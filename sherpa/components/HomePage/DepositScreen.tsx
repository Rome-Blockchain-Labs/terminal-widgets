import { InformationCircleIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import useSherpaContext from '../../hooks/useSherpaContext'

interface DepositScreenProps {
  selectedContract: any
  setSelectedContract: any
}
const DepositScreen = ({
  selectedContract,
  setSelectedContract,
}: DepositScreenProps) => {
  const { sherpaClient } = useSherpaContext()
  const router = useRouter()
  const { AVAXContracts } = useSherpaContext()
  const [commitment, setCommitment] = useState()
  const [noteString, setNoteString] = useState()

  const createCommitment = async () => {
    if (!sherpaClient) return
    const weiToEther = (x: any) => x * 1e18
    const client = sherpaClient as any
    const deposit = client.createDeposit(
      weiToEther(selectedContract.val),
      'avax'
    )
    setCommitment(deposit.commitment)
    setNoteString(deposit.noteString)
  }

  useEffect(() => {
    if (commitment && noteString) {
      router.push({
        pathname: '/unique',
        query: {
          commitment,
          noteString,
          contract: JSON.stringify(selectedContract),
        },
      })
    }
  }, [commitment, noteString, router, selectedContract])

  return (
    <div className="flex flex-col flex-grow mt-2">
      <div className="text-primary text-[1.9vw] font-medium ">Token</div>
      <div className="mt-1 flex items-center rounded-sm w-full p-[2.5%] bg-primary text-secondary font-bold text-[1.9vw] pl-2 ">
        AVAX
      </div>
      <div className="flex mt-2">
        <span className="font-medium text-[1.9vw]">Amount</span>
        <InformationCircleIcon className="w-2 h-2 mb-2" />
      </div>
      <div className="flex justify-between mt-2">
        {AVAXContracts.map((contract: any, index: number) => {
          return (
            <Amount
              key={index}
              active={contract.val === selectedContract.val}
              onClick={() => setSelectedContract(AVAXContracts[index])}
            >
              <span>{contract.val}</span>
              <AVAX active={contract.val === selectedContract.val}>AVAX</AVAX>
            </Amount>
          )
        })}
      </div>

      <button
        onClick={createCommitment}
        className="mt-auto rounded-full w-full p-[2%] text-primary text-[2.4vw] bg-white mb-[10%]"
      >
        Deposit
      </button>
    </div>
  )
}

export default DepositScreen

interface AmountProps {
  active?: boolean
  children: ReactNode
  onClick?: any
}

const Amount = ({ active, children, onClick }: AmountProps) => {
  return (
    <button
      onClick={onClick}
      className={`${
        active ? 'bg-white text-primary' : 'bg-primary text-secondary'
      } flex flex-col items-center justify-center w-[25%] aspect-square rounded-full `}
    >
      {children}
    </button>
  )
}
const AVAX = ({
  active,
  children,
}: {
  active: boolean
  children: ReactNode
}) => {
  return (
    <span
      className={`${
        !active ? 'text-white' : 'text-primary'
      } text-[1.9vw] -mt-1`}
    >
      {children}
    </span>
  )
}
