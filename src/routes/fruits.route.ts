import { AxiosResponse } from 'axios';
import { Router } from 'express';
import { groupByKey } from '../utils/array.utils';
import { getAxiosClient } from '../utils/axios.utils';
const router = Router();

const axiosClient = getAxiosClient();
function retryWorkDelay(
	worker: Promise<AxiosResponse<any, any>>,
	city: string,
	delay: number,
	count: number,
	retry = 1
) {
	return worker
		.then((response: { data: any }) => {
			// group by the response by using key for faster access
			const groupedResponse = groupByKey(
				response.data,
				'location_1_city'
			);

			const dataToBeReturned = {
				city: city,
				fruits: [],
			} as { city: string; fruits: string[] };

			groupedResponse[city].forEach((value: any) => {
				dataToBeReturned.fruits.push(value.item);
			});
			return [dataToBeReturned];
		})
		.catch((err) => {
			if (count > retry) {
				console.log(err + 'executing with delay ' + delay);
				setTimeout(() => {
					retryWorkDelay(
						worker,
						city,
						delay * (retry + 1),
						count,
						retry + 1
					);
				}, delay);
			} else {
				console.log(err + 'executing with delay ' + delay);
				throw new Error(err.message);
			}
		});
}
router.get('/', async (req, res) => {
	const city = req.query.city as string;

	const cal = axiosClient.get('y6p2-px98.json', {
		params: { category: 'Fruit' },
	});
	retryWorkDelay(cal, city, 1000, 3)
		.then((data) => {
			res.json({ data: data });
		})
		.catch((err) => {
			res.status(500).json({ error: err.message });
		});
});
export { router as fruitRoutes };
