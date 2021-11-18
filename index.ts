const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 80;
const pool = require('./db.js')
const app = express()
const upload = require('express-fileupload')
const dotenv = require('dotenv').config()

app.use(cors())

app.use(express.json())

app.get("/", async (req,res) => {
    
})


console.log('hello world')