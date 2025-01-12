import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { Progress } from "@/types/userTypes";
import { apiUrl } from "@/modal-forms/OnboardingModal";

export const useFetchProfileCompletion = (): UseQueryResult<
	Progress,
	AxiosError
> => {
	const { getToken } = useAuth();
	const { user } = useUser();
	const { username } = useParams<{ username: string }>();

	const currentUser = user?.username;
	const AuthorizedUser = currentUser || username;

	const fetchCompletionPercentage = async (): Promise<Progress> => {
		const token = await getToken();
		if (!token) {
			throw new Error("User Unauthorized!");
		}
		const url = `${apiUrl}/api/users/${AuthorizedUser}/completion-percentage`;
		const response = await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	};

	return useQuery<Progress, AxiosError>({
		queryKey: ["profileCompletion", username],
		queryFn: fetchCompletionPercentage,
		staleTime: 30000,
	});
};
