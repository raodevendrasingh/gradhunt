// hooks
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

// Third-party libraries
import { SubmitHandler } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";

import Spinner from "@/components/ui/Spinner";

interface FormData {
	description: string;
}

export const ResumeDeleteModal: React.FC<{
	setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowDeleteModal }) => {
	const [isLoading, setIsLoading] = useState(false);
	const { getToken } = useAuth();

	const onSubmit = async () => {
		setIsLoading(true);

		try {
			const token = await getToken();
			if (!token) {
				throw new Error("Token is not available");
			}

			const url = `/api/delete-resume`;
			const response = await axios.delete(url, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},

			});

			if (response.status === 200) {
				toast.success("Resume Deleted");
				setShowDeleteModal(false);
			} else {
				toast.error("Failed to delete resume. Try again!");
			}
		} catch (error: any) {
			toast.error("Error occured while deleting resume. Try again!");
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
								Delete Resume
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
														Are you sure you want to delete this resume? This
														action cannot be undone. Deleting your resume will
														remove it permanently from our records.
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
								onClick={() => setShowDeleteModal(false)}
							>
								Cancel
							</button>
							<button
								className="flex items-center justify-center bg-rose-500 w-1/2 text-white hover:bg-rose-600 font-semibold border rounded-lg text-sm px-4 py-2.5 shadow hover:shadow-xl outline-none focus:outline-none cursor-pointer ease-linear transition-colors duration-150"
								type="submit"
								onClick={onSubmit}
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
