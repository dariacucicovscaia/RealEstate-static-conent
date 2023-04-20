const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const indexRouter = require('./routes/index');
const app = express();

app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(express.static('public'))
app.use('/', indexRouter);

app.post('/estateUpload', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded.');
        return;
    }
    for (var fileName123 in req.files) {
        const fileNamee = req.files[fileName123];

        var uploadPath = `./public/estate/` + req.body.estateOwner;
        console.log(uploadPath)
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, {recursive: true});
        }
        uploadPath += `/${fileNamee.name}`

        fileNamee.mv(uploadPath, err => {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }
        });
    }
    res.json({files: req.files});
});


app.post('/upload', function (req, res) {
    if (req.files === null) {
        return res.status(400).json({msg: 'No file uploaded'});
    }
    const file = req.files.file;
    console.log(req.body.userName)
    var uploadPath = `./public/profileImg/` + req.body.userName;
    console.log(uploadPath)
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, {recursive: true});
    }
    uploadPath += `/${file.name}`;
    file.mv(uploadPath, err => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.json({fileName: file.name});
    })

});


app.post('/uploadArticlePic', function (req, res) {
    if (req.files === null) {
        return res.status(400).json({msg: 'No file uploaded'});
    }
    const file = req.files.file;
    console.log(req.body.userName)
    var uploadPath = `./public/article/` + req.body.userName;
    console.log(uploadPath)
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, {recursive: true});
    }
    uploadPath += `/${file.name}`;
    file.mv(uploadPath, err => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.json({fileName: file.name});
    })

});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.info(`Server running on port ${PORT}`))

