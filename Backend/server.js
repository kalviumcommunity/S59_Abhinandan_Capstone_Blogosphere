const express = require('express');
const dotenv = require('dotenv'); 
dotenv.config();
const app = express();
const cors = require('cors')

const cookieParser = require('cookie-parser')

const routes = require("./Controllers/routes");
const userRoutes = require("./Controllers/User-Routes");

app.use(cookieParser());

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(cookieParser())
app.use('/data', routes);
app.use('/user', userRoutes)
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send("Your database is connected to the server");
});
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
