import axios from 'axios';

import { loggingEndpoint } from '../../config';

//budget logRocket/sentry for error reporting
class LoggerWithCloud {
  userAddress = 'unset';
  constructor(userAddress = 'default') {
    this.userAddress = userAddress;
  }
  async sendToCloud(args, level = 'log') {
    return await axios
      .post(loggingEndpoint, {
        data: args,
        level,
        userAddress: this.userAddress,
      })
      .catch(() => {});
  }
  setUserAddress(userAddress) {
    this.userAddress = userAddress;
  }
  log(...args) {    
    this.sendToCloud(args, 'log');
  }
  error(...args) {
    console.error(...args);
    this.sendToCloud(args, 'error');
  }
}

const singleton = new LoggerWithCloud();
export default singleton;
