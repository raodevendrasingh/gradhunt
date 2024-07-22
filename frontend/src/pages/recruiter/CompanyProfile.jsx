// hooks
import { useEffect, useState } from "react";

import axios from "axios";

// assets
import CompanyLogo from "@/assets/avatar/emptyLogo.png";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

// local imports
import { CompanyProfileModal } from "./modalForms/CompanyProfileModal";
import { useStore } from "@/store/userStore.js";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { TbWorldWww } from "react-icons/tb";

export const CompanyProfile = () => {
	const { user } = useKindeAuth();
	const { userName } = useStore();
	const [companyData, setCompanyData] = useState(null);

	useEffect(() => {
		const url = `http://localhost:8000/api/recruiter/${userName}/get-company-data`;
		const fetchCompanyProfile = async () => {
			if (!userName) return;
			try {
				const response = await axios.get(url, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				setCompanyData(response.data);
				console.log(response.data);
			} catch (error) {
				console.error("Error fetching company profile:", error);
			}
		};
		fetchCompanyProfile();
	}, [user, userName]);

	return (
		<div className="w-full pt-20 mx-auto">
			<div className="max-w-7xl mx-auto lg:ml-64">
				<div className="max-w-5xl mx-auto flex flex-col mb-3 gap-3 px-3">
					<section className="bg-white px-2 p-2 border rounded-xl shadow">
						<div className="flex justify-between items-center">
							<span className="font-semibold text-lg pl-1 text-gray-800">
								Company Profile
							</span>
							<span>
								<CompanyProfileModal />
							</span>
						</div>

						<div className="mt-1 bg-white rounded-xl">
							<div className="h-[120px] mb-24">
								{/* cover pic box */}
								<div className="bg-gray-400/80 h-32 p-2 rounded-t-xl"></div>
								{/* logo box */}
								<div className="relative -top-12 left-2 sm:left-4 size-24 sm:size-28 rounded-xl z-10">
									<img src={CompanyLogo} alt="company-logo" />
								</div>
								<div className="relative -top-28  pb-2.5 sm:pb-6 bg-gray-100 p-2 flex flex-col sm:flex-row justify-start items-center gap-2 z-0 rounded-b-xl overflow-hidden">
									<div className="flex justify-between items-center ml-20 sm:ml-32 h-12 w-2/3 text-2xl p-2 ">
										{/* <span>+ Add Company Name</span> */}
										{companyData?.companyName ? (
											<span className="text-2xl sm:text-3xl font-semibold text-gray-800 pl-3">
												{companyData.companyName}
											</span>
										) : (
											<span className="text-lg text-blue-600 pl-3">
												+ Add Company Name
											</span>
										)}
									</div>
									{/* company brief */}
									<div className="h-7 mt-2 sm:mt-0 text-sm bg-gray-50 text-gray-800 tracking-wide w-full sm:w-48 sm:mr-2 flex justify-center items-center rounded-full gap-1 px-2 hover:cursor-pointer">
										{companyData?.website ? (
											<>
												<div className="flex items-center gap-1">
													<span className="hover:underline">
														{companyData.website.replace(/^https?:\/\//, "")}
													</span>
													<span>
														<FaArrowUpRightFromSquare className="text-gray-500 size-[10px]" />
													</span>
												</div>
											</>
										) : (
											<span className="text-xs text-blue-600 pl-3">
												+Add Website
											</span>
										)}
									</div>
								</div>
							</div>
							<div className="flex flex-col gap-3">
								{/* company stats */}

								<div className=" flex flex-col items-center md:flex-row gap-1 bg-gray-50 text-sm p-2 rounded-xl">
									<div className="w-full md:w-2/3 flex gap-1">
										<div className="py-0.5 px-2 w-full md:w-1/2">
											Employees:{" "}
											{companyData?.employeeSize ? (
												<span className="text-base">
													{companyData.employeeSize}
												</span>
											) : (
												<span className="text-xs text-blue-600 pl-3">
													+ Add Size
												</span>
											)}
										</div>
										<div className="py-0.5 px-2 w-full md:w-1/2">
											Estd.:{" "}
											{companyData?.establishedYear ? (
												<span className="text-base">
													{companyData.establishedYear}
												</span>
											) : (
												<span className="text-xs text-blue-600 pl-3">
													+ Add Estd Date
												</span>
											)}
										</div>
									</div>

									<div className="py-0.5 px-2 w-full md:w-1/3">
										Industry:{" "}
										{companyData?.industry ? (
											<span className="text-base">{companyData.industry}</span>
										) : (
											<span className="text-xs text-blue-600 pl-3">
												+ Add Industry
											</span>
										)}
									</div>
								</div>
								{/* locations */}

								<div className="flex flex-col gap-2 bg-gray-50 p-2 rounded-xl">
									<span className="text-xl font-medium pl-2 text-gray-800">
										Headquarters
									</span>
									<div className="flex items-center pl-3 pt-1">
										{companyData?.headquarters ? (
											<span className="text-base">
												{companyData.headquarters}
											</span>
										) : (
											<span className="text-xs text-blue-600">
												+ Add Location
											</span>
										)}
									</div>
								</div>

								<div className="flex flex-col gap-2 bg-gray-50 p-2 rounded-xl">
									<span className="text-xl font-medium pl-2 text-gray-800">
										Other Branches
									</span>
									<div className="flex items-center flex-wrap gap-3 text-sm pt-1 pl-3">
										{companyData?.branches &&
										typeof companyData.branches === "string" ? (
											JSON.parse(companyData.branches).map((branch, index) => (
												<div key={index} className="branch-info">
													<span className="text-base">
														{branch.city}, {branch.state}, {branch.country}
													</span>
												</div>
											))
										) : (
											<span className="text-xs text-blue-600">
												+ Add Location
											</span>
										)}
									</div>
								</div>

								<div className="flex flex-col gap-2 bg-gray-50 p-2 rounded-xl">
									<span className="text-xl font-medium pl-2 text-gray-800">
										About
									</span>

									{companyData?.about ? (
										<span className="pl-2">{companyData.about}</span>
									) : (
										<p className="text-xs text-blue-600 pl-3">
											+ Add Description
										</p>
									)}
								</div>

								<div className="flex flex-col gap-2 bg-gray-50 p-2 rounded-xl">
									<span className="text-xl font-medium pl-2 text-gray-800">
										Company Mission and Values
									</span>
									{companyData?.values ? (
										<span className="pl-2">{companyData.values}</span>
									) : (
										<p className="text-xs text-blue-600 pl-3">
											+ Add Description
										</p>
									)}
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};
