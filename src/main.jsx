import { HashRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./state/authState";
import { AppProvider } from "./state/appState";

export default function Main() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthProvider>
    </HashRouter>
  );
}
