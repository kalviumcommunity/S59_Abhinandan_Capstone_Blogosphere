const express = require('express');
const dotenv = require('dotenv'); 
dotenv.config();
const app = express();
const cors = require('cors')

const cookieParser = require('cookie-parser')

const routes = require("./Controllers/routes");
const userRoutes = require("./Controllers/User-Routes");
const blogRoutes = require("./Controllers/blogRoutes")
const commentRoutes = require("./Controllers/commentRoutes")
const scheduleEmails = require("./Controllers/cronJobScheduling")
const aiChatRoutes = require("./Controllers/langChainRoutes")

const allowedOrigins = [
    'http://localhost:5173',
    'https://blogosphere-4321.netlify.app',
];

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } 
        else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(express.json());
app.use(cookieParser())
app.use('/data', routes);
app.use('/user', userRoutes)
app.use('/blog' , blogRoutes)
app.use('/review', commentRoutes)
app.use("/payment", require('./Controllers/payment'));
app.use('/', aiChatRoutes)
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send("Your database is connected to the server");
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
    scheduleEmails();
});
