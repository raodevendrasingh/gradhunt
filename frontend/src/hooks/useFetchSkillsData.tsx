// !for fetching skill data in the skill tab

import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Skill } from "@/types/userTypes";
import { useParams } from "react-router-dom";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useFetchSkillData = (): UseQueryResult<Skill[], AxiosError> => {
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();

	const fetchskillData = async (): Promise<Skill[]> => {
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User Unauthorized!");
			}
			const url = `/api/get-skills/${username}`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (error: AxiosError | any) {
			if (error.response && error.response.status === 404) {
				console.warn("404 Not Found: The requested resource does not exist.");
				return [];
			} else {
				throw error;
			}
		}
	};

	return useQuery<Skill[], AxiosError>({
		queryKey: ["skillData", username],
		queryFn: fetchskillData,
	});
};
