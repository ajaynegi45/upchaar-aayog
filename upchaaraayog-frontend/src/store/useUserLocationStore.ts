import {create} from "zustand";
import {Location} from "./types";

interface UserLocationState {
    location: Location;
    setLocation: (location: Location) => void;
}

export const useUserLocationStore = create<UserLocationState>((set) => ({
    location: {
        state: "Delhi",
        district: "South",
        pincode: "",
    },
    setLocation: (location) => set({location}),
}));
