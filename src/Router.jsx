import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Vite-specific dynamic import
const modules = import.meta.glob('./apps/**/App.jsx');

const apps = {};
for (const path in modules) {
  const match = path.match(/\.\/apps\/(app\d+)\/App\.jsx$/);
  if (match) {
    apps[match[1]] = React.lazy(modules[path]); // Lazy component
  }
}

const firstAvailableApp = Object.keys(apps)[0];

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/${firstAvailableApp}`} replace />} />

        {Object.keys(apps).map(appName => (
          <Route
            key={appName}
            path={`/${appName}/*`}
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                {React.createElement(apps[appName])}
              </React.Suspense>
            }
          />
        ))}

        <Route path="*" element={<Navigate to={`/${firstAvailableApp}`} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
