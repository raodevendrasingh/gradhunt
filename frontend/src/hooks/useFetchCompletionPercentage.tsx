import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { Progress } from "@/types/userTypes";

export const useFetchProfileCompletion = (): UseQueryResult<
	Progress,
	AxiosError
> => {
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();

	const fetchCompletionPercentage = async (): Promise<Progress> => {
		const token = await getToken();
		if (!token) {
			throw new Error("User Unauthorized!");
		}
		const url = `/api/users/${username}/completion-percentage`;
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
