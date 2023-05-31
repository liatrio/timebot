import { getUserList, getProjectList } from "../external/harvest";


export async function getUserIdByEmail(email: string) {
	const userList: any = await getUserList(false);

	for(const user of userList.users) {
		if(user.email === email) {
			return user.id;
		}
	}
}

export async function getProjectByName(name: string) {
	const projectList: any = await getProjectList(false);
	const projectMatches = [];

	for(const project of projectList.projects) {
		const regex = new RegExp(`.*${name}.*`, "gi");
		if(project.name.match(regex)) {
			projectMatches.push(project);
		}
	}
	
	return projectMatches;
}