const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 80;
const pool = require('./db.js')
const app = express() 
const dotenv = require('dotenv').config()

app.use(cors())

app.use(express.json())
 


app.get('/', async (req, res) => {
    console.log(typeof(process.env.DB_USER))
    console.log(typeof(process.env.DB_PASSWORD))
    console.log(typeof(process.env.DB_HOST))
    console.log(typeof(process.env.DB_PORT))
    console.log(typeof(process.env.DB_DATABASE))


})

app.get('/respondToMeYoWatafack', async (req,res) => {
    console.log("REsponded")
    res.send({response: "kek"})
})


app.post("/getTable", async (req,res) => {
    try {
        let orderby;
        let limit = req.body.number
        let table = req.body.table
        console.log(req.body)
        
        if (req.body.orderby != 'None') { 
            orderby = " ORDER BY " + req.body.orderby + " " + req.body.ascdesc 
        } else {
            orderby = " " 
        }
        let q = `SELECT * FROM ${table} ${orderby} LIMIT ${limit};`;
        let usersList = await pool.query(q);
        res.send(usersList.rows) 
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

app.post("/delTable", async (req,res) => {
    try {
        console.log(req.body) 
        let cond = req.body.condition 
        if (typeof cond === "string") {
            console.log('cond is str')
            cond = `'${cond}'`
        } 
        let col = req.body.column
        let table = req.body.table
        let deleted = `SELECT * FROM ${table} WHERE ${col} = ${cond};`
        let q = `DELETE FROM ${table} WHERE ${col} = ${cond};`;
        console.log(q)
        let deletedList = await pool.query(deleted)
        let usersList = await pool.query(q);
        console.log(usersList)
        res.send(deletedList.rows) 
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

app.post("/updTable", async (req,res) => {
    try {
        console.log(req.body)
        let cond = req.body.condition
        let col = req.body.column
        let table = req.body.table
        let colToEdit = req.body.editColumn
        let value = req.body.val
        if (typeof cond === "string") {
            console.log('cond is str') 
            cond = `'${cond}'`
        } 
        if (typeof value === "string") {
            console.log('value is str')
            value = `'${value}'`
        }
        
        let updated = `SELECT * FROM ${table} WHERE ${col} = ${cond};`
        

        let q = `UPDATE ${table} SET ${colToEdit} = ${value} WHERE ${col} = ${cond};`;
        console.log(q)
        let updateList = await pool.query(updated)

        let usersList = await pool.query(q);

        console.log(usersList)
        res.send(updateList.rows) 
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

app.post("/insTable", async (req,res) => {
    try {
        console.log(req.body)
        let table = req.body.table
        let arr = req.body.vals
        let values = ''

        for (let i = 0; i < arr.length; i++) {
            if (typeof(arr[i]) === 'string') {
                console.log(arr[i])  
                console.log("IS STR")
                arr[i] = `'${arr[i]}'`
            } else if (typeof(arr[i]) === 'number') {
                console.log(arr[i]) 
                console.log("IS NUM")

                arr[i] = `${arr[i]}`
            }

            values += arr[i]
            if (i != arr.length - 1) {
                values += ', '
            }
        }
        let q = `INSERT INTO ${table} VALUES (${values}) RETURNING *;`;
        console.log(q)
        let usersList = await pool.query(q);
        console.log(usersList)
        res.send(usersList.rows) 
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

app.post("/customQuery", async (req, res) => {
    try {
        console.log(req.body)
        let txt = req.body.text
        txt = txt.replace(/(\r\n|\n|\r)/gm," ");
        // console.log(txt)
        let q = await pool.query(txt)
        console.log(q)
        res.send(q.rows)
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
})

app.post("/login", async (req, res) => {
    console.log(req.body)

    if (req.body.Login.toLowerCase() === "admin" && req.body.Pass.toLowerCase() === "341") {
        console.log("ADNAN THE BEST")
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        res.send({isLogged: true})
        
    
    }

})

app.listen(PORT, () => {
    console.log('running on port ' + PORT);
})
