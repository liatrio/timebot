function getHarvestRequestOpts(method: string) {
	return {
		method: method,
		headers: {
			"Authorization": process.env.HARVEST_ACCESS_TOKEN,
			"Harvest-Account-Id": process.env.HARVEST_ACCOUNT_ID,
			"User-Agent": "Liatrio timebot"
		}
	};
}

function buildHarvestUri(endpoint: string) {
	return process.env.HARVEST_API_URL + endpoint;
}

export async function getUserList(onlyActive: boolean = false) {
	let requestOpts: any = getHarvestRequestOpts("GET");
	let endpoint = onlyActive ? "users?is_active=true" : "users";
	let uri = buildHarvestUri(endpoint);
	let response = await fetch(uri, requestOpts);

	return await response.json();
}