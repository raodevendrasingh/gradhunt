import axios from "axios";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

const isValidSlug = (companySlug: string): boolean => {
    return companySlug.length < 32 && /^[a-z0-9-]+$/.test(companySlug);
};

export const useCompanySlugCheck = () => {
    const [isCheckingSlug, setIsCheckingSlug] = useState<boolean>(false);
    const [companySlugMsg, setSlugMsg] = useState<string>("");
    const [isFieldValid, setIsFieldValid] = useState<boolean>(false);

    const checkSlug = useDebounceCallback(
        async (companySlug: string) => {
            if (companySlug.length > 4 && isValidSlug(companySlug)) {
                setIsCheckingSlug(true);
                setSlugMsg("");
                try {
                    const url = `/api/users/check-company-slug/?companySlug=${companySlug}`;                    
                    const response = await axios.get(url);
                    if (response.data.exists) {
                        setSlugMsg("This URL is already taken, choose something else!");
                        setIsFieldValid(false);
                    } else {
                        setSlugMsg("This URL is available!");
                        setIsFieldValid(true);
                    }
                } catch (error) {
                    setSlugMsg("Error checking URL!");
                    setIsFieldValid(false);
                } finally {
                    setIsCheckingSlug(false);
                }
            } else {
                setIsFieldValid(false);
                setSlugMsg("");
            }
        },
        500
    );

    return { isValidSlug, isCheckingSlug, companySlugMsg, isFieldValid, checkSlug };
};