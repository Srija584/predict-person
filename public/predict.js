var images = [];

var index = 1;

function buildImage() {
    $("#pred").hide();
    console.log("building")
//   var img = document.createElement('img')
//   document.getElementById('content').appendChild(img);
  for(var vari = 1; vari <= 72; vari ++) {
      let p = "../test/" + vari.toString() + ".jpg";
      images[vari] = p;
  }
  // $("#content").attr("src", images[index]);
  $("#selected-image").attr("src", images[index]);
  $("#prediction-list").empty();
  $("#predicted").attr("src", "");
}

function changeImage() {
  $("#pred").hide();
  index++;
  index = index % 72; // This is for if this is the last image then goto first image I have 4 images so I've given 4 change accordingly 
  // $("#content").attr("src", images[index]);
  $("#selected-image").attr("src", images[index]);
  $("#prediction-list").empty();
  $("#predicted").attr("src", "");
}

function changeImagePrev() {
    if(index > 1) {
        $("#pred").hide();
        index--;
        index = index % 72; // This is for if this is the last image then goto first image I have 4 images so I've given 4 change accordingly 
        // $("#content").attr("src", images[index]);
        $("#selected-image").attr("src", images[index]);
        $("#prediction-list").empty();
        $("#predicted").attr("src", "");
    }
    
}

var image = null;
$("#image-selector").change(function() {
    let reader = new FileReader();
    reader.onload = function() {
        let dataURL = reader.result;
        $("#selected-image").attr("src", dataURL);
        $("#prediction-list").empty();
        $("#predicted").attr("src", "");
        var fileinput = document.getElementById("image-selector");
        //Make new SimpleImage from file input
        image = new SimpleImage(fileinput);
    }

    let file = $("#image-selector").prop('files')[0];
    reader.readAsDataURL(file);
})


let model;
(async function() {
    console.log("model loading start");
    model = await tf.loadModel('../models/myModel/model.json');
    $('.progress-bar').hide();
    console.log("model loading ended");
    buildImage();
})();



$("#predict-btn").click(async function() {
    let image = $("#selected-image").get(0);
    let tensor = tf.fromPixels(image,1)
    .resizeNearestNeighbor([64,64])
    .toFloat()
    .reshape([1,64,64])

let predictions = await model.predict(tensor).data();
console.log(predictions);
let a = Math.max.apply(Math, predictions);
let i = predictions.indexOf(a);
dataURL = PERSON_CLASSES[i];
$("#pred").show();
$("#predicted").attr("src", dataURL);
// var text = "This is person " + (i+1).toString();
// $('#prediction-list').html(text);
});

function gray(imgObj) {
    var canvas = document.createElement('canvas');
    var canvasContext = canvas.getContext('2d');
     
    var imgW = imgObj.width;
    var imgH = imgObj.height;
    canvas.width = imgW;
    canvas.height = imgH;
     
    canvasContext.drawImage(imgObj, 0, 0);
    var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);
     
    for(var y = 0; y < imgPixels.height; y++){
        for(var x = 0; x < imgPixels.width; x++){
            var i = (y * 4) * imgPixels.width + x * 4;
            var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
            imgPixels.data[i] = avg; 
            imgPixels.data[i + 1] = avg; 
            imgPixels.data[i + 2] = avg;
        }
    }
    canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return imgPixels
}

function search() {
    var googleBox = document.getElementById("googleBox");
        searchButton = document.getElementById("searchButton");

    var userInput = googleBox.value;
    console.log(userInput);
    let arr = userInput.split(' ');
    let str = "https://www.google.com/search?q=";
    str = str + arr[0];
    for(var vari=1; vari<arr.length; vari++) {
        str = str + "+" + arr[vari];
    }
    str = str + "&tbm=isch"
      window.open(str);
 // }
}


