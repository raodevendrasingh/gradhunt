import { UserBasicDetails, UserDetails } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

export const useFetchUserDetails = () => {
	const [userDetails, setUserDetails] = useState<UserBasicDetails>();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User Unauthorized!");
			}
			const url = `/api/get-user-details/${username}`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const data = response.data;
			setUserDetails(data);
		} catch (err: any) {
			setError(err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const refetch = useCallback(() => {
		fetchData();
	}, [fetchData]);

	return { userDetails, isLoading, error, refetch };
};
