import { HashRouter } from "react-router-dom";
import App from "./App";
import SiteGate from "./pages/SiteGate";
import { AuthProvider } from "./state/authState";
import { AppProvider } from "./state/appState";
import { SiteGateProvider, useSiteGate } from "./state/siteGateState";

function SiteGateOrApp() {
  const { ready, unlocked } = useSiteGate();

  if (!ready) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-white text-sm text-slate-600">
        Загрузка…
      </div>
    );
  }

  if (!unlocked) {
    return <SiteGate />;
  }

  return (
    <AuthProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </AuthProvider>
  );
}

export default function Main() {
  return (
    <HashRouter>
      <SiteGateProvider>
        <SiteGateOrApp />
      </SiteGateProvider>
    </HashRouter>
  );
}

