import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CertificateData } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";

interface CertificateDataProps {
	certificateId: number;
}

export const useFetchCertificateDataById = ({
	certificateId,
}: CertificateDataProps): UseQueryResult<CertificateData, AxiosError> => {
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();

	const fetchData = async (): Promise<CertificateData> => {
		const token = await getToken();
		if (!token) {
			throw new Error("User Unauthorized!");
		}
		const url = `/api/get-certificate/${username}/${certificateId}`;
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
		queryFn: fetchData,
	});
};
