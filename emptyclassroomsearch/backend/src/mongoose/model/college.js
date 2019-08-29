const mongoose = require('mongoose')

const collegeSchema = new mongoose.Schema({
    name: String,
    abbrv: String,
})

module.exports = mongoose.model('College', collegeSchema)