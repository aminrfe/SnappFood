import React, { useState } from "react";
import "@fontsource/vazir";
import SignUp from "./components/User/SignUp";
import RTLProvider from "./ThemeProvider";
import Login from "./components/Login";

import "./App.css";

function App() {
  const [isLoginPage, setIsLoginPage] = useState(true);

  return (
    <div className="app-container">
      {isLoginPage ? (
        <RTLProvider>
          <Login onSwitch={() => setIsLoginPage(false)} />
        </RTLProvider>
      ) : (
        <RTLProvider>
          <SignUp onSwitch={() => setIsLoginPage(true)} />
        </RTLProvider>
      )}
    </div>
  );
}

export default App;
