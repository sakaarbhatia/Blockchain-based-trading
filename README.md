# Loyalty rewards on blockchain

Refer to screenshots folder for system look!

## Setup
1. clone the repository to local directory
2. go to blockchain-based-trading folder
3. npm install
This will download all the dependencies

## Pre-requisites before starting server

Please note that all the mentioned steps are required

1. Start an ethereum (geth) node OR a quorum node and type geth attach

In geth console window, Launch scripts using command loadscript("<scriptName>") :
a. createRetailAccounts.js : This script will create 10 retail organisation  accounts, unlock them, and transfer ethers to these accounts for transactions, Your coinbase should already have some ethers for this puropse *(Required for demo purposes)*
b. tokenDeploy.js : This script will deploy loyality tokens contract on the peer to peer network. Allot initial tokens to the genesis (caller) address. This script also returns the contract address.

2. Update config.json :
a. tokenAddress : Copy this address this field
b. nodeAddress : Enter node rpc address to which application will connect

3. Update retailers.json :
a. Add created addresses from createRetailAccounts.js to this json file and keep password as "retailers" //you can change it as per your address password *(Required for demo purposes)*

4. MongoDB products
a. Setup mongodb server and create a database named "loyaltyRewards"
b. copy products.json from setup folder and use mongoimport to fill products collection
mongoimport -d loyaltyRewards -c products --file products.json


5. Final Step is to add list of created retail addresses as genesis addresses in token contract (Allows them ownership in loyality points) using setGenesisAddressArray function of contract which accepts an array of addreses to make them owner. This function can only be called via an already owner. 
If not using console, you can you one of the server API to do this :
POST : localhost:3000/api/transaction/genesis
Parameters example:
```
{
	"address": "0xed9d02e382b34818e88b88a309c7fe71e65f419d",
	"password": "retailers",
	"genesisAddresses": "0x00ebace8aa25281d8ab4e30082759077384e264d;0xbec2822622448995975c9c649c17d597b1073627;0x8f51274a2d362345c9a9ee54c84ab15cc78d3450"
}
```

Remember to seperate addresses by ;
screenshot :
![request format](/screenshots/genesisRequest.png)


After all the steps are completed
###start the server
command : *node server.js*

You can access the application at localhost:3000

Process information

Registering a user : 
Register a user using GUI, this process in the backend will do 2 things :
1. Create a new user in local database
2. Create an ethereum account for this user (This account password will be the password used to register) (DEMO PURPOSES)
3. Select a random account from retailers.json, which will transfer some initial tokens from retailer account to user account. *(DEMO PURPOSES)*

![register](/screenshots/register.png)

Login User:
Login using your username and password
![login](/screenshots/login.png)

Now, this will open the shopping/transfer website for you where you can :

![landing page](/screenshots/landingPage.png)


#### 1. Buy a product using your loyality points

![products](/screenshots/products.png)


![buy](/screenshots/buy.png)



#### 2. Transfer your loyality points to any other user using his public key

![transfer](/screenshots/transfer.png)



#### 3. View your passbook

![passbook](/screenshots/passbook.png)



Layout :


![layout](/screenshots/layout.png)


confirmation:


![confirm](/screenshots/confirm.png)
