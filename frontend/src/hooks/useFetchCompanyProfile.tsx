import { CompanyProfile } from "@/types/userTypes";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";

export const useFetchCompanyProfile = () => {
	const [companyData, setCompanyData] = useState<CompanyProfile>();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const { isSignedIn, user } = useUser();

	const username = isSignedIn && user?.username

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const url = `/api/recruiter/${username}/get-company-data`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = response.data;
			setCompanyData(data);
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

	return { companyData, isLoading, error, refetch };
};
