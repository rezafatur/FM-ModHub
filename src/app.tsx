import { createRoot } from "react-dom/client";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "@/components/layout/app-layout";

import PortalOverview from "@/pages/portal/PortalOverview";
import Settings from "@/pages/others/Settings";

const container = document.getElementById("root");
if (!container) {
    throw new Error("Root container missing in index.html");
}

const router = createMemoryRouter([
    {
        element: <AppLayout />,
        children: [
            {
                handle: { breadcrumb: { label: "Portal", href: "/" } },
                children: [
                {
                    index: true,
                    element: <PortalOverview />,
                    handle: { breadcrumb: { label: "Overview" } },
                },
                ],
            },
            {
                handle: { breadcrumb: { label: "Others" } },
                children: [
                {
                    path: "settings",
                    element: <Settings />,
                    handle: { breadcrumb: { label: "Settings" } },
                },
                ],
            },
        ],
    },
]);

createRoot(container).render(
    <ThemeProvider>
        <RouterProvider router={router} />
    </ThemeProvider>
);
