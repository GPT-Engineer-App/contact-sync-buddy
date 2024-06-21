import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { TenantProvider } from "./contexts/TenantContext.jsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { RoleProvider } from "./contexts/RoleContext.jsx";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const theme = extendTheme({ colors });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <TenantProvider>
          <RoleProvider>
            <App />
          </RoleProvider>
        </TenantProvider>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
