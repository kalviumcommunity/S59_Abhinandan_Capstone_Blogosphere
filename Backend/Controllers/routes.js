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
        res.status(500).json({ error: "An error occurred while fetching trials." });
    }
})

router.post('/add', async (req, res) => {
    try{
        const { name } = req.body;
        const trial = new Trial({name})
        const saveTrial = await trial.save()
        res.json(saveTrial)
    }
    catch(error){
        res.json({error: "An error has been caught - post"});
        res.status(500).json({ error: "An error occurred while saving the trial." });
    }
    
});

connectToDB()
module.exports=router;