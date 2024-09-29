import { UserBasicDetails } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import axios, { AxiosError } from "axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const useFetchUserDetails = (): UseQueryResult<
	UserBasicDetails,
	AxiosError
> => {
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();

	const fetchUserDetails = async (): Promise<UserBasicDetails> => {
		const token = await getToken();
		if (!token) {
			throw new Error("User Unauthorized!");
		}
		const url = `/api/get-user-details/${username}`;
		const response = await axios.get<UserBasicDetails>(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	};

	return useQuery<UserBasicDetails, AxiosError>({
		queryKey: ["userDetails", username],
		queryFn: fetchUserDetails,
	});
};
