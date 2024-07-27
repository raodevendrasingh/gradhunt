// !for displaying experience data in the experience tab
/* eslint-disable react-hooks/exhaustive-deps */

// assets
import CompanyLogo from "@/assets/avatar/emptyLogo.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "@/store/userStore";
import { toast } from "sonner";

export const FetchExperienceData = ({ refresh }) => {
	const [isExperienceData, setIsExperienceData] = useState();
	const [experienceData, SetExperienceData] = useState();

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

	// console.log(experienceData);

	useEffect(() => {
		const fetchExperienceData = async () => {
			try {
				const url = `http://localhost:8000/api/recruiter/${userName}`;
				const response = axios
					.get(url, {
						headers: {
							"Content-Type": "application/json",
						},
					})
					.then((response) => {
						const fetchedData = response.data.experience_data;
						SetExperienceData(fetchedData);
						setIsExperienceData(true);
					})
					
			} catch (error) {
				setIsExperienceData(false);
				console.error("Error fetching user details: ", error);
				toast.error("Error fetching user details");
			}
		};
		fetchExperienceData();
	}, [userName, refresh]);

	return { experienceData, isExperienceData };
};
