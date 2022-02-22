import { Contract } from '@ethersproject/contracts'
import CampaignFactory from '../build/CampaignFactory.json'
import { useEffect, useState } from 'react'
import tw, { styled, css, theme } from 'twin.macro'
import { useWeb3React } from '@web3-react/core'
import {
  NetworkName,
  getChainHexByNetworkName,
  getNetworkByNetworkName,
} from '../WalletContext/constants'
import { InjectedConnector } from '@web3-react/injected-connector'
import { isMobile } from 'react-device-detect'
import * as sherpa from 'sherpa'
import { ethers } from 'ethers'
import { ToggleButton } from 'components/ToggleButton'
import { InformationCircleIcon } from '@heroicons/react/outline'
import { ToggleSwitch } from 'components/ToggleSwitch'
import DepositStat from 'components/DepositStat'
import web3 from '../web3'
import { injected } from 'connectors'
import Select from 'components/Select'

const sherpaProxyAddress = '0xC0EB087ac8C732AC23c52A16627c4539d8966d79' //fuji
const selectedContractAddress = '0x66F4f64f9Dce3eB1476af5E1f530228b8eD0a63f' //fuji 10avax
const injectedProvider = new InjectedConnector({})
const Home = () => {
  const [commitment, setCommitment] = useState()
  const [transaction, setTransaction] = useState<'deposit' | 'withdraw'>(
    'deposit'
  )
  console.log(sherpa)
  const FACTORY_ADDRESS = '0x1da8a83eD1e8d76B8dE28653E657Efc8295b1ee6'

  const { library, active, activate, deactivate } = useWeb3React()

  const [campaigns, setCampaigns] = useState()
  const [loading, setLoading] = useState(false)
  // connect to rinkeby before clicking to init contract button
  const initContract = async () => {
    setLoading(true)
    // const signer = library.getSigner()
    const accounts = await web3.eth.getAccounts()
    const instance = new web3.eth.Contract(CampaignFactory.abi, FACTORY_ADDRESS)
    const c = await instance.methods.getDeployedCampaigns().call()
    // const c = await instance.getDeployedCampaigns().call()
    // const contract = new Contract(FACTORY_ADDRESS, CampaignFactory.abi, signer)
    // const c = await contract.getDeployedCampaigns()
    setCampaigns(c)
    setLoading(false)
  }

  const confirmDeposit = async () => {
    // const signer = library.getSigner()

    const accounts = await web3.eth.getAccounts()
    // const weiValue = 10
    // const tokens = web3.utils.toWei(weiValue, 'avax')
    // const ethValue = ethers.utils.formatEther(weiValue)
    const weiToEther = (x) => x * 1e18
    const netId = 43113
    const deposit = await sherpa.createDeposit(weiToEther(10), 'avax', netId)
    console.log('withdrawl info within', deposit) //todo add download step
    const commitment = deposit.commitment
    await sherpa.sendDeposit(
      library,
      weiToEther(10),
      sherpaProxyAddress,
      netId,
      selectedContractAddress,
      commitment,
      'avax',
      accounts[0]
    )
  }

  const connectToWallet = async () => {
    await activate(injectedProvider)
  }
  useEffect(() => {
    const makeDeposit = async () => {
      const netId = 43113
      const deposit = await sherpa.createDeposit(10, 'avax', netId)
      setCommitment(deposit.commitment)

      console.log(deposit)
    }
    makeDeposit()
  }, [])

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized || (isMobile && window.ethereum)) {
        activate(injected)
        // next line is a for for: https://giters.com/NoahZinsmeister/web3-react/issues/257
        window?.ethereum?.removeAllListeners(['networkChanged'])
      }
    })
  }, [activate])

  return (
    <div className="">
      {console.log(transaction !== 'deposit', 'transaction')}

      {console.log(transaction !== 'withdraw', 'transaction')}
      {console.log(active)}
      {loading && <div>getting campaigns...</div>}
      {campaigns && <div>{JSON.stringify(campaigns)}</div>}
      {/* <button onClick={initContract} className="border bg-slate-400">
        Instantiate Contract and get deployed campaign
      </button>
      <div tw="bg-red-500 text-xl">{active}</div>
      <Button variant="primary" onClick={() => switchNetwork('Avalanche Fuji')}>
        switch network avalanche
      </Button>
      <Button variant="primary" onClick={() => switchNetwork('Rinkeby')}>
        connect to rinkeby
      </Button>
      <Button variant="primary" onClick={() => connectToWallet()}>
        wallet connect
      </Button>
      <Button variant="primary" onClick={deactivate}>
        disconnect
      </Button>
      <Button onClick={confirmDeposit}>finalize deposit</Button> */}
      {/* <div tw="bg-red-700">faldf</div> */}

      <div tw="bg-contain bg-sherpa-bg w-[522px]  flex justify-center items-stretch px-[34px] py-[23px] gap-[15px]">
        <div tw="rounded-md w-1/2 backdrop-filter backdrop-blur-md bg-white bg-opacity-50  px-[15px] py-[9px] ">
          <div tw="bg-white rounded-full flex">
            <ToggleButton disabled={transaction !== 'deposit'}>
              Deposit
            </ToggleButton>
            <ToggleButton disabled={transaction !== 'withdraw'}>
              Withdraw
            </ToggleButton>
          </div>

          <div tw="flex w-full mt-2">
            <div>
              <div tw="flex">
                <span tw="font-medium text-[9px]">Relayer Mode</span>
                <InformationCircleIcon tw="mb-2 h-2 w-2" />
              </div>
              <ToggleSwitch />
            </div>

            <div tw="ml-2">
              <div tw="flex">
                <span tw="font-medium text-[9px]">Relayer Fee</span>
                <InformationCircleIcon tw="mb-2 h-2 w-2" />
              </div>
              <Select />
              {/* <select tw="rounded-sm w-[118px] h-[26px] bg-[#03283D] text-[#19A99D] font-bold text-[9px]">
                <option
                  value="asd"
                  tw="w-[120px] h-[26px] bg-[#03283D] text-[#19A99D]"
                >
                  Sherpa Relayer - 1%
                </option>
              </select> */}
            </div>
          </div>

          <div>
            <div tw="flex">
              <span tw="font-medium text-[9px]">Unique Key</span>
              <InformationCircleIcon tw="mb-2 h-2 w-2" />
            </div>
            <input
              tw="px-2 rounded-sm text-[7px] h-[26px] w-full bg-[#03283D] text-white placeholder:text-[#707070]"
              placeholder="Insert Unique Key Here"
            />
          </div>

          <div tw="mt-[6px]">
            <div tw="flex">
              <span tw="font-medium text-[9px]">Recipient Wallet Address</span>
              <InformationCircleIcon tw="mb-2 h-2 w-2" />
            </div>
            <input
              tw="px-2 rounded-sm text-[7px] h-[26px] w-full bg-[#03283D] text-white placeholder:text-[#707070]"
              placeholder="Insert Address Here"
            />
          </div>

          <button tw="mt-[7px] rounded-full w-full h-[28px] text-[#03283D] text-[11px] bg-white">
            Withdraw
          </button>
        </div>

        <div tw="rounded-md w-1/2 backdrop-filter backdrop-blur-md bg-[#24466D] bg-opacity-50  px-[15px] py-[9px] ">
          <div tw="flex">
            <div tw="text-white text-[11px] font-bold">STATISTICS</div>
            <div tw="ml-auto">
              <div tw="rounded-[4px]  bg-[#03283D] text-[#19A99D] p-[6px] text-[11px] font-bold">
                10
              </div>
            </div>
          </div>
          <div tw="flex mt-2">
            <span tw="text-[10px] text-white">Anonymity Set</span>
            <InformationCircleIcon tw="mb-2 h-2 w-2 text-white" />
            <div tw="text-[7px] text-white ml-auto mr-1">AVAX</div>
          </div>

          <div tw="flex mt-1 items-center">
            <div tw="rounded-[4px]  bg-[#03283D] text-[#19A99D] py-[4px] px-[11px] text-[11px] font-bold">
              4685
            </div>
            <span tw="text-[9px] ml-[5px] text-white">equal user deposits</span>
          </div>

          <div tw="text-[10px] text-white mt-[12px]">Anonymity Set</div>
          <div tw="grid grid-cols-2 grid-rows-6 grid-flow-col gap-y-[6px] mt-1">
            {Array(12)
              .fill(undefined)
              .map((ele) => {
                return <DepositStat key={ele} />
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

const switchNetwork = async (networkName: NetworkName) => {
  console.log(networkName)
  console.log(getChainHexByNetworkName(networkName))
  //todo make this more generic -- ie switch network for non evm
  await window?.ethereum
    ?.request({
      method: 'wallet_switchEthereumChain',

      params: [{ chainId: getChainHexByNetworkName(networkName) }],
    })
    .catch((err: any) => {
      console.log(err)
      const { blockExplorerUrl, chainHex, name, nativeCurrency, rpcUrl } =
        getNetworkByNetworkName(networkName)

      window?.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            blockExplorerUrls: [blockExplorerUrl],
            chainId: chainHex,
            chainName: name,
            nativeCurrency,
            rpcUrls: [rpcUrl],
          },
        ],
      })
    })
}
