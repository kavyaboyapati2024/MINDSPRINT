import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './src/lib/db.js';
import userRoutes from './src/routes/userRoutes.js'

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

 connectDB();

const PORT = process.env.PORT || 9000;

app.use('/authUsers',userRoutes)


app.listen(PORT,() => {
    console.log(`Server running at port : ${PORT}`)
})