import { apiUrl } from "@/modal-forms/profile/OnboardingModal";

import axios from "axios";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const useEmailCheck = () => {
	const [isCheckingEmail, setIsCheckingEmail] = useState<boolean>(false);
	const [emailMsg, setEmailMsg] = useState<string>("");
	const [isFieldValid, setIsFieldValid] = useState<boolean>(false);

	const checkEmail = useDebounceCallback(async (email: string) => {
		if (email.length > 3 && isValidEmail(email)) {
			setIsCheckingEmail(true);
			setEmailMsg("");
			try {
				const url = `${apiUrl}/api/users/check-email/?email=${email}`;
				const response = await axios.get(url);
				if (response.data.exists) {
					setEmailMsg("This email is already registered!");
					setIsFieldValid(false);
				} else {
					setEmailMsg("");
					setIsFieldValid(true);
				}
			} catch (error) {
				setEmailMsg("Error checking email!");
				setIsFieldValid(false);
			} finally {
				setIsCheckingEmail(false);
			}
		} else {
			setIsFieldValid(false);
			setEmailMsg("");
		}
	}, 500);

	return {
		isValidEmail,
		isCheckingEmail,
		emailMsg,
		isFieldValid,
		checkEmail,
	};
};
