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

router.post('/add', async (req, res) => {
    try{
        const { name } = req.body;
        const trial = new Trial({name})
        saveTrial = await trial.save()
        res.json(saveTrial)
    }
    catch(error){
        res.json({error: "An error has been caught - post"});
    }
    
});

connectToDB()
module.exports=router;