// Importing React and necessary libraries for routing and state management
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store'; // Redux store
import { ToastContainer } from 'react-toastify'; // Toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS

// Layout Components
import Navbar from './components/layout/Navbar'; // Navigation bar
import Footer from './components/layout/Footer'; // Footer component
import PrivateRoute from './components/routing/PrivateRoute'; // Component for protecting routes

// Page Components
import Home from './components/pages/Home'; // Home page
import Services from './components/pages/Services'; // Services listing page
import Service from './components/pages/Service'; // Single service details page
import Providers from './components/pages/Providers'; // Providers listing page
import ProviderProfile from './components/pages/ProviderProfile'; // Provider profile page
import Login from './components/pages/Login'; // Login page
import Register from './components/pages/Register'; // Registration page
import Dashboard from './components/pages/Dashboard'; // User dashboard (protected)
import CreateService from './components/pages/CreateService'; // Create service page (protected)
import EditService from './components/pages/EditService'; // Edit service page (protected)
import BecomeProvider from './components/pages/BecomeProvider'; // Become a provider page
import Recommendations from './components/pages/Recommendations'; // Recommendations page (protected)
import NotFound from './components/pages/NotFound'; // 404 Not Found page

// CSS
import './App.css'; // Custom application styles
import 'leaflet/dist/leaflet.css'; // Leaflet map styles

/**
 * Main application component that sets up routing, state management, and layout.
 */
function App() {
  return (
    // Wrapping the application with Redux Provider to make the store available globally
    <Provider store={store}>
      {/* Wrapping the application with Router for client-side routing */}
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Navbar is displayed on all pages */}
          <Navbar />
          <main className="flex-grow">
            {/* Toast notifications for user feedback */}
            <ToastContainer position="top-center" autoClose={5000} />
            {/* Defining application routes */}
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} /> {/* Home page */}
              <Route path="/services" element={<Services />} /> {/* Services listing */}
              <Route path="/services/:id" element={<Service />} /> {/* Single service details */}
              <Route path="/providers" element={<Providers />} /> {/* Providers listing */}
              <Route path="/providers/:id" element={<ProviderProfile />} /> {/* Provider profile */}
              <Route path="/login" element={<Login />} /> {/* Login page */}
              <Route path="/register" element={<Register />} /> {/* Registration page */}
              <Route path="/become-provider" element={<BecomeProvider />} /> {/* Become a provider */}

              {/* Private Routes (protected by authentication) */}
              <Route path="/dashboard" element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} /> {/* User dashboard */}
              </Route>
              <Route path="/create-service" element={<PrivateRoute />}>
                <Route path="/create-service" element={<CreateService />} /> {/* Create service */}
              </Route>
              <Route path="/edit-service/:id" element={<PrivateRoute />}>
                <Route path="/edit-service/:id" element={<EditService />} /> {/* Edit service */}
              </Route>
              <Route path="/recommendations" element={<PrivateRoute />}>
                <Route path="/recommendations" element={<Recommendations />} /> {/* Recommendations */}
              </Route>

              {/* Catch-all route for undefined paths */}
              <Route path="*" element={<NotFound />} /> {/* 404 Not Found */}
            </Routes>
          </main>
          {/* Footer is displayed on all pages */}
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

// Exporting the main application component
export default App;