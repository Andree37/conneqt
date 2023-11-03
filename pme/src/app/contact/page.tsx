"use client"
import {useId, useState} from 'react'
import Link from 'next/link'

import {Border} from '@/components/Border'
import {Button} from '@/components/Button'
import {Container} from '@/components/Container'
import {FadeIn} from '@/components/FadeIn'
import {PageIntro} from '@/components/PageIntro'
import {SocialMedia} from '@/components/SocialMedia'
import Dropzone from "react-dropzone";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

import countries from "@/countries/countries.json";

function TextInput({
                       label,
                       ...props
                   }: React.ComponentPropsWithoutRef<'input'> & { label: string }) {
    let id = useId()

    return (
        <div className="group relative z-0 transition-all focus-within:z-10">
            <input
                type="text"
                id={id}
                {...props}
                placeholder=" "
                className="peer block w-full border border-neutral-300 bg-transparent px-6 pb-4 pt-12 text-base/6 text-neutral-950 ring-4 ring-transparent transition focus:border-neutral-950 focus:outline-none focus:ring-neutral-950/5 group-first:rounded-t-2xl group-last:rounded-b-2xl"
            />
            <label
                htmlFor={id}
                className="pointer-events-none absolute left-6 top-1/2 -mt-3 origin-left text-base/6 text-neutral-500 transition-all duration-200 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:font-semibold peer-focus:text-neutral-950 peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:text-neutral-950"
            >
                {label}
            </label>
        </div>
    )
}

function RadioInput({
                        label,
                        ...props
                    }: React.ComponentPropsWithoutRef<'input'> & { label: string }) {
    return (
        <label className="flex gap-x-3">
            <input
                type="radio"
                {...props}
                className="h-6 w-6 flex-none appearance-none rounded-full border border-neutral-950/20 outline-none checked:border-[0.5rem] checked:border-neutral-950 focus-visible:ring-1 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
            />
            <span className="text-base/6 text-neutral-950">{label}</span>
        </label>
    )
}

function ContactForm() {
    const [form, setForm] = useState<{ file: File | undefined, country: string, city: string }>({
        file: undefined,
        country: 'Portugal',
        city: "Lisbon"
    })

    return (
        <FadeIn className="lg:order-last">
            <form onSubmit={(e) => {
                e.preventDefault()
                fetch('/api/pme', {method: 'POST', body: JSON.stringify(form)}).then(() => {
                    alert('Form submitted')
                })
            }}>
                <h2 className="font-display text-base font-semibold text-neutral-950">
                    Register your service
                </h2>
                <div className="isolate mt-6 -space-y-px rounded-2xl bg-white/50">
                    <TextInput label="Your name" name="name" autoComplete="name"/>
                    <TextInput
                        label="Email"
                        type="email"
                        name="email"
                        autoComplete="email"
                    />
                    <TextInput
                        label="Company name"
                        name="company"
                        autoComplete="organization"
                    />
                    <TextInput label="Phone" type="tel" name="phone" autoComplete="tel"/>
                    <TextInput label="Message" name="message"/>
                    <div className='flex justify-between space-x-5 flex-1 h-20'>
                        <Select value={form.country}
                                onValueChange={(v) => {
                                    setForm({
                                        ...form,
                                        country: v,
                                    })
                                }}>
                            <SelectTrigger className='h-full border border-neutral-300 rounded-none'>
                                <SelectValue placeholder="Select a country"/>
                            </SelectTrigger>
                            <SelectContent className='bg-gray-100'>
                                <SelectGroup className=''>
                                    {Object.keys(countries).filter((value, index, array) => array.indexOf(value) === index).map((country) => (
                                        <SelectItem value={country}>{country}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select value={form.city} onValueChange={(v) => {
                            setForm({...form, city: v})
                        }}>
                            <SelectTrigger className="h-full border border-neutral-300 rounded-none">
                                <SelectValue placeholder="Select a city"/>
                            </SelectTrigger>
                            <SelectContent className='bg-gray-100'>
                                <SelectGroup className=''>
                                    {countries[form.country as keyof typeof countries]?.filter((value, index, array) => array.indexOf(value) === index).map((city) => (
                                        <SelectItem value={city}>{city}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <Dropzone multiple={false} accept={{'pdf': ['application/pdf']}}
                              onDrop={acceptedFiles => {
                                  setForm({...form, file: acceptedFiles[0]})
                              }}>
                        {({getRootProps, getInputProps}) => (
                            form?.file ? <div
                                    className='relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none cursor-pointer'>
                                    <p className="text-sm text-black">File loaded: {form.file.name}</p>
                                    <Button
                                        className="mt-2 content-center items-center align-middle justify-center bg-gray-200 hover:bg-gray-300 w-full h-12"
                                        onClick={() => setForm({...form, file: undefined})}>Remover</Button>
                                </div> :
                                <div {...getRootProps()}
                                     className='relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none cursor-pointer'>
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            vectorEffect="non-scaling-stroke"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                    <input {...getInputProps()} />
                                </div>
                        )}
                    </Dropzone>
                    <TextInput label="Answer to client call" name="answer_to_client_call"/>
                    <div className="border border-neutral-300 px-6 py-8 first:rounded-t-2xl last:rounded-b-2xl">
                        <fieldset>
                            <legend className="text-base/6 text-neutral-500">Service type</legend>
                            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                                <RadioInput label="Online" name="type" value="online"/>
                                <RadioInput label="Presential" name="type" value="presential"/>
                                <RadioInput label="Both" name="type" value="both"/>
                            </div>
                        </fieldset>
                    </div>
                </div>
                <Button type="submit" className="mt-10">
                    Let’s work together
                </Button>
            </form>
        </FadeIn>
    )
}

function ContactDetails() {
    return (
        <FadeIn>
            <h2 className="font-display text-base font-semibold text-neutral-950">
                What are the next steps?
            </h2>
            <p className="mt-6 text-base text-neutral-600">
                We will send you an email with the password to access the platform which will allow you to manage your
                service and clients. You will be able to add more information about your service, like the team, the
                schedules, and the prices.
            </p>

            {/*<Offices className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2"/>*/}

            <Border className="mt-16 pt-16">
                <h2 className="font-display text-base font-semibold text-neutral-950">
                    Still got questions?
                </h2>
                <dl className="mt-6 grid grid-cols-1 gap-8 text-sm sm:grid-cols-2">
                    {[
                        ['Careers', 'careers@studioagency.com'],
                        ['Press', 'press@studioagency.com'],
                    ].map(([label, email]) => (
                        <div key={email}>
                            <dt className="font-semibold text-neutral-950">{label}</dt>
                            <dd>
                                <Link
                                    href={`mailto:${email}`}
                                    className="text-neutral-600 hover:text-neutral-950"
                                >
                                    {email}
                                </Link>
                            </dd>
                        </div>
                    ))}
                </dl>
            </Border>

            <Border className="mt-16 pt-16">
                <h2 className="font-display text-base font-semibold text-neutral-950">
                    Follow us
                </h2>
                <SocialMedia className="mt-6"/>
            </Border>
        </FadeIn>
    )
}


export default function Contact() {
    return (
        <>
            <PageIntro eyebrow="Contact us" title="Let’s work together">
                <p>Let's start conneq-ting clients to your service.</p>
            </PageIntro>

            <Container className="mt-24 sm:mt-32 lg:mt-40">
                <div className="grid grid-cols-1 gap-x-8 gap-y-24 lg:grid-cols-2">
                    <ContactForm/>
                    <ContactDetails/>
                </div>
            </Container>
        </>
    )
}
