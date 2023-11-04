'use client'
import { Form } from '@/app/pme/contact/page'
import { clientDataI } from '@/app/schedule/[id]/page'
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalSigner,
  useWeb3ModalState,
} from '@web3modal/ethers5/react'
import { useCallback, useEffect } from 'react'
import { NotifyClient } from '@walletconnect/notify-client'

const buttonStyle = {
  backgroundColor: '#4CAF50',
  border: 'none',
  color: 'white',
  padding: '14px 32px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  margin: '4px 2px',
  cursor: 'pointer',
  borderRadius: '8px',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s ease',
}

export default function ConnectWeb3({
  clientInfo,
  scheduleDate,
  pmeInfo,
  notifyCli,
}: {
  clientInfo: clientDataI
  scheduleDate: any
  pmeInfo: Form
  notifyCli: NotifyClient
}) {
  // 4. Use modal hook
  const { open } = useWeb3Modal()

  const { selectedNetworkId } = useWeb3ModalState()
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { signer } = useWeb3ModalSigner()

  const subscribeInbox = useCallback(() => {
    if (isConnected && address) {
      notifyCli.subscribe({
        account: address,
        appDomain: 'localhost:3000',
      })
    }
  }, [isConnected && address])

  useEffect(() => {
    subscribeInbox()
  }, [subscribeInbox])

  async function onSignMessage() {
    const signature = await signer?.signMessage('Hello Web3Modal Ethers')
    console.log(signature)
  }

  async function onSendTransaction() {
    const signature = await signer?.sendTransaction({
      to: pmeInfo.address,
      //This value is defined by the PME
      value: '10000000000000',
    })

    const res = await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailTo: pmeInfo.email,
        message: `You have a new client ${clientInfo.name} schedule to date - ${scheduleDate} with email: ${clientInfo.email} and phone: ${clientInfo.phone}`,
        subject: `New client ${clientInfo.name}`,
      }),
    })
    await fetch('/api/appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: scheduleDate,
        clientInfo: clientInfo,
        //@ts-ignore This is not typed but it's internal of mongo db
        pmeId: pmeInfo._id,
      }),
    })
  }

  return (
    <>
      {isConnected ? (
        <button style={buttonStyle} onClick={() => onSendTransaction()}>
          Pay 0.0001 eth
        </button>
      ) : (
        <>
          <button style={buttonStyle} onClick={() => open()}>
            Cripto (Connect wallet)
          </button>
        </>
      )}
      {/*  <button onClick={() => open({ view: 'Networks' })}>
        Open Network Modal
      </button> */}
    </>
  )
}
