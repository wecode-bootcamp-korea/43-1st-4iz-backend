const { userService } = require('../services')
const {catchAsync} = require('../utils/error')

const signUp = catchAsync (async(req, res) => {
    try {
        const { name, email, password, phoneNumber, birthday} = req.body;
        if ( !name || !email || !password || !phoneNumber || !birthday ) {
            const error = new Error('KEY_ERROR')
            error.statusCode = 400

            throw error
        }
        const insertId = await userService.signUp(name, email, password, phoneNumber, birthday)
        return res.status(201).json({insertId});
    } catch (error) {
        console.error(error) 
		
		return res.status(error.statusCode).json({ message: error.message });
    }

})

module.exports = {
    signUp
}