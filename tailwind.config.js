/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/routes/*.tsx",
    "./src/components/**/*.tsx",
    "./src/features/**/components/**/*.tsx",
    "./src/features/**/routes/**/*.tsx",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

