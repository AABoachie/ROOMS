const jwt = require('jsonwebtoken')
const User = require('../model/user')

// confirm the token from header
async function auth (req, res, next) {
    
    const token = req.headers.authorization.replace('Bearer ', '');
    
    try{
        const _id = jwt.verify(token, 'secret')._id
        
        const user = await User.findOne({ _id: _id, tokens: token })
        req.auth = { user, token }
                
        next()        

    }catch(e){
        res.send({ errMsg: 'Could not authenticate ' + e})    
    }
}

module.exports = auth