/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./**/*.html",    // Tracks HTML files nested inside any subfolders
    "./js/**/*.js",   // Tracks all JS files in your js folders
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}