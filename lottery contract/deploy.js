const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, bytecode } = require('./compile');

const provider = new HDWalletProvider(

    '🔑 ', 
    'https://rinkeby.infura.io/v3/81724c4b3c964bb485da3f4068131d6f'
);

const web3 = new Web3(provider);

const deploy = async () => {

    try{
    const accounts = await web3.eth.getAccounts();

    console.log('Attemptting to deply from the account', accounts[0])

    const result = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode})
        .send({gas: '1000000', from: accounts[0]});
    
    console.log(abi);
    console.log('Contract deployed to', result.options.address);
    }catch(error){
        console.log(error)
    }
};


deploy();
