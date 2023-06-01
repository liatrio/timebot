import { getUserList, getProjectList, getProjectUserAssignments } from "../external/harvest";


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

	for(const project of projectList.projects) {
		if(project.name === name) {
			return project;
		}
	}
}