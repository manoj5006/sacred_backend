const express = require('express');
const { getSitstusts } = require('../guide/adminConroller');
const { authenticateJWT } = require('../assist/validation')
const adminController = require('../guide/adminConroller');

const router = express.Router();

router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.login);
router.post('/verify', adminController.verifyLogin)
router.post('/change-password', authenticateJWT, adminController.changePassword);
router.post('/add-token', authenticateJWT, adminController.addToken);
router.get('/get-token', authenticateJWT, adminController.getToken);
router.post('/update-token', authenticateJWT, adminController.updateToken);
router.post('/change-sitstusts', authenticateJWT, adminController.changeSitstusts);
router.get('/get-sitstusts', authenticateJWT, getSitstusts);
router.post('/deposit',  adminController.deposit);
router.post('/forgot-password', adminController.forgotPassword);
router.post('/forgetPasswordVerify', adminController.forgetPasswordVerify);
router.post('/get-deposit', authenticateJWT, adminController.getDeposit);
router.get('/allusers', authenticateJWT, adminController.allUsers);
router.get('/buyhistory', authenticateJWT, adminController.getBuyHistory);
router.post('/updatereferalpercentage', authenticateJWT, adminController.updateReferalPercentage);
router.get('/getreferalpercentage', authenticateJWT, adminController.getReferalPercentage);
router.post('/setlanchingdate', authenticateJWT, adminController.setLanchingDate);
router.get('/getlanchingdate', adminController.getLanchingDate);
router.get('/getsubscribers', authenticateJWT, adminController.getSubscribers);
module.exports = router;