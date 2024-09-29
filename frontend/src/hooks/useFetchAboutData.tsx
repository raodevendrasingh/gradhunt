import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { AboutSection } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";

export const useFetchAboutSection = (): UseQueryResult<AboutSection, AxiosError> => {
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();

	const fetchAboutSection = async (): Promise<AboutSection> => {
		const token = await getToken();
		if (!token) {
			throw new Error("User Unauthorized!");
		}
		const url = `/api/get-user-desc/${username}`;
		const response = await axios.get<AboutSection>(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	};

	return useQuery<AboutSection, AxiosError>({
		queryKey: ["aboutSection", username],
		queryFn: fetchAboutSection,
	});
};
