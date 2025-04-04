import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CertificateData } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { apiUrl } from "@/modal-forms/profile/OnboardingModal";

interface CertificateDataProps {
	certificateId: number;
}

export const useFetchCertificateDataById = ({
	certificateId,
}: CertificateDataProps): UseQueryResult<CertificateData, AxiosError> => {
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();

	const fetchCertificateDataById = async (): Promise<CertificateData> => {
		const token = await getToken();
		if (!token) {
			throw new Error("User Unauthorized!");
		}
		const url = `${apiUrl}/api/users/${username}/certificates/${certificateId}`;
		const response = await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	};
	return useQuery<CertificateData, AxiosError>({
		queryKey: ["certificateIdData", username, certificateId],
		queryFn: fetchCertificateDataById,
		staleTime: 30000,
	});
};
