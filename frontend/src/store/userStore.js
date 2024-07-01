import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const UserStore = (set) => ({
    userType: localStorage.getItem('userType') || null,
    setUserType: (userType) => {
        localStorage.setItem('userType', userType);
        set({ userType });
    },
    userName: null,
    setUserName: (userName) => {
        localStorage.setItem('userName', userName);
        set({ userName })
    },
    userID: null,
    setUserID: (userID) => {
        localStorage.setItem('userID', userID);
        set({ userID });
    }
});

export const useStore = create(
    devtools(
        persist(UserStore, {
            name: "userStorage",
        })
    )
);