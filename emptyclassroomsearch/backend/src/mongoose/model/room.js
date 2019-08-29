const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    startTime: Number,
    endTime: Number,
    day: String
})

const roomSchema = new mongoose.Schema({
    room: String,  
    course: [ courseSchema ],
    college: String
})

module.exports = mongoose.model('Room', roomSchema)