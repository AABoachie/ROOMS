const express = require('express')

require('./src/mongoose/database')

const User = require('./src/mongoose/model/user')
const Post = require('./src/mongoose/model/post')
const Room = require('./src/mongoose/model/room')
const College = require('./src/mongoose/model/college')

const auth = require('./src/mongoose/middleware/auth')

const app = express();

app.use(express.json())

app.use(express.static(__dirname + '\\dist\\roomrally-app'))

app.get('/college', async (req, res) => {
    try{
        res.send(await College.find({}))
    } catch(e){
        res.status(400).send(e)
    }
})

app.get('/college/:_id', async (req, res) => {    
    try{        
        const { _id } = req.params
        // console.log(_id)
        res.send( await College.find({_id}))
    }catch(e){
        res.status(400).send()
    }
})

app.post('/college', async (req, res) => {
    try{
        // const college = new College(res.body)        
        res.send(await new College(req.body).save())
    }catch(e){
        res.status(400).send()
    }
})

app.post('/user/create', async (req, res) => {    
    try{
        const user = await new User(req.body).save(); 
        const token = await user.getAuthToken()
        res.send({ user, token })
    }catch(e){
        res.status(400).send(e)
    }    
})

app.delete('/user/delete', auth, async (req, res) => {       
    try{        
        const { email } = req.auth.user
        res.send(await User.findOne({ email }).remove())
    }catch(e){
        res.status(400).send({ errMsg: e })
    }
})

app.patch('/user/edit', auth, async (req, res) => {
    try{
        const { email = null, password = null, tags = null } = req.body
        
        const user = req.auth.user

        if(email) user.email = email
        if(password) user.password = password
        if(tags) user.tags = tags        
            
        await user.save()
        
        res.send()

    }catch(e){
        res.status(400).send(e)
    }
})

app.get('/user/profile', auth, async (req, res) => {
    try{
        const { user } = req.auth
        res.send(user)
    }catch(e){
        res.status.send(e)
    }
})

app.post('/user/login', async (req, res) => {
    try{
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if(user && await user.confirmPassword(password)){
            const token = await user.getAuthToken()
            res.send({ user, token })
        }else{
            res.send({ errMsg: "Incorrect Login"})
        }
    }catch(e){
        res.status(400).send(e)
    }
})

app.post('/user/logout', auth, async (req, res) => {
    try{        
        const { user, token } = req.auth        
        const remaining_tokens = user.tokens.filter((TOKEN) =>  token != TOKEN)
        
        user.tokens = remaining_tokens;
        
        await user.save()
        res.send()
    }catch(e){
        res.status(400).send(e)
    }
})

app.post('/post/create', auth, async (req, res) => {
    try{
        req.body.publisher = req.auth.user._id
        await new Post(req.body).save()
        res.send()
    }catch(e){
        res.status(400).send()
    }
})

app.patch('/post/edit', auth, async (req, res) => {
    try{

    }catch(e){
        
    }
})

app.delete('/post/delete', auth, async (req, res) => {
    const { _id }  = req.query
    try{        
        res.send(await Post.findOne({ _id }).remove())
    }catch(e){
        res.status(400).send(e)
    }
})

app.get('/post', auth, async (req, res) => {    
    try{
        const { room = null, tags = null } = req.query
        const post = await Post.find({}) //query based on the room id { tags: { $in: ["Chill", "school"] } }
        res.send(post)
    }catch(e){
        res.status(400).send()
    }
})

app.get('/user/post/', auth, async (req, res) => {
    try{
        const { _id: publisher } = req.auth.user          
        res.send(await Post.find({ publisher }))
    }catch(e){
        res.status(400).send()
    }
})

app.get('/room/find', (req, res) => {   
    try{
        Room.find({
            room: req.query.building
        }).lean().then((rooms) => {        
            roomStatus = roomVacancy(rooms[0]);        
            if (roomStatus.duration != -1){
                roomStatus.duration = Math.floor((roomStatus.duration) / 60) + ':' + ((roomStatus.duration) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping:false }) + ' hours'
            }
            res.send(roomStatus);
        })
    }catch(e){
        res.status(400).send(e)
    }    
})

