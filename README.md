# EHR System over Blockchain — HealthVault

This repository implements the system described in our paper published at the **2024 IEEE International Conference on Blockchain and Distributed Systems Security (ICBDS)**: *"Verified Access to EHR over Blockchain and IPFS with Lit Protocol Encryption."*

If you use this system, or the curated EHR dataset, in your research, please cite our paper:

> V. S. Moorthy, K. Saravanan, H. B, S. Saravanan and R. G. J, "Verified Access to EHR over Blockchain and IPFS with Lit Protocol Encryption," 2024 IEEE International Conference on Blockchain and Distributed Systems Security (ICBDS), Pune, India, 2024, pp. 1-7, doi: 10.1109/ICBDS61829.2024.10837546.

```bibtex
@INPROCEEDINGS{10837546,
  author={Moorthy, V Srihari and Saravanan, Karthikeyan and B, Hariviyaas and Saravanan, Sudhan and J, Rolant Gini},
  booktitle={2024 IEEE International Conference on Blockchain and Distributed Systems Security (ICBDS)}, 
  title={Verified Access to EHR over Blockchain and IPFS with Lit Protocol Encryption}, 
  year={2024},
  volume={},
  number={},
  pages={1-7},
  keywords={Protocols;MIMICs;Medical services;Blockchains;Encryption;Portals;Blockchain;EHR;Decentralization;IPFS;Lit protocol;Validating Access to EHR},
  doi={10.1109/ICBDS61829.2024.10837546}}
```

Paper link: https://ieeexplore.ieee.org/document/10837546

The curated EHR dataset used to test and validate this system is available in a companion repository: https://github.com/VSrihariMoorthy/EHR-system-over-Blockchain-HealthVault-CuratedEHRs

---

## About this project

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
