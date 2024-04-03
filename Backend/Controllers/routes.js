const express = require('express')
const router = express.Router();
const {connectToDB} = require('../db.js')

const Trial = require('../Models/trial.js')


router.get('/', async(req, res) => {
    try {
        const current = await Trial.find()
        res.json(current)   
    }
    catch(error) {
        res.json({error: "An error has been caught - get"})
    }
})
connectToDB()
module.exports=router;