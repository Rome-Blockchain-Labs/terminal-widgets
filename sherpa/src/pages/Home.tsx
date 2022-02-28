import { useEffect, useState } from 'react'
import { ToggleButton } from 'components/ToggleButton'
import { InformationCircleIcon } from '@heroicons/react/outline'
import DepositStat from 'components/DepositStat'
import WithdrawScreen from '../components/WithdrawScreen'
import DepositScreen from 'components/DepositScreen'
import LoadingScreen from 'components/LoadingScreen'
import useSherpaContext from '../hooks/useSherpaContext'

const Home = () => {
  const { AVAXContracts, sherpaClient } = useSherpaContext()
  const client = sherpaClient as any
  const [transaction, setTransaction] = useState<'deposit' | 'withdraw'>(
    'deposit'
  )

  const [selectedContract, setSelectedContract] = useState(AVAXContracts[0])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalDeps, setTotalDeps] = useState()

  useEffect(() => {
    const fetchEvents = async () => {
      if (!client) return
      setLoading(true)
      const weiToEther = (x) => x * 1e18
      const res = await client.fetchEvents(
        weiToEther(selectedContract.val),
        'avax'
      )
      const eventList = res.events.slice(0, 12)
      setTotalDeps(res.events.length)
      setEvents(eventList)
      setLoading(false)
    }
    fetchEvents()
  }, [AVAXContracts, client, selectedContract])

  return (
    <div>
      <div tw="bg-contain bg-sherpa-bg w-[522px] flex justify-center items-stretch px-[34px] py-[23px] gap-[15px]">
        {loading && <LoadingScreen />}
        <div tw="flex flex-col rounded-md w-1/2 backdrop-filter backdrop-blur-md bg-white bg-opacity-50  px-[15px] py-[9px] ">
          <div tw="bg-white rounded-full flex">
            <ToggleButton
              onClick={() => setTransaction('deposit')}
              disabled={transaction === 'deposit'}
            >
              Deposit
            </ToggleButton>
            <ToggleButton
              onClick={() => setTransaction('withdraw')}
              disabled={transaction === 'withdraw'}
            >
              Withdraw
            </ToggleButton>
          </div>
          {transaction === 'deposit' ? (
            <DepositScreen
              selectedContract={selectedContract}
              setSelectedContract={setSelectedContract}
            />
          ) : (
            <WithdrawScreen />
          )}
        </div>

        <div tw="min-h-[247px] rounded-md w-1/2 backdrop-filter backdrop-blur-md bg-[#24466D] bg-opacity-50  px-[15px] py-[9px] ">
          <div tw="flex">
            <div tw="text-white text-[11px] font-bold">STATISTICS</div>
            <div tw="ml-auto">
              <div tw="rounded-[4px]  bg-primary text-secondary p-[6px] text-[11px] font-bold">
                {selectedContract.val}
              </div>
            </div>
          </div>
          <div tw="flex mt-2">
            <span tw="text-[10px] text-white">Anonymity Set</span>
            <InformationCircleIcon tw="mb-2 h-2 w-2 text-white" />
            <div tw="text-[7px] text-white ml-auto mr-1">AVAX</div>
          </div>

          <div tw="flex mt-1 items-center">
            <div tw="rounded-[4px]  bg-primary text-secondary py-[4px] px-[11px] text-[11px] font-bold">
              {totalDeps}
            </div>
            <span tw="text-[9px] ml-[5px] text-white">equal user deposits</span>
          </div>

          <div tw="text-[10px] text-white mt-[12px]">Anonymity Set</div>
          <div tw="grid grid-cols-2 grid-rows-6 grid-flow-col gap-y-[6px] mt-1">
            {events &&
              events.map((deposit, index) => {
                return <DepositStat deposit={deposit} key={index} />
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
