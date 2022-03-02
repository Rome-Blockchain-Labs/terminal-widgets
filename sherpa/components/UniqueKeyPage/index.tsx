import React, { ReactNode, useCallback } from 'react'
import { useEffect, useState } from 'react'
import { saveAs } from 'file-saver'
import { useWeb3React } from '@web3-react/core'
import useSherpaContext from '../../hooks/useSherpaContext'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import { classNames } from '../../../sherpa-react/src/utils/twUtils'
import { useRouter } from 'next/router'

const weiToEther = (x: any) => x * 1e18
const UniqueKey = () => {
  const { account } = useWeb3React()
  const router = useRouter()
  const { commitment, noteString, contract } = router.query
  const selectedContract =
    contract && typeof contract === 'string' && JSON.parse(contract)

  const [checked, setIsChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [transaction, setTransaction] = useState('')
  const { sherpaClient } = useSherpaContext()
  const client = sherpaClient as any

  function isChecked(e: React.ChangeEvent<HTMLInputElement>): void {
    const checked = e.target.checked
    setIsChecked(checked)
  }

  const downloadUniqueKey = useCallback(() => {
    if (!sherpaClient) return
    client.downloadNote(noteString, saveAs)
  }, [client, sherpaClient, noteString])
  const deposit = async () => {
    if (!sherpaClient || !contract) return

    setLoading(true)

    const res = await client.sendDeposit(
      weiToEther(selectedContract.val),
      commitment,
      'avax',
      account
    )
    if (res) {
      setTransaction(res)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!commitment) return
    downloadUniqueKey()
  }, [commitment, downloadUniqueKey])

  return (
    <div className="bg-cover bg-sherpa-bg w-[522px] h-[247px] flex justify-center px-[34px] py-[23px]">
      {console.log('account', account)}
      <div className="text-primary text-[10px] flex flex-col rounded-md w-full backdrop-filter backdrop-blur-md bg-white bg-opacity-50  px-[15px] py-[9px] ">
        <div className="text-[11px] font-bold">Make a Deposit</div>
        <div className="mt-1">
          We are giving you a unique key to increase the security of your money
          transaction. Save this unique key to your computer because you will
          need it to withdraw.
        </div>

        <div className="flex w-full items-center  mt-[14px]">
          <div>
            <div className="text-[11px] font-bold">Unique Key</div>
            <button
              onClick={downloadUniqueKey}
              className="rounded mt-1 flex w-[105px] bg-secondary text-white justify-around items-center h-[32px] "
            >
              <span>Download</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
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
          <div className="flex mt-auto mb-2 ml-14">
            <input onChange={(e) => isChecked(e)} type={'checkbox'} />
            <span className="ml-2">I backed up the note</span>
          </div>
        </div>

        <DepositButton onClick={deposit} disabled={!checked}>
          {loading ? (
            <LoadingSpinner />
          ) : transaction ? (
            'Deposit Success'
          ) : (
            'Deposit'
          )}
        </DepositButton>
      </div>
    </div>
  )
}

export default UniqueKey
interface DepositButtonProps {
  disabled?: boolean
  children?: ReactNode
  onClick?: any
}
const DepositButton = ({ disabled, children, onClick }: DepositButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        disabled ? 'bg-opacity-40 opacity-40' : '',
        'grid place-items-center mt-auto  mb-3 rounded-full w-full h-[28px] text-primary text-[11px] bg-white'
      )}
    >
      {children}
    </button>
  )
}
