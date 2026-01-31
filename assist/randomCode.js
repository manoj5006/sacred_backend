const User = require('../replica/userModel');

function generateOtp(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        otp += characters[randomIndex];
    }
    return otp;
}


function getOtpExpiry(durationInSeconds = 120) {
    return new Date(Date.now() + durationInSeconds * 1000); // in seconds (120 is second) 
}



async function generateUniqueReferralCode() {
    let isUnique = false;
    let referralCode = '';

    while (!isUnique) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        referralCode = '';
        for (let i = 0; i < 18; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            referralCode += characters[randomIndex];
        }

        // Check if code already exists in database
        const existingUser = await User.findOne({ referralCode });
        if (!existingUser) {
            isUnique = true;
        }
    }

    return referralCode;
}

module.exports = { generateOtp, getOtpExpiry, generateUniqueReferralCode };

// generateUniqueUserId