class Course {
    constructor(day, startTime, endTime){
      this.day = day;
      this.startTime = startTime;
      this.endTime = endTime;
    }
  }
  
  let rooms = {};
  
  function loadNJITRooms() {
    let tables = document.querySelectorAll("tbody")
  
    for(var i = 2; i < tables.length - 2; i++){
      let rows = tables[i].querySelectorAll("tr")
  
      rows.forEach((row) => {
        let cols = row.querySelectorAll('td');
        // alert(cols[7].textContent.trim())
  
        if(cols[6].querySelector("div")){
          cols[6].querySelector("div").querySelector("a").childNodes.forEach((child) => {
            if (child.nodeName === "#text"){
              // alert(child.textContent.trim())
              if(!rooms[child.textContent.trim()])
                rooms[child.textContent.trim()] = new Array();         
            }
          })
        }
  
        if(cols[7].textContent.trim() === "Open" && cols[3].querySelector('a').textContent === "Face-to-Face" && cols[10].textContent !== "" && cols[6].querySelector("div").textContent.trim() !== ""){
          let roomNumbers = new Array();
          let roomDays = new Array();
          let roomTimes = new Array();
  
          cols[4].querySelector("div").childNodes.forEach((child) => {
            if (child.nodeName === "#text"){
              // alert(child.textContent.trim())
              roomDays.push(child.textContent.trim())          
            }          
          })
  
          cols[5].querySelector("div").childNodes.forEach((child) => {
            if (child.nodeName === "#text"){
              // alert(child.textContent.trim())
              roomTimes.push(child.textContent.trim())          
            }
          })
  
          cols[6].querySelector("div").querySelector("a").childNodes.forEach((child) => {
            if (child.nodeName === "#text"){
              // alert(child.textContent.trim())
              roomNumbers.push(child.textContent.trim())          
            }
          })
          // alert(roomNumbers.length)
  
          for(var j = 0; j < roomNumbers.length; j++){
            let roomNumber = roomNumbers[j];
            let day = roomDays[j];
            let time = roomTimes[j];
  
            var start_time = time.split(' ')[0]
            var stop_time = time.split(' ')[3]
            
            // console.log(result.Sheet1[i])
            
            start_time = parseInt(start_time.split(':')[0], 10) * 60 + parseInt(start_time.split(':')[1], 10)
            stop_time = parseInt(stop_time.split(':')[0], 10) * 60 + parseInt(stop_time.split(':')[1], 10)
            
            const meridiem = time.split(' ')[1]
            
            if(meridiem.includes('P')){
              start_time += 720
              stop_time += 720
            }
  
            if(!rooms[roomNumber])
              rooms[roomNumber] = new Array();
  
            rooms[roomNumber].push(new Course(day, start_time, stop_time))
          }
        }
      })
    }
  }
  
  loadNJITRooms()
  
  let pages = document.querySelectorAll("tbody")[0].querySelectorAll("td")
  for(var k = 0; k < pages.length; k++){
    pages[k].click()
    loadNJITRooms()
    // alert(pages[i].textContent)
  }
  
  function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
  
  // Start file download.
  download("NJITRooms.txt",JSON.stringify(rooms));