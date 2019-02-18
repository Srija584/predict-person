let express = require('express');
// const GoogleImages = require('google-images');
// const client = new GoogleImages('001967967201881619301:he5u51h2wvg', 'AIzaSyA2MpuAXlTOvr-XtXu008MX8mHa7iozXi4');

let app = express();

app.use(function(req, res, next) {
    console.log(`${new Date()} - ${req.method} request for ${req.url}`);
    next();
});

app.use(express.static("../public"));

app.listen(8081, function() {
    console.log("Serving on port 8081")
});

// client.search('Steve Angello')
// .then(images => {
//     console.log(images);
//     /*
//     [{
//         "url": "http://steveangello.com/boss.jpg",
//         "type": "image/jpeg",
//         "width": 1024,
//         "height": 768,
//         "size": 102451,
//         "thumbnail": {
//             "url": "http://steveangello.com/thumbnail.jpg",
//             "width": 512,
//             "height": 512
//         }
//     }]
//      */
// });

// paginate results
// client.search('Steve Angello', {page: 2});