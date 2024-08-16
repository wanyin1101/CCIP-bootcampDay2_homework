(CCIPLocalSimulator.sol) - Create an instance of CCIPLocalSimulator.sol smart contract.

(CCNS.test.jg) 
1. Call the configuration() function to get Router contract address.

2. Create instances of CrossChainNameServiceRegister.sol, CrossChainNameServiceReceiver.sol and CrossChainNameServiceLookup.sol smart contracts and call the enableChain() function where needed.

3. Call the setCrossChainNameServiceAddress function of the CrossChainNameServiceLookup.sol smart contract "source" instance and provide the address of the CrossChainNameServiceRegister.sol smart contract instance.
Repeat the process for the CrossChainNameServiceLookup.sol smart contract "receiver" instance and provide the address of the CrossChainNameServiceReceiver.sol smart contract instance. 

5. Call the register() function and provide “alice.ccns” and Alice’s EOA address as function arguments.

6. Call the lookup() function and provide “alice.ccns” as a function argument. Assert that the returned address is Alice’s EOA address.


