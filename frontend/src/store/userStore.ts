import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const UserStore = (set: (arg0: { userType?: string; userName?: string; }) => void) => ({

    userType: localStorage.getItem('userType') || null,
    setUserType: (userType: string) => {
        localStorage.setItem('userType', userType);
        set({ userType });
    },
    userName: localStorage.getItem('userName') || null,
    setUserName: (userName: string) => {
        localStorage.setItem('userName', userName);
        set({ userName })
    },
    signInUser: (username: string, usertype: string) => {
        UserStore(set).setUserName(username);
        UserStore(set).setUserType(usertype);
    }
});

export const useStore = create(
    devtools(
        persist(UserStore, {
            name: "gradhunt_user",
        })
    )
);