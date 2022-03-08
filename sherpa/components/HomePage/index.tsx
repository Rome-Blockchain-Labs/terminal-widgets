import { useEffect, useState } from 'react'
import { ToggleButton } from './ToggleButton'
import { InformationCircleIcon } from '@heroicons/react/outline'
import DepositStat from './DepositStat'
import WithdrawScreen from './WithdrawScreen'
import DepositScreen from './DepositScreen'
import LoadingScreen from '../shared/LoadingScreen'
import useSherpaContext from '../../hooks/useSherpaContext'

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
      const weiToEther = (x: any) => x * 1e18
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
      <div className="bg-contain bg-sherpa-bg w-[522px] flex justify-center items-stretch px-[34px] py-[23px] gap-[15px]">
        {loading && <LoadingScreen />}
        <div className="flex flex-col rounded-md w-1/2 backdrop-filter backdrop-blur-md bg-white bg-opacity-50  px-[15px] py-[9px] ">
          <div className="flex bg-white rounded-full">
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

        <div className="min-h-[247px] rounded-md w-1/2 backdrop-filter backdrop-blur-md bg-[#24466D] bg-opacity-50  px-[15px] py-[9px] ">
          <div className="flex">
            <div className="text-white text-[11px] font-bold">STATISTICS</div>
            <div className="ml-auto">
              <div className="rounded-[4px]  bg-primary text-secondary p-[6px] text-[11px] font-bold">
                {selectedContract.val}
              </div>
            </div>
          </div>
          <div className="flex mt-2">
            <span className="text-[10px] text-white">Anonymity Set</span>
            <InformationCircleIcon className="w-2 h-2 mb-2 text-white" />
            <div className="text-[7px] text-white ml-auto mr-1">AVAX</div>
          </div>

          <div className="flex items-center mt-1">
            <div className="rounded-[4px]  bg-primary text-secondary py-[4px] px-[11px] text-[11px] font-bold">
              {totalDeps}
            </div>
            <span className="text-[9px] ml-[5px] text-white">
              equal user deposits
            </span>
          </div>

          <div className="text-[10px] text-white mt-[12px]">Anonymity Set</div>
          <div className="grid grid-cols-2 grid-rows-6 grid-flow-col gap-y-[6px] mt-1">
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
