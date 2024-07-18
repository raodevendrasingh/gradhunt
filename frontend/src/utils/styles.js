export const selectFieldStyle = {
    control: (provided) => ({
        ...provided,
        width: "100%",
        minHeight: "38px",
        borderRadius: "0.375rem",
        border: "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        color: "#4B5563",
        outline: "none",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "&:hover": {
            borderColor: "#E5E7EB",
        },
        "&:focus": {
            borderColor: "#E5E7EB",
            boxShadow: "none",
            outline: "none",
        },
    }),
    option: (provided) => ({
        ...provided,
        fontSize: "0.8rem",
    }),
};

export const selectCompanyFieldStyle = {
    control: (provided) => ({
        ...provided,
        width: "100%",
        minHeight: "38px",
        borderRadius: "0.5rem",
        backgroundColor: "#FFFFFF",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        color: "#4B5563",
        border: "2px solid #9ca3af",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "&:focus": {
            borderColor: "#3b82f6",
            boxShadow: "none",
            outline: "none",
        },
    }),
    option: (provided) => ({
        ...provided,
        fontSize: "0.8rem",
    }),
};