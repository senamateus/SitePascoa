/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.html",  // Procura em todos os arquivos HTML
    "./**/*.js",    // Procura em todos os arquivos JS
  ],
  theme: {
    fontFamily:{
      'sans': ['Roboto', 'sans-serif']
    },
    extend: {
      backgroundImage:{
        "home": "url('/assets/brigadeiro.png')"
      }
    },
  },
  plugins: [],
}

