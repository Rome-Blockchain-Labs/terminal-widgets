import tw, { styled } from 'twin.macro'
import { differenceInDays, differenceInHours } from 'date-fns'

const Count = styled.div`
  ${tw`rounded-sm px-2 py-[2px]  bg-primary font-bold text-white text-[7px]`}
`
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
    <div tw="flex">
      <Count>{leafIndex}</Count>
      <div tw="ml-[6px] text-primary text-[7px]">
        {' '}
        {diffInDays ? diffInDays + ' days ago' : diff + ' hours ago'}
      </div>
    </div>
  )
}

export default DepositStat
