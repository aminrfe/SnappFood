import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";

const theme = createTheme({
	palette: {
		primary: {
			main: "#D68240", // Your custom primary color
			contrastText: "#fff", // Optional: text color for better contrast
		},
		secondary: {
			main: "#F4DCC9", // Example secondary color
		},
	},
	typography: {
		fontFamily: "Vazir, sans-serif",
	},
	direction: "rtl",
});

const rtlCache = createCache({
	key: "mui",
	stylisPlugins: [rtlPlugin],
});

const RTLProvider = ({ children }) => (
	<CacheProvider value={rtlCache}>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	</CacheProvider>
);

export default RTLProvider;
