import Spinner from "../ui/Spinner";

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
						<span className="px-3 py-2 border-l border-y rounded-l-lg text-base bg-slate-50 text-gray-800">
							gradhunt.app/
						</span>
						<div className="relative">
							<input
								{...register("username", {
									required: true,
									maxLength: 16,
									onChange: (e: { target: { value: string } }) =>
										checkUsername(e.target.value),
								})}
								aria-label="Grab your username"
								placeholder="username"
								className="font-normal px-3 py-2 border-y rounded-r-lg w-full text-base bg-white placeholder:text-gray-400 placeholder:font-normal text-gray-800 focus:border-slate-800 hover:ring-2 ring-sky-500 transition-colors !important"
								title="Grab your username!"
							/>
						</div>
					</div>

					<div className="py-2 w-full px-1">
						<div className="flex flex-col justify-start overflow-hidden">
							{isCheckingUsername && (
								<span className="flex items-center gap-2">
                                    <Spinner color="black"/>
                                    <span className="text-xs text-gray-500">Searching...</span>
                                </span>
							)}
							{getDisplayMessage()}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
