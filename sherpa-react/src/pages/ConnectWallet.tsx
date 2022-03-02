import MetamaskLogo from 'assets/MetaMaskLogo'

const ConnectWallet = () => {
  return (
    <div tw="w-[522px] h-[293px] bg-black bg-opacity-70  text-[#C1FF00] grid place-items-center px-[34px] py-[23px] gap-[15px]">
      <div tw="bg-[#1C2430] w-[240px] mx-auto p-4 rounded-md ">
        <div tw="flex w-full ">
          <div tw="text-[8px] ">CONNECT YOUR WALLET</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            tw="ml-auto w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <hr tw="border-t border-[#515967] mt-2" />

        <button tw="rounded-md mt-4 flex  border border-[#60666E] w-[155px]  h-[34px] px-[10px]  items-center mx-auto">
          <div tw="text-white font-medium text-[9px]">Metamask </div>

          <MetamaskLogo tw="ml-auto" />
        </button>

        <div tw="text-center text-[#b4bbc7] text-[7px] mt-4">
          By connecting your wallet, <br />
          you agree to our Sherpa's Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  )
}

export default ConnectWallet
