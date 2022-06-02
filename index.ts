import express from 'express';
import dotenv from 'dotenv';
import authRouter from 'routes/auth';
import connect from './db/connect';

dotenv.config();

const app = express();
const { PORT, DB_URI } = process.env;

app.use('/auth', authRouter);

app.listen(Number(PORT), () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);

  connect(String(DB_URI));


});