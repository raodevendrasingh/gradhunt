// ?for fetching education data in the education tab

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { toast } from "sonner";
import { Education } from "@/types/userTypes";
import { useUser } from "@clerk/clerk-react";

export const useFetchEducationData = () => {
	const [educationData, SetEducationData] = useState<Education[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<any>(null);

	const { isSignedIn, user } = useUser();

	const username = isSignedIn && user?.username

    const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const url = `/api/recruiter/${username}/get-education-data`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
				},
			});
            const data = response.data;
			SetEducationData(data);
		} catch (err: any) {
			setError(err);
            toast.error("Error fetching education details");
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

	return { educationData, isLoading, error, refetch };
};
