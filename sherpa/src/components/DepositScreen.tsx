import { InformationCircleIcon } from '@heroicons/react/outline'
import tw, { styled } from 'twin.macro'
import { useEffect, useState } from 'react'
import * as sherpa from 'sherpa'
import { useNavigate } from 'react-router-dom'

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

const AVAXContracts = [
  {
    val: 10,
    address: '0x66F4f64f9Dce3eB1476af5E1f530228b8eD0a63f',
  },
  {
    val: 100,
    address: '0x66F4f64f9Dce3eB1476af5E1f530228b8eD0a63f',
  },
  {
    val: 500,
    address: '0x66F4f64f9Dce3eB1476af5E1f530228b8eD0a63f',
  },
]

const DepositScreen = () => {
  const [selectedContract, setSelectedContract] = useState(AVAXContracts[0])
  const [commitment, setCommitment] = useState()
  const navigate = useNavigate()

  const createCommitment = async () => {
    const weiToEther = (x) => x * 1e18
    const netId = 43113
    const deposit = await sherpa
      .createDeposit(weiToEther(10), 'avax', netId)
      .catch((err) => console.log(err))
    setCommitment(deposit.commitment)
  }

  useEffect(() => {
    if (commitment) {
      navigate('/unique', {
        state: {
          commitment,
          contract: selectedContract,
        },
      })
    }
  }, [commitment])

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
              active={contract.val === selectedContract.val}
              onClick={() => setSelectedContract(AVAXContracts[index])}
            >
              <span>{contract.val}</span>
              <AVAX active={contract.val === selectedContract.val}>AVAX</AVAX>
            </Amount>
          )
        })}
      </div>

      <button tw="mt-auto rounded-full w-full h-[28px] text-primary text-[11px] bg-white">
        Deposit
      </button>
    </div>
  )
}

export default DepositScreen
