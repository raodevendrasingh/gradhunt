// hooks
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

// Third-party libraries
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import Spinner from "@/components/ui/Spinner";
import { useFetchJobPosts } from "@/hooks/useFetchJobPosts";
import { useNavigate } from "react-router-dom";
import { JobPosts } from "@/types/userTypes";

interface JobPostDeleteDialogProps {
	jobPost: JobPosts;
	setShowDeleteDailog: React.Dispatch<React.SetStateAction<boolean>>;
}

export const JobPostDeleteDialog: React.FC<JobPostDeleteDialogProps> = ({
	jobPost,
	setShowDeleteDailog,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const { getToken } = useAuth();
	const { refetch: refetchJobPosts } = useFetchJobPosts();
	const navigate = useNavigate();

	const handleDelete = async () => {
		setIsLoading(true);

		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const url = `/api/jobs/manage/${jobPost.jobId.toLowerCase()}`;
			const response = await axios.delete(url, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.status === 200) {
				toast.success("Job Post Deleted");
				navigate(
					`/company/${jobPost.companyData.companyName.toLowerCase()}/manage-jobs`
				);
				refetchJobPosts();
				setShowDeleteDailog(false);
			} else {
				toast.error("Failed to delete Job Post. Try again!");
			}
		} catch (error: any) {
			toast.error("Error occurred while deleting Job Post. Try again!");
			if (error.response) {
				console.log("Error Status: ", error.response.status);
				console.log("Error Message: ", error.message);
				console.log("Error Response: ", error.response);
			} else if (error.request) {
				console.log("Error Request: ", error.request);
			} else {
				console.log("Error Message: ", error.message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="bg-slate-900/20 backdrop-blur fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer "
			>
				<motion.div
					initial={{ scale: 0.9, rotate: "0deg" }}
					animate={{ scale: 1, rotate: "0deg" }}
					exit={{ scale: 0, rotate: "0deg" }}
					onClick={(e) => e.stopPropagation()}
					className="bg-white p-4 rounded-2xl sm:mx-auto w-96 shadow-xl cursor-default relative overflow-hidden"
				>
					<div className="relative z-10 ">
						<div className="flex items-start justify-between ml-1 rounded-t">
							<h3 className="text-xl font-semibold text-gray-800 mt-1">
								Delete Job Post
							</h3>
						</div>
						<div className="">
							<div className="p-3 pb-6">
								<div className="flex flex-col gap-3">
									{/* description section */}
									<div className="flex flex-col gap-5">
										<div className="flex items-start gap-2">
											<div className="flex flex-col">
												<div className="flex items-center gap-2 w-full">
													<p className="text-sm">
														Are you sure you want to delete this Job Post? This
														action cannot be undone.
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/*footer*/}
						<div className="flex items-center justify-between gap-4 mt-3 rounded-b w-full">
							<button
								className="flex items-center justify-center w-1/2 text-gray-700 bg-slate-50 hover:bg-slate-100 font-semibold border rounded-lg text-sm px-4 py-2.5 outline-none focus:outline-none cursor-pointer ease-linear transition-colors duration-150"
								onClick={() => setShowDeleteDailog(false)}
							>
								Cancel
							</button>
							<button
								className="flex items-center justify-center bg-rose-500 w-1/2 text-white hover:bg-rose-600 font-semibold border rounded-lg text-sm px-4 py-2.5 shadow hover:shadow-xl outline-none focus:outline-none cursor-pointer ease-linear transition-colors duration-150"
								type="submit"
								onClick={handleDelete}
								disabled={isLoading}
							>
								{isLoading ? (
									<span className="flex items-center">
										<span className="mr-2">Deleting</span>
										<Spinner />
									</span>
								) : (
									"Delete"
								)}
							</button>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};
