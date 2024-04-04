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

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedTrial = await Trial.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedTrial) {
            return res.status(404).json({ error: "Trial not found." });
        }
        res.json(updatedTrial);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while updating the trial." });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTrial = await Trial.findByIdAndDelete(id);
        if (!deletedTrial) {
            return res.status(404).json({ error: "Trial not found." });
        }
        res.json({ message: "Trial deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while deleting the trial." });
    }
});

connectToDB()
module.exports=router;