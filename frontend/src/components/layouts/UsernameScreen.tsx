import { TbLoader } from "react-icons/tb";

export const UsernameScreen: React.FC<{
	register: any;
	isCheckingUsername: any;
	checkUsername: any;
	getDisplayMessage: any;
}> = ({ register, isCheckingUsername, checkUsername, getDisplayMessage }) => {
	return (
		<div className="flex flex-col py-10">
			<div className="flex items-center">
				<div className="flex flex-col items-center w-full">
					<div className="flex items-center justify-center w-full">
						<span className="px-3 py-2 border-l border-y rounded-l-lg text-base bg-gray-50 text-gray-700">
							gradhunt.tech/
						</span>
						<div className="relative">
							<input
								{...register("username", {
									required: true,
									maxLength: 12,
									onChange: (e: { target: { value: string } }) =>
										checkUsername(e.target.value),
								})}
								aria-label="Claim your username"
								placeholder="username"
								className="font-normal px-3 py-2 border-y rounded-r-lg w-full text-base bg-white placeholder:text-gray-400 placeholder:font-normal text-gray-800 focus:border-green-600 hover:ring-2 ring-green-500 transition-colors !important"
								title="Claim your username!"
							/>
						</div>
					</div>
					<div className="relative left-40 bottom-7">
						{isCheckingUsername && <TbLoader className="animate-spin" />}
					</div>
					<div className="py-2 w-full px-1">
						<div className="flex flex-col justify-start overflow-hidden">
							{getDisplayMessage()}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
