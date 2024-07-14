export const CandidatesPool = () => {
	return (
		<div className="w-full pt-24 mx-auto h-screen border">
			<div className="max-w-7xl mx-auto lg:ml-64 h-[80vh] border">
				<div className="max-w-5xl mx-auto h-[80vh] flex flex-wrap justify-start gap-3 px-3 border">
					{/* user card */}
					<div className="w-56 h-64 border rounded-lg flex flex-col items-center p-4">
						<img
							src="https://via.placeholder.com/100"
							alt="User"
							className="w-24 h-24 rounded-full"
						/>
						<h2 className="text-xl mt-4">Jason Roy</h2>
						<p className="text-sm mt-2">jason.roy@email.com</p>
					</div>
				</div>
			</div>
		</div>
	);
};
