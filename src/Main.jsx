// The previous navbar is kept at ./components/Navbar for an easy revert —
// swap the import below to bring it back.
import Navbar from "./components/NavbarNew";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useEffect, useState } from "react";
import LoadingOverlay from "./components/LoadingOverlay";

// Import Admin Components
import { AuthProvider } from "./admin/context/AuthContext";
import PrivateRoute from "./admin/components/PrivateRoute";
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import ProjectList from "./admin/pages/ProjectList";
import CreateProject from "./admin/pages/CreateProject";
import EditProject from "./admin/pages/EditProject";
import ProjectsPage from "./pages/ProjectsPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import AboutPage from "./pages/AboutPage";
import TeamList from "./admin/pages/TeamList";
import TeamForm from "./admin/pages/TeamForm";
import ContactPage from "./pages/ContactPage";
import LegalPage from "./pages/LegalPage";
import ClientList from "./admin/pages/ClientList";
import ClientForm from "./admin/pages/ClientForm";
import TestimonyList from "./admin/pages/TestimonyList";
import TestimonyForm from "./admin/pages/TestimonyForm";
import api from "./services/api";
import contentData from "./data/content.json";

const Main = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [backendReady, setBackendReady] = useState(false);

  // Check if current route is admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Check backend on initial load
  useEffect(() => {
    if (isAdminRoute) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setBackendReady(false);

    // Hit a lightweight endpoint to verify the backend is up, and keep asking
    // until it is. Letting people through on a failed check meant they landed
    // on a site with no projects, no team and no clients — every section either
    // empty or missing, with nothing to say why. Holding the screen is the
    // honest state.
    let stopped = false;
    let attempt = 0;
    let timer;

    const ask = () => {
      api
        .get("/teams/")
        .then(() => {
          if (!stopped) setBackendReady(true);
        })
        .catch(() => {
          if (stopped) return;
          attempt += 1;
          // Backing off to a ceiling: quick retries while it is probably just
          // starting up, then a slower pulse rather than hammering a server
          // that is genuinely down.
          const wait = Math.min(1000 * 2 ** (attempt - 1), 8000);
          console.warn(
            `Backend check failed (attempt ${attempt}), retrying in ${wait}ms`,
          );
          timer = setTimeout(ask, wait);
        });
    };

    ask();

    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, []);

  // The overlay now holds the screen until the sound question is answered, so
  // it says when the page behind it may be shown rather than a timer guessing.

  // Announced so the hero can stand its starfield down while the loading
  // screen is up: the screen draws one of its own, and the hero's would
  // otherwise be running underneath it for the whole of the wait.
  useEffect(() => {
    document.documentElement.dataset.booting = loading ? "true" : "false";
    window.dispatchEvent(
      new CustomEvent("fibi:booting", { detail: { booting: loading } }),
    );
  }, [loading]);

  return (
    <AuthProvider>
      {/* Only show loading overlay for non-admin routes */}
      {!isAdminRoute && (
        <LoadingOverlay
          isActive={loading}
          backendReady={backendReady}
          onFinish={() => setLoading(false)}
        />
      )}

      {/* Conditionally render public layout wrapper */}
      {isAdminRoute ? (
        // Admin routes - no navbar/footer
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <PrivateRoute>
                <ProjectList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/projects/create"
            element={
              <PrivateRoute>
                <CreateProject />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/projects/edit/:id"
            element={
              <PrivateRoute>
                <EditProject />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/team"
            element={
              <PrivateRoute>
                <TeamList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/team/create"
            element={
              <PrivateRoute>
                <TeamForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/team/edit/:id"
            element={
              <PrivateRoute>
                <TeamForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/clients"
            element={
              <PrivateRoute>
                <ClientList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/clients/create"
            element={
              <PrivateRoute>
                <ClientForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/clients/edit/:id"
            element={
              <PrivateRoute>
                <ClientForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/testimonies"
            element={
              <PrivateRoute>
                <TestimonyList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/testimonies/create"
            element={
              <PrivateRoute>
                <TestimonyForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/testimonies/edit/:id"
            element={
              <PrivateRoute>
                <TestimonyForm />
              </PrivateRoute>
            }
          />
        </Routes>
      ) : (
        // Public routes - with navbar/footer
        <div
          className={`${
            loading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300 flex flex-col min-h-screen`}
        >
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              {/* Services has no index of its own any more — the navbar panel
                  is the way in. Anything still pointing at /services lands on
                  the first service rather than a blank page. */}
              <Route
                path="/services"
                element={
                  <Navigate
                    to={`/services/${contentData.services[0].slug}`}
                    replace
                  />
                }
              />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route
                path="/privacy-policy"
                element={<LegalPage title="Privacy Policy" />}
              />
              <Route
                path="/terms-and-conditions"
                element={<LegalPage title="Terms and Conditions" />}
              />
              {/* <Route path="/projects/:id" element={<ProjectDetails />} /> */}
              {/* <Route path="*" element={<HomePage />} /> */}
            </Routes>
          </main>
        </div>
      )}
    </AuthProvider>
  );
};

export default Main;
