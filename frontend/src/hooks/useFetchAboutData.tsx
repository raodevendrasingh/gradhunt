import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { AboutSection } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { useFetchProfileCompletion } from "./useFetchCompletionPercentage";
import { apiUrl } from "@/modal-forms/OnboardingModal";

export const useFetchAboutSection = (): UseQueryResult<
	AboutSection,
	AxiosError
> => {
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();
	const { refetch: refetchCompletionPercentage } =
		useFetchProfileCompletion();

	const fetchAboutSection = async (): Promise<AboutSection> => {
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User Unauthorized!");
			}
			const url = `${apiUrl}/api/users/${username}/description`;
			const response = await axios.get<AboutSection>(url, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			refetchCompletionPercentage();
			return response.data;
		} catch (error: AxiosError | any) {
			return { description: "" };
		}
	};

	return useQuery<AboutSection, AxiosError>({
		queryKey: ["aboutSection", username],
		queryFn: fetchAboutSection,
		staleTime: 30000,
	});
};
