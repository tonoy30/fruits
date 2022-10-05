import { Router } from 'express';
import { groupByKey } from '../utils/array.utils';
import { getAxiosClient } from '../utils/axios.utils';
const router = Router();

const axiosClient = getAxiosClient({ retry: 3, retryDelay: 2000 });

router.get('/', (req, res) => {
	const city = req.query.city as string;

	axiosClient
		.get('https://data.ct.gov/resource/y6p2-px98.json', {
			params: { category: 'Fruit' },
		})
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
			res.json({ data: [dataToBeReturned] });
		})
		.catch((error: any) => {
			res.status(500).json({ error: error.message });
		});
});
export { router as fruitRoutes };
