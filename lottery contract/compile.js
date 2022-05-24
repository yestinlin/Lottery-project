// SPDX-License-Identifier: MIT

// build path from compiler to solidity file
const path = require('path');
const fs = require('fs');
const solc =require('solc');

//for unix and windows
//take you from root dir to this inbox folder and both files

const lotteryPath = path.resolve(__dirname, 'contracts','Lottery.sol');

// read contents of file with encoding
const source = fs.readFileSync(lotteryPath, 'UTF-8');

var input = {
    language: 'Solidity',
    sources: {
        'Lottery.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
};

// parses solidity to English and strings 
var output = JSON.parse(solc.compile(JSON.stringify(input)));

var outputContracts = output.contracts['Lottery.sol']['Lottery']

// exports ABI interface
module.exports.abi = outputContracts.abi;

// exports bytecode from smart contract
module.exports.bytecode = outputContracts.evm.bytecode.object;
