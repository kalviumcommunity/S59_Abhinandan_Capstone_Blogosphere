const express = require('express');
const dotenv = require('dotenv'); 
dotenv.config();
const app = express();

const routes = require("./Controllers/routes");

app.use(express.json());
app.use('/data', routes);
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send("Your database is connected to the server");
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
