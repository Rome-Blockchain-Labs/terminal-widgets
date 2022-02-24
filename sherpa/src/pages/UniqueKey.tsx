import React from 'react'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import tw, { styled } from 'twin.macro'
import { saveAs } from 'file-saver';

import * as sherpa from 'sherpa'
import { useWeb3React } from '@web3-react/core'
import web3 from '../web3'
import sherpaClient from 'utils/sherpa'

interface LocationState {
  noteString: string
  commitment: string
  contract: any
}

const weiToEther = (x) => x * 1e18
const UniqueKey = () => {
  const location = useLocation()
  const state = location.state as LocationState
  const [checked, setIsChecked] = useState(false)

  function isChecked(e: React.ChangeEvent<HTMLInputElement>): void {
    const checked = e.target.checked
    setIsChecked(checked)
  }

  const downloadUniqueKey = () => {
    sherpaClient.downloadNote(state.noteString, saveAs)
  }
  const deposit = async () => {
    const accounts = await web3.eth.getAccounts()
    // valueWei, commitment, selectedToken, fromAddress
    await sherpaClient.sendDeposit(
      weiToEther(10),
      state.commitment,
      'avax',
      accounts[0]
    )
  }

  useEffect(() => {
    if (!state || !state.commitment) return
    downloadUniqueKey()
  }, [])

  return (
    <div tw="bg-cover bg-sherpa-bg w-[522px] h-[247px] flex justify-center px-[34px] py-[23px]">
      {console.log(checked)}
      <div tw="text-primary text-[10px] flex flex-col rounded-md w-full backdrop-filter backdrop-blur-md bg-white bg-opacity-50  px-[15px] py-[9px] ">
        <div tw="text-[11px] font-bold">Make a Deposit</div>
        <div tw="mt-1">
          We are giving you a unique key to increase the security of your money
          transaction. Save this unique key to your computer because you will
          need it to withdraw.
        </div>

        <div tw="flex w-full items-center  mt-[14px]">
          <div>
            <div tw="text-[11px] font-bold">Unique Key</div>
            <button
              onClick={downloadUniqueKey}
              tw="rounded mt-1 flex w-[105px] bg-secondary text-white justify-around items-center h-[32px] "
            >
              <span>Download</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                tw="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
          </div>
          <div tw="flex mt-auto mb-2 ml-14">
            <input onChange={(e) => isChecked(e)} type={'checkbox'} />
            <span tw="ml-2">I backed up the note</span>
          </div>
        </div>

        <DepositButton onClick={deposit} disabled={!checked}>
          Deposit
        </DepositButton>
      </div>
    </div>
  )
}

export default UniqueKey

const DepositButton = styled.button<{ disabled: boolean }>`
  ${tw`mt-auto  mb-3 rounded-full w-full h-[28px] text-primary text-[11px] bg-white`}

  ${({ disabled }) => disabled && tw`bg-opacity-40 opacity-40 `}
`
