import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
	res.send('Hello From Home!');
});

export { router as homeRoutes };
