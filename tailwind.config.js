/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#16a34a",
                    light: "#9FEDD7",
                    dark: "#1A8A63",
                },
                accent: {
                    DEFAULT: "#FFB84D",
                    light: "#FFDAA3",
                    dark: "#F29C1F",
                },
                nutriscore: {
                    a: "#038C4C",
                    b: "#85BB2F",
                    c: "#FECB02",
                    d: "#EF8200",
                    e: "#E63E11",
                },
            },
            fontFamily: {
                sans: ["Poppins_400Regular", "ui-sans-serif", "system-ui"],
                poppins: ["Poppins_400Regular"],
            },
        },
    },
    plugins: [],
};
