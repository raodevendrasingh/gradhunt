import axios from "axios";
import clsx from "clsx";
import dummyLogo from "@/assets/avatar/dummyLogo.png";
import Spinner from "@/components/ui/Spinner";
import { BannerCropper } from "@/components/common/BannerCropper";
import { BiBriefcase } from "react-icons/bi";
import { Button } from "@/components/ui/Button";
import { CompanyProfileType } from "@/types/userTypes";
import { companySize, companyTypes, sectors } from "@/utils/selectObjects";
import { FiGlobe, FiPhone } from "react-icons/fi";
import { handleCloudinaryUpload } from "@/lib/handleCloudinaryUpload";
import { HiOutlineBuildingOffice2, HiOutlineUsers } from "react-icons/hi2";
import { LocationSelect } from "@/helpers/LocationSelect2";
import { LogoCropper } from "@/components/common/LogoCropper";
import { MdAlternateEmail } from "react-icons/md";
import { SelectInput } from "@/components/ui/SelectInput";
import { useCallback, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { TbCameraPlus, TbSeeding, TbX } from "react-icons/tb";
import { TextInput } from "@/components/ui/TextInput";
import { TiptapEditor } from "@/components/ui/TiptapEditor";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";

import {
	LuWallet,
	LuCircleDollarSign,
	LuCalendar,
	LuChartLine,
} from "react-icons/lu";

import {
	handleCrop,
	handleUpload,
	openFileDialog,
} from "@/utils/FileUploadMethods";
import { useFetchCompanyProfile } from "@/hooks/company/useFetchCompanyProfile";
import { apiUrl } from "@/modal-forms/profile/OnboardingModal";

export default function Settings() {
	const [initialLocation, setInitialLocation] = useState<string>("");

	const [editorContent, setEditorContent] = useState("");
	const [editorError, setEditorError] = useState("");
	const [editorInstance, setEditorInstance] = useState(null);

	const [isLoading, setIsLoading] = useState(false);
	const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
	const [croppedLogo, setCroppedLogo] = useState<string | null>(null);
	const [croppedBanner, setCroppedBanner] = useState<string | null>(null);
	const [uploadedBanner, setUploadedBanner] = useState<string | null>(null);
	const [isLogoCropperOpen, setIsLogoCropperOpen] = useState(false);
	const [isBannerCropperOpen, setIsBannerCropperOpen] = useState(false);

	const logoInputRef = useRef<HTMLInputElement | null>(null);
	const bannerInputRef = useRef<HTMLInputElement | null>(null);

	const { getToken } = useAuth();

	const {
		data: companyData,
		isLoading: isCompanyDataLoading,
		isError: isCompanyDataError,
	} = useFetchCompanyProfile();

	const {
		reset,
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<CompanyProfileType>();

	const openLogoFileDialog = () => openFileDialog(logoInputRef);
	const openBannerFileDialog = () => openFileDialog(bannerInputRef);

	const handleLogoCrop = handleCrop(setCroppedLogo, setIsLogoCropperOpen);
	const handleBannerCrop = handleCrop(
		setCroppedBanner,
		setIsBannerCropperOpen
	);

	const handleLogoUpload = handleUpload(
		setUploadedLogo,
		setIsLogoCropperOpen
	);
	const handleBannerUpload = handleUpload(
		setUploadedBanner,
		setIsBannerCropperOpen
	);

	const handleEditorReady = useCallback(
		(editor: any) => {
			setEditorInstance(editor);
			if (editor) {
				editor.on("update", ({ editor }: any) => {
					const content = editor.getHTML();
					setEditorContent(content);
					if (content && editorError) {
						setEditorError("");
					}
				});
			}
		},
		[editorError]
	);

	useEffect(() => {
		if (companyData && !isCompanyDataLoading && !isCompanyDataError) {
			reset({
				companyName: companyData.companyName,
				companyTagline: companyData.tagline,
				companyWebsite: companyData.companyWebsite,
				companyEmail: companyData.companyEmail,
				companyPhone: companyData.companyPhone,
				employeeSize: {
					value: companyData.employeeSize as string,
					label: companyData.employeeSize as string,
				},
				establishedYear: companyData.establishedYear,
				marketCap: companyData.marketCap,
				fundingRaised: companyData.fundingRaised,
				companyType: {
					value: companyData.companyType as string,
					label: companyData.companyType as string,
				},
				yearlyRevenue: companyData.yearlyRevenue,
				industry: {
					value: companyData.industry as string,
					label: companyData.industry as string,
				},
				headquarters: companyData.headquarters,
				branches: companyData.branches,
				companyLogo: companyData.companyLogo,
				companyBanner: companyData.companyBanner,
			});
			setCroppedBanner(companyData.companyBanner);
			setCroppedLogo(companyData.companyLogo);
			setInitialLocation(companyData.headquarters);
			setEditorContent(companyData.description);
		}
	}, [companyData, isCompanyDataLoading, isCompanyDataError]);

	const onSubmit: SubmitHandler<CompanyProfileType> = async (data) => {
		setIsLoading(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User not authorized!");
			}

			let content = "";
			if (editorInstance) {
				content = (editorInstance as any).getHTML();
			}

			let cloudinaryBannerUrl = "";
			let cloudinaryLogoUrl = "";

			if (croppedBanner) {
				cloudinaryBannerUrl = await handleCloudinaryUpload(
					croppedBanner,
					"gradhunt/banners"
				);
			}

			if (croppedLogo) {
				cloudinaryLogoUrl = await handleCloudinaryUpload(
					croppedLogo,
					"gradhunt/logos"
				);
			}

			const formData = {
				...data,
				companyLogo: cloudinaryLogoUrl,
				companyBanner: cloudinaryBannerUrl,
				description: content,
			};

			const url = `${apiUrl}/api/company`;
			await axios.patch(url, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			toast.success("Company profile Updated");
		} catch (error: any) {
			console.error(error.response);
			toast.error("Error updating company profile");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex h-full">
			{/* main */}
			<div className="w-full lg2:w-[70%] overflow-y-auto scrollbar-hide p-4">
				<h2 className="text-lg font-semibold pb-5">
					Update Company Profile{" "}
				</h2>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
					<div
						className={clsx(
							"relative w-full aspect-[4/1] mb-16 rounded-xl",
							croppedBanner
								? "bg-transparent"
								: " bg-slate-200 border-2 border-dashed border-gray-500",
							errors.companyBanner && "border-red-500 bg-red-50"
						)}
					>
						{/* Cover Image container */}
						<div className="relative aspect-[4/1] w-full rounded-xl overflow-hidden">
							<input
								{...register("companyBanner")}
								aria-invalid={
									errors.companyBanner ? "true" : "false"
								}
								type="file"
								name="companyBanner"
								className="hidden"
								ref={bannerInputRef}
								onChange={handleBannerUpload}
							/>

							{croppedBanner && (
								<img
									src={croppedBanner}
									alt="banner"
									className="absolute inset-0 h-full w-full object-cover"
								/>
							)}
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="flex items-center gap-4">
									<button
										type="button"
										onClick={openBannerFileDialog}
										className="bg-gray-700 bg-opacity-70 hover:bg-opacity-55 p-3 rounded-full transition-colors duration-200"
									>
										<TbCameraPlus className="size-5 sm:size-7 text-gray-50" />
									</button>
									{croppedBanner && (
										<button
											type="button"
											onClick={() =>
												setCroppedBanner(null)
											}
											className="bg-gray-700 bg-opacity-70 hover:bg-opacity-55 p-3 rounded-full transition-colors duration-200"
										>
											<TbX className="size-5 sm:size-7 text-gray-50" />
										</button>
									)}
								</div>
							</div>
						</div>

						{/* Company Logo Container */}
						<div className="absolute -bottom-14 sm:-bottom-12 left-5 sm:left-8">
							<div className="relative w-24 h-24 sm:w-28 sm:h-28 aspect-square rounded-xl ">
								<div className="absolute inset-0 flex items-center justify-center">
									<input
										{...register("companyLogo")}
										aria-invalid={
											errors.companyLogo
												? "true"
												: "false"
										}
										type="file"
										name="companyLogo"
										className="hidden"
										ref={logoInputRef}
										onChange={handleLogoUpload}
									/>
									{croppedLogo ? (
										<img
											src={croppedLogo}
											alt="Cropped"
											className="relative left-6 w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl bg-gray-400"
										/>
									) : (
										<img
											src={dummyLogo}
											alt="User profile"
											className="relative left-6 w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl"
										/>
									)}
									<button
										type="button"
										onClick={openLogoFileDialog}
										className="relative -left-12 sm:-left-14 bg-gray-700 bg-opacity-70 hover:bg-opacity-55 p-3 rounded-full transition-colors duration-200"
									>
										<TbCameraPlus className="size-7 text-gray-50" />
									</button>
								</div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
						<TextInput
							label="Company Name"
							name="companyName"
							register={register}
							icon={
								<HiOutlineBuildingOffice2 className="h-5 w-5" />
							}
							error={errors.companyName?.message}
							validationRules={{
								required: "Company name is required",
							}}
						/>
						<TextInput
							label="Tagline"
							name="companyTagline"
							register={register}
							icon={<FiGlobe className="h-5 w-5" />}
							error={errors.companyTagline?.message}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<TextInput
							label="Company Email"
							name="companyEmail"
							register={register}
							icon={<MdAlternateEmail className="h-5 w-5" />}
							error={errors.companyEmail?.message}
							validationRules={{
								required: "Company email is required",
							}}
						/>
						<TextInput
							label="Company Contact"
							name="companyPhone"
							register={register}
							icon={<FiPhone className="h-5 w-5" />}
						/>
					</div>
					<div className="col-span-2">
						<TextInput
							label="Website"
							name="companyWebsite"
							register={register}
							icon={<FiGlobe className="h-5 w-5" />}
							error={errors.companyWebsite?.message}
							validationRules={{
								required: "Website is required",
							}}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<SelectInput
							label="Employee Size"
							name="employeeSize"
							options={companySize}
							control={control}
							icon={<HiOutlineUsers className="h-5 w-5" />}
							error={errors.employeeSize?.message}
							isRequired
						/>
						<TextInput
							label="Established Year"
							name="establishedYear"
							register={register}
							icon={<LuCalendar className="h-5 w-5" />}
							error={errors.establishedYear?.message}
							validationRules={{
								required: "Established year is required",
								maxLength: {
									value: 4,
									message: "Invalid year",
								},
								minLength: {
									value: 4,
									message: "Invalid year",
								},
								pattern: {
									value: /^\d+$/,
									message: "Only digits are allowed",
								},
							}}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<TextInput
							label="Market Capitalization"
							name="marketCap"
							register={register}
							icon={<LuChartLine className="h-5 w-5" />}
						/>
						<TextInput
							label="Funding Raised"
							name="fundingRaised"
							register={register}
							icon={<LuCircleDollarSign className="h-5 w-5" />}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<TextInput
							label="Yearly Revenue"
							name="yearlyRevenue"
							register={register}
							icon={<LuWallet className="h-5 w-5" />}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<SelectInput
							label="Company Type"
							name="companyType"
							options={companyTypes}
							control={control}
							icon={<TbSeeding className="h-5 w-5" />}
							error={errors.companyType?.message}
							isRequired
						/>
						<SelectInput
							label="Industry"
							name="industry"
							options={sectors}
							control={control}
							icon={<BiBriefcase className="h-5 w-5" />}
							error={errors.industry?.message}
							isRequired
						/>
					</div>

					<div className="col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Company Headquarters
						</label>
						<LocationSelect
							control={control}
							name="headquarters"
							placeholder="Location"
							error={errors.headquarters?.message}
							rules={{
								required: "Location is required",
							}}
							initialValue={initialLocation}
						/>
					</div>
					<div className="col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Company Branches
						</label>
						<LocationSelect
							control={control}
							name="branches"
							placeholder="Location"
							isMulti
						/>
					</div>

					<div className="col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							About Company
						</label>
						<TiptapEditor
							onEditorReady={handleEditorReady}
							initialContent={editorContent}
						/>
						{editorError && (
							<p className="mt-1 text-sm text-red-600">
								{editorError}
							</p>
						)}
					</div>
					<div className="flex justify-end pt-5">
						<Button
							type="submit"
							variant="primary"
							className="w-36 py-2.5 rounded-lg"
						>
							{isLoading ? <Spinner /> : "Update Profile"}
						</Button>
					</div>
				</form>
			</div>

			{/* sidebar */}
			<div className="hidden lg2:flex flex-col gap-2 w-64 xl:w-[25%] h-full border-l scrollbar-hide overflow-y-auto p-4"></div>

			{/* Logo Cropper */}
			{isLogoCropperOpen && uploadedLogo && (
				<LogoCropper
					imageSrc={uploadedLogo}
					onCropComplete={handleLogoCrop}
					onClose={() => setIsLogoCropperOpen(false)}
				/>
			)}

			{/* Banner Cropper */}
			{isBannerCropperOpen && uploadedBanner && (
				<BannerCropper
					imageSrc={uploadedBanner}
					onCropComplete={handleBannerCrop}
					onClose={() => setIsBannerCropperOpen(false)}
				/>
			)}
		</div>
	);
}
