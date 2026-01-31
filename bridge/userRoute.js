const express = require('express');
const router = express.Router();
const userController = require('../guide/userController');
const adminController = require('../guide/adminConroller');
router.post('/register', userController.registerUser);
router.post('/sign', userController.sign);
router.post('/getToken', userController.getToken);
router.post('/buyTransaction', userController.buyTransaction);
router.post('/getReferral', userController.getReferral);
router.post('/referalFee', userController.referalFee);
router.post('/getOneReferalList',userController.getOneReferalList)
router.post('/findAddressbyReferralId',userController.findAddressbyReferralId)
router.post('/referalFee',userController.referalFee)
router.post('/getBuyHistory',userController.getBuyHistory)
router.post('/subscribe',userController.subscribe)
router.post('/getLanchingDate',adminController.getLanchingDate)

module.exports = router;
