const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const { initializeApp } =  require("firebase/app");
const multer = require("multer");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
// const config = require('./config/firebase');

const firebaseConfig = {
    apiKey: "AIzaSyAOs12MmeVn1Y6Z8YXIZZ-ezqiLZdKRAfQ",
    authDomain: "crescent-1.firebaseapp.com",
    projectId: "crescent-1",
    storageBucket: "crescent-1.appspot.com",
    messagingSenderId: "47416897510",
    appId: "1:47416897510:web:030e88f3dff11adb823027",
    measurementId: "G-0JGG0EJF4E",
  };

//Initialize a firebase application
const appp = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });



const User = require('./models/User');


const app = express();
// initializeApp(config.firebaseConfig);

// Setting up multer as a middleware to grab photo uploads
// const upload = multer({ storage: multer.memoryStorage() });

//------------ Passport Configuration ------------//
require('./config/passport')(passport);

//------------ DB Configuration ------------//
const db = require('./config/key').MongoURI;

//------------ Mongo Connection ------------//
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(err => console.log(err));

//------------ EJS Configuration ------------//
app.use(expressLayouts);
app.use("/assets", express.static('./assets'));
app.set('view engine', 'ejs');

const MongoStore = require('connect-mongo');

//------------ Bodyparser Configuration ------------//
// app.use(bodyParser);
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan('tiny'));

//------------ Express session Configuration ------------//
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

//------------ Passport Middlewares ------------//
app.use(passport.initialize());
app.use(passport.session());



//------------ Connecting flash ------------//
app.use(flash());

//------------ Global variables ------------//
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

  app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const dateTime = giveCurrentDateTime();
        console.log(req.file);

        const storageRef = ref(storage, `files/${req.file.originalname + "       " + dateTime}`);

        // Create file metadata including the content type
        const metadata = {
            contentType: req.file.mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

        // Grab the public url
        const downloadURL = await getDownloadURL(snapshot.ref);

        console.log('File successfully uploaded.');
        return res.send({
            message: 'file uploaded to firebase storage',
            name: req.file.originalname,
            type: req.file.mimetype,
            downloadURL: downloadURL
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message)
    }
});
  

app.use('/login', (req , res)=>{  
    res.render('login');
})

app.use('/register', (req , res)=>{  
    res.render('register');
})

app.use('/auth', require('./routes/auth'));
app.use('/', (req , res)=>{  
    // res.render('home');
    res.render('category');
})

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}


const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on PORT ${PORT}`));