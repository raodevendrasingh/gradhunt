// ?for fetching project data in the project tab

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ProjectData } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";

interface ProjectDataProps {
	projectId: number;
}

export const useFetchProjectDataById = ({
	projectId,
}: ProjectDataProps): UseQueryResult<ProjectData, AxiosError> => {
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();

	const fetchProjectDataById = async (): Promise<ProjectData> => {
		const token = await getToken();
		if (!token) {
			throw new Error("User Unauthorized!");
		}
		const url = `/api/get-project/${username}/${projectId}`;
		const response = await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	};

	return useQuery<ProjectData, AxiosError>({
		queryKey: ["projectIdData", username, projectId],
		queryFn: fetchProjectDataById,
	});
};
