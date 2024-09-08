// !for fetching experience data in the experience tab

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { Experience } from "@/types/userTypes";

export const useFetchExperienceData = () => {
	const [experienceData, setExperienceData] = useState<Experience[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<any>(null);

	const { isSignedIn, user } = useUser();

	const username = isSignedIn ? user?.username : "newUser";

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const url = `/api/recruiter/${username}/get-experience-data/`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
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
