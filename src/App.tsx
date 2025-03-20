import { Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { ThemeProvider } from "./components/ThemeProvider";

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
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" element={<div />} />
          )}
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
