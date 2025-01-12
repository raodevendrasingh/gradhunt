import { UserDetails } from "@/types/userTypes";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios, { AxiosError } from "axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { apiUrl } from "@/modal-forms/OnboardingModal";

export const useFetchUserData = (): UseQueryResult<UserDetails, AxiosError> => {
	const { getToken } = useAuth();
	const { user } = useUser();

	const fetchUserData = async (): Promise<UserDetails> => {
		if (user) {
			const token = await getToken();
			if (!token) {
				throw new Error("User Unauthorized!");
			}
			const url = `${apiUrl}/api/users`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		}
		throw new Error("User Unauthorized!");
	};

	return useQuery<UserDetails, AxiosError>({
		queryKey: ["userDetails"],
		queryFn: fetchUserData,
		staleTime: 30000,
	});
};
