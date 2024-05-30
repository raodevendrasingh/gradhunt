/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";
import colors from "tailwindcss/colors";
import form from "@tailwindcss/forms";

export default withMT({
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
    important: true,
	theme: {
		extend: {
			fontFamily: {
                NotoSans: ["Noto Sans", "sans-serif"],
			},
			colors: colors,
			screens: {
				xs: "475px",
				// => @media (min-width: 992px) { ... }
			},
		},
	},
	plugins: [form],
});
