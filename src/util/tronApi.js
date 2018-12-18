import contracts from './abi.json';

const contract = contracts['Test']

console.log(contract, 'contract')

const utils = {
  tronWeb: false,
  contract: false,

  setTronWeb(tronWeb) {
    this.tronWeb = tronWeb;
    this.contract = tronWeb.contract(contract.abi, contract.address)
  },
};

export default utils;
