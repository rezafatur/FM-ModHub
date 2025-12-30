export {}

declare global {
    interface Window {
        electronAPI: {
            getFaceCounts: (
                normalPath: string,
                iconPath: string
            ) => Promise<{
                normal: number;
                icon: number;
            }>;
            getPaths: () => Promise<{
                normalPath: string;
                iconPath: string;
            }>;
            savePaths: (
                normalPath: string,
                iconPath: string
            ) => Promise<{ success: boolean }>;
            openExternal: (url: string) => void
            quitApp: () => void
        }
    }
}
