const User = require('../replica/userModel');
const { generateUniqueReferralCode } = require('../assist/randomCode');
const jwt = require('jsonwebtoken');
const Web3 = require("web3");
const Token = require('../replica/tokenModel')
const BuyModel = require('../replica/buyModule')
const feeModel = require('../replica/feesModel')
const subscribeModel = require('../replica/subscribeModel')
// const encrypter = require('../contactor/endec')
const encrypter =require('../contactor/endec')


exports.registerUser = async (req, res) => {
    const { walletAddress, walletType, shortAddress, referedBy } = req.body;
    try {
        const existingUser = await User.findOne({ walletAddress });
        if (existingUser) {
            return res.status(200).json({ status: false, message: 'Login Successfully' });
        }
        const referralCode = await generateUniqueReferralCode(User);
        const user = await User.create({
            walletAddress,
            walletType,
            shortAddress,
            referedBy,
            referralCode
        });

        const token = jwt.sign(
            { userId: user.walletAddress },
            process.env.JWT_SECRET,
        );

        res.status(200).json({
            status: true,
            message: 'User registered successfully',
            user,
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ status: false, message: 'Server error' });
    }
}


exports.getReferral = async (req, res) => {
    const { walletAddress } = req.body;
    if (!walletAddress) {
        return res.status(400).json({ status: false, message: 'Wallet address is required' });
    }
    const referral = await User.findOne({ walletAddress });
    if (!referral) {
        return res.status(400).json({ status: false, message: 'Referral not found' });
    }
    res.status(200).json({ status: true, message: 'Referral fetched successfully', data: referral });
}

exports.sign = async (req, res) => {
    let hash = req.body.hash
    let hashdec = encrypter.decrypt(hash)
    let signature = Web3.eth.accounts.sign(hashdec, process.env.SIGNER_PVTKEY);
    let sig = encrypter.encrypt(signature.signature)
    res.json(sig)
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

exports.buyTransaction = async (req, res) => {
    try {

        const { tokenAddress, tokenSymbol, buyAmount, amountInWei, transaction, referenceAddress, userAddress } = req.body;

        const buy = await BuyModel.create({
            tokenAddress, tokenSymbol, buyAmount, amountInWei, transaction, referenceAddress, userAddress
        });

        if (buy) {
            res.status(200).json({ status: true, message: 'Buy Transaction saved successfully', buy });
        }
        else {
            res.status(400).json({
                status: false,
                message: 'Buy Transaction not saved',
            });
        }


    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

exports.referalFee = async (req, res) => {
    try {
        const { referer, input, output, fee, time, user } = req.body;
        const Fee = await feeModel.create({
            referer: (referer).toLowerCase(), input, output, fee, time, user
        });

        if (Fee) {
            res.status(200).json({ status: true, message: 'Fee Transaction saved successfully', Fee });
        }
        else {
            res.status(400).json({
                status: false,
                message: 'Fee Transaction not saved',
            });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

exports.getOneReferalList = async (req, res) => {
    try {
        await feeModel.find({ user: req.body.address }).then((feesList) => {
            if (feesList && feesList != null) {
                res.status(200).json({ status: true, data: feesList });
            }
            else {
                res.status(400).json({
                    status: false,
                    message: 'Fees List are not available',
                });
            }
        })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

exports.getBuyHistory = async (req, res) => {
    try {
        const { userAddress } = req.body;
        const buyHistory = await BuyModel.find({ userAddress });
        if (buyHistory && buyHistory != null) {
            res.status(200).json({ status: true, message: 'Buy History fetched successfully', buyHistory });
        }
        else {
            res.status(400).json({ status: false, message: 'Buy History not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

exports.getReferralHistory = async (req, res) => {
    try {
        const { userAddress } = req.body;
        const referralHistory = await User.find({ user: userAddress });
        if (referralHistory && referralHistory != null) {
            res.status(200).json({ status: true, message: 'Referral History fetched successfully', referralHistory });
        }
        else {
            res.status(400).json({ status: false, message: 'Referral History not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

exports.findAddressbyReferralId = async (req, res) => {
    try {
        const { referralId } = req.body;
        const user = await User.findOne({ referralCode: referralId });
        if(user){
            res.status(200).json({ status: true, message: 'Address fetched successfully', user:user });
        }
        else{
            res.status(400).json({ status: false, message: 'Address not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}


exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        const subscribeUser = await subscribeModel.findOne({ email: email });
        if (subscribeUser) {
            res.status(200).json({ status: true, message: 'Thank you! Already Subscribed' });
        }
        else {
        const subscribe = await subscribeModel.create({ email: email });
            res.status(200).json({ status: true, message: 'Subscribed Successfully', email: email });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

