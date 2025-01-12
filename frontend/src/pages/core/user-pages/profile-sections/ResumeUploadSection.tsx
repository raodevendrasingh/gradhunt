import { useState, useRef, useEffect } from "react";
import { LuUpload, LuDownload, LuX } from "react-icons/lu";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useFetchUserDetails } from "@/hooks/useFetchUserDetails";
import { extractFileName } from "@/utils/ExtractFileNames";
import { ResumeDeleteModal } from "@/modal-forms/ResumeDeleteModal";
import { PdfDownloadIcon } from "@/components/common/PDFIcon";
import { useFetchProfileCompletion } from "@/hooks/useFetchCompletionPercentage";
import { apiUrl } from "@/modal-forms/OnboardingModal";

type UploadStatus = "idle" | "uploading" | "success" | "error" | "completed";

const uploadToFirebase = async (
	file: File,
	onProgress: (progress: number) => void
): Promise<string> => {
	const storageRef = ref(storage, "resume/" + file.name);
	const uploadTask = uploadBytesResumable(storageRef, file);

	return new Promise((resolve, reject) => {
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				onProgress(progress);
			},
			(error) => {
				console.error("Error uploading file:", error);
				reject(error);
			},
			async () => {
				const downloadURL = await getDownloadURL(
					uploadTask.snapshot.ref
				);
				resolve(downloadURL);
			}
		);
	});
};

