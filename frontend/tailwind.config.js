/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";
import colors from 'tailwindcss/colors'

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
	plugins: [],
});
