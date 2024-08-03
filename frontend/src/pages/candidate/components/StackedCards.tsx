export const StackedCards = () => {
	return (
		<div className="flex flex-col gap-1">
			<div>
				<div className="border border-gray-gray2 rounded-md w-full px-4 pt-4 pb-8 flex gap-2 bg-gray-gray1">
					<div className="flex"></div>
					<p className="text-primary font-normal text-xs">
						We have some recommendations to improve your profile.
					</p>
				</div>
				<div className="flex flex-col-reverse relative mt-12">
					<div className="flex relative -mt-[72px] hover:z-50">
						<a href="/scroll" className="">
							<div className="w-full p-4 bg-white flex gap-2 items-center group border border-gray-gray2 rounded-md cursor-pointer transition-all hover:border-primary shadow-[0px_4px_16px_0px_rgba(33,33,33,0.05)] duration-200 ease-in-out">
								<div className="flex flex-col gap-2 flex-shrink">
									<p className="text-gray-gray1k font-semibold text-xs uppercase">
										Write Your First Post
									</p>
									<p className="text-light font-normal text-xs">
										First post can be about you creating your Peerlist profile!
									</p>
									<p className="text-gray-gray1k font-semibold text-[10px] uppercase group-hover:underline">
										Post <span>→</span>
									</p>
								</div>
								<div className="flex flex-shrink-0"></div>
							</div>
						</a>
					</div>
					<div className="flex relative -mt-[72px] hover:z-50">
						<a href="/raodevendrasinh/about" className="">
							<div className="w-full p-4 bg-white flex gap-2 items-center group border border-gray-gray2 rounded-md cursor-pointer transition-all hover:border-primary shadow-[0px_4px_16px_0px_rgba(33,33,33,0.05)] duration-200 ease-in-out">
								<div className="flex flex-col gap-2 flex-shrink">
									<p className="text-gray-gray1k font-semibold text-xs uppercase">
										Tell Us About You
									</p>
									<p className="text-light font-normal text-xs">
										And your favourite books, podcasts, videos, links etc.
									</p>
									<p className="text-gray-gray1k font-semibold text-[10px] uppercase group-hover:underline">
										About <span>→</span>
									</p>
								</div>
								<div className="flex flex-shrink-0"></div>
							</div>
						</a>
					</div>
					<div className="flex relative -mt-[72px] hover:z-50">
						<a href="/user/settings/profile" className="">
							<div className="w-full p-4 bg-white flex gap-2 items-center group border border-gray-gray2 rounded-md cursor-pointer transition-all hover:border-primary shadow-[0px_4px_16px_0px_rgba(33,33,33,0.05)] duration-200 ease-in-out">
								<div className="flex flex-col gap-2 flex-shrink">
									<p className="text-gray-gray1k font-semibold text-xs uppercase">
										Complete Basic Profile
									</p>
									<p className="text-light font-normal text-xs">
										Make sure you add website, profile tags and social links.
									</p>
									<p className="text-gray-gray1k font-semibold text-[10px] uppercase group-hover:underline">
										Update Profile <span>→</span>
									</p>
								</div>
								<div className="flex flex-shrink-0"></div>
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};
