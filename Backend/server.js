const express = require('express')

const app = express()
const routes=require("./Controllers/routes")


app.use(express.json())
app.use('/data',routes)

const port = 1111

app.get('/', (req, res)=>{
    res.send("Your Data base is connected to the server")
})

app.listen(port, ()=> {
    console.log(`App is running on port ${port}`)
})

