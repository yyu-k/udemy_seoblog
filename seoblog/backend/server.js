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
const userRoutes = require('./routes/user_routes');
const categoryRoutes = require('./routes/category_routes');
const tagRoutes = require('./routes/tag_routes');
const formRoutes = require('./routes/form_routes');
const commentRoutes = require('./routes/comment_routes');

//app
const app = express()

//db
mongoose.connect(process.env.DATABASE_CLOUD)
.then(() => console.log('DB connected'));

//middlewares
app.use(morgan('dev')); //development mode which gives endpoints in the console
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors()); //enable all cross origin requests
//routes middleware
app.use('/api', blogRoutes); //Start all routes with api
app.use('/api', authRoutes); 
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);
app.use('/api', formRoutes);
app.use('/api', commentRoutes);
app.use('/api', (req, res, next) => {
    return res.status(404).json({
        error : '404 - requested resource not found. Please check if the API endpoint is correct'
    });
})


//cors - deal with cross-origin requests
if(process.env.NODE_ENV === 'development') {
    app.use(cors({origin : process.env.CLIENT_URL}))
}

//port
const port = process.env.PORT || 8000 //access port variable from env file with default value of 8000
app.listen(port, ()=> { //second argument is not necessary
    console.log(`Server is running on port ${port}`);
})