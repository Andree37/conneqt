import {RootLayout} from "@/components/RootLayout";

export function Layout({children}: { children: React.ReactNode }) {
    return (
        <>
            <RootLayout>
                <main className="flex-auto">{children}</main>
            </RootLayout>
        </>
    )
}
