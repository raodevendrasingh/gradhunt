import { useState, useEffect } from "react";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";

export const NotificationToggle = ({
	defaultValue = false,
	notificationType,
	label,
	icon,
}: {
	defaultValue?: boolean;
	notificationType: string;
	label: string;
	icon: React.ReactNode;
}) => {
	const [isToggling, setIsToggling] = useState<boolean>(false);
	const [currentValue, setCurrentValue] = useState<boolean>(defaultValue);
	const { getToken } = useAuth();

	const { control, register } = useForm({
		defaultValues: {
			webNotification: defaultValue,
		},
	});

	useEffect(() => {
		setCurrentValue(defaultValue);
	}, [defaultValue]);

	const handleNotificationToggle = async () => {
		const newValue = !currentValue;
		setIsToggling(true);
		try {
			const token = await getToken();
			if (!token) {
				throw new Error("User Unauthorized");
			}
			const formData = {
				isNotificationEnabled: newValue,
			};
			const url =
				"/api/users/notification/?notificationType=" + notificationType;
			await axios.patch(url, formData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			setCurrentValue(newValue);
			toast.success(
				`${notificationType.charAt(0).toUpperCase() + notificationType.slice(1)} Notification settings updated successfully`
			);
		} catch (error) {
			toast.error(`Failed to update ${notificationType} notification settings`);
		} finally {
			setIsToggling(false);
		}
	};

	return (
		<ToggleSwitch
			control={control}
			register={register}
			icon={icon}
			label={label}
			name="webNotification"
			disabled={isToggling}
			defaultValue={currentValue}
			onChange={handleNotificationToggle}
		/>
	);
};
