import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import colorThemes from "./colorThemes.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="556014740957-h25lvbpu8uo25bbu89r5lmj4bepppgc8.apps.googleusercontent.com">
      <ChakraProvider theme={colorThemes}>
        <App />
      </ChakraProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
