const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tags: [String],
    tokens: [String]
})

userSchema.pre('save', async function() {        
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }    
})

userSchema.methods.getAuthToken = async function() {
    const token = jwt.sign({_id: this._id }, "secret");
    this.tokens.push(token)
    await this.save()

    return token
}

userSchema.methods.confirmPassword = async function(password) {
    console.log(password, this.password, await bcrypt.compare(password, this.password))
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)