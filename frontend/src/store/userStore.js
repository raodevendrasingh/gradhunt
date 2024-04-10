import { create } from "zustand";

export const useStore = create((set) => ({
	userType: null,
	setUserType: (type) => set(() => ({ userType: type })),
	educationDetails: {},
	setEducationDetails: (details) => set(() => ({ educationDetails: details })),
	employmentDetails: {},
	setEmploymentDetails: (details) =>
		set(() => ({ employmentDetails: details })),
}));
