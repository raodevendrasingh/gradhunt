import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { TbLoader } from "react-icons/tb";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Spinner from "./Spinner";

export const UsernameInput = () => {
	const [inputFocused, setIsFocused] = useState<boolean>(false);
	const [, setValue] = useLocalStorage<string>("potentialUser", "");
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isDirty },
	} = useForm<{ username: string }>();

	const {
		isValidUsername,
		isCheckingUsername,
		usernameMsg,
		isFieldValid,
		checkUsername,
	} = useUsernameCheck();

	const username = watch("username");

	const onSubmit = handleSubmit((data) => {
		if (isFieldValid && !isCheckingUsername) {
			setValue(data.username);
			navigate(`/signup`);
		}
	});

	const getDisplayMessage = () => {
		if (!isDirty || username.length < 4) {
			return (
				<p className="text-light font-normal text-sm">Grab your username!</p>
			);
		}
		if (errors.username) {
			return (
				<p className="text-red-500 text-sm" role="alert">
					{errors.username.message}
				</p>
			);
		}
		if (username && !isValidUsername(username)) {
			return (
				<p className="text-red-500 text-sm">
					Username can only contain lowercase letters and digits (max 16
					characters)
				</p>
			);
		}
		if (usernameMsg) {
			return <p className="text-sm">{usernameMsg}</p>;
		}
		return null;
	};

	return (
		<div className="mt-9">
			<form
				onSubmit={onSubmit}
				className="relative flex flex-col gap-4 items-center"
			>
				<div
					tabIndex={0}
					className={`max-w-sm w-full pl-6 p-3 flex items-center h-14 justify-between transition duration-100 ease-in-out shadow transform border ${
						inputFocused ? "border-gray-800" : "border-gray-300"
					} rounded-full text-neutral-600 bg-gray-50 hover:ring-4 hover:ring-sky-200`}
				>
					<div className="flex items-center gap-x-2">
						<div className="flex items-center">
							<span className="text-lg select-none">gradhunt.tech/</span>
							<div className="relative">
								<input
									{...register("username", {
										required: "Username is required",
										maxLength: {
											value: 16,
											message: "Username cannot be more than 16 characters",
										},
										pattern: {
											value: /^[a-z0-9]+$/,
											message:
												"Username can only contain lowercase letters and digits",
										},
										onChange: (e) => checkUsername(e.target.value),
									})}
									aria-label="Claim your username"
									placeholder="username"
									className="font-normal p-0 w-full text-lg bg-gray-50 placeholder:text-gray-400 placeholder:font-normal text-gray-800 outline-none ring-0 border-none !important"
									title="Claim your username!"
									onFocus={() => setIsFocused(true)}
									onBlur={() => setIsFocused(false)}
								/>
							</div>
						</div>
					</div>
					<div>
						<button
							className="font-medium text-center transition-all ease-in duration-75 disabled:opacity-50 disabled:cursor-not-allowed flex items-center leading-120 select-none rounded-full justify-center text-base h-8 w-8 bg-gray-700 border border-t border-b-4 text-white border-gray-900 hover:bg-gray-800 border-none"
							type="submit"
							disabled={
								isCheckingUsername ||
								!isFieldValid ||
								!isValidUsername(username)
							}
							aria-label="Submit"
						>
							{isCheckingUsername ? <Spinner /> : <FaArrowRight />}
						</button>
					</div>
				</div>
				<div className="h-6 text-center">
					<div className="flex flex-col justify-center overflow-hidden">
						{getDisplayMessage()}
					</div>
				</div>
			</form>
		</div>
	);
};
