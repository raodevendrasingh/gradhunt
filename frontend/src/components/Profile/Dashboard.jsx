export const Dashboard = () => {
	return (
		<>
			<div className="w-full pt-24 mx-auto h-screen ">
				<div className="max-w-7xl mx-auto lg:ml-64 h-[80vh]">
					<div className="max-w-5xl mx-auto h-[80vh] px-3">
						{/* user details */}
						<div className="flex w-full mb-2">
							<div className="w-full h-auto flex flex-col md:flex-row gap-1">
								<div className="flex h-auto w-full gap-1">
									<div className=" w-32 h-32 flex justify-center ">
										<img
											src="https://via.placeholder.com/100"
											className="aspect-auto border rounded-lg"
										/>
									</div>

									<div className="flex flex-col flex-grow h-auto border border-gray-100 bg-gray-100   p-3  rounded-lg">
										<h1 className="text-3xl">Jason Roy</h1>
										<h3 className="text-sm">@jsonroy123</h3>
										<p className="pt-5 ">Male</p>
									</div>
								</div>
								<div className="flex flex-col xs:flex-row w-full h-auto  gap-1 ">
									<div className="w-full h-auto border border-gray-100 bg-gray-100 p-3 flex flex-col justify-center rounded-lg ">
										<h1 className="">jason.roy@email.com</h1>
										<h3 className="">+1 123456789</h3>
									</div>
									<div className="w-full h-auto border border-gray-100 bg-gray-100 p-3 flex flex-col justify-center rounded-lg">
										<h3>United Kingdom</h3>
										<p className="text-sm">British Summer Time (UTC+01:00)</p>
									</div>
								</div>
							</div>
						</div>

						{/* experience section*/}
						<div className="flex flex-col w-full border border-gray-100 bg-gray-100 h-auto p-2 rounded-lg my-2">
							<div>
								<h3 className="text-2xl py-2">Experience</h3>
							</div>
							<div className="flex">
								<div className="w-full border border-gray-50 bg-gray-50 h-auto p-2 rounded-lg">
									<div className="flex items-baseline justify-between ">
										<h1 className="text-xl">OneInfo Tek</h1>
										<h1 className="text-xs">July 2021 - Present</h1>
									</div>
									<h2>HR</h2>
								</div>
							</div>
						</div>

						{/* stats section */}
						<div className="flex w-full border border-gray-100 bg-gray-100 h-28 p-2 rounded-lg gap-2 my-2">
							<div className="w-1/3 border border-gray-50 bg-gray-50 h-auto p-3 rounded-lg">
								Jobs Posted 10
							</div>
							<div className="w-1/3 border border-gray-50 bg-gray-50 h-auto p-3 rounded-lg">
								Applications Recieved 150
							</div>
							<div className="w-1/3 border border-gray-50 bg-gray-50 h-auto p-3 rounded-lg">
								Average Response ~15
							</div>
						</div>

						<div className="flex flex-col  w-full border border-gray-100 bg-gray-100 h-auto p-2 rounded-lg">
							<div>
								<h3 className="text-2xl py-2">Job Postings</h3>
							</div>
							<div className="flex flex-col md:flex-row gap-1">
								<div className="w-full md:w-1/4 border border-gray-50 bg-gray-50 h-28 p-2 rounded-lg">
									<h1 className="text-xl">Position</h1>
									<h2>experience required</h2>
									<p>job description</p>
								</div>
								<div className="w-full md:w-1/4 border border-gray-50 bg-gray-50 h-28 p-2 rounded-lg">
									<h1 className="text-xl">Position</h1>
									<h2>experience required</h2>
									<p>job description</p>
								</div>
								<div className="w-full md:w-1/4 border border-gray-50 bg-gray-50 h-28 p-2 rounded-lg">
									<h1 className="text-xl">Position</h1>
									<h2>experience required</h2>
									<p>job description</p>
								</div>
								<div className="w-full md:w-1/4 border border-gray-50 bg-gray-50 h-28 p-2 rounded-lg">
									<h1 className="text-5xl">+</h1>
									<h2>Post Jobs</h2>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