app.get('/room/search', (req, res) => {
    let college = req.query.college
    res.setHeader('Content-Type', 'application/json');  
    if(req.query.building && req.query.duration){            
      //return all rooms open for the rest of the day or open longer than the req.query in a particular building
      Room.find({ college }).then((rooms) => {
        let rmstats = [];
        rooms.filter((room) => {        
          return room.room.includes(req.query.building)
        }).forEach((room) => {
          let rmstat = roomVacancy(room)
          rmstat.room = room.room
          if(rmstat.duration == -1)
            rmstats.push(rmstat)
          if(rmstat.duration > req.query.duration && rmstat.status == 'free'){
            // rmstat.duration = Math.floor((rmstat.duration) / 60) + ':' + ((rmstat.duration) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping:false }) + ' hours'
            rmstats.push(rmstat)
          }
        })        
        res.send(rmstats)
      })
    }else if(req.query.building){                
      Room.find({ college }).then((rooms) => {
        let rmstats = []
        rooms.filter((room) => {        
          return room.room.includes(req.query.building)
        }).forEach((room) => {
          rmstat = roomVacancy(room)
          rmstat.room = room.room
        //   if(rmstat.duration != -1)
        //     rmstat.duration = Math.floor((rmstat.duration) / 60) + ':' + ((rmstat.duration) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping:false }) + ' hours'
          if(rmstat.status == 'free')
            rmstats.push(rmstat)
        })        
        res.send(rmstats)
      })
    }else if(req.query.duration){        
      //return all rooms open for the day or open longer than the req.query      
      Room.find({ college }).then((rooms) => {        
        let rmstats = []
        rooms.forEach((room) => {    
            let rmstat = roomVacancy(room)           
            rmstat.room = room.room   
            // console.log(req.query.duration, rmstat.status)
            if(rmstat.duration > req.query.duration && rmstat.status == 'free'){
                // rmstat.duration = Math.floor((rmstat.duration) / 60) + ':' + ((rmstat.duration) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping:false }) + ' hours'
                rmstats.push(rmstat)
            }
            if(rmstat.duration == -1){                
                rmstats.push(rmstat)
            }
        })      
        res.send(rmstats)
      })
    }
  })

app.get('*', (req, res) => {    
    res.sendFile(__dirname + '\\dist\\roomrally-app\\index.html');
});

function roomVacancy(room){
    const weekday = ['S', 'M', 'T', 'W', 'R', 'F', 'S']
    var time = new Date();    
    // var day = weekday[time.getDay()]
    var day = weekday[2]

    time = (time.getHours() * 60) + time.getMinutes()    
    filtered_rooms = room.course.filter((course) => course.day.includes(day))  
       
    if(filtered_rooms <= 0) return { status: 'free', duration: 5000 }
    else {       
        filtered_rooms.sort((a, b) => a.startTime - b.startTime)

        for(var i = 0 ; i < filtered_rooms.length; i++){
            var start = filtered_rooms[i].startTime
            var end = filtered_rooms[i].endTime  
        
            //check if we are before the first course in the room for the day
            if(i == 0 && time < start) return { status: 'free', duration: start - time }

            // check if we are during a course
            if(time >= start && time < end) return { status: 'occupied', duration: end - time }

            //if it is not last course in them room..
            if(i < filtered_rooms.length - 1){           
                var next_startTime = filtered_rooms[i + 1].startTime;           
                //check if we are between this course and the next course             
                if(time > end && time < next_startTime) return { status: 'free', duration: next_startTime - time }                        
            //if it is the last course in the room, and the course is over -- return
            } else return { status: 'free', duration: 5000 }
        }
    }
}

app.listen(3000, () => {
    console.log('Now listening on port 3000')
})