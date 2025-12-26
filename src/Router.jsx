import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import App1 from "./apps/app1/App.jsx";
import App2 from "./apps/app2/App.jsx";
import App3 from "./apps/app3/App.jsx";
import App4 from "./apps/app4/App.jsx";
import App5 from "./apps/app5/App.jsx";
import App6 from "./apps/app6/App.jsx";
import App7 from "./apps/app7/App.jsx";
import App8 from "./apps/app8/App.jsx";
import App9 from "./apps/app9/App.jsx";
import App10 from "./apps/app10/App.jsx";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/app2" replace />} />
        <Route path="/app1/*" element={<App1 />} />
        <Route path="/app2/*" element={<App2 />} />
        <Route path="/app3/*" element={<App3 />} />
        <Route path="/app4/*" element={<App4 />} />
        <Route path="/app5/*" element={<App5 />} />
        <Route path="/app6/*" element={<App6 />} />
        <Route path="/app7/*" element={<App7 />} />
        <Route path="/app8/*" element={<App8 />} />
        <Route path="/app9/*" element={<App9 />} />
        <Route path="/app10/*" element={<App10 />} />
      </Routes>
    </BrowserRouter>
  );
}
