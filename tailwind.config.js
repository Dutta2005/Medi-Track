module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./App.js"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        light: {
          bg: "#ffffff", // White
          text: "#1e1c16", // Dark Brown
          card: "#ffffff", // White
          cardText: "#1e1c16", // Dark Brown
          popover: "#ffffff", // White
          popoverText: "#1e1c16", // Dark Brown
          primary: "#ff9800", // Orange
          primaryText: "#f7f9eb", // Light Cream
          secondary: "#f7f7eb", // Off White
          secondaryText: "#3d2b13", // Deep Brown
          muted: "#f7f7eb", // Off White
          mutedText: "#716f65", // Gray Brown
          accent: "#f7f7eb", // Off White
          accentText: "#3d2b13", // Deep Brown
          destructive: "#d32f2f", // Red
          destructiveText: "#f7f9eb", // Light Cream
          border: "#e5e5e5", // Light Gray
          input: "#e5e5e5", // Light Gray
          ring: "#ff9800", // Orange
          chart1: "#e5733b", // Burnt Orange
          chart2: "#0f8568", // Teal
          chart3: "#143e55", // Deep Blue
          chart4: "#f0c63b", // Mustard Yellow
          chart5: "#f7a83b", // Golden Orange
        },
        dark: {
          bg: "#1e1c16", // Dark Brown
          text: "#f7f9eb", // Light Cream
          card: "#1e1c16", // Dark Brown
          cardText: "#f7f9eb", // Light Cream
          popover: "#1e1c16", // Dark Brown
          popoverText: "#f7f9eb", // Light Cream
          primary: "#ff8f00", // Deep Orange
          primaryText: "#f7f9eb", // Light Cream
          secondary: "#30241a", // Coffee Brown
          secondaryText: "#f7f9eb", // Light Cream
          muted: "#30241a", // Coffee Brown
          mutedText: "#9f8b76", // Tan
          accent: "#30241a", // Coffee Brown
          accentText: "#f7f9eb", // Light Cream
          destructive: "#d32f2f", // Red
          destructiveText: "#f7f9eb", // Light Cream
          border: "#30241a", // Coffee Brown
          input: "#30241a", // Coffee Brown
          ring: "#ff8f00", // Deep Orange
          chart1: "#1976d2", // Bright Blue
          chart2: "#1a9273", // Dark Teal
          chart3: "#e6a03b", // Warm Yellow
          chart4: "#9b48d2", // Purple
          chart5: "#e03570", // Pinkish Red
        },
      }
      
    },
  },
  plugins: [],
}

