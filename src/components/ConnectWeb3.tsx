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
  onSendTransaction,
  performRegistration,
}: {
  clientInfo: clientDataI
  scheduleDate: any
  pmeInfo: Form
  notifyCli: NotifyClient
  onSendTransaction: any
  performRegistration: any
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
        appDomain: 'www.conneqt.pt',
      })

      performRegistration()
    }
  }, [isConnected && address])

  useEffect(() => {
    subscribeInbox()
  }, [subscribeInbox])

  async function onSignMessage() {
    const signature = await signer?.signMessage('Hello Web3Modal Ethers')
    console.log(signature)
  }

  return (
    <>
      {isConnected ? (
        // @ts-ignore
        <button
          style={buttonStyle}
          onClick={() =>
            onSendTransaction({
              signer,
              clientInfo,
              scheduleDate,
              pmeInfo,
            })
          }
        >
          Pay 0.0001 eth
        </button>
      ) : (
        <>
          {/*@ts-ignore*/}
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
