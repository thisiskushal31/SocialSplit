import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ChatProvider from "./Context/ChatProvider";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.render(
  <BrowserRouter forceRefresh={true}>
    <ChatProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ChatProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
