module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./docs/**/*.mdx"],
    theme: {
        extend: {},
    },
    plugins: [],
    darkMode: '[data-theme="dark"]',
    corePlugins: {
        preflight: false, // Docusaurus has its own reset
    },
};
