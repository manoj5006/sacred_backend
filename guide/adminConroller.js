const Admin = require('../replica/adminModel');
const Deposit = require('../replica/depositModel')
const { generateOtp, getOtpExpiry } = require('../assist/randomCode')
const sendEmail = require('../contactor/email')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Token = require('../replica/tokenModel');
const User = require('../replica/userModel');
const BuyHistory = require('../replica/buyModule');
const Subscribe = require('../replica/subscribeModel');

exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const newAdmin = new Admin({
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    newAdmin.password = await bcrypt.hash(newAdmin.password, salt);
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(200).json({ status: false, message: 'Invalid admin' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log(isMatch);

    if (!isMatch) {
      return res.status(200).json({ status: false, message: 'Invalid password' });
    }

    const otp = generateOtp(6);

    const salt = await bcrypt.genSalt(10);
    const encryptedOtp = await bcrypt.hash(otp, salt);

    const otpExpireAt = getOtpExpiry(120);

    admin.authOtp = encryptedOtp;
    admin.otpExpireAt = otpExpireAt;


    const subject = 'Your OTP for Login';
    const html = `<p>Your OTP is: <strong>${otp}</strong>. It will expire in 2 minutes.</p>`;

    await sendEmail({
      to: admin.email,
      subject: subject,
      html: html,
    });

    await admin.save();

    res.status(200).json({
      status: true,
      message: 'OTP sent to your mail successfully',
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.verifyLogin = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(200).json({ status: false, message: 'Admin not found' });
    }
    if (new Date() > admin.otpExpireAt) {
      return res.status(200).json({ status: false, message: 'OTP has expired' });
    }
    const isMatch = await bcrypt.compare(otp, admin.authOtp);
    if (!isMatch) {
      return res.status(200).json({ status: false, message: 'Invalid OTP' });
    }
    const token = jwt.sign(email, process.env.JWT_SECRET);
    admin.authOtp = '';
    admin.otpExpireAt = null;
    await admin.save();
    res.status(200).json({
      status: true,
      message: 'Login successful',
      token: token
    });

  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ status: false, message: error.message });
  }
};


exports.changePassword = async (req, res) => {
  const { password, newpassword } = req.body;

  try {
    const adminemail = req.user;
    console.log(adminemail, "========>adminId");


    const admin = await Admin.findOne({ email: adminemail });

    if (!admin) {
      return res.status(200).json({ status: false, message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(200).json({ status: false, message: 'Incorrect current password' });
    }

    if (password === newpassword) {
      return res.status(200).json({ status: false, message: 'New password cannot be the same as the current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newpassword, salt);
    admin.password = hashedNewPassword;
    await admin.save();

    res.status(200).json({ status: true, message: 'Password changed successfully' });

  } catch (error) {
    console.error('Error during password change:', error);
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.changeSitstusts = async (req, res) => {
  const { password, status } = req.body
  try {
    const admin = await Admin.findOne({ email: req.user });
    if (!admin) {
      return res.status(200).json({ status: false, message: 'Admin not found' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(200).json({ status: false, message: 'Incorrect password' });
    }
    admin.SiteMode = status;
    await admin.save();
    res.status(200).json({ status: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error during status change:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}


exports.addToken = async (req, res) => {
  const { tokenName, tokenSymbol, tokenAddress, tokenDecimals, tokenUsdtLastPrice, tokenBnbLastPrice } = req.body;
  try {
    const existingToken = await Token.findOne({
      $or: [
        { tokenName: tokenName },
        { tokenSymbol: tokenSymbol }
      ]
    });

    if (existingToken) {
      if (existingToken.tokenName === tokenName) {
        return res.status(200).json({ status: false, message: 'Token name already exists' });
      }
      if (existingToken.tokenSymbol === tokenSymbol) {
        return res.status(500).json({ status: false, message: 'Token symbol already exists' });
      }
    }

    const price = parseFloat(tokenUsdtLastPrice);
    if (isNaN(price)) {
      return res.status(200).json({ status: false, message: 'Token price must be a valid number' });
    }
    const priceBnb = parseFloat(tokenBnbLastPrice);
    if (isNaN(priceBnb)) {
      return res.status(500).json({ status: false, message: 'Token price must be a valid number' });
    }

    const token = new Token({
      tokenName,
      tokenSymbol,
      tokenAddress,
      tokenDecimals,
      tokenUsdtLastPrice: price,
      tokenBnbLastPrice: priceBnb
    });
    await token.save();
    res.status(200).json({ status: true, message: 'Token added successfully' });
  } catch (error) {
    console.error('Error during token addition:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}

exports.getToken = async (req, res) => {
  try {
    const tokens = await Token.find();
    res.status(200).json({ status: true, message: 'Tokens fetched successfully', tokens });
  } catch (error) {
    console.error('Error during token fetching:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}

exports.updateToken = async (req, res) => {
  const { tokenSymbol, tokenUsdtLastPrice, tokenBnbLastPrice } = req.body;
  try {
    const price = parseFloat(tokenUsdtLastPrice);
    if (isNaN(price)) {
      return res.status(400).json({ status: false, message: 'Token price must be a valid number' });
    }

    const priceBnb = parseFloat(tokenBnbLastPrice);
    if (isNaN(priceBnb)) {
      return res.status(400).json({ status: false, message: 'Token price must be a valid number' });
    }

    const token = await Token.findOne({ tokenSymbol });
    if (!token) {
      return res.status(400).json({ status: false, message: 'Token not found' });
    }

    token.tokenUsdtLastPrice = price;
    token.tokenBnbLastPrice = priceBnb;
    await token.save();

    res.status(200).json({ status: true, message: 'Token price updated successfully' });
  } catch (error) {
    console.error('Error during token updating:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}

exports.getSitstusts = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.user });
    res.status(200).json({ status: true, message: 'Status fetched successfully', sitestatus: admin.SiteMode });
  } catch (error) {
    console.error('Error during status fetching:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(200).json({ status: false, message: 'Admin not found' });
    }
    const otp = generateOtp(6);
    const salt = await bcrypt.genSalt(10);
    const encryptedOtp = await bcrypt.hash(otp, salt);
    const otpExpireAt = getOtpExpiry(120);
    admin.authOtp = encryptedOtp;
    admin.otpExpireAt = otpExpireAt;
    await admin.save();
    const subject = 'Your OTP for Password Reset';
    const html = `<p>Your OTP is: <strong>${otp}</strong>. It will expire in 2 minutes.</p>`;
    await sendEmail({
      to: admin.email,
      subject: subject,
      html: html,
    });
    res.status(200).json({ status: true, message: 'OTP sent to your mail successfully' });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}


exports.forgetPasswordVerify = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ status: false, message: 'Admin not found' });
    }
    if (new Date() > admin.otpExpireAt) {
      return res.status(400).json({ status: false, message: 'OTP has expired' });
    }
    const isMatch = await bcrypt.compare(otp, admin.authOtp);
    if (!isMatch) {
      return res.status(400).json({ status: false, message: 'Invalid OTP' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    if (admin.password === newPassword) {
      return res.status(400).json({ status: false, message: 'New password cannot be the same as the current password' });
    }
    admin.password = hashedNewPassword;
    admin.authOtp = '';
    admin.otpExpireAt = null;
    await admin.save();
    res.status(200).json({ status: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error during password reset verification:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}

// deposit

exports.deposit = async (req, res) => {
  const { tokenAddress, tokenSymbol, depositeAmount, amountInWei, transaction } = req.body;
  try {
    const deposit = await Deposit.create({
      tokenAddress, tokenSymbol, depositeAmount, amountInWei, transaction
    });
    if (deposit) {
      res.status(200).json({
        status: true,
        message: 'Deposited Successfully',
        deposit
      });
    }
    else {
      res.status(400).json({
        status: false,
        message: 'Something went wrong while depositing',
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
} 


exports.getDeposit = async (req, res) => {
  try {
    const deposits = await Deposit.find();
    res.status(200).json({ status: true, message: 'Deposits fetched successfully', data:deposits });
  } catch (error) {
    console.error('Error during deposit fetching:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: true, message: 'Users fetched successfully', data: users });
  } catch (error) {
    console.error('Error during user fetching:', error);
    res.status(500).json({ status: false, message: error.message });      
  }
}

exports.getBuyHistory = async (req, res) => {
  try {
    const buyHistory = await BuyHistory.find();
    res.status(200).json({ status: true, message: 'Buy history fetched successfully', data: buyHistory });
  } catch (error) {
    console.error('Error during buy history fetching:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}


exports.updateReferalPercentage = async (req, res) => {
  const { referalPercentageForBuy } = req.body;
  try {
    const admin = await Admin.findOne({ email: req.user });
    if (!admin) {
      return res.status(400).json({ status: false, message: 'Admin not found' });
    }
    admin.referalPercentageForBuy = referalPercentageForBuy;
    await admin.save();
    res.status(200).json({ status: true, message: 'Referal percentage updated successfully' });
  } catch (error) {
    console.error('Error during referal percentage updating:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}

exports.getReferalPercentage = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.user });
    if(!admin){
      return res.status(400).json({ status: false, message: 'Admin not found' });
    }
    res.status(200).json({ status: true, message: 'Referal percentage fetched successfully', data: admin.referalPercentageForBuy });
  } catch (error) {
    console.error('Error during referal percentage fetching:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}

exports.setLanchingDate = async (req, res) => {
  const { date } = req.body;
  try {
    const admin = await Admin.findOne({ email: req.user });
    if (!admin) {
      return res.status(400).json({ status: false, message: 'Admin not found' });
    }
    admin.lanchingDate = date;
    await admin.save();
    res.status(200).json({ status: true, message: 'Lanching date set successfully' });
  } catch (error) {
    console.error('Error during lanching date setting:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}

exports.getLanchingDate = async (req, res) => {
  try {
    const admin = await Admin.find({});
    // if (!admin) {
    //   return res.status(400).json({ status: false, message: 'Admin not found' });
    // }
    res.status(200).json({ status: true, message: 'Lanching date fetched successfully', data: admin[0].lanchingDate });
  } catch (error) {
    console.error('Error during lanching date fetching:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}

exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscribe.find({});
    res.status(200).json({ status: true, message: 'Subscribers fetched successfully', data: subscribers });
  } catch (error) {
    console.error('Error during subscribers fetching:', error);
    res.status(500).json({ status: false, message: error.message });
  }
}



