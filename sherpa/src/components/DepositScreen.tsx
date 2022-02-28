import { InformationCircleIcon } from '@heroicons/react/outline'
import tw, { styled } from 'twin.macro'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import sherpaClient from 'utils/sherpa'
import useSherpaContext from '../hooks/useSherpaContext'

const Token = styled.div`
  ${tw`mt-1 flex items-center rounded-sm w-full h-[26px] bg-primary text-secondary font-bold text-[9px] pl-2 `}
`
const Amount = styled.button<{ active: boolean }>`
  ${tw`flex flex-col items-center justify-center w-12 h-12 rounded-full bg-primary text-secondary`}

  ${({ active }) => !active && tw`bg-white text-primary `}
`
const AVAX = styled.span<{ active: boolean }>`
  ${tw`text-primary text-[8px] -mt-1`}

  ${({ active }) => active && tw`text-white `}
`

interface DepositScreenProps {
  selectedContract: any
  setSelectedContract: any
}
const DepositScreen = ({
  selectedContract,
  setSelectedContract,
}: DepositScreenProps) => {
  const { AVAXContracts } = useSherpaContext()
  const [commitment, setCommitment] = useState()
  const [noteString, setNoteString] = useState()
  const navigate = useNavigate()

  const createCommitment = async () => {
    const weiToEther = (x) => x * 1e18
    const deposit = sherpaClient.createDeposit(
      weiToEther(selectedContract.val),
      'avax'
    )
    setCommitment(deposit.commitment)
    setNoteString(deposit.noteString)
  }

  useEffect(() => {
    if (commitment && noteString) {
      navigate('/unique', {
        state: {
          commitment,
          noteString,
          contract: selectedContract,
        },
      })
    }
  }, [commitment, noteString])

  return (
    <div tw="mt-2 flex flex-col flex-grow">
      <div tw="text-primary text-[9px] font-medium ">Token</div>
      <Token>AVAX</Token>
      <div tw="flex mt-2">
        <span tw="font-medium text-[9px]">Amount</span>
        <InformationCircleIcon tw="mb-2 h-2 w-2" />
      </div>
      <div tw="flex justify-between">
        {AVAXContracts.map((contract, index) => {
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
        tw="mt-auto rounded-full w-full h-[28px] text-primary text-[11px] bg-white"
      >
        Deposit
      </button>
    </div>
  )
}

export default DepositScreen
