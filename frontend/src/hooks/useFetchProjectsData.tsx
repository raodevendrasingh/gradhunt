import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ProjectData } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { useFetchProfileCompletion } from "./useFetchCompletionPercentage";
import { apiUrl } from "@/modal-forms/OnboardingModal";

export const useFetchProjectData = (): UseQueryResult<
	ProjectData[],
	AxiosError
> => {
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();
	const { refetch: refetchCompletionPercentage } =
		useFetchProfileCompletion();

	const fetchProjectData = async (): Promise<ProjectData[]> => {
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User Unauthorized!");
			}
			const url = `${apiUrl}/api/users/${username}/projects`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			refetchCompletionPercentage();
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

	return useQuery<ProjectData[], AxiosError>({
		queryKey: ["projectsData", username],
		queryFn: fetchProjectData,
		staleTime: 30000,
	});
};
