import { create } from "zustand";

export const useStore = create((set) => ({
    userType: localStorage.getItem('userType') || null,
    setUserType: (userType) => {
        localStorage.setItem('userType', userType);
        set({ userType });
    },
	userName: null,
	setUserName: (uname) => set(() => ({ userName: uname })),
}));
