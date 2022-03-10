import React, { ReactNode } from 'react'
import { InformationCircleIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import useSherpaContext from '../../hooks/useSherpaContext'
import Button from './Button'
import { classNames } from '../../utils/twUtils'

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

const Compliance = () => {
  const [uniqueKey, setUniqueKey] = useState<string>()
  const [report, setReport] = useState<Report>()
  const [loading, setLoading] = useState(false)
  const { sherpaClient } = useSherpaContext()
  const client = sherpaClient as any
  return (
    <div className="grid w-screen h-screen place-items-center">
      <div className="bg-cover bg-sherpa-bg w-full max-w-5xl   flex justify-center px-[6.5%] py-[4.4%]">
        <div className="text-primary text-[1.9vw] flex flex-col rounded-md w-full backdrop-filter backdrop-blur-md bg-white bg-opacity-50  px-[3vw] py-[1.8vw] ">
          <div className="text-[2.4vw] font-bold">Compliance tool</div>
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
            <span className="font-medium text-[1.9vw]">Unique Key</span>
            <InformationCircleIcon className="w-2 h-2 mb-2" />
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
            className="px-2 rounded-sm text-[1.7vw] p-[2%]  mb-3 w-full bg-primary text-white placeholder:text-[#707070]"
            placeholder="Insert Unique Key Here"
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
            Get Report
          </Button>

          {report && (
            <div className="flex flex-col mt-3 gap-y-1">
              <div className="flex">
                <div className="text-[2.4vw] font-bold">Deposit</div>
                {/* <div>{format(new Date(), 'EEE MMM dd yyyy HH:mm OOOO')}</div> */}
              </div>
              <Label>Transaction</Label>
              <Value>{report.deposit.transaction}</Value>
              <Label>From Address</Label>
              <Value>{report.deposit.address}</Value>
              <div className="flex">
                <div className="text-[2.4vw] font-bold">Withdrawal</div>
                {/* <div>{format(new Date(), 'EEE MMM dd yyyy HH:mm OOOO')}</div> */}
              </div>
              <Label>Transaction</Label>
              <Value>{report.withdrawl.transaction}</Value>
              <Label>To Address</Label>
              <Value className="mb-3">{report.withdrawl.address}</Value>
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
        'px-2 rounded-sm text-[1.7vw] p-[2%] w-full flex items-center bg-primary text-white placeholder:text-[#707070]'
      )}
    >
      {children}
    </div>
  )
}
const Label = ({ children }: { children: ReactNode }) => {
  return <div className="font-medium text-[1.9vw]">{children}</div>
}
