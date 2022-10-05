function groupByKey(array: any, key: string) {
	return array.reduce((prev: any, obj: any) => {
		if (obj[key] === undefined) return prev;
		return Object.assign(prev, {
			[obj[key]]: (prev[obj[key]] || []).concat(obj),
		});
	}, {});
}
export { groupByKey };
