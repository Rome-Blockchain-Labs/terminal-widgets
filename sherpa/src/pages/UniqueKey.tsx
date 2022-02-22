import React from 'react'

const UniqueKey = () => {
  return (
    <div tw="bg-cover bg-sherpa-bg w-[522px] h-[247px] flex justify-center px-[34px] py-[23px]">
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
            <button tw="rounded mt-1 flex w-[105px] bg-secondary text-white justify-around items-center h-[32px] ">
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
            <input type={'checkbox'} />
            <span tw="ml-2">I backed up the note</span>
          </div>
        </div>

        <button tw="mt-auto  mb-3 rounded-full w-full h-[28px] text-primary text-[11px] bg-white">
          Deposit
        </button>
      </div>
    </div>
  )
}

export default UniqueKey
