import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CompanyForm } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import { apiUrl } from "@/modal-forms/OnboardingModal";

export const useFetchCompanyProfile = (
	isCompanyAdmin?: boolean
): UseQueryResult<CompanyForm, AxiosError> => {
	const { getToken } = useAuth();

	const fetchCompanyProfile = async (): Promise<CompanyForm> => {
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User Unauthorized!");
			}
			const url = `${apiUrl}/api/company`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (error: AxiosError | any) {
			if (error.response && error.response.status === 404) {
				console.warn(
					"404 Not Found: The requested resource does not exist."
				);
				return {
					companySlug: "",
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
		queryKey: ["companyProfile"],
		queryFn: fetchCompanyProfile,
		staleTime: 30000,
		enabled: isCompanyAdmin,
	});
};
