import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CompanyForm } from "@/types/userTypes";
import { useParams } from "react-router-dom";
import { apiUrl } from "@/modal-forms/profile/OnboardingModal";

export const useFetchCompanyProfileByParams = (): UseQueryResult<
	CompanyForm,
	AxiosError
> => {
	const { companyslug } = useParams<{ companyslug: string }>();

	const fetchCompanyProfile = async (): Promise<CompanyForm> => {
		try {
			const url = `${apiUrl}/api/company/${companyslug}`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			return response.data;
		} catch (error: AxiosError | any) {
			if (error.response && error.response.status === 404) {
				console.warn(
					"404 Not Found: The requested resource does not exist."
				);
				return {
					companyAdmin: {
						username: "",
						firstname: "",
						lastname: "",
						email: "",
					},
					companySlug: "",
					companyBanner: "",
					companyTagline: "",
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
		queryKey: ["companyProfileByName", companyslug],
		queryFn: fetchCompanyProfile,
		staleTime: 30000,
	});
};
