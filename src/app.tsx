import React from "react";
import { createRoot } from "react-dom/client";
import Dashboard from "@/pages/Dashboard";

const container = document.getElementById("root");

if (!container) {
    throw new Error("Root container missing in index.html");
}

createRoot(container).render(
    <React.StrictMode>
        <Dashboard />
    </React.StrictMode>
)
