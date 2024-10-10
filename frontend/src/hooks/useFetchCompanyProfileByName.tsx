import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CompanyForm } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";

export const useFetchCompanyProfileByName = (): UseQueryResult<
	CompanyForm,
	AxiosError
> => {
	const { getToken } = useAuth();
	const { companyname } = useParams<{ companyname: string }>();

	const fetchCompanyProfile = async (): Promise<CompanyForm> => {
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User Unauthorized!");
			}
			const url = `/api/company/${companyname}`;
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
				return {
					companyBanner: "",
					companyLogo: "",
					companyName: "",
					tagline: "",
					companyEmail: "",
					companyPhone: "",
					establishedYear: "",
					marketCap: "",
					fundingRaised: "",
					yearlyRevenue: "",
					headquarters: "",
					branches: [],
					description: "",
					companyType: "",
					industry: "",
					companyWebsite: "",
					employeeSize: "",
					isDraft: true,
				};
			} else {
				throw error;
			}
		}
	};

	return useQuery<CompanyForm, AxiosError>({
		queryKey: ["companyProfileByName", companyname],
		queryFn: fetchCompanyProfile,
		staleTime: 30000,
	});
};
