// !for fetching skill data in the skill tab

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Skill } from "@/types/userTypes";
import { useParams } from "react-router-dom";

export const useFetchSkillData = () => {
	const [skillData, setSkillData] = useState<Skill[]>([]);
	const [isSkillLoading, setIsSkillLoading] = useState<boolean>(true);
	const [error, setError] = useState<any>(null);
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();

	const fetchData = useCallback(async () => {
		setIsSkillLoading(true);
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
			const data = response.data;
			setSkillData(data);
		} catch (err: any) {
			setError(err);
			toast.error("Error fetching skill details");
		} finally {
			setIsSkillLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const refetch = useCallback(() => {
		fetchData();
	}, [fetchData]);

	return { skillData, isSkillLoading, error, refetch };
};
