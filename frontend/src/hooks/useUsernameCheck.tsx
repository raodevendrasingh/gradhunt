import axios from "axios";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

export const useUsernameCheck = () => {
    const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
    const [usernameMsg, setUsernameMsg] = useState<string>("");
    const [isFieldValid, setIsFieldValid] = useState<boolean>(false);

    const checkUsername = useDebounceCallback(
        async (username: string) => {
            if (username.length > 3) {
                setIsCheckingUsername(true);
                setUsernameMsg("");
                try {
                    const url = `/api/check-username?username=${username}`;
                    const response = await axios.get(url);
                    if (response.data.exists) {
                        setUsernameMsg("This username is already taken, choose something else.😞");
                        setIsFieldValid(false);
                    } else {
                        setUsernameMsg("This username is available! 🎉");
                        setIsFieldValid(true);
                    }
                } catch (error) {
                    setUsernameMsg("Error checking username");
                    setIsFieldValid(false);
                } finally {
                    setIsCheckingUsername(false);
                }
            } else {
                setIsFieldValid(false);
                setUsernameMsg("");
            }
        },
        500
    );

    return { isCheckingUsername, usernameMsg, isFieldValid, checkUsername };
};