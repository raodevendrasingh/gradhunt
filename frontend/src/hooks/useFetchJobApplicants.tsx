import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Applicant } from "@/types/userTypes";
import { useParams } from "react-router-dom";

export const useFetchJobApplicants = (): UseQueryResult<
	Applicant,
	AxiosError
> => {
	const { getToken } = useAuth();
	const { companyname, jobId } = useParams<{
		companyname: string;
		jobId: string;
	}>();

	const fetchJobApplicantData = async (): Promise<Applicant> => {
		const token = await getToken();
		if (!token) {
			throw new Error("User Unauthorized!");
		}
		const url = `/api/company/${companyname}/applicants/${jobId}`;
		const response = await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	};

	return useQuery<Applicant, AxiosError>({
		queryKey: ["applicantData", companyname, jobId],
		queryFn: fetchJobApplicantData,
		staleTime: 10000,
	});
};
