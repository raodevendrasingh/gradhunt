import { UserBasicDetails } from "@/types/userTypes";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios, { AxiosError } from "axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useFetchProfileCompletion } from "./useFetchCompletionPercentage";

export const useFetchUserDetails = (): UseQueryResult<
	UserBasicDetails,
	AxiosError
> => {
	const { getToken } = useAuth();
	const { user } = useUser();
	const { username } = useParams<{ username: string }>();
	const { refetch: refetchCompletionPercentage } = useFetchProfileCompletion();

	const fetchUserDetails = async (): Promise<UserBasicDetails> => {
		if (user) {
			const currentUser = user.username;
			const token = await getToken();
			if (!token) {
				throw new Error("User Unauthorized!");
			}
			const url = `/api/users/${username || currentUser}`;
			const response = await axios.get<UserBasicDetails>(url, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			refetchCompletionPercentage();
			return response.data;
		}
		throw new Error("User Unauthorized!");
	};

	return useQuery<UserBasicDetails, AxiosError>({
		queryKey: ["userDetails", username],
		queryFn: fetchUserDetails,
		staleTime: 30000,
	});
};
