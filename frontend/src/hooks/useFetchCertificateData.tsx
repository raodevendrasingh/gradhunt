// ?for fetching certificate data in the certificate tab

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { toast } from "sonner";
import { CertificateData } from "@/types/userTypes";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";

export const useFetchCertificateData = () => {
	const [certificateData, SetCertificateData] = useState<CertificateData[]>([]);
	const [isCertifyLoading, setIsCertifyLoading] = useState<boolean>(true);
	const [certifyError, setCertifyError] = useState<any>(null);
	const { getToken } = useAuth();
	const { username } = useParams<{ username: string }>();

	const fetchData = useCallback(async () => {
		setIsCertifyLoading(true);
		try {
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
			const data = response.data;
			SetCertificateData(data);
		} catch (err: any) {
			setCertifyError(err);
			toast.error("Error fetching certificate details");
		} finally {
			setIsCertifyLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const refetchCertificates = useCallback(() => {
		fetchData();
	}, [fetchData]);

	return {
		certificateData,
		isCertifyLoading,
		certifyError,
		refetchCertificates,
	};
};
