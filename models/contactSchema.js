const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('./userSchema');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return /^[\d]{11,}$/.test(v);
      },
      message: `enter at least 11 digits.`
    }
  }
});

// authentication token 
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDZiMzRjMjMzNWEzNjkzNjJhOGQ0OGIiLCJpYXQiOjE2ODQ4MTAyNTJ9.bBfpCHwUSW1CC6QC1Wa8PbV0z-OqnlzBddmzcVtQRlw';
const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

const createContacts = async () => {
  const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });
  if (!rootUser) {
    console.log('not found');
    return null;
  }

  const Contacts = mongoose.model(`${rootUser._id}_contact`, contactSchema);

  return Contacts;
};

module.exports = createContacts;
