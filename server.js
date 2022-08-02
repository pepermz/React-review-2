

///Dependencies///

// get .env variables
require("dotenv").config()
// pull PORT from .env, give default value of 3000
const { PORT = 4000, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose")
// importing middleware
const cors = require("cors")
const morgan = require("morgan")

// DATABASE CONNECTION

//Establish connection
mongoose.connect(MONGODB_URL)
//Connection Events
mongoose.connection
.on("open", () => console.log("You are connected to mongoose"))
.on("close", () => console.log("You are disconnected from mongoose"))
.on("error", (error) => console.log(error))

// MODELS
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
})

const People = mongoose.model("People", PeopleSchema)

// MIDDLEWARE
app.use(cors())// to prevent cors errors, open access to all origins
app.use(morgan("dev")) // logging
app.use(express.json()) // parse json bodies


// ROUTES

// create a test route
app.get("/",(req,res) => {
    res.send("hello world")
})

// People index route
app.get("/people", async(req,res)=> {
    try {
        // get all people
        res.json(await People.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

// People create route
app.post("/people", async(req,res)=>{
    try {
        res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

// PEOPLE UPDATE ROUTE
app.put("/people/:id", async (req,res) => {
    try {
        // update people by their id
        res.json(
            await People.findByIdAndUpdate(req.params.id, req.body)
        )
    } catch (error) {
        res.status(400).json(error)
    }
})

// People DELETE Route
app.delete("/people/:id", async (req, res) => {
    try {
        // delete people by ID
        res.json(
            await People.findByIdAndRemove(req.params.id)
        )
    } catch (error) {
        res.status(400).json(error)
    }
})

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))