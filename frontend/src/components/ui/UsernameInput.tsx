import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { TbLoader } from "react-icons/tb";
import { useUsernameCheck } from "@/hooks/useUsernameCheck";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const UsernameInput = () => {
    const [inputFocused, setIsFocused] = useState<boolean>(false);
    const [, setValue] = useLocalStorage<string>('potentialUser', '');
    const navigate = useNavigate();

    const { register, handleSubmit, watch } = useForm<{ username: string }>();
    const { isCheckingUsername, usernameMsg, isFieldValid, checkUsername } = useUsernameCheck();

    const username = watch("username");

    const onSubmit = handleSubmit((data) => {
        if (isFieldValid && !isCheckingUsername) {
            setValue(data.username);
            navigate(`/signup`);
        }
    });

    return (
        <div className="mt-9">
            <form onSubmit={onSubmit} className="relative flex flex-col gap-4 items-center">
                <div
                    tabIndex={0}
                    className={`max-w-sm w-full pl-6 p-3 flex items-center h-14 justify-between transition duration-100 ease-in-out shadow transform border ${inputFocused ? "border-gray-800" : "border-gray-300"
                        } rounded-full text-neutral-600 bg-gray-50 hover:ring-4 hover:ring-green-200`}
                >
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <span className="text-lg">gradhunt.tech/</span>
                            <div className="relative">
                                <input
                                    {...register("username", {
                                        required: true,
                                        onChange: (e) => checkUsername(e.target.value),
                                    })}
                                    aria-label="Claim your username"
                                    placeholder="username"
                                    className="font-normal p-0 w-full text-lg bg-gray-50 placeholder:text-gray-400 placeholder:font-normal text-gray-800 outline-none ring-0 border-none !important"
                                    title="Claim your username!"
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            className="font-medium text-center transition-all ease-in duration-75 disabled:opacity-50 disabled:cursor-not-allowed flex items-center leading-120 select-none rounded-full justify-center text-base h-8 w-8 bg-gray-700 border border-t border-b-4 text-white border-gray-900 hover:bg-gray-800 border-none"
                            type="submit"
                            disabled={isCheckingUsername || !isFieldValid}
                            aria-label="Submit"
                        >
                            {isCheckingUsername ? <TbLoader /> : <FaArrowRight />}
                        </button>
                    </div>
                </div>
                <div className="h-6 text-center">
                    <div className="flex flex-col justify-center overflow-hidden">
                        {usernameMsg ? (
                            <p className="text-sm">{usernameMsg}</p>
                        ) : (
                            <p className="text-light font-normal text-sm">
                                Claim your username!
                            </p>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};