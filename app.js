// Make sure you have Web3.js library and Metamask installed in your browser

const contractAddress = 0x7d0C9bC954babB2D8e20246421382935cb636185;
const contractABI = [
  [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        }
      ],
      "name": "buyTicket",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "date",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "ticketCount",
          "type": "uint256"
        }
      ],
      "name": "createEvent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "events",
      "outputs": [
        {
          "internalType": "address",
          "name": "organizer",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "date",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "ticketCount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "ticketRemain",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "tickets",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "transferTicket",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
];

const web3 = new Web3(window.ethereum);

const eventContract = new web3.eth.Contract(contractABI, contractAddress);

async function createEvent() {
  const eventName = document.getElementById('eventName').value;
  const eventDate = new Date(document.getElementById('eventDate').value).getTime() / 1000;
  const ticketPrice = web3.utils.toWei(document.getElementById('ticketPrice').value, 'ether');
  const ticketCount = parseInt(document.getElementById('ticketCount').value, 10);
  
  try {
    const accounts = await web3.eth.requestAccounts();
    const sender = accounts[0];
    
    await eventContract.methods.createEvent(eventName, eventDate, ticketPrice, ticketCount).send({ from: sender });
    alert('Event created successfully');
  } catch (error) {
    console.error(error);
    alert('Error creating event');
  }
}

async function loadEvents() {
  const eventsList = document.getElementById('eventsList');
  
  const eventCount = await eventContract.methods.nextId().call();
  
  for (let i = 0; i < eventCount; i++) {
    const eventDetails = await eventContract.methods.events(i).call();
    const eventDate = new Date(eventDetails.date * 1000).toLocaleString();
    
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${eventDetails.name}</strong> (${eventDate}) - Price: ${web3.utils.fromWei(eventDetails.price)} ETH`;
    
    eventsList.appendChild(listItem);
  }
}

window.addEventListener('load', async () => {
  // Request access to the user's Ethereum accounts
  await window.ethereum.enable();
  loadEvents();
});
