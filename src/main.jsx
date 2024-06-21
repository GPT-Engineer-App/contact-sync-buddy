import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { TenantProvider } from "./contexts/TenantContext.jsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { RoleProvider } from "./contexts/RoleContext.jsx";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        backgroundImage: "url('/path/to/circular-pattern.png')",
        backgroundSize: "cover",
      },
    },
  },
});

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