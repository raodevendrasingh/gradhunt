// ?for displaying education data in the education tab
/* eslint-disable react-hooks/exhaustive-deps */

// assets
import CompanyLogo from "@/assets/avatar/emptyLogo.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "@/store/userStore";
import { toast } from "sonner";

export const FetchEducationData = ({ refresh }) => {
	const [isEducationData, setIsEducationData] = useState();
	const [educationData, SetEducationData] = useState();

	const { userName, setUserName } = useStore((state) => ({
		userName: state.userName,
		setUserName: state.setUserName,
	}));

	useEffect(() => {
		if (!userName) {
			const storedUserName = localStorage.getItem("userName");
			if (storedUserName) {
				setUserName(storedUserName);
			}
		}
	}, [userName, setUserName]);

	// console.log(educationData);

	useEffect(() => {
		const fetchEducationData = async () => {
			try {
				const url = `http://localhost:8000/api/recruiter/${userName}`;
				axios
					.get(url, {
						headers: {
							"Content-Type": "application/json",
						},
					})
					.then((response) => {
						const fetchedData = response.data.education_data;
						SetEducationData(fetchedData);
						setIsEducationData(true);
					});
			} catch (error) {
				setIsEducationData(false);
				console.error("Error fetching education data: ", error);
				toast.error("Error fetching education data");
			}
		};
		fetchEducationData();
	}, [userName, refresh]);

	return { educationData, isEducationData };
};
