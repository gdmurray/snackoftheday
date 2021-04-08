const { fontFamily } = require("tailwindcss/defaultTheme")
const colors = require("tailwindcss/colors")

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    fontFamily: {
      "sans": ["Inter", ...fontFamily.sans],
      "serif": [...fontFamily.serif],
      "mono": [...fontFamily.mono]
    },
    colors: {
      ...colors
    },
    extend: {}
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
      fontWeight: ["active"],
      fontSize: ["active"]
    }
  },
  plugins: []
}
