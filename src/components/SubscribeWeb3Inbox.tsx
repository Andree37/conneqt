import {
  useInitWeb3InboxClient,
  useManageSubscription,
  useMessages,
  useSubscription,
  useW3iAccount,
} from '@web3inbox/widget-react'
import {
  useWeb3ModalAccount,
  useWeb3ModalSigner,
} from '@web3modal/ethers5/react'
import { useCallback, useEffect } from 'react'

export default function SubscribeWeb3Inbox() {
  // watch messages of current account's subscription to current dapp
  const { messages, deleteMessage } = useMessages()
  const { address, isConnected } = useWeb3ModalAccount()

  const { signer } = useWeb3ModalSigner()

  async function onSignMessage({ message }: { message: string }) {
    if (!signer) return ''
    return await signer.signMessage(message)
  }

  // Initialize the Web3Inbox SDK
  const isReady = useInitWeb3InboxClient({
    // The project ID and domain you setup in the Domain Setup section
    projectId: process.env.NEXT_PUBLIC_CONNECT_PROJECT_ID || '',
    domain: 'www.conneqt.pt',

    // Allow localhost development with "unlimited" mode.
    // This authorizes this dapp to control notification subscriptions for all domains (including `app.example.com`), not just `window.location.host`
    isLimited: false,
  })

  const { setAccount, isRegistered, isRegistering, register, account } =
    useW3iAccount()

  useEffect(() => {
    if (!address) return // Convert the address into a CAIP-10 blockchain-agnostic account ID and update the Web3Inbox SDK with it

    setAccount(`eip155:1:${address}`)
  }, [isConnected, address])

  // In order to authorize the dapp to control subscriptions, the user needs to sign a SIWE message which happens automatically when `register()` is called.
  // Depending on the configuration of `domain` and `isLimited`, a different message is generated.
  const performRegistration = useCallback(async () => {
    if (!address) return
    try {
      console.log('ENTER BEFORE REGISTER')

      await register((message: string) => {
        console.log('ENTER MESSAGE', message)
        return onSignMessage({ message })
      })
      console.log('ENTER here after register')
    } catch (registerIdentityError) {
      alert(registerIdentityError)
    }
  }, [onSignMessage, register, address])

  const { isSubscribed, isSubscribing, subscribe } = useManageSubscription()

  const performSubscribe = useCallback(async () => {
    // Register again just in case
    await performRegistration()
    await subscribe()
  }, [subscribe, isRegistered])

  const { subscription } = useSubscription()

  const sendNotification = async () => {
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
            title: 'Transaction succeded',
            body: 'Notification body',
          },
          accounts: [
            account, // CAIP-10 account ID
          ],
        }),
      },
    )
  }

  return (
    <>
      {!isReady ? (
        <div>Loading client...</div>
      ) : (
        <>
          {!address ? (
            <div>Connect your wallet</div>
          ) : (
            <>
              <div>Address: {address}</div>
              <div>Account ID: eip155:1: {address}</div>
              {!isRegistered ? (
                <div>
                  To manage notifications, sign and register an identity
                  key:&nbsp;
                  <button
                    onClick={performRegistration}
                    disabled={isRegistering}
                  >
                    {isRegistering ? 'Signing...' : 'Sign'}
                  </button>
                </div>
              ) : (
                <>
                  {!isSubscribed ? (
                    <>
                      <button
                        onClick={performSubscribe}
                        disabled={isSubscribing}
                      >
                        {isSubscribing
                          ? 'Subscribing...'
                          : 'Subscribe to notifications'}
                      </button>
                    </>
                  ) : (
                    <>
                      <div>You are subscribed</div>
                      <div>Subscription: {JSON.stringify(subscription)}</div>
                      <div>Messages: {JSON.stringify(messages)}</div>
                      <button onClick={sendNotification}>
                        Send notification
                      </button>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}
