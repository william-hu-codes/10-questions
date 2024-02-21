//  connection string - .env
require('dotenv').config()

// db - connection
require('./db.connection')

// import models
const User = require("../models/user")
const Case = require("../models/case")

async function deleteAllCases() {
    try {
        await Case.deleteMany({})
        console.log("deleted all cases")
    }catch(err){
        console.log(err)
    }
}

// deleteAllCases()

async function deleteAllUsers() {
    try {
        await User.deleteMany({})
        console.log("deleted all users")
    }catch(err){
        console.log(err)
    }
}

// deleteAllUsers()