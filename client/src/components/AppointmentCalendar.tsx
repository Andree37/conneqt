'use client';
import {Menu, Transition} from '@headlessui/react';
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isEqual,
    isSameDay,
    isSameMonth,
    isToday,
    parse,
    parseISO,
    startOfToday,
} from 'date-fns';
import React, {Fragment, useState} from 'react';
import {enUS} from 'date-fns/locale';
import Link from 'next/link';
import {ChevronLeftIcon, ChevronRightIcon, MoreVerticalIcon} from "lucide-react";

// This function is used to get the styles of the days in the calendar
// It can be seen as where on the calendar should the day go to
// e.g. sunday -> 1 -> col-start-1
//      monday -> 2 -> col-start-2
// etc.
function getDayStyle(index: number, day: Date) {
    let colStartClasses = [
        '',
        'col-start-2',
        'col-start-3',
        'col-start-4',
        'col-start-5',
        'col-start-6',
        'col-start-7',
    ];

    return index === 0 && colStartClasses[getDay(day)];
}

export type Appointment = {
    date: string,
    clientInfo: {
        name: string,
        email: string,
        phone: string,
    },
    pmeId: string
}

export type NutritionistCalendarProps = {
    appointments: Appointment[];
};

export default function NutritionistCalendar({appointments}: NutritionistCalendarProps) {
    const today = startOfToday();
    const [selectedDay, setSelectedDay] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

    const days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    });

    function previousMonth() {
        const firstDayNextMonth = add(firstDayCurrentMonth, {months: -1});
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    }

    function nextMonth() {
        const firstDayNextMonth = add(firstDayCurrentMonth, {months: 1});
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    }

    const selectedDayMeetings = appointments.filter((consultation) =>
        isSameDay(new Date(consultation.date), selectedDay),
    );

    return (
        <div className="pt-16">
            <div className="px-4 mx-2 max-w-md sm:px-7 md:px-6 md:max-w-4xl">
                <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
                    <div className="w-full md:pr-14">
                        <div className="flex items-center w-full">
                            <h2 className="flex-auto font-semibold text-gray-900">
                                {format(firstDayCurrentMonth, 'MMMM yyyy', {locale: enUS})}
                            </h2>
                            <button
                                type="button"
                                onClick={previousMonth}
                                className="flex flex-none justify-center items-center p-1.5 -my-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Previous Month</span>
                                <ChevronLeftIcon className="w-5 h-5" aria-hidden="true"/>
                            </button>
                            <button
                                onClick={nextMonth}
                                type="button"
                                className="flex flex-none justify-center items-center p-1.5 -my-1.5 ml-2 -mr-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Next Month</span>
                                <ChevronRightIcon className="w-5 h-5" aria-hidden="true"/>
                            </button>
                        </div>
                        <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
                            <div>S</div>
                            <div>M</div>
                            <div>T</div>
                            <div>W</div>
                            <div>T</div>
                            <div>F</div>
                            <div>S</div>
                        </div>
                        <div className="grid grid-cols-7 mt-2 text-sm">
                            {days.map((day: Date, dayIdx: number) => (
                                <div key={day.toString()} className={`${getDayStyle(dayIdx, day)} py-1.5`}>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDay(day)}
                                        className={`${isEqual(day, selectedDay) && 'text-white'} ${
                                            !isEqual(day, selectedDay) && isToday(day) && 'text-red-500'
                                        } ${
                                            !isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            isSameMonth(day, firstDayCurrentMonth) &&
                                            'text-gray-900'
                                        } ${
                                            !isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            !isSameMonth(day, firstDayCurrentMonth) &&
                                            'text-gray-400'
                                        } ${isEqual(day, selectedDay) && isToday(day) && 'bg-red-500'} ${
                                            isEqual(day, selectedDay) && !isToday(day) && 'bg-gray-900'
                                        } ${!isEqual(day, selectedDay) && 'hover:bg-gray-200'} ${
                                            (isEqual(day, selectedDay) || isToday(day)) && 'font-semibold'
                                        } mx-auto flex h-8 w-8 items-center justify-center rounded-full`}
                                    >
                                        <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                                    </button>

                                    <div className="mx-auto mt-1 w-1 h-1">
                                        {appointments.some((consultation) =>
                                            isSameDay(new Date(consultation.date), day),
                                        ) && <div className="w-1 h-1 rounded-full bg-sky-500"></div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <section className="mt-12 w-80 md:pl-14 md:mt-0">
                        <h2 className="font-semibold text-gray-900">
                            Appointments for{' '}
                            <time dateTime={format(selectedDay, 'yyyy-MM-dd', {locale: enUS})}>
                                {format(selectedDay, 'MMMM dd, yyy', {locale: enUS})}
                            </time>
                        </h2>
                        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                            {selectedDayMeetings.length > 0 ? (
                                selectedDayMeetings.map((consultation) => (
                                    <Consultation consultation={consultation}
                                                  key={new Date(consultation.date).getUTCDay()}/>
                                ))
                            ) : (
                                <p>No appointments on this day.</p>
                            )}
                        </ol>
                    </section>
                </div>
            </div>
        </div>
    );
}

function Consultation({consultation}: { consultation: Appointment }) {
    const startDateTime = parseISO(consultation.date);
    const endDateTime = new Date();
    endDateTime.setTime(startDateTime.getTime() + 60 * 30 * 1000);

    return (
        <li className="flex items-center py-2 px-4 space-x-4 rounded-xl focus-within:bg-gray-100 hover:bg-gray-100 group">

            <div className="flex-auto">
                <p className="text-gray-900">{consultation.clientInfo.name}</p>
                <p className="text-gray-900">{consultation.clientInfo.email}</p>
                <p className="text-gray-900">{consultation.clientInfo.phone}</p>
                <p className="mt-0.5">
                    <time dateTime={consultation.date}>
                        {format(startDateTime, 'HH:mm ', {locale: enUS})}
                    </time>
                    - <time dateTime={endDateTime.toString()}>{format(endDateTime, 'HH:mm')}</time>
                </p>
            </div>
            <Menu as="div" className="relative opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                <div>
                    <Menu.Button
                        className="flex items-center p-1.5 -m-2 text-gray-500 rounded-full hover:text-gray-600">
                        <span className="sr-only">Open options</span>
                        <MoreVerticalIcon className="w-6 h-6" aria-hidden="true"/>
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items
                        className="absolute right-0 z-10 mt-2 w-36 bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                {({active}) => (
                                    <Link
                                        href={`/appointment/${consultation.clientInfo.email}`}
                                        className={`${
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        } block px-4 py-2 text-sm`}
                                    >
                                        Information
                                    </Link>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({active}) => (
                                    <a
                                        className={`${
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        } block px-4 py-2 text-sm cursor-pointer`}
                                    >
                                        Cancel
                                    </a>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </li>
    );
}
