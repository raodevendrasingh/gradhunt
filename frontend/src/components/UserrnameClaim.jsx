import { useState } from "react";
import logoIcon from "../assets/gh_logo_icon.png";
import { FaArrowRight } from "react-icons/fa6";

export const UserrnameClaim = () => {
	const [inputFocused, setIsFocused] = useState(false);
	return (
		<div className="mt-9">
			<form className="relative flex flex-col gap-4 items-center">
				<div
					tabIndex="0" // Step 1: Make the div focusable
                    className={`max-w-sm w-full pl-6 p-3 flex items-center h-14 justify-between transition duration-100 ease-in-out transform border ${inputFocused ? "border-green-800" : "border-gray-200"} rounded-full text-neutral-600 bg-gray-50 hover:ring-4 hover:ring-green-200`}				>
					<div className="flex items-center gap-x-2">
						{/* <div>
							<img src={logoIcon} alt="logo" className="h-8 w-9" />
						</div> */}
						<div className="flex items-center">
							<span className="text-lg">gradhunt.tech/</span>
							<div className="relative">
								<input
									aria-label="Claim your username"
									required
									placeholder="username"
									className="font-normal p-0 w-full text-lg placeholder:text-gray-400 placeholder:font-normal text-gray-800 outline-none ring-0 border-none !important"
									title="Claim your username!"
									onFocus={() => setIsFocused(true)} // Manage focus state
									onBlur={() => setIsFocused(false)} // Reset focus state when not focused
								/>
							</div>
						</div>
					</div>
					<div>
						<button
							className="border font-medium text-center transition-all ease-in duration-75 disabled:opacity-50 disabled:cursor-not-allowed flex items-center leading-120 select-none rounded-full justify-center text-base h-8 w-8 bg-gray-gray9 text-white border-gray-gray9 hover:bg-gray-gray8 bg-green-600 border-none hover:bg-green hover:shadow-focus-border hover:shadow-green-lighter"
							type="submit"
							disabled={false}
							aria-label="Submit"
						>
							<FaArrowRight />
						</button>
					</div>
				</div>
				<div className="h-6 text-center">
					<div className="flex flex-col justify-center overflow-hidden">
						<p className="text-green font-normal text-sm -translate-y-full h-max max-h-0 opacity-0">
							It’s available... this username is available! 😃
						</p>
						<p className="text-light font-normal text-sm h-max animate-slide-up max-h-10 opacity-100">
							Claim your username before it’s too late!
						</p>
						<p className="text-red text-sm translate-y-full h-max max-h-0 opacity-0">
							This username is already taken, you’re a little late.😐
						</p>
					</div>
				</div>
			</form>
		</div>
	);
};
