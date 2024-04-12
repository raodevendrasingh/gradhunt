/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";
import colors from "tailwindcss/colors";
import form from "@tailwindcss/forms";

export default withMT({
	content: ["./index.html", "./src/**/*.{js,jsx}"],
	theme: {
		extend: {
			fontFamily: {
				Nunito: ["Nunito", "sans-serif"],
			},
			colors: colors,
		},
	},
	plugins: [form],
});
