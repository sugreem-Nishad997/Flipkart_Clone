import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user_routes.js';
import productRoutes from './routes/product_routes.js';
import paymentRoutes from './routes/payment_routes.js';
import orderRoutes from './routes/order_routes.js';
const app = express();
dotenv.config();

const dbUrl = process.env.DB_URL;

app.use(cors());
app.use(express.json({limit:'40kb'}));
app.use(express.urlencoded({limit:'40kb', extended:true}));

app.use(userRoutes);
app.use(productRoutes);
app.use(paymentRoutes);
app.use(orderRoutes);

const connectToDB = async() => {
    await mongoose.connect(dbUrl);
    console.log("Connect To DB");
}

const start = async() => {
    app.listen(8000, () => {
        console.log("Listening to port 8000")
        connectToDB();
    })
}

// app.post("/payment/create-order", (req, res) => {
//     res.json({message:"feteched"});
// })
app.use((err, req, res, next) => {
    console.log("Unexpected Error", err);
    res.status(500).json({message:"Unexpected server error", error:err.message});
})
start();