/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify the paths to all of the template files in your project
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}", // Adjust this based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1DA1F2",
        secondary: "#14171A",
        accent: "#F45D22",
      },
      spacing: {
        128: "32rem", // Custom spacing value
        144: "36rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      borderRadius: {
        "4xl": "2rem", // Custom border radius
      },
    },
  },
  // Add any Tailwind plugins you want to use
  plugins: [],
};
