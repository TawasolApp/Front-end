/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mainBackground: "rgb(var(--main-background))",
        cardBackground: "rgb(var(--card-background))",
        cardBackgroundHover: "rgb(var(--card-background-hover))",
        cardBorder: "rgb(var(--card-border))",
        itemBorder: "rgb(var(--item-border))",
        itemBorderFocus: "rgb(var(--item-border-focus))",

        textTitle: "rgb(var(--text-title))",
        textHeavyTitle: "rgb(var(--text-heavy-title))",
        textHeavyTitleHover: "rgb(var(--text-heavy-title-hover))",
        textDate: "rgb(var(--text-date))",
        textBreakpoint: "rgb(var(--text-breakpoint))",
        textContent: "rgb(var(--text-content))",
        textPlaceholder: "rgb(var(--text-placeholder))",
        textPlaceholderHover: "rgb(var(--text-placeholder-hover))",
        textActivity: "rgb(var(--text-activity))",
        textActivityHover: "rgb(var(--text-activity-hover))",
        textLightActivity: "rgb(var(--text-light-activity))",

        header: "rgb(var(--header))",

        authorName: "rgb(var(--author-name))",
        authorNameHover: "rgb(var(--author-name-hover))",
        authorBio: "rgb(var(--author-bio))",
        form: "rgb(var(--form))",
        icon: "rgb(var(--icon))",
        buttonIconHover: "rgb(var(--button-icon-hover))",

        buttonSubmitDisable: "rgb(var(--button-submit-disable))",
        buttonSubmitEnable: "rgb(var(--button-submit-enable))",
        buttonSubmitEnableHover: "rgb(var(--button-submit-enable-hover))",
        buttonSubmitText: "rgb(var(--button-submit-text))",

        listSelected: "rgb(var(--list-selected))",
      }
    },
  },
  plugins: [],
}
