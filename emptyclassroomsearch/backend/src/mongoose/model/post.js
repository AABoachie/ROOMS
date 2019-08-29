const mongoose = require('mongoose')
const User = require('../model/user')
const nodemailer = require('nodemailer')

const postSchema = new mongoose.Schema({
    room: String,
    description: String,
    title: String,
    duration: Number,
    tags: [String],
    publisher: String
})

postSchema.pre("save", async function() {
    const users = await User.find({ tags : { $in : this.tags } })
    
    var emails = [];

    users.forEach((user) => {
        emails.push(user.email)
    })

    console.log(emails.join(', '))


    var trasnporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'septimra@gmail.com',
            pass: '!QWer12345'
        }
    })

    var mailOptions = {
        from: 'septimra@gmail.com',
        to: emails.join(', '),
        subject: 'A room matching your tags has been started',
        text: 'Click the link to check it out'
    }

    trasnporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
})

module.exports = mongoose.model('Post', postSchema)