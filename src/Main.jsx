import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
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
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import TeamList from "./admin/pages/TeamList";
import TeamForm from "./admin/pages/TeamForm";
import ContactPage from "./pages/ContactPage";

const Main = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [phaseTimer] = useState(600);

  // Check if current route is admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Initial load
  useEffect(() => {
    setLoading(true);
    const totalTime = phaseTimer + 180 + phaseTimer + 50;
    const timer = setTimeout(() => setLoading(false), totalTime);
    return () => clearTimeout(timer);
  }, []);

  // Route changes
  useEffect(() => {
    // Don't show loading overlay for admin routes
    if (!isAdminRoute) {
      setLoading(true);
      const totalTime = phaseTimer + 180 + phaseTimer + 50;
      const timer = setTimeout(() => setLoading(false), totalTime);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isAdminRoute]);

  return (
    <AuthProvider>
      {/* Only show loading overlay for non-admin routes */}
      {!isAdminRoute && (
        <LoadingOverlay isActive={loading} phaseTimer={phaseTimer} />
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
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
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
