const mongoose = require('mongoose')
require('dotenv').config()

const connectToDB = async() => {
    try{
        await mongoose.connect(process.env.DB_URI)
        console.log("MONGODB CONNETED")
    }
    catch(err){
        console.error("Connection Failed",err)
    }
}

const disconnect = async() => {
    mongoose.disconnect()
    console.log("MONGODB DISCONNECTED")
}

const isConnected= () => {
    return mongoose.connection.readyState === 1;
}

module.exports = { connectToDB, disconnect, isConnected }
