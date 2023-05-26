import { getUserList } from "../external/harvest";


export async function getUserIdByEmail(email: string) {
	let userList: any = await getUserList(false);

	for(let user of userList.users) {
		if(user.email === email) {
			return user.id;
		}
	}
}