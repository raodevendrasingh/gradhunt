// hooks
import { useUser } from "@clerk/clerk-react";

// external packages
import { AnimatePresence, motion } from "framer-motion";
import { SubmitHandler, useForm } from "react-hook-form";
import { HiOutlineArrowRight } from "react-icons/hi";
import { HiOutlineXMark } from "react-icons/hi2";

import brandIcon from "@/assets/brand/brandIcon.png";
import Spinner from "@/components/ui/Spinner";
import { useNavigate } from "react-router-dom";
import { useCompanySlugCheck } from "@/hooks/company/useCompanySlugCheck";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "@/components/ui/Button";

interface FormField {
	companySlug: string;
}

export const CompanyOnboardingModal = ({
	setShowOnboardingModal,
}: {
	setShowOnboardingModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { isSignedIn } = useUser();
	const navigate = useNavigate();
	const [, setCompanySlug] = useLocalStorage<string>("companyslug", "");

	if (!isSignedIn) return null;

	const {
		checkSlug,
		companySlugMsg,
		isCheckingSlug,
		isValidSlug,
		isFieldValid,
	} = useCompanySlugCheck();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid, isDirty },
	} = useForm<FormField>({
		defaultValues: {
			companySlug: "",
		},
	});

	const getDisplayMessage = () => {
		if (!isDirty || companySlug.length < 4) {
			return;
		}
		if (errors.companySlug) {
			return (
				<p className="text-red-500 text-xs" role="alert">
					{errors.companySlug.message}
				</p>
			);
		}
		if (companySlug && !isValidSlug(companySlug)) {
			return (
				<p className="text-red-500 text-xs">
					Url can only contain lowercase letters and digits and dashes
					(max 16 characters)
				</p>
			);
		}
		if (companySlugMsg) {
			return (
				<p
					className={`text-xs ${isFieldValid ? "text-green-600" : "text-rose-600"}`}
				>
					{companySlugMsg}
				</p>
			);
		}
		return null;
	};

	const onSubmit: SubmitHandler<FormField> = (data) => {
		setCompanySlug(data.companySlug);
		setShowOnboardingModal(false);
		navigate("/create-company-profile");
	};

	const companySlug = watch("companySlug");

	return (
		isSignedIn && (
			<AnimatePresence>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
				>
					<motion.div
						initial={{ scale: 0, rotate: "0deg" }}
						animate={{ scale: 1, rotate: "0deg" }}
						exit={{ scale: 0, rotate: "0deg" }}
						onClick={(e) => e.stopPropagation()}
						className="bg-white p-4 rounded-xl sm:mx-auto w-full max-w-[400px] shadow-xl cursor-default relative overflow-hidden"
					>
						<div className="relative z-10 w-full">
							<div className="flex flex-col items-center justify-center rounded-t w-full pt-5">
								<img
									src={brandIcon}
									alt="brandLogo"
									className="size-24 aspect-auto mb-1"
								/>
								<h3 className="text-2xl font-bold text-center mb-2">
									Welcome to <br /> GradHunt Jobs!
								</h3>
								<p className="text-center text-sm">
									Get your custom company URL
								</p>
								<button
									className="fixed top-3 right-3 ml border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
									onClick={() =>
										setShowOnboardingModal(false)
									}
								>
									<span className="bg-transparent text-gray-800">
										<HiOutlineXMark className="size-10 hover:bg-gray-100 rounded-full p-2" />
									</span>
								</button>
							</div>
							<form
								id="basicDetailForm"
								onSubmit={handleSubmit(onSubmit)}
							>
								<div className="p-3">
									<div className="flex flex-col gap-3">
										<div className="flex flex-col py-10">
											<div className="flex items-center">
												<div className="flex flex-col items-center w-full">
													<div className="flex items-center justify-center w-full">
														<span className="px-3 py-2 border-l border-y rounded-l-lg text-base bg-slate-50 text-gray-800">
															gradhunt.tech/
														</span>
														<div className="relative">
															<input
																{...register(
																	"companySlug",
																	{
																		required:
																			true,
																		maxLength: 16,
																		onChange:
																			(e: {
																				target: {
																					value: string;
																				};
																			}) =>
																				checkSlug(
																					e
																						.target
																						.value
																				),
																	}
																)}
																aria-label="Grab your username"
																placeholder="username"
																className="font-normal px-3 py-2 border-y rounded-r-lg w-full text-base bg-white placeholder:text-gray-400 placeholder:font-normal text-gray-800 focus:border-slate-800 hover:ring-2 ring-sky-500 transition-colors !important"
																title="Grab your username!"
															/>
														</div>
													</div>

													<div className="py-2 w-full px-1">
														<div className="flex flex-col justify-start overflow-hidden">
															{isCheckingSlug && (
																<span className="flex items-center gap-2">
																	<Spinner color="black" />
																	<span className="text-xs text-gray-500">
																		Verifying...
																	</span>
																</span>
															)}
															{getDisplayMessage()}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="flex items-center justify-center mt-4">
									<Button
										type="submit"
										disabled={
											!isValid ||
											isCheckingSlug ||
											!isFieldValid
										}
										className="flex w-full items-center justify-center gap-2 text-sm py-2.5 rounded-lg"
									>
										<>
											Continue
											<HiOutlineArrowRight className="size-4" />
										</>
									</Button>
								</div>
							</form>
						</div>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		)
	);
};
