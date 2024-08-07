import { useState, useEffect } from "react";
import axios from "axios";
import { useStore } from "@/store/userStore.js";

export const FetchCompanyProfile = ({ refresh } = {}) => {
	const { userName } = useStore();
	const [companyData, setCompanyData] = useState(null);

	useEffect(() => {
		const fetchCompanyData = async () => {
			if (!userName) return;
			try {
				const url = `http://localhost:8000/api/recruiter/${userName}/get-company-data`;
				await axios
					.get(url, {
						headers: {
							"Content-Type": "application/json",
						},
					})
					.then((response) => {
						const fetchedData = response.data;
						setCompanyData(fetchedData);
					});
			} catch (error) {
				console.error("Error fetching company profile:", error);
			}
		};

		fetchCompanyData();
	}, [user, userName, refresh]);

	return companyData;
};
