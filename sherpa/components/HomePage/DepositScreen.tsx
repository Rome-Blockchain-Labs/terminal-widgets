import { InformationCircleIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import useSherpaContext from '../../hooks/useSherpaContext'
import Tooltip from 'rc-tooltip'

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
      <div className="text-primary  sm:text-[1.9vw] font-medium lg:text-lg ">
        Token
      </div>
      <div className="lg:text-lg mt-1 flex items-center rounded-sm w-full p-[2.5%] bg-primary text-secondary font-bold sm:text-[1.9vw] pl-2 ">
        AVAX
      </div>
      <div className="flex mt-2">
        <span className="font-medium sm:text-[1.9vw] lg:text-xl">Amount</span>
        <Tooltip
          placement="bottom"
          trigger={['hover']}
          overlay={
            <div className="w-[200px] text-xs sm:text-[1.3vw] lg:text-sm">
              You can only deposit an amount provided in the list as this
              ensures ultimate privacy.
            </div>
          }
        >
          <InformationCircleIcon className="h-3 w-3 sm:h-[1.4vw] sm:w-[1.4vw] lg:w-4 lg:h-4 mb-2" />
        </Tooltip>
      </div>
      <div className="flex justify-between mt-2">
        {AVAXContracts.map((contract: any, index: number) => {
          return (
            <Amount
              key={index}
              active={contract.val === selectedContract.val}
              onClick={() => setSelectedContract(AVAXContracts[index])}
            >
              <span className=" sm:text-[1.9vw] lg:text-xl">
                {contract.val}
              </span>
              <AVAX active={contract.val === selectedContract.val}>AVAX</AVAX>
            </Amount>
          )
        })}
      </div>
      <button
        onClick={createCommitment}
        className="mt-10 sm:mt-auto rounded-full w-full p-[2%] text-primary sm:text-[2.4vw] lg:text-2xl bg-white sm:mb-[5%]"
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
      } sm:text-[1.9vw] lg:text-xl  -mt-1`}
    >
      {children}
    </span>
  )
}
