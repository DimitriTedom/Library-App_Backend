import express from "express";
import bodyParser from "body-parser";
import userRoutes from './routes/userRoutes'
import bookRoutes from './routes/bookRoutes'
import borrowRoutes from './routes/borrowRoutes'
require('dotenv').config();

const app = express();

app.use(bodyParser.json()); //For parsing application/json
app.use('/users',userRoutes);
app.use('/books',bookRoutes);
app.use('/borrows',borrowRoutes)

export default app;