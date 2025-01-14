import { ContentSkeleton } from "@/pages/core/components/ui/ContentSkeleton";
import { MdModeEdit } from "react-icons/md";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { GoGlobe } from "react-icons/go";
import { useState } from "react";

import { AiFillSafetyCertificate } from "react-icons/ai";
import { useFetchCertificateData } from "@/hooks/academia/useFetchCertificateData";
import { LuDot } from "react-icons/lu";
import { EditCertificateModal } from "@/modal-forms/certificate/EditCertificateModal";
import { AddCertificateModal } from "@/modal-forms/certificate/AddCertificateModal";
import { useUser } from "@clerk/clerk-react";
import { useFetchUserDetails } from "@/hooks/profile/useFetchUserDetails";

export const Ceritficates = () => {
	const [showCertifyModal, setShowCertifyModal] = useState<boolean>(false);
	const [editingCertifyId, setEditingCertifyId] = useState<number>();
	const [showEditCertifyModal, setShowEditCertifyModal] =
		useState<boolean>(false);

	const { isSignedIn, user } = useUser();
	const { data: userDetails } = useFetchUserDetails();

	const {
		data: certificateData,
		isLoading: isCertifyLoading,
		refetch: refetchCertificates,
	} = useFetchCertificateData();

	const handleEditCertificate = (id: number) => {
		setEditingCertifyId(id);
		setShowEditCertifyModal(true);
	};

	return (
		<div className="flex flex-col items-center border rounded-lg mt-2 w-full px-3 py-2">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-2">
					<AiFillSafetyCertificate />
					<span className="text-gray-700 font-semibold text-base">
						Licence and Certifications
					</span>
				</div>
			</div>

			{isCertifyLoading ? (
				<ContentSkeleton />
			) : (
				<>
					{certificateData && certificateData.length > 0 ? (
						<div className="flex flex-col gap-3 w-full">
							{certificateData.map((data, index) => (
								<div
									key={index}
									className="w-full flex items-start gap-3 bg-white pt-3 rounded-lg"
								>
									<div className="flex flex-col gap-1 w-full">
										<div className="flex items-center justify-between">
											<span className="text-xl font-semibold text-gray-800">
												{data.certificateName}
											</span>
											{isSignedIn &&
												user.username ===
													userDetails?.user_details
														?.username && (
													<button
														type="button"
														onClick={() =>
															handleEditCertificate(
																data.id as number
															)
														}
														className="p-2 rounded-full text-gray-700 bg-white hover:bg-slate-50 text-sm font-medium cursor-pointer transition-colors"
													>
														<MdModeEdit className="size-5" />
													</button>
												)}
										</div>
										<div className="flex items-center justify-start -mt-2 w-full">
											{data.issuerOrg && (
												<div className="text-sm font-semibold text-gray-700">
													<p>{data.issuerOrg}</p>
												</div>
											)}
										</div>
										<div className="flex items-center justify-start font-medium w-full">
											{data.isValid ? (
												<span className="text-xs text-gray-600">
													Issued {data.startMonth}{" "}
													{data.startYear}
												</span>
											) : (
												<span className="flex items-center text-xs text-gray-600">
													<LuDot />
													Expires {data.endMonth}{" "}
													{data.endYear}
												</span>
											)}
										</div>
										<div className="flex items-center justify-start gap-2 w-full text-xs font-medium">
											{data.credentialUrl && (
												<Link
													to={data.credentialUrl}
													target="_blank"
													className="flex items-center justify-center gap-1.5 w-fit px-2 py-1 rounded-full bg-slate-50 border text-gray-600 hover:text-gray-800"
												>
													<GoGlobe /> Credential{" "}
													<HiOutlineArrowUpRight />
												</Link>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex items-center justify-center w-full min-h-32">
							<button
								type="button"
								onClick={() => setShowCertifyModal(true)}
								className="px-3 py-2 rounded-lg text-gray-700 bg-white hover:bg-slate-50 w-44 text-sm font-medium border border-gray-300 cursor-pointer transition-colors"
							>
								Add Certifications
							</button>
						</div>
					)}
					{showCertifyModal && (
						<AddCertificateModal
							setShowCertifyModal={setShowCertifyModal}
							onSave={refetchCertificates}
						/>
					)}

					{showEditCertifyModal && (
						<EditCertificateModal
							setShowEditCertifyModal={setShowEditCertifyModal}
							certificateId={editingCertifyId as number}
							onSave={refetchCertificates}
						/>
					)}
				</>
			)}
		</div>
	);
};
