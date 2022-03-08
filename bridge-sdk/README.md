# Bridge SDK

## Quick Start

1. `yarn`
2. `yarn build`
3. `npm link`
4. Clone this project in a separate folder `https://github.com/iandjx/iframed-react.git`
5. `npm i`
6. `npm link @rome/bridgesdk`
7. `npm run dev`
8. Load rome-frontend branch `https://github.com/Rome-Blockchain-Labs/rome-frontend/tree/feat-sherpa-iframe-buttons`
9. `yarn start`
10. open hello world widget

## Explanation of Quick Start

Runnin npm link will expose the bridgesdk locally without the need of publishing it to npm for local dev purposes. iframed-react project loads and implements te bridgesdk. The branch in the rome-frontend loads the widget helloworld with the src url being http://localhost:3001 which is the iframed-react link. The tools.tsx inside the hello world starts up the transport bus to wait for messages from the child iframe
