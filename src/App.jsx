import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Favorites from "./pages/Favorites";
import Reviews from "./pages/Reviews";
import Contacts from "./pages/Contacts";
import Transfer from "./pages/Transfer";
import { AppProvider } from "./state/appState";

const pageVariants = {
  initial: { opacity: 0, y: 10, filter: "blur(6px)" },
  enter: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(6px)" },
};

function Page({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="px-4 sm:px-6 lg:px-10"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <AppProvider>
      <div className="app-shell">
        <Header />

        <div className="flex-1 pt-20 sm:pt-24">
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname + location.search}>
              <Route
                path="/"
                element={
                  <Page>
                    <Home />
                  </Page>
                }
              />
              <Route
                path="/catalog"
                element={
                  <Page>
                    <Catalog />
                  </Page>
                }
              />
              <Route
                path="/favorites"
                element={
                  <Page>
                    <Favorites />
                  </Page>
                }
              />
              <Route
                path="/reviews"
                element={
                  <Page>
                    <Reviews />
                  </Page>
                }
              />
              <Route
                path="/contacts"
                element={
                  <Page>
                    <Contacts />
                  </Page>
                }
              />
              <Route
                path="/transfer"
                element={
                  <Page>
                    <Transfer />
                  </Page>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>

        <Footer />
      </div>
    </AppProvider>
  );
}

