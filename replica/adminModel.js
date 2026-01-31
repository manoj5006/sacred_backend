const mongoose = require('mongoose');
const { db1 } = require('../framing/storage');

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    authOtp: {
      type: String,
      default: '',
    },
    otpExpireAt: {
      type: Date,
      default:'', 
    },
    SiteMode: {
      type: Boolean,
      default: false,
    },
    ipAddress:{
      type:String,
      default:''
    },
    referalPercentageForBuy:{
      type:Number,
      default:0
    },
    lanchingDate:{
      type:Date,
      default:''
    }
  },
  {
    timestamps: true, 
  }
);
const Admin = db1.model('Admin', adminSchema);
module.exports = Admin;
