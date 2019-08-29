//NJIT course catalog parsing and storing in db: room-course-data
// const excelToJson = require('convert-excel-to-json')
const db = require('../src/mongoose/database')
const Room = require('../src/mongoose/model/room')
var fs = require('fs')

// //convert excel to json
// const result = excelToJson({
//   sourceFile: 'data/NJIT/Course04_16_2019.xlsx'
// })

// // console.log(result)

// //filter json for relevant course data
// function filter(json){
//     if (json.D === "Face-to-FaceFace-to-Face:")
//       return true
//   return false
// }

// //parse filtered course data
// const room_course_array = []
// var i;

// // console.log(result)

// for (i = 0; i < result.Sheet1.length; i++){
//   if(filter(result.Sheet1[i])){
//     // console.log(result.Sheet1[i], result.Sheet1[i + 1], result.Sheet1[i + 2])
//     //direct data

//     // console.log(result.Sheet1[i], '\n')
    
//     const hours = result.Sheet1[i].F
//     const day = result.Sheet1[i].E
//     let room;    
//     room = result.Sheet1[i + 1].G
    
    

//     var start_time = hours.split(' ')[0]
//     var stop_time = hours.split(' ')[3]

//     console.log(hours)
    
//     // console.log(result.Sheet1[i])
    
//     start_time = parseInt(start_time.split(':')[0], 10) * 60 + parseInt(start_time.split(':')[1], 10)
//     stop_time = parseInt(stop_time.split(':')[0], 10) * 60 + parseInt(stop_time.split(':')[1], 10)
    
//     const meridiem = hours.split(' ')[1]
    
//     if(meridiem.includes('P')){
//       start_time += 720
//       stop_time += 720
//     }
    
    
    
//     const building = room.split(' ')[0]
    
//     const room_number = room.split(' ')[1]
    
//     if(room_course_array[room] == null)
//       room_course_array[room] = []
    
//     room_course_array[room].push({
//       start_min: start_time,
//       end_min: stop_time,
//       days: day
//     })
    
//     var time = new Date()
//     time = (time.getHours() * 60) + time.getMinutes()
    
//     // console.log(time > start_time && time < stop_time, time, hours, start_time, stop_time, day, room, meridiem)
    
//     if(time > start_time && time < stop_time){
//       var duration = stop_time - time
//       // console.log(Math.floor(duration / 60), duration % 60)
//     }

//   }
// }

let NJITRooms = fs.readFile('data/NJITRooms.txt', async (err, data) =>{
  // console.log(data.toString())
  // console.log(JSON.parse(data))

  val = JSON.parse(data)

  for(key of Object.keys(val)){
    // console.log(val[key][0])

    // await new Room({
    //   room: key,      
    //   course: val[key]
    // }).save().then((rm) => {
    //   console.log(rm)
    // }).catch((e) => {
    //   console.log('Failed to store room', e)
    // })    

    try{
      const rm = await Room.update({ room: key}, { room: key, course: val[key], college: '5d633eb8a53a45b5e08326f3' }, { upsert: true })
      console.log(rm)
    }catch(e){
      console.log(e)
    }
    
  }
  console.log('Done')
})

// Room.updateMany({}, { course: [] }).then((result) => {
//   console.log(result)
// })


// //send rooms populated with courses to db
// Object.keys(room_course_array).forEach((room) => {
//   console.log(room_course_array[room])
//   new Room({
//     room_number: room.split(' ')[1],
//     building: room.split(' ')[0],
//     course: room_course_array[room]
//   }).save().then((rm) => {
//     console.log(rm)
//   }).catch((e) => {
//     console.log('Failed to store room', e)
//   })
// })
