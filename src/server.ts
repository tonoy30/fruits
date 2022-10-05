import dotenv from 'dotenv';
import express from 'express';
import { fruitRoutes } from './routes/fruits.route';
import { homeRoutes } from './routes/home.route';

dotenv.config();

const port = process.env.PORT || '3000';

const app = express();

app.use(express.json());

app.use('/', homeRoutes);
app.use('/fruits', fruitRoutes);

app.listen(port, () => {
	console.log(`[server]: server is listening on port:${port}`);
});
