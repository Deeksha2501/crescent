const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');


const http = require('http');
const PORT = 3000;
const app = express();

//------------ EJS Configuration ------------//
app.use(expressLayouts);
app.use("/assets", express.static('./assets'));
app.set('view engine', 'ejs');


app.use('*', (req , res)=>{    
    // res.send("hello");
    res.render('home');
})

app.listen(PORT, console.log(`Server running on PORT ${PORT}`));
