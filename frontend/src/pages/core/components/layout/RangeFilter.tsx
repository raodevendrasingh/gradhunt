import React, { useState } from "react";
import { motion } from "framer-motion";
import { currency as currencyOptions } from "@/utils/selectObjects";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { Controller } from "react-hook-form";

interface RangeFilterProps {
    control: any;
    title: string;
    type: "experience" | "salary";
    field: "experience" | "expectedSalary";
}

interface RangeValue {
    min: string;
    max: string;
    currency?: string;
}

export const RangeFilter: React.FC<RangeFilterProps> = ({
    control,
    title,
    type,
    field,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col gap-2 py-3 px-4 border-b">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-gray-800 font-medium text-base select-none">
                    {title}
                </span>

                {isOpen ? (
                    <FaChevronUp className="text-gray-500" />
                ) : (
                    <FaChevronDown className="text-gray-500" />
                )}
            </div>

            <motion.div
                initial={false}
                animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                }}
                className="overflow-hidden"
            >
                <div className="flex flex-col gap-4 p-2">
                    <Controller
                        name={field}
                        control={control}
                        render={({ field: { value, onChange } }) => {
                            // Ensure value is in the correct format
                            const currentValue: RangeValue =
                                Array.isArray(value) && value[0]
                                    ? parseRangeValue(value[0], type)
                                    : {
                                        min: "",
                                        max: "",
                                        currency: type === "salary" ? "INR" : undefined,
                                    };

                            return (
                                <>
                                    <div className="flex flex-col space-y-2">
                                        <label className="text-gray-700 text-sm">Min</label>
                                        <input
                                            type="text"
                                            value={currentValue.min}
                                            onChange={(e) => {
                                                const updatedValue = {
                                                    ...currentValue,
                                                    min: e.target.value,
                                                };
                                                onChange([updatedValue]);
                                            }}
                                            placeholder={
                                                type === "experience" ? "Min years" : "Minimum amount"
                                            }
                                            className="w-full py-1.5 bg-gray-50 border border-gray-300 hover:border-gray-500 text-gray-800 text-sm rounded-lg focus:ring focus:ring-gray-100 focus:border-gray-500 block transition duration-200"
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <label className="text-gray-700 text-sm">Max</label>
                                        <input
                                            type="text"
                                            value={currentValue.max}
                                            onChange={(e) => {
                                                const updatedValue = {
                                                    ...currentValue,
                                                    max: e.target.value,
                                                };
                                                onChange([updatedValue]);
                                            }}
                                            placeholder={
                                                type === "experience" ? "Max years" : "Maximum amount"
                                            }
                                            className="w-full py-1.5 bg-gray-50 border border-gray-300 hover:border-gray-500 text-gray-800 text-sm rounded-lg focus:ring focus:ring-gray-100 focus:border-gray-500 block transition duration-200"
                                        />
                                    </div>

                                    {type === "salary" && (
                                        <div className="flex flex-col space-y-2">
                                            <label className="text-gray-700 text-sm">Currency</label>
                                            <select
                                                value={currentValue.currency || "INR"}
                                                onChange={(e) => {
                                                    const updatedValue = {
                                                        ...currentValue,
                                                        currency: e.target.value,
                                                    };
                                                    onChange([updatedValue]);
                                                }}
                                                className="w-full py-1.5 bg-gray-50 border border-gray-300 hover:border-gray-500 text-gray-800 text-sm rounded-lg focus:ring focus:ring-gray-100 focus:border-gray-500 block transition duration-200"
                                            >
                                                {currencyOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </>
                            );
                        }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

function parseRangeValue(
    value: string | RangeValue,
    type: "experience" | "salary"
): RangeValue {
    // If already an object, return as-is
    if (typeof value === 'object' && 'min' in value) {
        return value;
    }

    // If empty or undefined
    if (!value)
        return {
            min: "",
            max: "",
            currency: type === "salary" ? "INR" : "",
        };

    // If still a string
    const parts = value.toString().split("-");
    if (type === "experience") {
        return {
            min: parts[0] || "",
            max: parts[1] || "",
        };
    }

    // Salary case
    const currencyMatch = value.toString().match(/\s([A-Z]{3})$/);
    const currency = currencyMatch ? currencyMatch[1] : "INR";

    return {
        min: parts[0] || "",
        max: parts[1]?.split(" ")[0] || "",
        currency: currency,
    };
}