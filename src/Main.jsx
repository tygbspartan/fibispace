import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/AboutUs";
import Contact from "./pages/Contact";
import { useEffect, useState } from "react";
import LoadingOverlay from "./components/LoadingOverlay";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";

// Import Admin Components
import { AuthProvider } from "./admin/context/AuthContext";
import PrivateRoute from "./admin/components/PrivateRoute";
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import ProjectList from "./admin/pages/ProjectList";
import CreateProject from "./admin/pages/CreateProject";
import EditProject from "./admin/pages/EditProject";

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
        </Routes>
      ) : (
        // Public routes - with navbar/footer
        <div
          className={`${
            loading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300 flex flex-col min-h-screen md:mx-24`}
        >
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
        </div>
      )}
    </AuthProvider>
  );
};

export default Main;
