import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Applicant } from "@/types/userTypes";
import { useParams } from "react-router-dom";
import { apiUrl } from "@/modal-forms/OnboardingModal";

export const useFetchJobApplicants = (): UseQueryResult<
	Applicant,
	AxiosError
> => {
	const { getToken } = useAuth();
	const { companyslug, jobId } = useParams<{
		companyslug: string;
		jobId: string;
	}>();

	const fetchJobApplicantData = async (): Promise<Applicant> => {
		const token = await getToken();
		if (!token) {
			throw new Error("User Unauthorized!");
		}
		const url = `${apiUrl}/api/company/${companyslug}/applicants/${jobId}`;
		const response = await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	};

	return useQuery<Applicant, AxiosError>({
		queryKey: ["applicantData", companyslug, jobId],
		queryFn: fetchJobApplicantData,
		staleTime: 10000,
	});
};
