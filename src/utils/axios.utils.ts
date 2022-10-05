import axios from 'axios';

function getAxiosClient(retryConfig: { retry: number; retryDelay: number }) {
	const axiosClient = axios.create({
		baseURL: '',
		headers: {},
		...retryConfig,
	});

	axiosClient.interceptors.response.use(undefined, (err) => {
		const { config, message } = err;
		if (!config || !config.retry) {
			return Promise.reject(err);
		}
		console.log(err.message);
		// retry while Network timeout or Network Error
		if (
			!(message.includes('timeout') || message.includes('Network Error'))
		) {
			return Promise.reject(err);
		}
		config.retry -= 1;
		const delayRetryRequest = new Promise<void>((resolve) => {
			setTimeout(() => {
				console.log('retry the request', config.url);
				resolve();
			}, config.retryDelay || 1000);
		});
		return delayRetryRequest.then(() => axiosClient(config));
	});
	return axiosClient;
}
export { getAxiosClient };
