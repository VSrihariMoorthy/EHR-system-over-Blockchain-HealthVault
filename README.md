# Verified Access to EHR over Blockchain and IPFS with Lit Protocol Encryption

This repository implements the system described in our paper published at the **2024 IEEE International Conference on Blockchain and Distributed Systems Security (ICBDS)**: *"Verified Access to EHR over Blockchain and IPFS with Lit Protocol Encryption."*

**IEEE Xplore:** https://ieeexplore.ieee.org/document/10837546

## Abstract

The growing digitization of medical information has raised the possibility of medical records being stolen or manipulated in addition to their convenience. To overcome this, our work suggests a cutting-edge EHR sharing system that uses Blockchain and decentralized storage to safely and conveniently store and exchange medical records. Our work required curating patients' medical records to test and validate our system's working. Data from sources like MIMIC-III are considered to curate and populate the EHRs with all possible types of medical data. Our proposed EHR system is built on top of the Ethereum Blockchain, with IPFS for decentralized storage of the EHR, and MetaMask for facilitating transactions securely. IPFS system stores content using a content addressable mechanism by default, allowing anyone with a file's CID to access it. To secure EHRs on the IPFS network, we encrypt EHRs using the Lit protocol before being stored in the IPFS network. It allows authorized users to retrieve the EHRs and decrypt them without introducing additional latency to the blockchain system. Additionally, we have implemented an OTP mechanism to authenticate a patient's access to the patient portal before accessing the EHRs for added security. The patient has the sole authority to grant and revoke access to their EHRs to a doctor. The implementation proves good for the secured sharing of EHR with less overheads.

**Full text (ResearchGate):** https://www.researchgate.net/publication/388129677_Verified_Access_to_EHR_over_Blockchain_and_IPFS_with_Lit_Protocol_Encryption

## Citation Requirement

**Use of this repository, its code, or the accompanying curated EHR dataset, in any research, publication, product, or derivative work, requires citation of the paper below.** This applies to academic papers, technical reports, theses, and any public or commercial use of the system or data.

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
---
## Setup

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

The curated EHR dataset used to test and validate this system is available in a companion repository: https://github.com/VSrihariMoorthy/EHR-system-over-Blockchain-HealthVault-CuratedEHRs
