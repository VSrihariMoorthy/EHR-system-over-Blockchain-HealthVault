# React Truffle Box

This box comes with everything you need to start using Truffle to write, compile, test, and deploy smart contracts, and interact with them from a React app.

1. Clone the repo,
2. Open using vscode or any other ide.
3. Run ganache, configure project settings ⚙️ to add truffle-config.js path of the repo in ganache project.
4. In metamask, import account by entering the network address, chain id or similar details and make sure that 100 eth is available as soon as you configure the above. 
5. Then run these commands in vscode, after cd ing it to this repo.

```sh
$ cd truffle
$ npm install
$ truffle compile
$ truffle deploy

cd ../client
$ npm install
$ npm start
```
Curated EHRs are available in this repository - https://github.com/VSrihariMoorthy/EHR-system-over-Blockchain-HealthVault-CuratedEHRs


