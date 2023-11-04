'use client'
import { useCallback, useEffect, useId, useState } from 'react'
import Link from 'next/link'

import { Border } from '@/components/Border'
import { Button } from '@/components/Button'
import { FadeIn } from '@/components/FadeIn'
import { Offices } from '@/components/Offices'
import { PageIntro } from '@/components/PageIntro'
import { SocialMedia } from '@/components/SocialMedia'
import DateTimePicker from '@/components/DateTimePicker'
import BetterStepper from '@/components/BetterStepper'
import ConnectWeb3 from '@/components/ConnectWeb3'

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'
import { Form } from '@/app/pme/contact/page'
import { NotifyClient } from '@walletconnect/notify-client'
//  import SubscribeWeb3Inbox from '@/components/SubscribeWeb3Inbox'
// 1. Get projectId
const projectId = process.env.NEXT_PUBLIC_CONNECT_PROJECT_ID

// 2. Set chains
const goerli = {
  chainId: 5,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://ethereum-goerli.publicnode.com',
}

// 3. Create modal
const web3ModalMetadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/'],
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata: web3ModalMetadata }),
  chains: [goerli],
  projectId: projectId || '',
})

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
//const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

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

function ContactForm({ handleChange, form }) {
  return (
    <FadeIn className="lg:order-last">
      <form>
        <h2 className="font-display text-base font-semibold text-neutral-950">
          How should we contact you
        </h2>
        <div className="isolate mt-6 w-96 -space-y-px rounded-2xl bg-white/50">
          <TextInput
            onChange={(val) => handleChange('name', val.target.value)}
            label="Name"
            name="name"
            autoComplete="name"
            value={form.name}
          />
          <TextInput
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            onChange={(val) => handleChange('email', val.target.value)}
            value={form.email}
          />
          <TextInput
            onChange={(val) => handleChange('phone', val.target.value)}
            label="Phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            value={form.phone}
          />
        </div>
      </form>
    </FadeIn>
  )
}
export interface clientDataI {
  name: string
  email: string
  phone: string
}
export default function Contact({ params }: { params: { id: string } }) {
  const [pmeInfo, setPmeInfo] = useState<Form | undefined>(undefined)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [form, setForm] = useState<clientDataI>({
    name: '',
    email: '',
    phone: '',
  })

  const [notifyCli, setNotifyCli] = useState<NotifyClient | null>(null)

  const handleFormChange = (propName: string, value: string) => {
    setForm({ ...form, [propName]: value })
  }

  const initNotify = useCallback(async () => {
    const notifyClient = await NotifyClient.init({
      projectId: projectId,
    })

    setNotifyCli(notifyClient)
  }, [projectId])

  useEffect(() => {
    initNotify()
  }, [initNotify])

  useEffect(() => {
    async function f() {
      const res = await fetch(`/api/pme/${params.id}`)
      console.log(res)
      const data = await res.json()
      setPmeInfo(data?.document)
    }

    f()
  }, [])

  if (!pmeInfo) {
    return <div>Loading...</div>
  }

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
  }

  const renderDateTimePicker = () => {
    return (
      <>
        <h2 className="font-display text-base font-semibold text-neutral-950">
          Choose a date to meet us
        </h2>
        <DateTimePicker
          selectedDate={selectedDate}
          onChange={handleDateChange}
        />
      </>
    )
  }

  // Steps

  const steps = [
    {
      id: 'Step 1',
      name: 'Client info',
      href: '#',
      component: (
        <div className="min-h-96 flex max-h-96 w-full flex-col items-center justify-center space-y-4 rounded-lg bg-gray-200 p-6 shadow-lg">
          <ContactForm handleChange={handleFormChange} form={form} />
        </div>
      ),
    },
    {
      id: 'Step 2',
      name: 'Scheduling date',
      href: '#',
      component: (
        <div className="min-h-96 flex max-h-96 w-full  flex-col items-center justify-center space-y-4 rounded-lg bg-gray-200 p-6 shadow-lg">
          {renderDateTimePicker()}
        </div>
      ),
    },
    {
      id: 'Step 3',
      name: 'Payment',
      href: '#',
      component: (
        <div className=" min-h-96 flex max-h-96 w-full flex-col items-center justify-center space-y-4 rounded-lg bg-gray-200 p-6 shadow-lg">
          <ConnectWeb3
            clientInfo={form}
            scheduleDate={selectedDate}
            pmeInfo={pmeInfo}
            notifyCli={notifyCli}
          />
        </div>
      ),
    },
  ]

  return (
    <>
      <PageIntro eyebrow={pmeInfo.companyName} title="Let’s work together">
        <p>We can’t wait to hear from you.</p>
      </PageIntro>
      <div className="px-16 pt-8 ">
        <BetterStepper steps={steps} />
      </div>
      {/*  <Stepper /> */}
      {/*  <Container className="mt-24 sm:mt-32 lg:mt-40">
        <div className="grid grid-cols-1 gap-x-8 gap-y-24 lg:grid-cols-2">
          <ContactForm />
          <ContactDetails />
        </div>
        <DateTimePicker
          selectedDate={selectedDate}
          onChange={handleDateChange}
        />
      </Container> */}
    </>
  )
}
