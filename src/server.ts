import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { homeRoutes } from './routes/home.route';

dotenv.config();

mongoose.connect(process.env.DATABASE_URL!);

const db = mongoose.connection;
db.on('error', (err) => {
	console.error('[database]:', err);
});
db.once('connected', () => {
	console.log('[database]: database connected');
});
const port = process.env.PORT || '3000';

const app = express();

app.use(express.json());

app.use('/', homeRoutes);

app.listen(port, () => {
	console.log(`[server]: server is listening on port:${port}`);
});
