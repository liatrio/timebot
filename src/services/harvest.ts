import { getUserList } from "../external/harvest";


export async function getUserIdByEmail(email: string) {
	const userList: any = await getUserList(false);

	for(const user of userList.users) {
		if(user.email === email) {
			return user.id;
		}
	}
}