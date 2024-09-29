import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CertificateData } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";

export const useFetchCertificateData = (): UseQueryResult<
	CertificateData[],
	AxiosError
> => {
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();

	const fetchCertificateData = async (): Promise<CertificateData[]> => {
		const token = await getToken();
		if (!token) {
			throw new Error("User Unauthorized!");
		}
		const url = `/api/get-certificates/${username}`;
		const response = await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	};

	return useQuery<CertificateData[], AxiosError>({
		queryKey: ["certificateData", username],
		queryFn: fetchCertificateData,
	});
};
