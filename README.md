# tictactoe-eth

> Play tic tac toe - with Solidity

## Install deps

```sh
npm install
cd frontend
npm install
cd ..
```

## Checks

- Test contracts: `npm test`
- Lint: `npm run check`

## Deploy contract

### Local deploy

1. Start Hardhat's testing network: `npm run hardhat:node`
2. Deploy contract locally; while testing network is running: `npm run deploy:contract:localhost`

## Configure MetaMask

Connect MetaMask to local Hardhat's testing network:

* New RPC URL: http://127.0.0.1:8545/
* Chain ID: 31337
* Currency Symbol: GO

Look at the output of `npm run hardhat:node`, copy some account private keys and import them into MetaMask.

MetaMask on *Chrome Incognito* mode will detect account change on all tabs (even non Incognito tabs).
The only way I found to use multiple MetaMask accounts at the same time is using a different *Chrome Profile*.

## Start frontend

Once the Hardhat's testing network is running locally and contract is deployed, launch

```sh
cd frontend
npm start
```

## References

- [MetaMask Ethereum Provider API](https://docs.metamask.io/guide/ethereum-provider.html)
