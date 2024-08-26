import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";

import axios from "axios";
import { Outlet } from "react-router-dom";

import { Header } from "@/components/common/Header";
import { useStore } from "@/store/userStore";
import { UserOnboardingModal } from "@/components/common/OnboardingModal";

export default function CandidateLayout() {
    const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
    const { isSignedIn, user } = useUser();
    const signInUser = useStore((state) => state.signInUser);

    const { signOut } = useClerk();

    const fetchAndRedirectUser = async () => {
        if (isSignedIn) {
            const username = user.username || "";
            const email = user?.primaryEmailAddress?.emailAddress;
            try {
                const url = `/api/get-usertype/?email=${email}`;
                const response = await axios.get(url);
                const usertype = response.data.usertype;

                signInUser(username, usertype); // load username and usertype in local storage

                // redirect user to respective sign in page if the usertype dont match
                const redirectMap: { [key: string]: string } = {
                    recruiter: import.meta.env.VITE_BASE_RECRUITER_URL,
                    admin: import.meta.env.VITE_BASE_ADMIN_URL
                };

                if (redirectMap[usertype]) {
                    signOut()
                        .then(() => {
                            window.location.href = redirectMap[usertype];
                        })
                        .catch((error: any) => {
                            console.error("Error signing out:", error);
                        });
                }
            } catch (error) {
                console.error("Error fetching user type:", error);
            }
        }
    };

    useEffect(() => {
        // fetchAndRedirectUser();
        if (isSignedIn) {
            if (!user.username || !user.firstName || !user.lastName) {
                setIsOnboardingModalOpen(true);
            }
        }
    }, [isSignedIn, user]);

    return (
        <main>
            <Header />
            <Outlet />
            <div>
                <UserOnboardingModal
                    isOnboardingModalOpen={isOnboardingModalOpen}
                    setIsOnboardingModalOpen={setIsOnboardingModalOpen}
                />
            </div>
        </main>
    );
}
