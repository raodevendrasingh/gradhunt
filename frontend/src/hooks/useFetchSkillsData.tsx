import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Skill } from "@/types/userTypes";
import { useParams } from "react-router-dom";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { apiUrl } from "@/modal-forms/OnboardingModal";

export const useFetchSkillData = (): UseQueryResult<Skill[], AxiosError> => {
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();

	const fetchskillData = async (): Promise<Skill[]> => {
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User Unauthorized!");
			}
			const url = `${apiUrl}/api/users/${username}/skills`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (error: AxiosError | any) {
			if (error.response && error.response.status === 404) {
				console.warn(
					"404 Not Found: The requested resource does not exist."
				);
				return [];
			} else {
				throw error;
			}
		}
	};

	return useQuery<Skill[], AxiosError>({
		queryKey: ["skillData", username],
		queryFn: fetchskillData,
		staleTime: 30000,
		refetchInterval: 30000,
	});
};
