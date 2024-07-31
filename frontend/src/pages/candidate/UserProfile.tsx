import { useUser } from "@clerk/clerk-react";

export default function UserProfile () : JSX.Element {
    const { isSignedIn, user } = useUser();
    return  (
        <div className="pt-32">
            This is the user's profile page / portfolio
            <div className="flex flex-col">
				<span>username: {user?.username}</span>
				<span>firstname: {user?.firstName}</span>
				<span>primary-email: {user?.primaryEmailAddress?.toString()}</span>
			</div>
        </div>
    )
}