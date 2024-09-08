import { Recruiter } from "@/types/userTypes";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";

export const useFetchRecruiterData = () => {
	const [recruiterData, setRecruiterData] = useState<Recruiter>();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const { isSignedIn, user } = useUser();

	const username = isSignedIn && user?.username

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const url = `/api/recruiter/${username}`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = response.data;
			setRecruiterData(data);
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

	return { recruiterData, isLoading, error, refetch };
};
