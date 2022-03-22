import React, { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import useSherpaContext from '../../hooks/useSherpaContext'
import Button from './Button'
import { classNames } from '../../utils/twUtils'
import {useWeb3React} from "@web3-react/core";

interface Report {
  deposit: {
    address: string
    id: string
    transaction: string
  }
  withdrawl: {
    address: string
    id: string
    transaction: string
  }
}

const getTxDate = async (txHash:string, web3:any) =>{
  try{
    const { blockNumber } = await web3.eth.getTransaction(txHash)
    const {timestamp } = await web3.eth.getBlock(blockNumber||1)
    return new Date(timestamp*1000)
  }catch{}
}

const Compliance = () => {
  const [uniqueKey, setUniqueKey] = useState<string>()
  const { library } = useWeb3React()
  const [ depositDate, setDepositDate ] = useState<Date>()
  const [ withdrawlDate, setWithdrawlDate ] = useState<Date>()
  const [report, setReport] = useState<Report>()
  const [loading, setLoading] = useState(false)
  const { sherpaClient } = useSherpaContext()
  const client = sherpaClient as any

  useEffect(() => {
    (async () => {
      if (library){
        if (report?.deposit?.transaction){
          getTxDate(report.deposit.transaction, library).then(setDepositDate)
        }
        if (report?.withdrawl?.transaction){
          getTxDate(report.withdrawl.transaction, library).then(setWithdrawlDate)
        }
      }
    })();
  }, [report, library]);
  return (
    <div className="grid w-screen h-screen place-items-center bg-[#12181F]">
      <div className="bg-cover bg-sherpa-bg w-full flex justify-center px-[6.5%] py-[4.4%] max-w-5xl">
        <div className="text-primary sm:text-[1.9vw] lg:text-xl flex flex-col rounded-md w-full backdrop-filter backdrop-blur-md bg-white bg-opacity-50  px-[3vw] py-[1.8vw] ">
          <div className="text-lg sm:text-[2.4vw] lg:text-2xl font-bold">
            Compliance tool
          </div>
          <div className="mt-1">
            You can generate a report for all your deposit/withdraw operations
            processed with SHERPA using the compliance tool. Only you can
            produce this report using the secret note that was generated at
            deposit. SHERPA&apos;s mission is to provide data privacy. However,
            it does not relieve its users from their legal obligations. The
            compliance tool allows you to share this information with the
            relevant authorities
          </div>
          <div className="flex mt-2">
            <span className="font-medium sm:text-[1.9vw] lg:text-lg">
              Unique key
            </span>
          </div>
          <input
            onChange={(e) => setUniqueKey(e.target.value)}
            onKeyPress={async (e) => {
              if (e.key === 'Enter') {
                if (!uniqueKey || !client) return
                const compliance = await client.getCompliance(uniqueKey)
                setReport(compliance)
              }
            }}
            className="px-2 rounded-md text-xs sm:text-[1.7vw] lg:text-lg p-[2%]  mb-3 w-full bg-primary text-white placeholder:text-[#707070]"
            placeholder="Insert unique key here"
            value={uniqueKey}
          />

          <Button
            loading={loading}
            disabled={loading}
            onClick={async () => {
              if (!uniqueKey || !client) return
              setLoading(true)
              const compliance = await client.getCompliance(uniqueKey)

              setLoading(false)
              setReport(compliance)
            }}
          >
            Get report
          </Button>

          {report && (
            <div className="flex flex-col mt-3 gap-y-1">
              <div className="flex">
                <div className="text-lg sm:text-[2.4vw] lg:text-2xl font-bold">
                  Deposit
                </div>
                 <div className="text-lg bg-slate-300 ml-3 p-1 text-white font-bold rounded -mt-1">{depositDate?.toString()}</div>
              </div>
              <Label>Transaction</Label>
              <Value>{report.deposit.transaction}</Value>
              <Label>From Address</Label>
              <Value>{report.deposit.address}</Value>
              <Label>Commitment</Label>
              <Value>{report.deposit.id}</Value>
              <div className="flex mt-3">
                <div className="text-lg sm:text-[2.4vw] lg:text-2xl font-bold">
                  Withdrawal
                </div>
                <div className="text-lg bg-slate-300 ml-3 p-1 text-white font-bold rounded -mt-1">{withdrawlDate?.toString()}</div>
              </div>
              <Label>Transaction</Label>
              <Value>{report.withdrawl.transaction}</Value>
              <Label>To Address</Label>
              <Value>{report.withdrawl.address}</Value>
              <Label>Nullifier Hash</Label>
              <Value className="mb-3">{report.withdrawl.id}</Value>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Compliance

const Value = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={classNames(
        className ? className : '',
        'px-2 rounded-md  text-xs sm:text-[1.7vw] lg:text-lg p-[2%] w-full flex items-center bg-primary text-white placeholder:text-[#707070]'
      )}
    >
      {children}
    </div>
  )
}
const Label = ({ children }: { children: ReactNode }) => {
  return (
    <div className="font-medium sm:text-[1.9vw] lg:text-xl">{children}</div>
  )
}
