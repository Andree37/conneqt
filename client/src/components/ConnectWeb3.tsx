'use client'
import {
  useWeb3Modal,
  useWeb3ModalState,
  useWeb3ModalAccount,
  useWeb3ModalSigner,
} from '@web3modal/ethers5/react'

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

export default function ConnectWeb3() {
  console.log('ENTER HEREE')

  // 4. Use modal hook
  const { open } = useWeb3Modal()

  const { selectedNetworkId } = useWeb3ModalState()
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { signer } = useWeb3ModalSigner()

  async function onSignMessage() {
    const signature = await signer?.signMessage('Hello Web3Modal Ethers')
    console.log(signature)
  }

  async function onSendTransaction() {
    const signature = await signer?.sendTransaction({
      to: '0x4579d0Ad79BFBdf4539a1dDF5f10B378D724a34C',
      //This value is defined by the PME
      value: '10000000000000',
    })
    console.log(signature)
  }

  return (
    <>
      {isConnected ? (
        <button style={buttonStyle} onClick={() => onSendTransaction()}>
          Pay
        </button>
      ) : (
        <>
          <button style={buttonStyle} onClick={() => open()}>
            Connect wallet
          </button>
          <button
            style={buttonStyle}
            onClick={() => open({ view: 'Networks' })}
          >
            Open Network Modal
          </button>
        </>
      )}
      {/*  <button onClick={() => open({ view: 'Networks' })}>
        Open Network Modal
      </button> */}
    </>
  )
}
