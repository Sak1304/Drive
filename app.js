const express = require('express');
const userRouter = require('./routes/user.routes')
const dotenv = require('dotenv');
dotenv.config();

const connectToDB = require('./config/db')
connectToDB();
const cookieParser = require('cookie-parser')
const indexRouter = require('./routes/index.routes')
const homeRouter = require('./routes/home.route')




const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine','ejs');
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/index',homeRouter)
app.use('/',indexRouter)
app.use('/user',userRouter)

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`)
}) 

module.exports = app;