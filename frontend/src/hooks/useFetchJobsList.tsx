import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { JobPosts } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import { apiUrl } from "@/modal-forms/OnboardingModal";

export const useFetchJobsList = (): UseQueryResult<JobPosts[], AxiosError> => {
	const { getToken } = useAuth();

	const fetchAllJobsData = async (): Promise<JobPosts[]> => {
		const token = await getToken();
		if (!token) {
			throw new Error("User Unauthorized!");
		}
		const url = `${apiUrl}/api/jobs/list`;
		const response = await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	};

	return useQuery<JobPosts[], AxiosError>({
		queryKey: ["JobPosts"],
		queryFn: fetchAllJobsData,
		staleTime: 10000,
	});
};
