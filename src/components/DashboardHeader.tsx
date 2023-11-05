'use client'

import {toast} from '@/components/ui/use-toast'
import {useInitWeb3InboxClient, useManageSubscription, useMessages, useW3iAccount,} from '@web3inbox/widget-react'
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalSigner,
} from '@web3modal/ethers5/react'
import {useCallback, useEffect} from 'react'
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

export default function DashboardHeader({pmeID}: { pmeID: string }) {
    const {open} = useWeb3Modal()

    const {address, isConnected} = useWeb3ModalAccount()

    const {setAccount, isRegistered, isRegistering, register, account} =
        useW3iAccount()

    const isReady = useInitWeb3InboxClient({
        // The project ID and domain you setup in the Domain Setup section
        projectId: process.env.NEXT_PUBLIC_CONNECT_PROJECT_ID || '',
        domain: 'www.conneqt.pt',

        // Allow localhost development with "unlimited" mode.
        // This authorizes this dapp to control notification subscriptions for all domains (including `app.example.com`), not just `window.location.host`
        isLimited: false,
    })

    useEffect(() => {
        if (!address) return // Convert the address into a CAIP-10 blockchain-agnostic account ID and update the Web3Inbox SDK with it

        setAccount(`eip155:1:${address}`)
    }, [isConnected, address])
    const {messages} = useMessages()

    const {signer} = useWeb3ModalSigner()

    async function onSignMessage({message}: { message: string }) {
        if (!signer) return ''
        return await signer.signMessage(message)
    }

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

    const {isSubscribed, isSubscribing, subscribe} = useManageSubscription()

    const performSubscribe = useCallback(async () => {
        // Register again just in case
        await performRegistration()
        await subscribe()
    }, [subscribe, isRegistered])

    return (
        <div className="mt-10 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                This is your Dashboard.
                <br/>
            </h2>
            <div className="mt-10 flex flex-col items-center gap-x-6">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                    Share your link with your new clients.
                </p>
                <p
                    onClick={() => {
                        toast({
                            title: 'Link copied.',
                            type: 'foreground',
                            className: 'bg-gray-100',
                            description: 'You can now share this link with your new clients.',
                            variant: 'default',
                        })
                        navigator.clipboard.writeText(
                            `https://www.conneqt.pt/schedule/${pmeID}`,
                        )
                    }}
                    className="cursor-pointer text-indigo-500"
                >{`https://www.conneqt.pt/schedule/${pmeID}`}</p>
            </div>

            <div>
                {!address ? (
                    <button onClick={() => open()}>connect wallet</button>
                ) : (
                    <>
                        {' '}
                        <h2>Notifications</h2>
                        {!isSubscribed ? (
                            <button onClick={() => performSubscribe()}>
                                Get notifications
                            </button>
                        ) : (
                            JSON.stringify(messages)
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
