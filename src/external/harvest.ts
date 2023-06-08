function getHarvestRequestOpts(method: string) {
	return {
		method: method,
		headers: {
			"Authorization": `Bearer ${process.env.HARVEST_ACCESS_TOKEN}`,
			"Harvest-Account-Id": process.env.HARVEST_ACCOUNT_ID,
			"User-Agent": "Liatrio timebot"
		}
	};
}

function buildHarvestUri(endpoint: string) {
	return process.env.HARVEST_API_URL + endpoint;
}

export async function getUserTimeEntries(userId: string, from: string, to: string) {
	const requestOpts: any = getHarvestRequestOpts("GET");
	const endpoint = "time_entries?user_id=" + userId + "&from=" + from + "&to=" + to;
	const uri = buildHarvestUri(endpoint);
	const response = await fetch(uri, requestOpts);

	return await response.json();
}

export async function getProjectTimeEntries(projectId: string) {
	const requestOpts: any = getHarvestRequestOpts("GET");
	const endpoint = "time_entries?project_id=" + projectId;
	const uri = buildHarvestUri(endpoint);
	const response = await fetch(uri, requestOpts);

	return await response.json();
}

export async function getUserList(onlyActive = false) {
	const requestOpts: any = getHarvestRequestOpts("GET");
	const endpoint = onlyActive ? "users?is_active=true" : "users";
	const uri = buildHarvestUri(endpoint);
	const response = await fetch(uri, requestOpts);

	return await response.json();
}

export async function getProjectList(onlyActive = false) {
	const requestOpts: any = getHarvestRequestOpts("GET");
	const endpoint = onlyActive ? "projects?is_active=true" : "projects";
	const uri = buildHarvestUri(endpoint);
	const response = await fetch(uri, requestOpts);

	return await response.json();
}

export async function getUserProjectAssignments(userId: string) {
	const requestOpts: any = getHarvestRequestOpts("GET");
	const endpoint = "users/" + userId + "/project_assignments";
	const uri = buildHarvestUri(endpoint);
	const response = await fetch(uri, requestOpts);

	return await response.json();
}

export async function getActiveUserAssignments(userId: string) {
	const requestOpts: any = getHarvestRequestOpts("GET");
	const endpoint = "user_assignments?is_active=true&user_id=" + userId;
	const uri = buildHarvestUri(endpoint);
	const response = await fetch(uri, requestOpts);

	return await response.json();
}

export async function getActiveProjectTimeEntries(userId: string, projectId: string) {
	const requestOpts: any = getHarvestRequestOpts("GET");
	const endpoint = "time_entries?user_id=" + userId + "&project_id=" + projectId;
	const uri = buildHarvestUri(endpoint);
	const response = await fetch(uri, requestOpts);

	return await response.json();
}

export async function getProjectUserAssignments(projectId: string, onlyActive = false) {
	const requestOpts: any = getHarvestRequestOpts("GET");
	const endpoint = onlyActive ? "projects/" + projectId + "/user_assignments?is_active=true" : "projects/" + projectId + "/user_assignments";
	const uri = buildHarvestUri(endpoint);
	const response = await fetch(uri, requestOpts);

	return await response.json();
}