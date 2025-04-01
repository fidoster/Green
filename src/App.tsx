import { Suspense, lazy } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { ThemeProvider } from "./components/ThemeProvider";

// Lazy load the AdminPanel component
const AdminPanel = lazy(() => import("./components/AdminPanel"));

function App() {
  // Use the useRoutes hook for Tempo routes
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <ThemeProvider defaultTheme="light" storageKey="greenbot-ui-theme">
      <Suspense fallback={<p>Loading...</p>}>
        {/* Tempo routes are handled separately */}
        {tempoRoutes}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPanel />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" element={null} />
          )}
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
