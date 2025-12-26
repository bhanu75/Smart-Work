import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Dynamically import all apps from ./apps folder
const importAllApps = () => {
  const context = import.meta.glob('./apps/**/App.jsx'); // Vite specific
  const apps = {};
  for (const path in context) {
    // Extract app name from path, e.g., ./apps/app1/App.jsx => app1
    const match = path.match(/\.\/apps\/(app\d+)\/App\.jsx$/);
    if (match) {
      apps[match[1]] = context[path];
    }
  }
  return apps;
};

const apps = importAllApps();
const firstAvailableApp = Object.keys(apps)[0];

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to={`/${firstAvailableApp}`} replace />} />

        {/* Dynamic routes */}
        {Object.keys(apps).map((appName) => (
          <Route
            key={appName}
            path={`/${appName}/*`}
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <React.lazy(() => apps[appName]) />
              </React.Suspense>
            }
          />
        ))}

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to={`/${firstAvailableApp}`} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
