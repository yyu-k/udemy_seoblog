const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()

//app
const app = express()

//middlewares
app.use(morgan('dev')) //development mode which gives endpoints in the console
app.use(bodyParser.json())
app.use(cookieParser())

//cors
app.use(cors())

//routes
app.get('/api', (req, res) => { //localhost:8000/api, response to this endpoint will be the current time
    res.json({time: Date().toString()})
}) 

//port
const port = process.env.PORT || 8000 //access port variable from env file with default value of 8000
app.listen(port, ()=> { //second argument is not necessary
    console.log(`Server is running on port ${port}`);
})