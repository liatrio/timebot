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

export async function getUserTimeEntries(userId: string, from: Date, to: Date) {
	let requestOpts: any = getHarvestRequestOpts("GET");
	let uri = buildHarvestUri("time_entries?user_id=" + userId + "&from=" + from + "&to=" + to);
	let response = await fetch(uri, requestOpts);

	return await response.json();
}

export async function getProjectTimeEntries(projectId: string, from: Date, to: Date) {
	let requestOpts: any = getHarvestRequestOpts("GET");
	let uri = buildHarvestUri("time_entries?project_id=" + projectId + "&from=" + from + "&to=" + to);
	let response = await fetch(uri, requestOpts);

	return await response.json();
}