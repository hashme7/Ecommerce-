const express = require("express");
const app = express();
const morgan = require('morgan')
const session = require('express-session')
const nocache = require('nocache')

//calling Database function
require('./config/database').connect()

//*********static files***********/
app.use(express.static("public"));
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//************ nocache ********* */
app.use(nocache())
//********* morgan ********//
app.use(morgan('dev'))

//*********session************* */
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));
app.set('view engine', 'ejs');

//*******user_routes*******//
const userRoute = require("./route/userRoute");
app.use("/", userRoute);

//****** admin_routes******//
const adminRoute = require('./route/adminRoute')
app.use('/admin', adminRoute)

app.listen(2020, () => {
  console.log("http://localhost:2020");
});
