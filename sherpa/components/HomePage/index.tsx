import { useEffect, useState } from 'react'
import { ToggleButton } from './ToggleButton'
import { InformationCircleIcon } from '@heroicons/react/outline'
import DepositStat from './DepositStat'
import WithdrawScreen from './WithdrawScreen'
import DepositScreen from './DepositScreen'
import LoadingScreen from '../shared/LoadingScreen'
import useSherpaContext from '../../hooks/useSherpaContext'
import { useResponsive } from '../../hooks/useResponsive'
const Home = () => {
  const { md } = useResponsive()
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
      setTotalDeps(res.events.length)
      setEvents(res.events)
      setLoading(false)
    }
    fetchEvents()
  }, [AVAXContracts, client, selectedContract])

  const eventList = md ? events.slice(0, 16) : events.slice(0, 12)

  return (
    <div className="grid w-screen h-screen place-items-center">
      <div className="bg-cover bg-sherpa-bg w-full flex flex-col sm:flex-row  items-center justify-center sm:items-stretch px-[6.5%] py-[4.4%] gap-[15px]  max-w-5xl">
        {loading && <LoadingScreen />}
        <div className="flex flex-col rounded-md w-1/2 backdrop-filter backdrop-blur-md bg-white bg-opacity-50  p-[2%] ">
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

        <div className="min-h-[247px] rounded-md w-1/2 backdrop-filter backdrop-blur-md bg-[#24466D] bg-opacity-50  px-[3.5%] py-[2%] ">
          <div className="flex">
            <div className="text-white text-[2.4vw] lg:text-2xl font-bold">
              STATISTICS
            </div>
            <div className="ml-auto">
              <div className="rounded-[4px]  bg-primary text-secondary p-[6px] text-[2.4vw] lg:text-2xl font-bold">
                {selectedContract.val}
              </div>
            </div>
          </div>
          <div className="flex mt-2">
            <span className="text-[2.3vw] lg:text-2xl text-white">
              Anonymity Set
            </span>
            <InformationCircleIcon className="w-2 h-2 mb-2 text-white" />
            <div className="text-[1.7vw] lg:text-xl text-white ml-auto mr-[0.5]">
              AVAX
            </div>
          </div>

          <div className="flex items-center mt-1">
            <div className="rounded-[4px]  bg-primary text-secondary py-[4px] px-[11px] text-[2.2vw] lg:text-2xl font-bold">
              {totalDeps}
            </div>
            <span className="text-[1.9vw] lg:text-xl ml-[5px] text-white">
              equal user deposits
            </span>
          </div>

          <div className="text-[2vw] lg:text-xl text-white mt-[12px]">
            Anonymity Set
          </div>
          <div className="grid grid-cols-2 grid-rows-6 grid-flow-col gap-y-[1.3vw] lg:gap-y-3  mt-1 md:grid-rows-8 ">
            {events &&
              eventList.map((deposit, index) => {
                return <DepositStat deposit={deposit} key={index} />
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
