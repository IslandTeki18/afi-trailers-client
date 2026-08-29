/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Barlow", "Helvetica", "Arial", "sans-serif"],
        display: ["'Barlow Condensed'", "Barlow", "Helvetica", "sans-serif"],
      },
      // Palette from the "Afi Trailer Rentals Redesign" design (direction 1a, dark yard).
      colors: {
        ink: {
          DEFAULT: "#14140F",
          2: "#1C1B15",
          rule: "#2E2C26",
          border: "#3A382F",
        },
        bone: {
          DEFAULT: "#F1EFE9",
          2: "#E7E4DC",
          3: "#E4E0D6",
          4: "#EDEAE3",
        },
        paper: "#FFFEFB",
        field: "#F7F5F0",
        cream: "#FBF3DF",
        sand: "#DCD8CE",
        rule: {
          DEFAULT: "#D6D2C8",
          2: "#C9C4B8",
          hair: "#F0EDE6",
        },
        amber: {
          DEFAULT: "#E0A612",
          mid: "#C08C0A",
          dark: "#8E660A",
          deep: "#3D2E06",
        },
        mute: {
          DEFAULT: "#6F6B62",
          2: "#8E8A80",
          3: "#9A958A",
          4: "#7E7A70",
          5: "#A5A096",
          6: "#B2ADA3",
        },
        body: {
          DEFAULT: "#3D3A33",
          2: "#55524A",
          3: "#4A473F",
        },
        rust: "#B3300E",
      },
      maxWidth: {
        site: "1200px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
