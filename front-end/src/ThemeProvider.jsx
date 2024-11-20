import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import "@fontsource/vazir";

const theme = createTheme({
	typography: {
		fontFamily: "Vazir, sans-serif",
	},
	direction: "rtl",
});

const rtlCache = createCache({
  key: "mui",
  stylisPlugins: [rtlPlugin]
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
