import Web3 from 'web3';

let web3;

if (window.ethereum) {
    // Request account access if needed
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    // We use MetaMask's provider
    web3 = new Web3(window.ethereum);
} else if (window.web3) {
    // Use Mist/MetaMask's provider
    web3 = new Web3(window.web3.currentProvider);
} else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
}

export default web3;
