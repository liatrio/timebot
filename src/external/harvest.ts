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
  const requestOpts: any = getHarvestRequestOpts("GET");
  const endpoint = "time_entries?user_id=" + userId + "&from=" + from + "&to=" + to;
  const uri = buildHarvestUri(endpoint);
  const response = await fetch(uri, requestOpts);

  return await response.json();
}

export async function getProjectTimeEntries(projectId: string, from: Date, to: Date) {
  const requestOpts: any = getHarvestRequestOpts("GET");
  const endpoint = "time_entries?project_id=" + projectId + "&from=" + from + "&to=" + to;
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
  const endpoint = onlyActive ? "projects?is_active=true" : "users";
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

export async function getProjectUserAssignments(projectId: string, onlyActive = false) {
  const requestOpts: any = getHarvestRequestOpts("GET");
  const endpoint = onlyActive ? "projects/" + projectId + "/user_assignments?is_active=true" : "projects/" + projectId + "/user_assignments";
  const uri = buildHarvestUri(endpoint);
  const response = await fetch(uri, requestOpts);

  return await response.json();
}