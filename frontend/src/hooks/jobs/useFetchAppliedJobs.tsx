import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { AppliedJobsType } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import { apiUrl } from "@/modal-forms/profile/OnboardingModal";

export const useFetchAppliedJobs = (): UseQueryResult<
	AppliedJobsType[],
	AxiosError
> => {
	const { getToken } = useAuth();

	const fetchAppliedJobsData = async (): Promise<AppliedJobsType[]> => {
		const token = await getToken();
		if (!token) {
			throw new Error("User Unauthorized!");
		}
		const url = `${apiUrl}/api/jobs/applied`;
		const response = await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	};

	return useQuery<AppliedJobsType[], AxiosError>({
		queryKey: ["AppliedJobsType"],
		queryFn: fetchAppliedJobsData,
		staleTime: 10000,
	});
};
