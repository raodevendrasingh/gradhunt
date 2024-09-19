// ?for fetching userDesc data in the userDesc tab

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { Progress } from "@/types/userTypes";

export const useFetchProfileCompletion = () => {
	const [progress, SetProgress] = useState<Progress>();
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
			const url = `/api/get-completion-percentage/${username}`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
				},
			});
            const data = response.data;
			SetProgress(data);
		} catch (err: any) {
			setError(err);
            toast.error("Error fetching completion percentage");
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

	return { progress, isLoading, error, refetch };
};
