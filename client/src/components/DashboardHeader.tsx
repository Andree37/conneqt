'use client'

import {toast} from "@/components/ui/use-toast";

export default function DashboardHeader({pmeID}: { pmeID: string }) {
    return <div className='flex mt-10 flex-col items-center justify-center'>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">This is your Dashboard.
            <br/>

        </h2>
        <div className="mt-10 flex flex-col items-center gap-x-6">
            <p className="text-sm font-semibold leading-6 text-gray-900">
                Share your link with your new clients.
            </p>
            <p onClick={() => {
                toast({
                    title: 'Link copied.',
                    type: 'foreground', className: 'bg-gray-100',
                    description: 'You can now share this link with your new clients.',
                    variant: 'default',
                });
                navigator.clipboard.writeText(`http://localhost:3000/schedule/${pmeID}`);
            }} className='text-indigo-500 cursor-pointer'>{`http://localhost:3000/schedule/${pmeID}`}</p>
        </div>
    </div>
}
