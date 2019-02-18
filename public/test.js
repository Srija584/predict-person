var
fs      = require('fs'),
path    = require('path'),
request = require('request');

//Required options

//Change noOfTimes (has to be integer) to 2 for 20 images, 5 for 50 images, etc...
//APIKEY from google developers console
//SEARCHKEY from a custom search engine's ID

var 
APIKEY    = "AIzaSyA2MpuAXlTOvr-XtXu008MX8mHa7iozXi4",
SEARCHKEY = "001967967201881619301:he5u51h2wvg",
noOfTimes = 10;

//Globals

var
counter      = 0,
apiURL       = "https://www.googleapis.com/customsearch/v1?cx="+SEARCHKEY+"&num=10&searchType=image&key="+APIKEY+"&q=",
OtherCounter = 1,
adder;

function getCounter(){
counter+=1;
return counter;
}

function handleBody(err, res, body){
var results;

body = JSON.parse(body);
results = body.items;

myCount = 0;
for(var i in results){
  while(myCount <= 20) {
    results[i].indexValue = i;
    myCount += 1;
    request(results[i].link)
    .pipe(fs.createWriteStream(path.join(__dirname, process.argv[3], process.argv[3] + getCounter() + ".jpg")))
    .on('close', function(){
      console.log("Downloaded "+ OtherCounter + " images");
      OtherCounter+=1;
    })
    .on('error', function(error_pipe){
      console.log("\033[91mERROR: Download failed");
      console.log(error_pipe);
      console.log("\n");
    });
  }
  
}
}

function startScript(){
try{
  if (!fs.existsSync(process.argv[3])){
    fs.mkdirSync(process.argv[3]);
  }
}
catch(err){    
  console.log(err);
  console.log("Fatal ERROR: directory creation failed");
  return;
}

for(var i = 0; i<noOfTimes; i++){
  adder = i*10 + 1;
  setTimeout(function(){request(apiURL + process.argv[2] +  "&start=" + adder, handleBody)}, 1000*i);
}
}

startScript();
