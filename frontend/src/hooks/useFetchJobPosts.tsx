import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { JobPosts } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { apiUrl } from "@/modal-forms/OnboardingModal";

export const useFetchJobPosts = (): UseQueryResult<JobPosts[], AxiosError> => {
	const { getToken } = useAuth();
	const { companyslug } = useParams<{ companyslug: string }>();

	const fetchJobPosts = async (): Promise<JobPosts[]> => {
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User Unauthorized!");
			}
			const url = `${apiUrl}/api/company/${companyslug}/jobs`;
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

	return useQuery<JobPosts[], AxiosError>({
		queryKey: ["JobPosts", companyslug],
		queryFn: fetchJobPosts,
		staleTime: 10000,
	});
};
