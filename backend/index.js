import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './lib/db.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

const PORT = process.env.PORT || 9000;


app.listen(PORT,() => {
    console.log(`Server running at port : ${PORT}`)
    connectDB();
})