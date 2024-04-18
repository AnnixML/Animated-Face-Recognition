/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      'white': '#ffffff',
      'cyan': '#00ffff',
      'lightcyan': "#87d3f8",
      'magenta': "#ff00ff",
      'tangerine': "#f28500",
      'darkblue': "#203354",
      'pl': { //primary-light
        /*
        '50': '#f4f9f4',
        '100': '#e5f3e7',
        '200': '#cce6cf',
        '300': '#a4d1aa',
        '400': '#74b47c',
        '500': '#549e5e',
        '600': '#3e7b46', 
        '700': '#33623a', 
        '800': '#2c4f31',
        '900': '#26412b',
        '950': '#112214',
        */ //rest of color palette

        '1': '#e5f3e7', /* used for general background */
        '2': '#cce6cf', /* used for box backgrounds */
        '3': '#549e5e', /* text and border of buttons */
        '4': '#33623a', /* text in General */
    }, 'sl': { //secondary light
      //to be added
    }, 'pd': { //primary dark
      /*
      '50': '#f3f6f3',
      '100': '#e2eae1',
      '200': '#c5d6c4',
      '300': '#9db99c',
      '400': '#719673',
      '500': '#517853',
      '600': '#3d5e40',
      '700': '#304c33',
      '800': '#283d2a',
      '900': '#223224',
      '950': '#18251a',
      */ //rest of color palette
      '1': '#699374', /* used for general background */
      '2': '#1C3144', /* used for box backgrounds */
      '3': '#3A471F', /* text and border of buttons */
      '4': '#43464b', /* text in General */
      '5': '#23262b', /* text in General */
      '6': '#cccccc',
    }, 'sd': { //secondary dark
      //to be added
    }, 'abc': {
      '1': '#99adbe'
    }
  },
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'bocchi': "url('/makeit.jpg')",
      },
    },
  },
  plugins: [],
}