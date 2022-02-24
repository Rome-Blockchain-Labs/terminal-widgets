import * as sherpa from 'sherpa'
import web3 from '../web3'

const netId = 43113
const sherpaClient = new sherpa.SherpaSDK(netId, web3)
console.log(sherpaClient.createDeposit)
export default sherpaClient
