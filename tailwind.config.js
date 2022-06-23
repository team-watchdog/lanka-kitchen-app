module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./containers/**/*.{js,ts,jsx,tsx}",
  ],
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        "brand-primary": "#244583",
        "primary-color": "#0891b2",
        "secondary-color": "#08B27E",
        "warning-color": "#f59e0b",
        "danger-color": "#dc2626",
        "default-color": "#334155",
      }
    },
  },
  plugins: [],
}
