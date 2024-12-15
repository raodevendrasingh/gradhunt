import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { EducationData } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { useFetchProfileCompletion } from "./useFetchCompletionPercentage";

export const useFetchEducationData = (): UseQueryResult<
	EducationData[],
	AxiosError
> => {
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();
    const { refetch: refetchCompletionPercentage } = useFetchProfileCompletion();

	const fetchEducationData = async (): Promise<EducationData[]> => {
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User Unauthorized!");
			}
			const url = `/api/users/${username}/education`;
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
				console.warn("404 Not Found: The requested resource does not exist.");
				return [];
			} else {
				throw error;
			}
		}
	};

	return useQuery<EducationData[], AxiosError>({
		queryKey: ["educationData", username],
		queryFn: fetchEducationData,
        staleTime: 30000,
	});
};
