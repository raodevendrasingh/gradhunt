import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/clerk-react";
import { ExperienceData } from "@/types/userTypes";
import { useParams } from "react-router-dom";
import { apiUrl } from "@/modal-forms/OnboardingModal";

interface ExperienceByIdProps {
	experienceId: number;
}

export const useFetchExperienceById = ({
	experienceId,
}: ExperienceByIdProps): UseQueryResult<ExperienceData, AxiosError> => {
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();

	const fetchExperienceDataById = async (): Promise<ExperienceData> => {
		const token = await getToken();
		if (!token) {
			throw new Error("User Unauthorized!");
		}
		const url = `${apiUrl}/api/users/${username}/experiences/${experienceId}`;
		const response = await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	};

	return useQuery<ExperienceData, AxiosError>({
		queryKey: ["experienceIdData", username, experienceId],
		queryFn: fetchExperienceDataById,
		staleTime: 30000,
	});
};
