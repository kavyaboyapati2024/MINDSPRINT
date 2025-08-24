import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './src/lib/db.js';
import cookieParser from 'cookie-parser';
import userRoutes from './src/routes/userRoutes.js'
import upcomingAuctionRoutes from './src/routes/auctionRoutes.js'

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

 connectDB();

const PORT = process.env.PORT || 9000;

app.use('/api/authUsers',userRoutes)
app.use('/api/auctions',upcomingAuctionRoutes)


app.listen(PORT,() => {
    console.log(`Server running at port : ${PORT}`)
})