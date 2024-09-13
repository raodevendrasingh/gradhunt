import { useCallback, useState } from "react";

// icons
import { MdOutlineEdit, MdMail } from "react-icons/md";
import { FaPhone, FaLocationDot } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { FaBriefcase } from "react-icons/fa6";
import { BsBuildingsFill } from "react-icons/bs";
import { LuCalendarCheck } from "react-icons/lu";

// assets
import noUser from "@/assets/avatar/noUser.png";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// hooks
import { useFetchRecruiterData } from "@/hooks/useFetchRecruiterData";
import { SignedIn, useUser } from "@clerk/clerk-react";
import { HiOutlineCamera } from "react-icons/hi";
import { EditImageModal } from "@/modalForms/ImageEditModal";
import clsx from "clsx";
import { AddBasicDetailModal } from "@/modalForms/AddBasicDetailModal";
import { getMonthYear } from "@/utils/convertTimeStamps";
import { AddExpModal } from "@/modalForms/AddExpModal";

export const RecruiterProfileView = () => {
	const { isSignedIn } = useUser();
	const { recruiterData, refetch } = useFetchRecruiterData();
	const [showImageEditModal, setShowImageEditModal] = useState<boolean>(false);
	const [showBasicDetailModal, setShowBasicDetailModal] =
		useState<boolean>(false);
	const [showExpModal, setShowExpModal] = useState<boolean>(false);

	const handleRefresh = useCallback(() => {
		refetch();
	}, [refetch]);

	return (
		<div className="w-full pt-20 pb-2 mx-auto">
			<div className="max-w-7xl mx-auto lg:ml-64">
				<div className="max-w-5xl mx-auto px-3">
					{/* recruiter details */}
					<section
						className={clsx("flex flex-col w-full mb-2 bg-white rounded-xl", {
							"pt-0": SignedIn,
							"pt-2": !SignedIn,
						})}
					>
						{isSignedIn && (
							<div className="flex justify-end pr-2 pt-2">
								<button
									type="button"
									onClick={() => setShowBasicDetailModal(true)}
								>
									<MdOutlineEdit className="size-9 hover:bg-gray-100 rounded-full p-2" />
								</button>
								{showBasicDetailModal && (
									<AddBasicDetailModal
										setShowBasicDetailModal={setShowBasicDetailModal}
										onSave={handleRefresh}
									/>
								)}
							</div>
						)}
						<div className="w-full flex flex-col md:flex-row px-8 pb-8 gap-1">
							<div className="flex flex-col md:flex-row items-start w-full gap-10">
								<div className="size-40 flex flex-col mb-2 justify-center items-center">
									<div className="relative flex justify-center items-center size-[145px] pt-8">
										{/* progress bar */}
										<CircularProgressbar
											value={30}
											strokeWidth={4}
											styles={buildStyles({
												pathColor: "#082e4f",
												trailColor: "#95d0ee",
												strokeLinecap: "round",
												pathTransitionDuration: 0.5,
											})}
										/>
										{/* profile picture */}
										<img
											src={noUser}
											className="absolute size-32 rounded-full object-cover"
											alt="User"
										/>
									</div>
									{isSignedIn && (
										<div className="relative -top-6 left-[52px]">
											<button
												type="button"
												onClick={() => setShowImageEditModal(true)}
											>
												<HiOutlineCamera className="size-6 sm:size-7 text-gray-100 bg-gray-700 border border-gray-700 rounded-full p-1" />
											</button>
											{showImageEditModal && (
												<EditImageModal
													setShowImageEditModal={setShowImageEditModal}
													onSave={handleRefresh}
													apiUrl={"/api/upload-profile-image"}
												/>
											)}
										</div>
									)}
								</div>
								<div className="flex md:flex-row flex-grow w-full justify-between bg-white rounded-lg">
									<div className="flex flex-col">
										<div className="flex flex-col gap-2">
											{recruiterData ? (
												<div className="flex items-center text-2xl gap-1">
													<span>{recruiterData?.user_details.firstname}</span>
													<span>{recruiterData?.user_details.lastname}</span>
												</div>
											) : (
												<div className="h-8 w-52 skeleton" />
											)}

											{recruiterData ? (
												<div className="flex text-sm items-center gap-1">
													{recruiterData?.recruiter_details.jobTitle}
												</div>
											) : (
												<div className="h-6 w-40 skeleton" />
											)}

											{/* badge */}
											{recruiterData ? (
												<span className=" w-24 inline-flex items-center justify-center gap-x-1.5 py-1 px-3 rounded-lg text-xs font-medium bg-blue-100 text-blue-900">
													<FaBriefcase className="" />
													<p>Recruiter</p>
												</span>
											) : (
												<div className="h-5 w-32 skeleton" />
											)}
										</div>
										<div className="flex pt-2 flex-col md:flex-row items-start md:items-end gap-3 md:gap-10">
											{recruiterData ? (
												<>
													<div className="sm:hidden flex items-center gap-2">
														<div>
															<BsBuildingsFill className="size-3 text-slate-700" />
														</div>
														<p className="text-base text-slate-900 ">
															{recruiterData?.recruiter_details.companyName}
														</p>
													</div>
													<div className="flex flex-col gap-2">
														<div className="text-sm flex items-center gap-2">
															<div>
																<FaLocationDot className="size-4 text-gray-600" />
															</div>
															<div className="flex flex-col">
																<span className="text-sm">
																	{
																		recruiterData?.recruiter_details
																			.companyLocation
																	}
																</span>
															</div>
														</div>
														<div className="text-sm flex items-center gap-2">
															<div>
																<LuCalendarCheck className="size-4 text-gray-600" />
															</div>
															<div className="flex items-center gap-1">
																<span>Joined</span>
																<span className="text-sm">
																	{getMonthYear(
																		recruiterData?.user_details
																			.created_at as string
																	)}
																</span>
															</div>
														</div>
													</div>
												</>
											) : (
												<div className="flex flex-col gap-2">
													<div className="sm:hidden h-5 w-32 skeleton" />
													<div className="flex items-center gap-1">
														<div className="size-5 skeleton" />
														<div className="h-5 w-28 skeleton" />
													</div>
													<div className="flex items-center gap-1">
														<div className="size-5 skeleton" />
														<div className="h-5 w-20 skeleton" />
													</div>
													
												</div>
											)}

											<div className="text-sm flex flex-col">
												{/* <div className="flex items-center gap-2">
													<span>
														<FaPhone className="size-3 text-gray-600" />
													</span>
													<span className="text-sm">+91 98765 43210</span>
												</div> */}
												{/* <div className="flex items-center gap-2">
													<span>
														<MdMail className="size-3 text-gray-600" />
													</span>
													<span className="text-sm">
														{recruiterData?.user_details.email}
													</span>
												</div> */}
											</div>
										</div>
									</div>
									<div className="hidden sm:flex p-3 gap-2">
										<div>
											<BsBuildingsFill className="size-6 text-slate-700" />
										</div>
										<p className="text-base">
											{recruiterData?.recruiter_details.companyName}
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* hiring preferences */}
					<section className="flex pt-2 p-5 flex-col w-full  rounded-xl bg-white  my-2">
						<div className="flex justify-between items-center">
							<h3 className="text-xl font-bold tracking-tight py-2">
								Hiring Preferences
							</h3>
							<div>
								<MdOutlineEdit className="size-9 hover:bg-gray-100 rounded-full p-2" />
							</div>
						</div>
						<div className="flex flex-col border border-gray-50 bg-gray-100 gap-3 rounded-lg">
							<div className="flex flex-col md:flex-row gap-3">
								<div className="flex flex-col w-full md:w-1/3 p-2 px-3">
									<span className="text-gray-500">Total Experience</span>
									<span className="text-sm">
										{recruiterData?.hiring_preference.experience} Years
									</span>
								</div>
								<div className="flex flex-col w-full md:w-2/3 p-2 px-3">
									<span className="text-gray-500">Industry I hire for</span>
									<span className="text-sm">
										{recruiterData?.hiring_preference.industry.map(
											(item, index) => (
												<span key={index}>
													{item.trim()}
													{index <
													recruiterData?.hiring_preference.industry.length - 1
														? ", "
														: ""}
												</span>
											)
										)}
									</span>
								</div>
							</div>
							<div className="flex flex-col md:flex-row gap-3">
								<div className="flex flex-col w-full md:w-1/3 p-2 px-3">
									<span className="text-gray-500">Levels I hire for</span>
									<span className="text-sm">
										{recruiterData?.hiring_preference.levels.map(
											(item, index) => (
												<span key={index}>
													{item.trim()}
													{index <
													recruiterData?.hiring_preference.levels.length - 1
														? ", "
														: ""}
												</span>
											)
										)}
									</span>
								</div>
								<div className="flex flex-col w-full md:w-2/3 p-2 px-3">
									<span className="text-gray-500">Funtions I hire for</span>
									<span className="text-sm">
										{recruiterData?.hiring_preference.function.map(
											(item, index) => (
												<span key={index}>
													{item.trim()}
													{index <
													recruiterData?.hiring_preference.function.length - 1
														? ", "
														: ""}
												</span>
											)
										)}
									</span>
								</div>
							</div>
							<div className="w-full flex flex-col p-2 px-3">
								<span className="text-gray-500">Skills I hire for</span>
								<span className="flex flex-wrap text-sm gap-2">
									{recruiterData?.hiring_preference.skills.map(
										(item, index) => (
											<span
												key={index}
												className="border border-gray-400 rounded-full py-0.5 px-2.5"
											>
												{item.trim()}
												{index <
												recruiterData?.hiring_preference.skills.length - 1
													? ""
													: ""}
											</span>
										)
									)}
								</span>
							</div>
						</div>
					</section>

					{/* experience section*/}
					<section className="flex pt-2 flex-col w-full  rounded-xl bg-white h-auto p-5 my-2">
						<div className="flex justify-between items-center">
							<h3 className="text-xl font-bold tracking-tight py-2">
								Experience
							</h3>
							<div className="flex gap-2">
								<button type="button" onClick={() => setShowExpModal(true)}>
									<FiPlus className="size-9 hover:bg-gray-100 rounded-full p-2" />
								</button>
								{showExpModal && (
									<AddExpModal
										setShowExpModal={setShowExpModal}
										onSave={handleRefresh}
									/>
								)}
							</div>
						</div>
						<div className="flex">
							<div className="w-full flex items-center gap-3 border border-gray-50 bg-gray-100 p-2 rounded-lg">
								{/* company logo */}
								<div className="size-14 bg-slate-300 rounded-lg"></div>
								{/* company name */}
								<div className="w-full">
									<div className="flex items-baseline justify-between ">
										<h1 className="text-xl font-semibold">
											{recruiterData?.recruiter_details.companyName}
										</h1>
										<h1 className="text-xs">July 2021 - Present</h1>
									</div>
									<h2 className="text-sm">
										{recruiterData?.recruiter_details.jobTitle}
									</h2>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};
