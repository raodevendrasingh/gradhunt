import { useState, useEffect } from "react";
import { BsPersonLock } from "react-icons/bs";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { apiUrl } from "@/modal-forms/profile/OnboardingModal";

export const ProfileVisibilityToggle = ({ defaultValue = false }) => {
	const [isToggling, setIsToggling] = useState<boolean>(false);
	const [currentValue, setCurrentValue] = useState<boolean>(defaultValue);
	const { getToken } = useAuth();

	const { control, register } = useForm({
		defaultValues: {
			makeProfilePrivate: defaultValue,
		},
	});

	useEffect(() => {
		setCurrentValue(defaultValue);
	}, [defaultValue]);

	const handleToggleProfileVisibility = async () => {
		const newValue = !currentValue;
		setIsToggling(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User Unauthorized");
			}
			const formData = {
				isProfilePrivate: newValue,
			};
			const url = `${apiUrl}/api/users/visibility`;
			await axios.patch(url, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			setCurrentValue(newValue);
			toast.success("Profile visibility updated successfully");
		} catch (error: any) {
			toast.error("Failed to update profile visibility");
		} finally {
			setIsToggling(false);
		}
	};

	return (
		<ToggleSwitch
			control={control}
			register={register}
			icon={<BsPersonLock className="h-5 w-5" />}
			label="Make Profile Private"
			name="makeProfilePrivate"
			helptext="Handle profile visibility. If turned on, only you can see your profile"
			disabled={isToggling}
			defaultValue={currentValue}
			onChange={handleToggleProfileVisibility}
		/>
	);
};
