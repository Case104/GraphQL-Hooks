const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

module.exports = {
    createUser: async ({ userInput: { email, password } }) => {
        try {
            const existingUser =  await User.findOne({email})
            if (existingUser) {
                throw new Error(`User ${email} already exists!`);
            }
            const hashedPassword = await bcrypt.hash(password, 12)

            const newUser = new User({
                email,
                password: hashedPassword
            });  
            const savedUser = await newUser.save();
            return { ...savedUser._doc, password: null, _id: savedUser.id }
        } catch(err) {
            throw err;
        }   
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email });
        if (!user){
            throw new Error(`Invalid login information`)
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword){
            throw new Error('Invalid login information');
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email }, 
            'superSecretString', 
            { expiresIn: '1h' }
        );
        return {
            userId: user.id,
            token,
            tokenExpiration: 1
        }
    }
};