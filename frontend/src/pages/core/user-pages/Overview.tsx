import ReorderButton from "@/components/layouts/ReorderButton";
import { UserAboutModal } from "@/modal-forms/UserDescriptionModal";
import { MdModeEdit } from "react-icons/md";
import { useEffect, useState } from "react";
import ComboboxAll from "@/components/layouts/ComboboxAll";
import { useFetchAboutSection } from "@/hooks/useFetchAboutData";
import { useUser } from "@clerk/clerk-react";
import { SkillSection } from "@/pages/core/user-pages/profile-sections/SkillSection";
import { toast } from "sonner";
import { ResumeUploadSection } from "@/pages/core/user-pages/profile-sections/ResumeUploadSection";
import { useFetchUserDetails } from "@/hooks/useFetchUserDetails";

export const Overview = () => {
	const [showAboutModal, setAboutModal] = useState<boolean>(false);
	const {
		data: userDesc,
		isLoading: isAboutLoading,
		error,
		refetch: refetchAbout,
	} = useFetchAboutSection();

	const { isSignedIn, user } = useUser();
	const { data: userDetails } = useFetchUserDetails();

	useEffect(() => {
		if (error && error.response?.status !== 404) {
			toast.error("Error fetching About Section details");
		}
	}, [error]);

	return (
		<div className="flex flex-col">
			{isSignedIn && (
				<div className="flex justify-between items-center">
					<ComboboxAll />
					{/* <ReorderButton /> */}
				</div>
			)}
			<div className="flex flex-col items-center border rounded-lg mt-2 w-full px-3 py-1">
				<div className="flex items-center justify-between w-full pb-2">
					<span className="text-gray-700 font-medium text-base pt-1">
						About
					</span>
					{isSignedIn &&
						user.username === userDetails?.user_details?.username && (
							<button
								type="button"
								onClick={() => setAboutModal(true)}
								className="p-2 rounded-full text-gray-700 bg-white hover:bg-slate-50 text-sm font-medium  cursor-pointer transition-colors"
							>
								<MdModeEdit className="size-5" />
							</button>
						)}
				</div>
				<div className="flex items-center justify-start w-full">
					{isAboutLoading ? (
						<>
							<div className="flex flex-col w-full gap-2">
								<div className="h-4 w-full skeleton" />
								<div className="h-4 w-full skeleton" />
								<div className="h-4 w-full skeleton" />
							</div>
						</>
					) : userDesc &&
					  (userDesc.description as string) &&
					  userDesc.description.length > 0 ? (
						<div className="flex flex-wrap text-sm">{userDesc.description}</div>
					) : (
						<div className="flex items-center justify-center w-full min-h-32">
							<button
								type="button"
								onClick={() => setAboutModal(true)}
								className="px-3 py-2 rounded-lg text-gray-700 bg-white hover:bg-slate-50 w-36 text-sm font-medium border border-gray-300 cursor-pointer transition-colors"
							>
								Add About
							</button>
						</div>
					)}
				</div>
				{showAboutModal && (
					<UserAboutModal setAboutModal={setAboutModal} onSave={refetchAbout} />
				)}
			</div>

			<SkillSection />
			<ResumeUploadSection />
		</div>
	);
};
