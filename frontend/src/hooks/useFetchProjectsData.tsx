// ?for fetching project data in the project tab

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { toast } from "sonner";
import { Project } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";

export const useFetchProjectData = () => {
	const [projectData, SetProjectData] = useState<Project[]>([]);
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
			const url = `/api/get-projects/${username}`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
				},
			});
            const data = response.data;
			SetProjectData(data);
		} catch (err: any) {
			setError(err);
            toast.error("Error fetching project details");
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

	return { projectData, isLoading, error, refetch };
};
