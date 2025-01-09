const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    image: { type: Buffer },      // Binary data for the image
    contentType: { type: String } // MIME type (e.g., "image/png", "image/jpeg")
}
},{
  timestamps: true,
})

userSchema.pre('save', async function (next) {
  if(!this.isModified('password')) {
      return next()
  }

  //hashing of password

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;