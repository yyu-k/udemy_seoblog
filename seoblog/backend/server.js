const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

//bring routes
const blogRoutes = require('./routes/blog_routes');
const authRoutes = require('./routes/auth_routes');

//app
const app = express()

//db
mongoose.connect(process.env.DATABASE_CLOUD)
.then(() => console.log('DB connected'));

//middlewares
app.use(morgan('dev')) //development mode which gives endpoints in the console
app.use(bodyParser.json())
app.use(cookieParser())
//routes middleware
app.use('/api', blogRoutes); //Start all routes with api
app.use('/api', authRoutes); 


//cors - deal with cross-origin requests
if(process.env.NODE_ENV === 'development') {
    app.use(cors({origin : process.env.CLIENT_URL}))
}

//port
const port = process.env.PORT || 8000 //access port variable from env file with default value of 8000
app.listen(port, ()=> { //second argument is not necessary
    console.log(`Server is running on port ${port}`);
})