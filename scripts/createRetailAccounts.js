
//Create User Accounts
var accountPassword = "retailers";
var numberOfUsers = 10; 

for(var index = 0; index < numberOfUsers; index++){
	var userAccount = personal.newAccount(accountPassword);

	console.log("Retailer account created with public key " + userAccount);

	personal.unlockAccount(userAccount,accountPassword,0)

	console.log(userAccount + " Account unlocked")		
}

//Transfer ether to all accounts for do transaction
var allAccounts = personal.listAccounts;
var etherbaseAccount = eth.coinbase;

for(var index=0; index <  allAccounts.length; index++){
	if(allAccounts[index] === eth.coinbase)
		continue;
	
	eth.sendTransaction({
			from: etherbaseAccount,
			to: allAccounts[index],
			value: web3.toWei(100, "ether")
	});
	console.log("Ether send to account " + allAccounts[index]);
}