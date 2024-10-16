import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { SavedJobs } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";

export const useFetchSavedJobs = (): UseQueryResult<
	SavedJobs,
	AxiosError
> => {
	const { getToken } = useAuth();

	const fetchSavedJobsData = async (): Promise<SavedJobs> => {
		const token = await getToken();
		if (!token) {
			throw new Error("User Unauthorized!");
		}
		const url = `/api/jobs/saved`;
		const response = await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	};

	return useQuery<SavedJobs, AxiosError>({
		queryKey: ["SavedJobs"],
		queryFn: fetchSavedJobsData,
		staleTime: 10000,
	});
};
