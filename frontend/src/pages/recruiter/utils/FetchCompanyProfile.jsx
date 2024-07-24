import { useState, useEffect } from "react";
import axios from "axios";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useStore } from "@/store/userStore.js";

export const FetchCompanyData = () => {
	const { user } = useKindeAuth();
	const { userName } = useStore();
	const [companyData, setCompanyData] = useState(null);

	useEffect(() => {
		const fetchCompanyProfile = async () => {
			if (!userName) return;
			const url = `http://localhost:8000/api/recruiter/${userName}/get-company-data`;
			try {
				const response = await axios.get(url, {
					headers: {
						"Content-Type": "application/json",
					},
				});
				setCompanyData(response.data);
			} catch (error) {
				console.error("Error fetching company profile:", error);
			}
		};

		fetchCompanyProfile();
	}, [user, userName]);

	return companyData;
}
