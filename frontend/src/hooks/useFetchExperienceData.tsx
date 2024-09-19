// !for fetching experience data in the experience tab

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Experience } from "@/types/userTypes";
import { useParams } from "react-router-dom";

export const useFetchExperienceData = () => {
	const [experienceData, setExperienceData] = useState<Experience[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<any>(null);
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User Unauthorized!");
			}
			const url = `/api/get-experience-data/${username}`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const data = response.data;
			setExperienceData(data);
		} catch (err: any) {
			setError(err);
			toast.error("Error fetching experience details");
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

	return { experienceData, isLoading, error, refetch };
};
