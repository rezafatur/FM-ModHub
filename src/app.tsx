import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"

import PortalOverview from "@/pages/portal/PortalOverview";
import Settings from "@/pages/others/Settings";

const container = document.getElementById("root");

if (!container) {
    throw new Error("Root container missing in index.html");
}

createRoot(container).render(
    <React.StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<PortalOverview />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>
)
