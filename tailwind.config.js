/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/shared/ui/*.tsx",
    "./src/features/**/components/**/*.tsx",
    "./src/features/**/pages/**/*.tsx",
    "./src/app/**/*.tsx",
    "./src/app/*.tsx",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
