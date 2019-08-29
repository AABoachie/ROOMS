const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/rmrally', {useNewUrlParser: true}).then(() => {
    console.log('Database connection successful')
}).catch((e) => {
    console.log(`Database connection failed:  + ${e}`)
})