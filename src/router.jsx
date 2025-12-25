import { BrowserRouter, Routes, Route } from "react-router-dom"

import App1 from "./apps/app1/App"
import App2 from "./apps/app2/App"
import App3 from "./apps/app3/App"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/app1/*" element={<App1 />} />
        <Route path="/app2/*" element={<App2 />} />
        <Route path="/app3/*" element={<App3 />} />
      </Routes>
    </BrowserRouter>
  )
}
