const assert = require('assert');

const ganache = require('ganache-cli');

const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const {abi, bytecode} = require('../compile');

let lottery;
let accounts;


beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode})
    .send({ from: accounts[0], gas: '1000000'  }); 


});


describe('Lottery Contract', () => {

    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
        
    });

    it('one account enter the lottery', async() => {
        await lottery.methods.enter().send({     // immediately attend to enter
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')     //Tool transfer to Wei

        });

    const players = await lottery.methods.getPlayers().call({   
        from: accounts[0]
    });

    assert.equal(accounts[0],players[0]);   // Compare: The value it should be and the actual value
    assert.equal(1, players.length);        // Compare: The value it should be and the actual value
    });
    
    it('multiple accounts enter the lottery', async() => {
        await lottery.methods.enter().send({     // immediately attend to enter
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')     //Tool transfer to Wei

        });
        await lottery.methods.enter().send({     // immediately attend to enter
            from: accounts[1],
            value: web3.utils.toWei('0.02','ether')     //Tool transfer to Wei

        });
        await lottery.methods.enter().send({     // immediately attend to enter
            from: accounts[2],
            value: web3.utils.toWei('0.02','ether')     //Tool transfer to Wei

        });
        

    const players = await lottery.methods.getPlayers().call({   
        from: accounts[0]
    });

    assert.equal(accounts[0],players[0]);   // Compare: The value it should be and the actual value
    assert.equal(accounts[1],players[1]); 
    assert.equal(accounts[2],players[2]); 
    assert.equal(3, players.length);        // Compare: The value it should be and the actual value
    });

    it('requires a  minimum amount of ether to enter', async() => {
        let executed;
        try{
         await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.001','ether')
        });
        executed = 'success';  //fail us test if it have not thrown an error
        }catch(err){
            executed = 'fail'
        } 
        assert.equal('fail', executed);  //Pass it if it catches an error
    });

    it('only the manager can call this', async() => {
        let executed;
        try{
             await lottery.methods.pickWinner().call({
                 from: accounts[1]
             });
             executed = 'success';
         }catch(err){
             executed = 'fail'
         }
         assert.equal('fail', executed);  //Pass it if it catches an error
     });
    
     it('it sends money ', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('1','ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({from: accounts[0]});
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;      //Spent some money on gas

        console.log(difference);

        assert(difference > web3.utils.toWei('0.8','ether'));   
    });
     
    it('it reset the player array after sending money ', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('1','ether')
        });

        await lottery.methods.pickWinner().send({from: accounts[0]});

       const players = await lottery.methods.getPlayers().call();

       
        assert.equal(0,players.length);
    });        
});