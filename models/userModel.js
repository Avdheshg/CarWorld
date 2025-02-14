const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name']
    },
    email: {
        type: String,
        required: [true, 'A user must have a email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    photo: {
        type: String
    },
    // role: {
    //     type: String,
    //     enum: ['admin', 'user', 'uploader'], 
    //     default: 'admin'
    // },
    password: {
        type: String,  
        required: [true, 'Please provide a password'],
        // minlength: 5,
        select: false   // pass will not be shown to the User
    },
    passwordConfirm: {
        type: String,
        required: [true, 'A user must confirm the password'],
        validate: {
            // This only works on CREATE and SAVE
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
});

// Defining a pre MW for encrypting the pass
// V will run this function only when if the password is modified
userSchema.pre('save', async function(next) {
    // if the pass is not modified => return
    if (!this.isModified('password')) return next();

    // Hash the password
    this.password = await bcrypt.hash(this.password, 12);

    // deleting the confirm Pass
    this.passwordConfirm = undefined;

    next(); 
});

// for updating the password after the reset password req is made
userSchema.pre("save", function(next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
})

// Defining an IM(will be available for all the files of a certain collection)
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    console.log("*** Inside changedPasswordAfter ***")

    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log("times ", changedTimestamp, JWTTimestamp);

        return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
    console.log({ resetToken }, this.passwordResetToken);
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
};
 


const User = mongoose.model('User', userSchema);

module.exports = User;


