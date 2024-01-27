// Create web server

// Import modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
// Import mongoose
const mongoose = require('mongoose')
// Import config
const config = require('./config/config')
// Import models
const Comment = require('./models/comment')

// Create app
const app = express()
// Use morgan
app.use(morgan('combined'))
// Use bodyParser
app.use(bodyParser.json())
// Use cors
app.use(cors())

// Connect to mongodb
mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', () => console.log('Connected to mongodb'))

// Create route for GET request
app.get('/comments', (req, res) => {
  Comment.find({}, 'content', (error, comments) => {
    if (error) { console.error(error) }
    res.send({
      comments: comments
    })
  }).sort({ _id: -1 })
})

// Create route for POST request
app.post('/comments', (req, res) => {
  const db = req.db
  const content = req.body.content
  const newComment = new Comment({
    content: content
  })

  newComment.save(error => {
    if (error) { console.error(error) }
    res.send({
      success: true,
      message: 'Comment saved'
    })
  })
})

// Listen on port 8081
app.listen(process.env.PORT || 8081)