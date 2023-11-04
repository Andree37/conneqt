import AppointmentCalendar from "@/components/AppointmentCalendar";
import {cookies} from "next/headers";
import Link from "next/link";
import DashboardHeader from "@/components/DashboardHeader";


async function fetchAppointmentsFromUser(pmeID: string) {
    const res = await fetch(`http://localhost:3000/api/appointment?pmeID=${pmeID}`);
    if (res.ok) {
        return await res.json();
    }
    return [];
}

export default async function DashboardPage() {
    const pmeID = cookies().get('userID');
    if (!pmeID || !pmeID?.value) {
        return <Link href='/pme/login'>
            Please log in
        </Link>
    }

    const appointments = await fetchAppointmentsFromUser(pmeID.value);

    return <>
        <DashboardHeader pmeID={pmeID.value}/>
        <h2 className=" flex justify-center mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Your
            Appointments</h2>

        <div className='flex justify-center items-center'>
            <AppointmentCalendar appointments={appointments.document}/>

        </div>

    </>
}
