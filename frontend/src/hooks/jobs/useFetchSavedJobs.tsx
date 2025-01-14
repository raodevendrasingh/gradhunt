import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { SavedJobsType } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import { apiUrl } from "@/modal-forms/profile/OnboardingModal";

export const useFetchSavedJobs = (): UseQueryResult<
	SavedJobsType[],
	AxiosError
> => {
	const { getToken } = useAuth();

	const fetchSavedJobsData = async (): Promise<SavedJobsType[]> => {
		const token = await getToken();
		if (!token) {
			throw new Error("User Unauthorized!");
		}
		const url = `${apiUrl}/api/jobs/saved`;
		const response = await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	};

	return useQuery<SavedJobsType[], AxiosError>({
		queryKey: ["SavedJobsType"],
		queryFn: fetchSavedJobsData,
		staleTime: 10000,
	});
};
