import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { EducationData } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { apiUrl } from "@/modal-forms/OnboardingModal";

interface EducationDataProps {
	educationId: number;
}

export const useFetchEducationDataById = ({
	educationId,
}: EducationDataProps): UseQueryResult<EducationData, AxiosError> => {
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();

	const fetchEducationDataById = async (): Promise<EducationData> => {
		const token = await getToken();
		if (!token) {
			throw new Error("User Unauthorized!");
		}
		const url = `${apiUrl}/api/users/${username}/education/${educationId}`;
		const response = await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	};

	return useQuery<EducationData, AxiosError>({
		queryKey: ["educationIdData", username, educationId],
		queryFn: fetchEducationDataById,
		staleTime: 30000,
	});
};
