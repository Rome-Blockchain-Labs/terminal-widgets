import { SherpaSDK } from 'sherpa'
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  // eslint-disable-next-line no-restricted-globals
  self.onmessage = (message) => {
    console.log(message)
    postMessage('hello')
  }
}
