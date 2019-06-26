let express = require('express');
let app = express();
let path = require('path');
let formidable = require('formidable');
let fs = require('fs');


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {

    // DELETE ALL PREVIOUS FILES
    let files = fs.readdirSync(path.join(__dirname, 'public/uploads/'));
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            let filePath = path.join(__dirname, 'public/uploads/') + files[i];
            fs.unlinkSync(filePath);
        }
    }
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/synchro', function (req, res) {
    let Gvideo, Rvideo, Lvideo, Name;
    let files = fs.readdirSync(path.join(__dirname, 'public/uploads/'));
    for (let file of files) {
        let ext = path.extname(file);
        let patt = new RegExp("Gvideo");
        if (patt.test(file)) {
            Gvideo = file;
        }
        patt = new RegExp("Rvideo");
        if (patt.test(file)) {
            Rvideo = file;
        }
        patt = new RegExp("Lvideo");
        if (patt.test(file)) {
            Lvideo = file;
        }
        ext = path.extname(file);
        if (ext !== '.mp4') {
            Name = file;
        }
    }

    let GvideoPath = path.join(__dirname, 'public/uploads/' + Gvideo);
    let LvideoPath = path.join(__dirname, 'public/uploads/' + Lvideo);
    let RvideoPath = path.join(__dirname, 'public/uploads/' + Rvideo);
    let NamevideoPath = path.join(__dirname, 'public/uploads/' + Name);

    const spawn = require('child_process').spawn;
    const shinfo = spawn('sh', ['info.sh', RvideoPath, LvideoPath, GvideoPath, NamevideoPath]);

    let currentTime = new Date().getTime();
    while (currentTime + 200 >= new Date().getTime()) {
    }
    res.sendFile(path.join(__dirname, 'views/player.html'));
});


app.get('/preview', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/preview.html'));
});


app.post('/upload', function (req, res) {

    // create an incoming form object
    let form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/public/uploads');
    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function (field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
    });
    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        res.end('success');
    });
    // parse the incoming request containing the form data
    form.parse(req);
    delete form;
});

let server = app.listen(3001, function () {
    console.log('Server listening on port 3000');
});
