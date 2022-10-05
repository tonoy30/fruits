import axios from 'axios';

function getAxiosClient() {
	const axiosClient = axios.create({
		baseURL: 'https://data.ct.gov/resource/',
		headers: {}
	});
	return axiosClient;
}

export { getAxiosClient };