const sendFileToServer = async (fileUrl: string, token: string) => {
	if (!token) {
		throw new Error("Token is not available");
	}
	const url = `${apiUrl}/api/users/resume`;
	await axios.post(url, fileUrl, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
};

export const ResumeUploadSection = () => {
	const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
	const [progress, setProgress] = useState(0);
	const [fileName, setFileName] = useState("");
	const [fileSize, setFileSize] = useState("");
	const [fileUrl, setFileUrl] = useState("");
	const [errMsg, setErrMsg] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const { getToken } = useAuth();
	const { isSignedIn, user } = useUser();

	const { data: userDetails, isLoading } = useFetchUserDetails();
	const { refetch: refetchCompletionPercentage } =
		useFetchProfileCompletion();

	useEffect(() => {
		if (
			userDetails &&
			userDetails.user_details &&
			userDetails.user_details.resumeLink &&
			typeof userDetails.user_details.resumeLink === "string" &&
			userDetails.user_details.resumeLink.length > 0
		) {
			setFileUrl(userDetails.user_details.resumeLink as string);
			setUploadStatus("completed");
		}
	}, [userDetails]);

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (uploadStatus === "success") {
			timer = setTimeout(() => {
				setUploadStatus("completed");
			}, 5000);
		} else if (uploadStatus === "error") {
			timer = setTimeout(() => {
				setUploadStatus("idle");
			}, 10000);
		}
		return () => clearTimeout(timer);
	}, [uploadStatus]);

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return bytes + " bytes";
		else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
		else return (bytes / 1048576).toFixed(1) + " MB";
	};

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];

		if (file) {
			if (file.size > 1048576) {
				setErrMsg("File size exceeds 1MB");
				setUploadStatus("error");
				setProgress(100);
				return;
			}

			setFileName(file.name);
			setFileSize(formatFileSize(file.size));
			setUploadStatus("uploading");
			setProgress(0);

			try {
				const token = await getToken();
				if (!token) {
					throw new Error("Token is not available");
				}
				const url = await uploadToFirebase(file, setProgress);
				setFileUrl(url);
				try {
					await sendFileToServer(url, token);
					setUploadStatus("success");
					refetchCompletionPercentage();
				} catch (sendError) {
					console.error("Error sending file to server:", sendError);
					setUploadStatus("error");
				}
			} catch (error) {
				console.error("Error uploading file:", error);
				setUploadStatus("error");
			}
		}
	};
	const getStatusColor = () => {
		switch (uploadStatus) {
			case "uploading":
				return "text-blue-600";
			case "success":
			case "completed":
				return "text-green-600";
			case "error":
				return "text-red-500";
			default:
				return "text-gray-500";
		}
	};

	const getProgressBarColor = () => {
		switch (uploadStatus) {
			case "uploading":
				return "bg-blue-600";
			case "success":
			case "completed":
				return "bg-green-600";
			case "error":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};

	const getStatusLabel = () => {
		switch (uploadStatus) {
			case "uploading":
				return "Uploading...";
			case "success":
				return "Successfully uploaded";
			case "error":
				return "Error uploading";
			case "completed":
				return "Resume Uploaded";
			default:
				return "Upload your resume";
		}
	};

	const handleDeleteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShowDeleteModal(true);
	};

	const handleDownloadClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (fileUrl) {
			window.open(fileUrl, "_blank");
		}
	};

	const handleDeleteResume = () => {
		setUploadStatus("idle");
	};

	return (
		<div className="flex flex-col items-center border rounded-lg mt-2 w-full px-3 py-1">
			<div className="flex items-center justify-between w-full">
				<span className="text-gray-700 font-medium text-base">
					Resume
				</span>
			</div>

			{uploadStatus === "completed" ? (
				<div className="w-full m-3 bg-white flex items-center justify-between rounded-xl border p-2">
					<div className="flex items-center">
						<PdfDownloadIcon />
						<div className="flex flex-col items-start justify-start p-3">
							<span
								className={`text-left text-base ${getStatusColor()}`}
							>
								{getStatusLabel()}
							</span>
							<span className="text-xs">
								{extractFileName(fileUrl).split("/")[1]}
							</span>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{isSignedIn &&
							user.username ===
								userDetails?.user_details?.username && (
								<button
									type="button"
									onClick={handleDeleteClick}
									className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500 transition-all duration-200"
									title="Delete Resume"
								>
									<LuX size={20} />
								</button>
							)}
						<button
							onClick={handleDownloadClick}
							title="Download Resume"
							className="p-2 hover:bg-blue-50 rounded-lg text-gray-500 hover:text-blue-600 transition-all duration-200"
						>
							<LuDownload size={20} />
						</button>
					</div>
				</div>
			) : (
				<div
					className="w-full m-3 bg-white flex flex-col items-center justify-center cursor-pointer border border-dashed border-gray-300 rounded-xl"
					onClick={handleClick}
				>
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileChange}
						className="hidden"
						accept=".pdf"
					/>
					{isLoading ? (
						<div className="flex flex-col items-center justify-center gap-3 py-8 w-full">
							<div className="size-12 rounded-full skeleton" />
							<div className="h-5 w-1/3 skeleton" />
							<div className="h-3 w-1/2 skeleton" />
						</div>
					) : uploadStatus === "idle" ? (
						<div className="flex flex-col items-center justify-center py-8">
							<span className="flex items-center justify-center h-16 w-16 bg-slate-100 rounded-full p-5 mb-3">
								<LuUpload className="size-12 text-gray-700" />
							</span>
							<span className="flex items-center justify-center">
								<p className="text-gray-600 font-medium mr-1">
									Drop your Resume here or
								</p>
								<p className="text-blue-600 font-medium hover:underline">
									Browse
								</p>
							</span>
							<p className="text-center text-sm text-gray-400 pt-2">
								File should be in .pdf format only and less than
								1MB
							</p>
						</div>
					) : (
						<div className="w-full bg-white flex items-center justify-between rounded-xl p-2">
							<div className="flex items-center w-full">
								<PdfDownloadIcon />
								<div className="flex flex-col items-start justify-start p-3 w-full">
									<div
										className={`text-left text-base ${getStatusColor()}`}
									>
										{getStatusLabel()}
									</div>
									{fileName && fileSize && (
										<span className="text-xs text-gray-600">
											{fileName} ({fileSize})
										</span>
									)}
									<div className="w-full mt-2">
										<div className="overflow-hidden h-1.5 text-xs flex rounded-full bg-gray-100">
											<motion.div
												initial={{ width: 0 }}
												animate={{
													width: `${progress}%`,
												}}
												transition={{
													duration: 0.5,
													ease: "easeInOut",
												}}
												className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressBarColor()}`}
											/>
										</div>
									</div>
									{uploadStatus === "error" && (
										<span className="text-xs text-red-500 mt-1">
											{errMsg}
										</span>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			)}

			{showDeleteModal && (
				<ResumeDeleteModal
					fileUrl={fileUrl}
					setShowDeleteModal={setShowDeleteModal}
					onDelete={handleDeleteResume}
				/>
			)}
		</div>
	);
};
