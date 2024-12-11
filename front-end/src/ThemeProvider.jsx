import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import PropTypes from "prop-types";

const theme = createTheme({
	palette: {
		primary: {
			main: "#D68240",
			contrastText: "#fff", 
		},
		secondary: {
			main: "#F4DCC9",
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

RTLProvider.propTypes = {
	children: PropTypes.node.isRequired, // Validate that children is a valid React node
};

export default RTLProvider;
