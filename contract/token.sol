pragma solidity ^0.4.6;


/**
 * Math operations with safety checks
 */
contract SafeMath {
  function mul(uint a, uint b) internal returns (uint) {
    uint c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }

  function div(uint a, uint b) internal returns (uint) {
    assert(b > 0);
    uint c = a / b;
    assert(a == b * c + a % b);
    return c;
  }

  function sub(uint a, uint b) internal returns (uint) {
    assert(b <= a);
    return a - b;
  }

  function add(uint a, uint b) internal returns (uint) {
    uint c = a + b;
    assert(c >= a);
    return c;
  }

  function assert(bool assertion) internal {
    if (!assertion) {
      throw;
    }
  }
}


/// Implements ERC 20 Token standard: https://github.com/ethereum/EIPs/issues/20
/// @title Abstract token contract - Functions to be implemented by token contracts.
contract AbstractToken {
    // This is not an abstract function, because solc won't recognize generated getter functions for public variables as functions
    function totalSupply() constant returns (uint256 supply) {}
    function balanceOf(address owner) constant returns (uint256 balance);
    function transfer(address to, uint256 value) returns (bool success);
    function transferFrom(address from, address to, uint256 value) returns (bool success);
    function approve(address spender, uint256 value) returns (bool success);
    function allowance(address owner, address spender) constant returns (uint256 remaining);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract LoyalityToken is AbstractToken, SafeMath{ 

	string public name; 
	string public symbol; 
	uint8 public decimals; 

	uint public initialSupplyPerAddress;
	uint public increasePerAddress;
	address public genesisCallerAddress;

	mapping (address => bool) public isGenesisAddress; 
	mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;

    /**
	*
	* Fix for the ERC20 short address attack
	*
	* http://vessenes.com/the-erc20-short-address-attack-explained/
	*/
    modifier onlyPayloadSize(uint size) {
	    if(msg.data.length < size + 4) {
	      throw;
	    }
	    _;
    }

	function LoyalityToken() { 
	
		name = "LoyalityTokenPoints"; 
		symbol = "LP"; 
		decimals = 18; 
		initialSupplyPerAddress = 3200000000000;
		increasePerAddress = 20000000;
		genesisCallerAddress = msg.sender;
		isGenesisAddress[genesisCallerAddress] = true;
		balances[genesisCallerAddress] = initialSupplyPerAddress;
	}


	function setGenesisAddressArray(address[] _address) public returns (bool success)
	{
		
			if (isGenesisAddress[msg.sender])
			{
				for (uint i = 0; i < _address.length; i++)
				{
					balances[_address[i]] = initialSupplyPerAddress;
					isGenesisAddress[_address[i]] = true;
				}
				return true;
			}

		return false;
	}

	function increaseMyTokenCount() public returns (bool success)
	{
		
		if (isGenesisAddress[msg.sender]){
			balances[msg.sender] = balances[msg.sender] + increasePerAddress;
			return true;
		}
			
		return false;
	}


	function transfer(address _to, uint _value) onlyPayloadSize(2 * 32) returns (bool success) {
	    
	    balances[msg.sender] = sub(balances[msg.sender], _value);
	    balances[_to] = add(balances[_to], _value);
	    Transfer(msg.sender, _to, _value);
	    return true;
  	}


  	function transferFrom(address _from, address _to, uint _value)  returns (bool success) {
	    var _allowance = allowed[_from][msg.sender];

	    // Check is not needed because safeSub(_allowance, _value) will already throw if this condition is not met
	    // if (_value > _allowance) throw;

	    balances[_to] = add(balances[_to], _value);
	    balances[_from] = sub(balances[_from], _value);
	    allowed[_from][msg.sender] = sub(_allowance, _value);
	    Transfer(_from, _to, _value);
	    return true;
    }


    function balanceOf(address _owner) constant returns (uint balance) {
	    return balances[_owner];
	}

	function approve(address _spender, uint _value) returns (bool success) {

	    // To change the approve amount you first have to reduce the addresses`
	    //  allowance to zero by calling `approve(_spender, 0)` if it is not
	    //  already 0 to mitigate the race condition described here:
	    //  https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
	    if ((_value != 0) && (allowed[msg.sender][_spender] != 0)) throw;

	    allowed[msg.sender][_spender] = _value;
	    Approval(msg.sender, _spender, _value);
	    return true;
	}

	function allowance(address _owner, address _spender) constant returns (uint remaining) {
	    return allowed[_owner][_spender];
	}

}