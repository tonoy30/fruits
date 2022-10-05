import { AxiosResponse } from 'axios';
import { Router } from 'express';
import { groupByKey } from '../utils/array.utils';
import { getAxiosClient } from '../utils/axios.utils';
const router = Router();

const axiosClient = getAxiosClient();
// retry http request on error
function retryRequestWithDelay(
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
			const dataByCity = groupedResponse[city]
			if (dataByCity && dataByCity.length) {
				dataByCity.forEach((value: any) => {
					dataToBeReturned.fruits.push(value.item);
				});
				return [dataToBeReturned];
			}
			return []
		})
		.catch((err) => {
			const { message } = err
			// retry while Network timeout or Network Error
			if (!(message.includes("timeout") || message.includes("Network Error"))) {
				return err;
			}
			if (count > retry) {
				console.log(err + 'executing with delay ' + delay);
				setTimeout(() => {
					retryRequestWithDelay(
						worker,
						city,
						delay * (retry + 1),
						count,
						retry + 1
					);
				}, delay);
			} else {
				console.log(err + 'executing with delay ' + delay);
				return err
			}
		});
}

router.get('/', async (req, res) => {
	const city = req.query.city as string;

	const worker = axiosClient.get('y6p2-px98.json', {
		params: { category: 'Fruit' },
	});
	try {
		const data = await retryRequestWithDelay(worker, city, 1000, 2);
		res.json({ data });
	} catch (error) {
		res.status(500).json({ error: error });
	}
});
export { router as fruitRoutes };

