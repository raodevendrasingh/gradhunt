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
			try {
                const url = `http://localhost:8000/api/recruiter/${userName}/get-company-data`;
				await axios.get(url, {
					headers: {
						"Content-Type": "application/json",
					},
				})
                .then((response) => {
                    const fetchedData = response.data;
                    setCompanyData(fetchedData);
                })
				
			} catch (error) {
				console.error("Error fetching company profile:", error);
			}
		};

		fetchCompanyProfile();
	}, [user, userName]);

	return companyData;
};
