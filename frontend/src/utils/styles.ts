export const selectFieldStyle = {
    control: (provided: any) => ({
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
    option: (provided: any) => ({
        ...provided,
        fontSize: "0.8rem",
    }),
};

export const selectCompanyFieldStyle = {
    control: (provided: any) => ({
        ...provided,
        width: "100%",
        padding: "0px 2px",
        minHeight: "38px",
        borderRadius: "0.5rem",
        backgroundColor: "#FFFFFF",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        color: "#4B5563",
        border: "1px solid #9ca3af",
        boxShadow: "0 1px 1px 0 rgba(0, 0, 0, 0.05)",
        "&:focus": {
            borderColor: "#3b82f6",
            boxShadow: "none",
            outline: "none",
        },
    }),
    option: (provided: any) => ({
        ...provided,
        fontSize: "0.8rem",

    }),
};


export const inputSearchFieldStyle = {
    control: (provided: any) => ({
        ...provided,
        width: '100%',
        minHeight: '38px',
        border: 'none',
        boxShadow: 'none',
        '&:hover': {
            border: 'none',
        },
    }),
    valueContainer: (provided: any) => ({
        ...provided,
        padding: '0 8px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    }),
    input: (provided: any) => ({
        ...provided,
        margin: '0',
        padding: '0',
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: '#9CA3AF',
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: '#1F2937',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    }),
    option: (provided: any, state: { isSelected: any; isFocused: any; }) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#2563EB' : state.isFocused ? '#BFDBFE' : 'white',
        color: state.isSelected ? 'white' : '#1F2937',
        '&:active': {
            backgroundColor: '#2563EB',
            color: 'white',
        },
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        padding: '0 8px',
    }),
};


export const skillSearchFieldStyle = {
    control: (provided: any) => ({
        ...provided,
        width: '100%',
        minHeight: '38px',
        border: 'none',
        boxShadow: 'none',
        '&:hover': {
            border: 'none',
        },
    }),
    valueContainer: (provided: any) => ({
        ...provided,
        padding: '0 8px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    }),
    input: (provided: any) => ({
        ...provided,
        margin: '0',
        padding: '0',
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: '#9CA3AF',
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: '#1F2937',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    }),
    option: (provided: any, state: { isSelected: any; isFocused: any; }) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#2563EB' : state.isFocused ? '#BFDBFE' : 'white',
        color: state.isSelected ? 'white' : '#1F2937',
        '&:active': {
            backgroundColor: '#2563EB',
            color: 'white',
        },
        fontSize: '12px'
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        padding: '0 8px',
    }),
    menu: (provided: any) => ({
        ...provided,
        zIndex: 2,
    }),

};