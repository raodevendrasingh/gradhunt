import { useState, useRef, useEffect } from "react";
import { LuUpload, LuDownload } from "react-icons/lu";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
type UploadStatus = "idle" | "uploading" | "success" | "error" | "completed";

const uploadToFirebase = async (
	file: File,
	onProgress: (progress: number) => void
): Promise<string> => {
	const storageRef = ref(storage, "resumes/" + file.name);
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
				const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
				resolve(downloadURL);
			}
		);
	});
};

const sendFileToServer = async (fileUrl: string, token: string) => {
	if (!token) {
		throw new Error("Token is not available");
	}
	const url = `/api/add-resume-link`;
	await axios.post(url, fileUrl, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
};

export default function FileUploadSection() {
	const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
	const [progress, setProgress] = useState(0);
	const [fileName, setFileName] = useState("");
	const [fileSize, setFileSize] = useState("");
	const [fileUrl, setFileUrl] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { getToken } = useAuth();

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (uploadStatus === "success") {
			timer = setTimeout(() => {
				setUploadStatus("completed");
			}, 5000);
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
				try {
					await sendFileToServer(url, token);
					setUploadStatus("success");
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
				return "text-green-700";
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

	const handleDownload = () => {
		if (fileUrl) {
			window.open(fileUrl, "_blank");
		}
	};

	return (
		<div
			className="w-full h-44 m-3 bg-white flex flex-col items-center justify-center cursor-pointer border border-dashed border-gray-300 rounded-xl"
			onClick={handleClick}
		>
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				className="hidden"
				accept=".pdf"
			/>
			{uploadStatus === "idle" ? (
				<div className="flex flex-col items-center justify-center py-8">
					<span className="flex items-center justify-center h-16 w-16 bg-slate-100 rounded-full p-5 mb-3">
						<LuUpload className="size-12 text-gray-700" />
					</span>
					<span className="flex items-center justify-center">
						<p className="text-gray-600 font-medium mr-1">
							Drop your Resume here or
						</p>
						<p className="text-blue-600 font-medium hover:underline">Browse</p>
					</span>
					<p className="text-center text-sm text-gray-400 pt-2">
						File should be in .pdf format only and less than 1MB
					</p>
				</div>
			) : (
				<div className="w-3/4 max-w-sm">
					<div className={`text-center text-base mb-2 ${getStatusColor()}`}>
						{getStatusLabel()}
					</div>
					{uploadStatus !== "completed" && (
						<div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
							<motion.div
								initial={{ width: 0 }}
								animate={{
									width: `${progress as number}%`,
								}}
								transition={{ duration: 0.5, ease: "easeInOut" }}
								className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressBarColor()}`}
							></motion.div>
						</div>
					)}
					{fileName && fileSize && (
						<div
							className={`text-sm ${uploadStatus === "completed" ? "text-center font-medium" : "text-gray-600"} mt-2`}
						>
							{fileName} ({fileSize})
						</div>
					)}
					<div className="flex items-center justify-center mt-2 ">
						{uploadStatus === "completed" && (
							<button
								onClick={handleDownload}
								className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
							>
								Download
								<LuDownload className="size-5" />
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
