const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const app = express()
const port = 3000
const ethSchema = require('./models/eth');



mongoose.connect('mongodb+srv://aj:ajmani@cluster0-c60su.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Database Connected'));


app.use(bodyParser.urlencoded({extended:false}))
app.set('view engine','pug')

app.get('/', function (req, res) {
    res.render('auth')
})

app.post('/', async function(req,res){
  var address = new ethSchema({
    email: req.body.email,
    ethaddress: req.body.ethereum
  });   
  try {
     const savedAddress = await address.save();
     res.render('dataSaved', {yourdata : address});
  } catch(err) {
    res.send("Did not save");
    console.log(err);
  }
})

//Routes for Canidates and Private key page has to be figured out.
//opine.com/electionID
app.get('/vote/:id', function(req,res){
  const id = req.params.id;
   res.render('category')
})

//Things need to be changed, especially contracts...
app.post('/vote/:id',function(req,res){
  const id = req.params.id;
    const Web3 = require('web3');
    const Tx = require('ethereumjs-tx').Transaction;
    const provider = new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/88492df009e34eab951ae05a2e5f1d69");
    const web3 = new Web3(provider);
    const ethaddress = (req.body.ethaddress)
    const account1 = `${ethaddress}`
    const privateKey = (req.body.pkey);
    web3.eth.defaultAccount = account1;
    const privateKey1 = Buffer.from(`${privateKey}`, 'hex');
    //change ABI ---Settled
    const abi = [
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "_voterAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "_voterName",
            "type": "string"
          }
        ],
        "name": "addVoter",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_candidateId",
            "type": "uint256"
          }
        ],
        "name": "doVote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "endVote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "restartVote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "startVote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "voter",
            "type": "address"
          }
        ],
        "name": "voteDone",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [],
        "name": "voteStarted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "voter",
            "type": "address"
          }
        ],
        "name": "voterAdded",
        "type": "event"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "ballotOfficialAddress",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "candidates",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "voteCount",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "candidatesCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "state",
        "outputs": [
          {
            "internalType": "enum Election.State",
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "voterRegister",
        "outputs": [
          {
            "internalType": "string",
            "name": "voterName",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "voted",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ];
    //change contract address --- Settled.
    const contract_Address = '0xddAc624E273bB4Df0d3ED3Da73475aBD3ac47C98';
    const contract = new web3.eth.Contract(abi, contract_Address);
    const myData = contract.methods.doVote(req.body.optradio).encodeABI();
    web3.eth.getTransactionCount(account1, (err, txCount) => {
    // Build the transaction
      const txObject = {
        nonce:    web3.utils.toHex(txCount),
        to:       contract_Address,
        value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),
        gasLimit: web3.utils.toHex(2100000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('6', 'gwei')),
        data: myData  
      }
        // Sign the transaction
        const tx = new Tx(txObject, {chain:'ropsten', hardfork: 'petersburg'});
        tx.sign(privateKey1);
        const serializedTx = tx.serialize();
        const raw = '0x' + serializedTx.toString('hex');
        // Broadcast the transaction
        const transaction = web3.eth.sendSignedTransaction(raw, (err, tx) => {
            if(err) return console.log(req.body.optradio);
            res.render('youVoted', {candidate: req.body.optradio, transaction: tx});
        });
    });
  })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))