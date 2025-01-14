import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { JobPosts } from "@/types/userTypes";
import { apiUrl } from "@/modal-forms/profile/OnboardingModal";

export const useFetchRecentJobs = (): UseQueryResult<
	JobPosts[],
	AxiosError
> => {
	const fetchRecentJobPosts = async (): Promise<JobPosts[]> => {
		try {
			const url = `${apiUrl}/api/jobs/recent`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
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

	return useQuery<JobPosts[], AxiosError>({
		queryKey: ["JobPosts"],
		queryFn: fetchRecentJobPosts,
		staleTime: 1800000, // 30 minutes
	});
};
