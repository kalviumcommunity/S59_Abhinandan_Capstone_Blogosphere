const express = require('express');
const dotenv = require('dotenv'); 
dotenv.config();
const app = express();
const cors = require('cors')

const cookieParser = require('cookie-parser')

const routes = require("./Controllers/routes");
const userRoutes = require("./Controllers/User-Routes");

const allowedOrigins = [
    'https://main--abhinandanblogosphere.netlify.app',
    'http://localhost:5173',
];

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));


app.use(express.json());
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
