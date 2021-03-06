import { differenceInDays, differenceInHours } from 'date-fns'

interface DepositStatProps {
  deposit: {
    dateTime: any
    leafIndex: number
  }
}

const DepositStat = ({
  deposit: { leafIndex, dateTime },
}: DepositStatProps) => {
  const diff = differenceInHours(new Date(), dateTime)
  const diffInDays = diff > 24 && differenceInDays(new Date(), dateTime)
  return (
    <div className="flex">
      <div className="rounded-md px-2 py-[2px]  bg-primary font-bold text-white text-xs  sm:text-[1.5vw] lg:text-lg">
        {leafIndex}
      </div>
      <div className="ml-[6px] text-primary font-semibold  text-xs sm:text-[1.5vw] lg:text-lg">
        {diffInDays ? diffInDays + ' days ago' : diff + ' hours ago'}
      </div>
    </div>
  )
}

export default DepositStat
