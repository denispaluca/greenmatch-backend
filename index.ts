import express from 'express';
import dotenv from 'dotenv';
import apiRouter from './routes/api';
import connect from './db/connect';
import cors from 'cors';
import { createServer } from 'http';
import * as socket from './services/socket';

dotenv.config();

const app = express();
const { PORT, DB_URI } = process.env;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use('/api', apiRouter);



const httpServer = createServer(app);


socket.init(httpServer, 'http://localhost:3000');

httpServer.listen(Number(PORT), () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);

  connect(String(DB_URI));
});

