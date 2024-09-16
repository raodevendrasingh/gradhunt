export default function FeedPostsPage() {
    return (
		<div className="flex h-full">
			{/* main */}
			<div className="w-full lg2:w-[70%] overflow-y-auto scrollbar-hide p-4">
				Feed Posts
			</div>
			{/* sidebar */}
			<div className="hidden lg2:flex flex-col gap-2 w-64 xl:w-[25%] h-full border-x scrollbar-hide overflow-y-auto p-4">
				Trending Posts
			</div>
		</div>
	);
}