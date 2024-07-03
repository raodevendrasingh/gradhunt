import { useState } from "react";
import { TbEdit } from "react-icons/tb";
import { FaTrashCan } from "react-icons/fa6";
import { useStore } from "../../store/userStore";

export const UserSettings = () => {
    const { userName } = useStore();

	const [toggleEmail, setToggleEmail] = useState(false);
	const [toggleAppNotify, setToggleAppNotify] = useState(false);
	const [checkEmail, setCheckEmail] = useState(false);
	const [checkJobEmail, setCheckJobEmail] = useState(false);
	const [checkAppEmail, setCheckAppEmail] = useState(false);

	const [checkAppNotify, setCheckAppNotify] = useState(false);
	const [checkJobNotify, setCheckJobNotify] = useState(false);
	const [checkJobUpdate, setCheckJobUpdate] = useState(false);
	return (
		<>
			<div className="w-full pt-24 mx-auto mb-3">
				<div className="max-w-7xl mx-auto lg:ml-64">
					<div className="max-w-5xl mx-auto flex flex-col gap-3 px-3 ">
						{/* username card */}

						<div className=" w-full border  bg-gray-50   p-5 rounded-lg ">
							<form className="flex flex-col gap-3">
								<label htmlFor="username">Username: </label>
								<div className="flex gap-3">
									<input
										type="text"
										className="rounded-lg h-10 max-w-sm focus:ring-transparent disabled:text-gray-400 disabled:cursor-not-allowed"
										value={userName}
										disabled
									/>
									{/* <span className="p-2 border rounded-lg">
										<TbEdit className="h-5 w-5 rounded text-slate-700" />
									</span> */}
								</div>
							</form>
						</div>

						{/* notifications */}
						<div className="flex flex-col h-auto w-full border  bg-gray-50  p-5 rounded-lg">
							<div className="">
								<h1 className="text-2xl">Notifications</h1>
								<p className="text-sm">
									Get notified form job opportunities and application responses.
								</p>
							</div>
							<hr className="my-3 " />

							{/* Email updates */}
							<div className="flex flex-col h-auto w-full bg-white  p-5 rounded-lg gap-3">
								<div className="">
									<h1 className="text-xl">Email Updates</h1>
									<p className="text-sm">
										Recieve email notification form platform activity
									</p>
									<input
										className="peer relative h-4 w-8 cursor-pointer appearance-none rounded-lg bg-slate-300 transition-colors after:absolute after:top-0 after:left-0 after:h-4 after:w-4 after:rounded-full after:bg-slate-500 after:transition-all checked:bg-emerald-200 checked:after:left-4 checked:after:bg-emerald-500 hover:bg-slate-400 after:hover:bg-slate-600 checked:hover:bg-emerald-300 checked:after:hover:bg-emerald-600 focus:outline-none checked:focus:bg-emerald-400 checked:after:focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-200 disabled:after:bg-slate-300"
										type="checkbox"
										value=""
										id="id-c01"
										checked={toggleEmail}
										onChange={() => setToggleEmail(!toggleEmail)}
									/>
									<label
										className="cursor-pointer pl-2 text-slate-900 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
										htmlFor="id-c01"
									>
										On
									</label>
								</div>

								<div className="flex flex-col gap-2">
									{/* Component: Primary checkbox with helper text  */}
									<div className="relative flex flex-wrap items-center">
										<input
											className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-slate-500 bg-white transition-colors checked:border-emerald-500 checked:bg-emerald-500 checked:hover:border-emerald-600 checked:hover:bg-emerald-600 focus:outline-none checked:focus:border-emerald-700 checked:focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50"
											type="checkbox"
											checked={checkEmail}
											onChange={() => setCheckEmail(!checkEmail)}
											id="check1"
											disabled={!toggleEmail}
										/>
										<label
											className="cursor-pointer pl-2 text-slate-900 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
											htmlFor="check1"
										>
											News and updates of the platform.
										</label>
										<small className="w-full pl-6 text-xs text-slate-400 transition peer-invalid:text-pink-500">
											<span>
												The latest news about the latest features and software
												update settings
											</span>
										</small>
										<svg
											className="pointer-events-none absolute left-0 top-1 h-4 w-4 -rotate-90 fill-white stroke-white opacity-0 transition-all duration-300 peer-checked:rotate-0 peer-checked:opacity-100 peer-disabled:cursor-not-allowed"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											aria-hidden="true"
											aria-labelledby="title-3 description-3"
											role="graphics-symbol"
										>
											<title id="title-3">Check mark icon</title>

											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M12.8116 5.17568C12.9322 5.2882 13 5.44079 13 5.5999C13 5.759 12.9322 5.91159 12.8116 6.02412L7.66416 10.8243C7.5435 10.9368 7.37987 11 7.20925 11C7.03864 11 6.87501 10.9368 6.75435 10.8243L4.18062 8.42422C4.06341 8.31105 3.99856 8.15948 4.00002 8.00216C4.00149 7.84483 4.06916 7.69434 4.18846 7.58309C4.30775 7.47184 4.46913 7.40874 4.63784 7.40737C4.80655 7.406 4.96908 7.46648 5.09043 7.57578L7.20925 9.55167L11.9018 5.17568C12.0225 5.06319 12.1861 5 12.3567 5C12.5273 5 12.691 5.06319 12.8116 5.17568Z"
											/>
										</svg>
									</div>
									{/*<!-- End Primary checkbox with helper text --> */}
									<div className="relative flex flex-wrap items-center">
										<input
											className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-slate-500 bg-white transition-colors checked:border-emerald-500 checked:bg-emerald-500 checked:hover:border-emerald-600 checked:hover:bg-emerald-600 focus:outline-none checked:focus:border-emerald-700 checked:focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50"
											type="checkbox"
											checked={checkJobEmail}
											onChange={() => setCheckJobEmail(!checkJobEmail)}
											id="check2"
											disabled={!toggleEmail}
										/>
										<label
											className="cursor-pointer pl-2 text-slate-900 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
											htmlFor="check2"
										>
											Job Updates
										</label>
										<small className="w-full pl-6 text-xs text-slate-400 transition peer-invalid:text-pink-500">
											<span>
												Recieve emails when new jobs are posted with similar
												skills.
											</span>
										</small>
										<svg
											className="pointer-events-none absolute left-0 top-1 h-4 w-4 -rotate-90 fill-white stroke-white opacity-0 transition-all duration-300 peer-checked:rotate-0 peer-checked:opacity-100 peer-disabled:cursor-not-allowed"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											aria-hidden="true"
											aria-labelledby="title-3 description-3"
											role="graphics-symbol"
										>
											<title id="title-3">Check mark icon</title>

											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M12.8116 5.17568C12.9322 5.2882 13 5.44079 13 5.5999C13 5.759 12.9322 5.91159 12.8116 6.02412L7.66416 10.8243C7.5435 10.9368 7.37987 11 7.20925 11C7.03864 11 6.87501 10.9368 6.75435 10.8243L4.18062 8.42422C4.06341 8.31105 3.99856 8.15948 4.00002 8.00216C4.00149 7.84483 4.06916 7.69434 4.18846 7.58309C4.30775 7.47184 4.46913 7.40874 4.63784 7.40737C4.80655 7.406 4.96908 7.46648 5.09043 7.57578L7.20925 9.55167L11.9018 5.17568C12.0225 5.06319 12.1861 5 12.3567 5C12.5273 5 12.691 5.06319 12.8116 5.17568Z"
											/>
										</svg>
									</div>
									<div className="relative flex flex-wrap items-center">
										<input
											className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-slate-500 bg-white transition-colors checked:border-emerald-500 checked:bg-emerald-500 checked:hover:border-emerald-600 checked:hover:bg-emerald-600 focus:outline-none checked:focus:border-emerald-700 checked:focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50"
											type="checkbox"
											checked={checkAppEmail}
											onChange={() => setCheckAppEmail(!checkAppEmail)}
											id="check3"
											disabled={!toggleEmail}
										/>
										<label
											className="cursor-pointer pl-2 text-slate-900 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
											htmlFor="check3"
										>
											Applications Updates
										</label>
										<small className="w-full pl-6 text-xs text-slate-400 transition peer-invalid:text-pink-500">
											<span>
												Recieve email updates regarding the jobs you applied.
											</span>
										</small>
										<svg
											className="pointer-events-none absolute left-0 top-1 h-4 w-4 -rotate-90 fill-white stroke-white opacity-0 transition-all duration-300 peer-checked:rotate-0 peer-checked:opacity-100 peer-disabled:cursor-not-allowed"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											aria-hidden="true"
											aria-labelledby="title-3 description-3"
											role="graphics-symbol"
										>
											<title id="title-3">Check mark icon</title>

											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M12.8116 5.17568C12.9322 5.2882 13 5.44079 13 5.5999C13 5.759 12.9322 5.91159 12.8116 6.02412L7.66416 10.8243C7.5435 10.9368 7.37987 11 7.20925 11C7.03864 11 6.87501 10.9368 6.75435 10.8243L4.18062 8.42422C4.06341 8.31105 3.99856 8.15948 4.00002 8.00216C4.00149 7.84483 4.06916 7.69434 4.18846 7.58309C4.30775 7.47184 4.46913 7.40874 4.63784 7.40737C4.80655 7.406 4.96908 7.46648 5.09043 7.57578L7.20925 9.55167L11.9018 5.17568C12.0225 5.06319 12.1861 5 12.3567 5C12.5273 5 12.691 5.06319 12.8116 5.17568Z"
											/>
										</svg>
									</div>
								</div>
							</div>

							{/* app updates */}
							<div className="flex flex-col h-auto w-full border mt-3 p-5 rounded-lg gap-3">
								<div className="">
									<h1 className="text-xl">App Updates</h1>
									<p className="text-sm">
										Recieve app notification form platform activity
									</p>
									<input
										className="peer relative h-4 w-8 cursor-pointer appearance-none rounded-lg bg-slate-300 transition-colors after:absolute after:top-0 after:left-0 after:h-4 after:w-4 after:rounded-full after:bg-slate-500 after:transition-all checked:bg-emerald-200 checked:after:left-4 checked:after:bg-emerald-500 hover:bg-slate-400 after:hover:bg-slate-600 checked:hover:bg-emerald-300 checked:after:hover:bg-emerald-600 focus:outline-none checked:focus:bg-emerald-400 checked:after:focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-200 disabled:after:bg-slate-300"
										type="checkbox"
										value=""
										id="id-c01"
										checked={toggleAppNotify}
										onChange={() => setToggleAppNotify(!toggleAppNotify)}
										disabled
									/>
									<label
										className="cursor-pointer pl-2 text-slate-900 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
										htmlFor="id-c01"
									>
										On
									</label>
								</div>

								<div className="flex flex-col gap-2">
									{/* Component: Primary checkbox with helper text  */}
									<div className="relative flex flex-wrap items-center">
										<input
											className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-slate-500 bg-white transition-colors checked:border-emerald-500 checked:bg-emerald-500 checked:hover:border-emerald-600 checked:hover:bg-emerald-600 focus:outline-none checked:focus:border-emerald-700 checked:focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50"
											type="checkbox"
											checked={checkAppNotify}
											onChange={() => setCheckAppNotify(!checkAppNotify)}
											id="check1"
											disabled={!toggleAppNotify}
										/>
										<label
											className="cursor-pointer pl-2 text-slate-900 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
											htmlFor="check1"
										>
											News and updates of the platform.
										</label>
										<small className="w-full pl-6 text-xs text-slate-400 transition peer-invalid:text-pink-500">
											<span>
												The latest news about the latest features and software
												update settings
											</span>
										</small>
										<svg
											className="pointer-events-none absolute left-0 top-1 h-4 w-4 -rotate-90 fill-white stroke-white opacity-0 transition-all duration-300 peer-checked:rotate-0 peer-checked:opacity-100 peer-disabled:cursor-not-allowed"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											aria-hidden="true"
											aria-labelledby="title-3 description-3"
											role="graphics-symbol"
										>
											<title id="title-3">Check mark icon</title>

											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M12.8116 5.17568C12.9322 5.2882 13 5.44079 13 5.5999C13 5.759 12.9322 5.91159 12.8116 6.02412L7.66416 10.8243C7.5435 10.9368 7.37987 11 7.20925 11C7.03864 11 6.87501 10.9368 6.75435 10.8243L4.18062 8.42422C4.06341 8.31105 3.99856 8.15948 4.00002 8.00216C4.00149 7.84483 4.06916 7.69434 4.18846 7.58309C4.30775 7.47184 4.46913 7.40874 4.63784 7.40737C4.80655 7.406 4.96908 7.46648 5.09043 7.57578L7.20925 9.55167L11.9018 5.17568C12.0225 5.06319 12.1861 5 12.3567 5C12.5273 5 12.691 5.06319 12.8116 5.17568Z"
											/>
										</svg>
									</div>
									{/*<!-- End Primary checkbox with helper text --> */}
									<div className="relative flex flex-wrap items-center">
										<input
											className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-slate-500 bg-white transition-colors checked:border-emerald-500 checked:bg-emerald-500 checked:hover:border-emerald-600 checked:hover:bg-emerald-600 focus:outline-none checked:focus:border-emerald-700 checked:focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50"
											type="checkbox"
											checked={checkJobNotify}
											onChange={() => setCheckJobNotify(!checkJobNotify)}
											id="check2"
											disabled={!toggleAppNotify}
										/>
										<label
											className="cursor-pointer pl-2 text-slate-900 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
											htmlFor="check2"
										>
											Job Updates
										</label>
										<small className="w-full pl-6 text-xs text-slate-400 transition peer-invalid:text-pink-500">
											<span>
												Recieve notifications when new jobs are posted with
												similar skills.
											</span>
										</small>
										<svg
											className="pointer-events-none absolute left-0 top-1 h-4 w-4 -rotate-90 fill-white stroke-white opacity-0 transition-all duration-300 peer-checked:rotate-0 peer-checked:opacity-100 peer-disabled:cursor-not-allowed"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											aria-hidden="true"
											aria-labelledby="title-3 description-3"
											role="graphics-symbol"
										>
											<title id="title-3">Check mark icon</title>

											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M12.8116 5.17568C12.9322 5.2882 13 5.44079 13 5.5999C13 5.759 12.9322 5.91159 12.8116 6.02412L7.66416 10.8243C7.5435 10.9368 7.37987 11 7.20925 11C7.03864 11 6.87501 10.9368 6.75435 10.8243L4.18062 8.42422C4.06341 8.31105 3.99856 8.15948 4.00002 8.00216C4.00149 7.84483 4.06916 7.69434 4.18846 7.58309C4.30775 7.47184 4.46913 7.40874 4.63784 7.40737C4.80655 7.406 4.96908 7.46648 5.09043 7.57578L7.20925 9.55167L11.9018 5.17568C12.0225 5.06319 12.1861 5 12.3567 5C12.5273 5 12.691 5.06319 12.8116 5.17568Z"
											/>
										</svg>
									</div>
									<div className="relative flex flex-wrap items-center">
										<input
											className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-slate-500 bg-white transition-colors checked:border-emerald-500 checked:bg-emerald-500 checked:hover:border-emerald-600 checked:hover:bg-emerald-600 focus:outline-none checked:focus:border-emerald-700 checked:focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50"
											type="checkbox"
											checked={checkJobUpdate}
											onChange={() => setCheckJobUpdate(!checkJobUpdate)}
											id="check3"
											disabled={!toggleAppNotify}
										/>
										<label
											className="cursor-pointer pl-2 text-slate-900 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400"
											htmlFor="check3"
										>
											Applications Updates
										</label>
										<small className="w-full pl-6 text-xs text-slate-400 transition peer-invalid:text-pink-500">
											<span>
												Recieve notification regarding the jobs you applied.
											</span>
										</small>
										<svg
											className="pointer-events-none absolute left-0 top-1 h-4 w-4 -rotate-90 fill-white stroke-white opacity-0 transition-all duration-300 peer-checked:rotate-0 peer-checked:opacity-100 peer-disabled:cursor-not-allowed"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											aria-hidden="true"
											aria-labelledby="title-3 description-3"
											role="graphics-symbol"
										>
											<title id="title-3">Check mark icon</title>

											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M12.8116 5.17568C12.9322 5.2882 13 5.44079 13 5.5999C13 5.759 12.9322 5.91159 12.8116 6.02412L7.66416 10.8243C7.5435 10.9368 7.37987 11 7.20925 11C7.03864 11 6.87501 10.9368 6.75435 10.8243L4.18062 8.42422C4.06341 8.31105 3.99856 8.15948 4.00002 8.00216C4.00149 7.84483 4.06916 7.69434 4.18846 7.58309C4.30775 7.47184 4.46913 7.40874 4.63784 7.40737C4.80655 7.406 4.96908 7.46648 5.09043 7.57578L7.20925 9.55167L11.9018 5.17568C12.0225 5.06319 12.1861 5 12.3567 5C12.5273 5 12.691 5.06319 12.8116 5.17568Z"
											/>
										</svg>
									</div>
								</div>
							</div>
						</div>
						{/* notifivation section ends */}
                        
                        {/* delete account button */}
						<div className="flex flex-col items-start gap-3 w-full border  bg-gray-50  p-5 rounded-lg  ">
							<div className="text-2xl text-red-500 font-bold ">Danger</div>
							<button className=" inline-flex items-center gap-2 text-lg text-red-600 px-4 py-3 border rounded-lg bg-red-50 hover:bg-red-500 hover:text-red-50 transition duration-200">
								Delete Account
								<span className="">
									<FaTrashCan />
								</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
