/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
        boxbackground: "rgb(var(--boxbackground))",
        boxheading: "rgb(var(--boxheading))",
        postsbuttoncolor: "rgb(var(--postsbuttoncolor))",
        text: "rgb(var(--text))",
        companyheader1: "rgb(var(--companyheader1))",
        companyheader2: "rgb(var(--companyheader2))",
        navbuttons: "rgb(var(--navbuttons))",
        overview: "rgb(var(--overview))",
        overviewcomponenttext: "rgb(var(--overviewcomponenttext))",
        postsslider: "rgb(var(--postsslider))",
        text2: "rgb(var(--text2))",
        modalbackground: "rgba(var(--modalbackground), 0.6)",
        sliderbutton: "rgb(var(--sliderbutton))",
        uploadimage: "rgb(var(--uploadimage))",
      },
    },
  },
  plugins: [],
};
