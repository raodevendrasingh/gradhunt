import { apiUrl } from "@/modal-forms/OnboardingModal";
import axios from "axios";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

const isValidUsername = (username: string): boolean => {
	return username.length < 16 && /^[a-z0-9]+$/.test(username);
};

export const useUsernameCheck = () => {
	const [isCheckingUsername, setIsCheckingUsername] =
		useState<boolean>(false);
	const [usernameMsg, setUsernameMsg] = useState<string>("");
	const [isFieldValid, setIsFieldValid] = useState<boolean>(false);

	const checkUsername = useDebounceCallback(async (username: string) => {
		if (username.length > 3 && isValidUsername(username)) {
			setIsCheckingUsername(true);
			setUsernameMsg("");
			try {
				const url = `${apiUrl}/api/users/check-username/?username=${username}`;
				const response = await axios.get(url);
				if (response.data.exists) {
					setUsernameMsg(
						"This username is already taken, choose something else.😞"
					);
					setIsFieldValid(false);
				} else {
					setUsernameMsg("This username is available! 🎉");
					setIsFieldValid(true);
				}
			} catch (error) {
				setUsernameMsg("Error checking username ⚠️");
				setIsFieldValid(false);
			} finally {
				setIsCheckingUsername(false);
			}
		} else {
			setIsFieldValid(false);
			setUsernameMsg("");
		}
	}, 500);

	return {
		isValidUsername,
		isCheckingUsername,
		usernameMsg,
		isFieldValid,
		checkUsername,
	};
};
