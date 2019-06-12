const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const {} = require('./helpers')

module.exports = {
    createUser: async args => {
        try {
            const existingUser =  await User.findOne({email: args.userInput.email})
            if (existingUser) {
                throw new Error(`User ${user.email} already exists`);
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

            const newUser = new User({
                email: args.userInput.email,
                password: hashedPassword
            });  
            const savedUser = await newUser.save();
            return { ...savedUser._doc, password: null, _id: savedUser.id }
        } catch(err) {
            throw err;
        }   
    }
};