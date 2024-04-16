const express = require('express');
const dotenv = require('dotenv'); 
dotenv.config();
const app = express();
const cors = require('cors')
const routes = require("./Controllers/routes");
const userRoutes = require("./Controllers/User-Routes")
app.use(express.json());
app.use(cors())
app.use('/data', routes);
app.use('/user', userRoutes)
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send("Your database is connected to the server");
});
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
