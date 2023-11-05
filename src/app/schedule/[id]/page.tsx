'use client'
import {useCallback, useEffect, useId, useState} from 'react'
import {FadeIn} from '@/components/FadeIn'
import {PageIntro} from '@/components/PageIntro'
import DateTimePicker from '@/components/DateTimePicker'
import BetterStepper from '@/components/BetterStepper'
import ConnectWeb3 from '@/components/ConnectWeb3'

import {createWeb3Modal, defaultConfig, useWeb3ModalAccount, useWeb3ModalSigner} from '@web3modal/ethers5/react'
import {Form} from '@/app/pme/contact/page'
import {NotifyClient} from '@walletconnect/notify-client'
import {
    useInitWeb3InboxClient,
    useManageSubscription,
    useMessages,
    useSubscription,
    useW3iAccount,
} from '@web3inbox/widget-react'
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
    ethersConfig: defaultConfig({metadata: web3ModalMetadata}),
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

function ContactForm({
                         handleChange,
                         form,
                     }: {
    handleChange: (aa: string, a: string) => void
    form: { name: string; email: string; phone: string }
}) {
    return (
        <FadeIn className="lg:order-last">
            <form>
                <h2 className="font-display text-base font-semibold text-neutral-950">
                    How should we contact you
                </h2>
                <div className="isolate mt-6 w-96 -space-y-px rounded-2xl bg-white/50">
                    <TextInput
                        onChange={(val: { target: { value: string } }) =>
                            handleChange('name', val.target.value)
                        }
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
                        onChange={(val: { target: { value: string } }) =>
                            handleChange('email', val.target.value)
                        }
                        value={form.email}
                    />
                    <TextInput
                        onChange={(val: { target: { value: string } }) =>
                            handleChange('phone', val.target.value)
                        }
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

export default function Contact({params}: { params: { id: string } }) {
    const {messages, deleteMessage} = useMessages()
    const {address, isConnected} = useWeb3ModalAccount()
    // Initialize the Web3Inbox SDK
    const isReady = useInitWeb3InboxClient({
        // The project ID and domain you setup in the Domain Setup section
        projectId: process.env.NEXT_PUBLIC_CONNECT_PROJECT_ID || '',
        domain: 'www.conneqt.pt',

        // Allow localhost development with "unlimited" mode.
        // This authorizes this dapp to control notification subscriptions for all domains (including `app.example.com`), not just `window.location.host`
        isLimited: false,
    })

    const {setAccount, isRegistered, isRegistering, register, account} =
        useW3iAccount()
    const {subscription} = useSubscription()
    const {isSubscribed, isSubscribing, subscribe} = useManageSubscription()
    const {signer} = useWeb3ModalSigner()

    const [pmeInfo, setPmeInfo] = useState<Form | undefined>(undefined)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [form, setForm] = useState<clientDataI>({
        name: '',
        email: '',
        phone: '',
    })

    const [notifyCli, setNotifyCli] = useState<NotifyClient | null>(null)

    const handleFormChange = (propName: string, value: string) => {
        setForm({...form, [propName]: value})
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

    useEffect(() => {
        if (!address && isConnected) return // Convert the address into a CAIP-10 blockchain-agnostic account ID and update the Web3Inbox SDK with it

        setAccount(`eip155:1:${address}`)
    }, [isConnected, address])

    // In order to authorize the dapp to control subscriptions, the user needs to sign a SIWE message which happens automatically when `register()` is called.
    // Depending on the configuration of `domain` and `isLimited`, a different message is generated.
    const performRegistration = useCallback(async () => {
        if (!account) return
        try {
            console.log('ENTER BEFORE REGISTER')

            await register((message: string) => {
                console.log('ENTER MESSAGE', message)
                return onSignMessage({message})
            })
            console.log('ENTER here after register')
        } catch (registerIdentityError) {
            alert(registerIdentityError)
        }
    }, [onSignMessage, register, account])

    const performSubscribe = useCallback(async () => {
        // Register again just in case
        await performRegistration()
        await subscribe()
    }, [subscribe, isRegistered, performRegistration])

    const sendNotification = async (clientInfo: clientDataI,
                                    scheduleDate: Date) => {
        const response = await fetch(
            `https://notify.walletconnect.com/${process.env.NEXT_PUBLIC_CONNECT_PROJECT_ID}/notify`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTIFY_SECRET}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    notification: {
                        type: 'fbc778e0-20c8-4b7f-b420-9de8b6672056', // Notification type ID copied from Cloud
                        title: 'You have a new client! ',
                        body: `You have a new client ${clientInfo.name} schedule to date - ${scheduleDate} with email: ${clientInfo.email} and phone: ${clientInfo.phone}`,
                    },
                    accounts: [
                        `eip155:1:${pmeInfo?.address}`, // CAIP-10 account ID
                    ],
                }),
            },
        )
        console.log('ENTER send notification', response)
    }

    async function onSendTransaction({
                                         signer,
                                         clientInfo,
                                         scheduleDate,
                                         pmeInfo,
                                     }: any) {
        const signature = await signer?.sendTransaction({
            to: pmeInfo.address,
            //This value is defined by the PME
            value: '10000000000000',
        })

        const res = await fetch('/api/email', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                emailTo: pmeInfo.email,
                message: `You have a new client ${clientInfo.name} schedule to date - ${scheduleDate} with email: ${clientInfo.email} and phone: ${clientInfo.phone}`,
                subject: `New client ${clientInfo.name}`,
            }),
        })
        await fetch('/api/appointment', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                date: scheduleDate,
                clientInfo: clientInfo,
                //@ts-ignore This is not typed but it's internal of mongo db
                pmeId: pmeInfo._id,
            }),
        })
        await performSubscribe()
        await sendNotification(clientInfo,
            scheduleDate)
    }

    async function onSignMessage({message}: { message: string }) {
        if (!signer) return ''
        return await signer.signMessage(message)
    }


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


    if (!notifyCli) {
        return <div>Loading CLI...</div>
    }
    // Steps

    const steps = [
        {
            id: 'Step 1',
            name: 'Client info',
            href: '#',
            component: (
                <div
                    className="min-h-96 flex max-h-96 w-full flex-col items-center justify-center space-y-4 rounded-lg bg-gray-200 p-6 shadow-lg">
                    <ContactForm handleChange={handleFormChange} form={form}/>
                </div>
            ),
        },
        {
            id: 'Step 2',
            name: 'Scheduling date',
            href: '#',
            component: (
                <div
                    className="min-h-96 flex max-h-96 w-full  flex-col items-center justify-center space-y-4 rounded-lg bg-gray-200 p-6 shadow-lg">
                    {renderDateTimePicker()}
                </div>
            ),
        },
        {
            id: 'Step 3',
            name: 'Payment',
            href: '#',
            component: (
                <div
                    className=" min-h-96 flex max-h-96 w-full flex-col items-center justify-center space-y-4 rounded-lg bg-gray-200 p-6 shadow-lg">
                    <ConnectWeb3
                        clientInfo={form}
                        scheduleDate={selectedDate}
                        pmeInfo={pmeInfo}
                        notifyCli={notifyCli}
                        onSendTransaction={onSendTransaction}
                        performRegistration={performRegistration}
                    />
                    {/*  <SubscribeWeb3Inbox /> */}
                    {/*<>*/}
                    {/*    {!isSubscribed ? (*/}
                    {/*        <>*/}
                    {/*            <button onClick={performSubscribe} disabled={isSubscribing}>*/}
                    {/*                {isSubscribing*/}
                    {/*                    ? 'Subscribing...'*/}
                    {/*                    : 'Subscribe to notifications'}*/}
                    {/*            </button>*/}
                    {/*        </>*/}
                    {/*    ) : (*/}
                    {/*        <>*/}
                    {/*            <div>You are subscribed</div>*/}
                    {/*            <div>Subscription: {JSON.stringify(subscription)}</div>*/}
                    {/*            <div>Messages: {JSON.stringify(messages)}</div>*/}
                    {/*            <button onClick={() => sendNotification({*/}
                    {/*                name: "test",*/}
                    {/*                email: "test",*/}
                    {/*                phone: "test"*/}
                    {/*            }, new Date())}>Send notification*/}
                    {/*            </button>*/}
                    {/*        </>*/}
                    {/*    )}*/}
                    {/*</>*/}
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
                <BetterStepper steps={steps}/>
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
