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
            fetchSortItOutSINations: () => Promise<{
                success: boolean;
                data?: Array<{
                    id: string;
                    name: string;
                    nickname: string;
                    logo: string;
                    newgens: string;
                    isWomens: boolean;
                    detailUrl: string;
                }>;
                error?: string;
            }>;
            openExternal: (url: string) => void
            quitApp: () => void
        }
    }
}
