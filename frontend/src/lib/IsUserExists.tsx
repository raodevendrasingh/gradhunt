import axios from "axios";

export const IsUserExists = async (username: string) => {
	try {
		const url = `/api/check-username?username=${username}`;
		const response = await axios.get(url);
		return response.data.exists;
	} catch (error) {
		console.error("Error checking username:", error);
		throw error;
	}
};
