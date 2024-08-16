// SPDX-License-Identifier: MIT
// test/CCNS.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrossChainNameService Test", function () {
    let ccipLocalSimulator;
    let register;
    let receiver;
    let lookupSource;
    let lookupReceiver;
    let alice;

    before(async function () {
        // Deploy the CCIPLocalSimulator contract
        const CCIPLocalSimulator = await ethers.getContractFactory("CCIPLocalSimulator");
        ccipLocalSimulator = await CCIPLocalSimulator.deploy();
        await ccipLocalSimulator.deployed();

        // Get Router contract address from configuration()
        const config = await ccipLocalSimulator.configuration();

        // Deploy CrossChainNameServiceRegister, CrossChainNameServiceReceiver, CrossChainNameServiceLookup
        const CrossChainNameServiceRegister = await ethers.getContractFactory("CrossChainNameServiceRegister");
        const CrossChainNameServiceReceiver = await ethers.getContractFactory("CrossChainNameServiceReceiver");
        const CrossChainNameServiceLookup = await ethers.getContractFactory("CrossChainNameServiceLookup");

        register = await CrossChainNameServiceRegister.deploy(config.sourceRouter);
        await register.deployed();

        receiver = await CrossChainNameServiceReceiver.deploy(config.destinationRouter);
        await receiver.deployed();

        lookupSource = await CrossChainNameServiceLookup.deploy();
        await lookupSource.deployed();

        lookupReceiver = await CrossChainNameServiceLookup.deploy();
        await lookupReceiver.deployed();

        // Enable chain in the receiver contract
        await receiver.enableChain(config.chainSelector);

        // Set the CrossChainNameServiceAddress in lookup contracts
        await lookupSource.setCrossChainNameServiceAddress(register.address);
        await lookupReceiver.setCrossChainNameServiceAddress(receiver.address);

        // Alice's EOA address
        [alice] = await ethers.getSigners();
    });

    it("should register and lookup CCNS name", async function () {
        // Register a new CCNS handle
        const name = "alice.ccns";
        await register.register(name, alice.address);

        // Lookup the registered name
        const resolvedAddress = await lookupSource.lookup(name);

        // Assert that the returned address is Alice's EOA address
        expect(resolvedAddress).to.equal(alice.address);
    });
});
