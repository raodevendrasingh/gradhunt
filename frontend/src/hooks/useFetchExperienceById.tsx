// !for fetching experience data in the experience tab

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { ExperienceData } from "@/types/userTypes";
import { useParams } from "react-router-dom";

interface ExperienceByIdProps {
	experienceId: number;
}

export const useFetchExperienceById = ({
	experienceId,
}: ExperienceByIdProps) => {
	const [experienceIdData, setExperienceIdData] = useState<ExperienceData>();
	const [isExpLoading, setIsExpLoading] = useState<boolean>(true);
	const [error, setError] = useState<any>(null);
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();

	const fetchData = useCallback(async () => {
		setIsExpLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User Unauthorized!");
			}
			const url = `/api/get-experience-data/${username}/${experienceId}`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const data = response.data;
			setExperienceIdData(data);
		} catch (err: any) {
			setError(err);
			toast.error("Error fetching experience details");
		} finally {
			setIsExpLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const refetchExp = useCallback(() => {
		fetchData();
	}, [fetchData]);

	return { experienceIdData, isExpLoading, error, refetchExp };
};
