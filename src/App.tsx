import React, { useContext } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider, { AuthContext } from "./context/auth.context";
import Login from "./Login";
import Container from "./Container";

function Router() {
  const authCtx = useContext(AuthContext);
  return (
    <BrowserRouter>
      {!authCtx.state.authenticated ? <Login /> : <Container />}
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  );
}

export default App;
