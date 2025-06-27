// const bcrypt = require('bcryptjs');

// exports.hashPassword = async (password) => {
//     try {
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
//         return hashedPassword
//     } catch (error) {
//         console.log(error);
//     }
// }

// exports.comparePassword = async (password, hashedPassword) => {
//     return bcrypt.compare(password, hashedPassword)
// }


const bcrypt = require('bcryptjs');

// Hash Password
exports.hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Hashing failed');
    }
};

// Compare Passwords
exports.comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error('Error comparing password:', error);
        throw new Error('Comparison failed');
    }
};
