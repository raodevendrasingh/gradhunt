import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { JobPosts } from "@/types/userTypes";
import { apiUrl } from "@/modal-forms/profile/OnboardingModal";

interface JobDataProps {
	jobId: string;
}

export const useFetchJobDetails = ({
	jobId,
}: JobDataProps): UseQueryResult<JobPosts, AxiosError> => {
	const fetchJobPostDetails = async (): Promise<JobPosts> => {
		const url = `${apiUrl}/api/job/${jobId}`;
		const response = await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response.data;
	};

	return useQuery<JobPosts, AxiosError>({
		queryKey: ["jobDetails", jobId],
		queryFn: fetchJobPostDetails,
		staleTime: 30000,
	});
};
