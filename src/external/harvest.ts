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
	let endpoint = "time_entries?user_id=" + userId + "&from=" + from + "&to=" + to;
	let uri = buildHarvestUri(endpoint);
	let response = await fetch(uri, requestOpts);

	return await response.json();
}

export async function getProjectTimeEntries(projectId: string, from: Date, to: Date) {
	let requestOpts: any = getHarvestRequestOpts("GET");
	let endpoint = "time_entries?project_id=" + projectId + "&from=" + from + "&to=" + to;
	let uri = buildHarvestUri(endpoint);
	let response = await fetch(uri, requestOpts);

	return await response.json();
}

export async function getUserList(onlyActive: boolean = false) {
	let requestOpts: any = getHarvestRequestOpts("GET");
	let endpoint = onlyActive ? "users?is_active=true" : "users";
	let uri = buildHarvestUri(endpoint);
	let response = await fetch(uri, requestOpts);

	return await response.json();
}

export async function getProjectList(onlyActive: boolean = false) {
	let requestOpts: any = getHarvestRequestOpts("GET");
	let endpoint = onlyActive ? "projects?is_active=true" : "users";
	let uri = buildHarvestUri(endpoint);
	let response = await fetch(uri, requestOpts);

	return await response.json();
}

export async function getUserProjectAssignments(userId: string) {
	let requestOpts: any = getHarvestRequestOpts("GET");
	let endpoint = "users/" + userId + "/project_assignments";
	let uri = buildHarvestUri(endpoint);
	let response = await fetch(uri, requestOpts);

	return await response.json();
}

export async function getProjectUserAssignments(projectId: string, onlyActive: boolean = false) {
	let requestOpts: any = getHarvestRequestOpts("GET");
	let endpoint = onlyActive ? "projects/" + projectId + "/user_assignments?is_active=true" : "projects/" + projectId + "/user_assignments";
	let uri = buildHarvestUri(endpoint);
	let response = await fetch(uri, requestOpts);

	return await response.json();
}