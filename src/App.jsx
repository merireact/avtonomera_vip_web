import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Favorites from "./pages/Favorites";
import Reviews from "./pages/Reviews";
import Contacts from "./pages/Contacts";
import Transfer from "./pages/Transfer";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminLayout from "./pages/Admin/AdminLayout";
import RequireManager from "./pages/Admin/RequireManager";
import AdminPlates from "./pages/Admin/AdminPlates";
import AdminReviews from "./pages/Admin/AdminReviews";
import AdminRequests from "./pages/Admin/AdminRequests";

const pageVariants = {
  initial: { opacity: 0, y: 10, filter: "blur(6px)" },
  enter: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(6px)" },
};

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

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

function PublicSite() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <Header />

      <div className="flex-1 pt-20 sm:pt-24">
        <AnimatePresence mode="wait" initial={false}>
          <Outlet key={location.pathname + location.search} />
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<RequireManager />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="plates" replace />} />
          <Route path="plates" element={<AdminPlates />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="requests" element={<AdminRequests />} />
        </Route>
      </Route>
      <Route path="/" element={<PublicSite />}>
        <Route
          index
          element={
            <Page>
              <Home />
            </Page>
          }
        />
        <Route
          path="catalog"
          element={
            <Page>
              <Catalog />
            </Page>
          }
        />
        <Route
          path="favorites"
          element={
            <Page>
              <Favorites />
            </Page>
          }
        />
        <Route
          path="reviews"
          element={
            <Page>
              <Reviews />
            </Page>
          }
        />
        <Route
          path="contacts"
          element={
            <Page>
              <Contacts />
            </Page>
          }
        />
        <Route
          path="transfer"
          element={
            <Page>
              <Transfer />
            </Page>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    </>
  );
}
