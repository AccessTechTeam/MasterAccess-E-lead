const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  email: String,
  valid: Boolean,
});

const profileSchema = new mongoose.Schema({
  id: String,
  name: String,
  firstName: String,
  lastName: String,
  emails: [emailSchema],
  professionalEmail: String,
  starryProfessionalEmail: String,
  professionalEmails: [String],
  personalEmail: String,
  starryPersonalEmail: String,
  personalEmails: [String],
  starryPhone: String,
  phone: String,
  phones: [String],
  location: String,
  title: String,
  companyName: String,
  fetchedAt: Date,
  processingTime: Number,
});

const kasprSchema = new mongoose.Schema({
  profiles: [profileSchema],
});

const Kaspr = mongoose.model('Kaspr', kasprSchema);

module.exports = Kaspr;
