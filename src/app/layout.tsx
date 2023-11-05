import {type Metadata} from 'next'

import {RootLayout} from '@/components/RootLayout'

import '@/styles/tailwind.css'
import {Toaster} from "@/components/ui/toaster";

export const metadata: Metadata = {
    title: {
        template: '%s - Conneqt',
        default: 'Conneqt - We help independent workers connect with clients and get paid',
    },
}

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" className="h-full bg-neutral-950 text-base antialiased">
        <body className="flex min-h-full flex-col">
        <RootLayout>{children}</RootLayout>
        <Toaster/>
        </body>
        </html>
    )
}
