"use strict";

const SHA256 = require('crypto-js/sha256');

class BeanInformation {
    constructor(id, originCountry, originFarm, harvestDate, processMethod, location, roastDate, roaster, roasterNotes) {
        this.id = id;
        this.originCountry = originCountry;
        this.originFarm = originFarm;
        this.harvestDate = harvestDate;
        this.processMethod = processMethod;
        this.location = location;
        this.roastDate = roastDate;
        this.roaster = roaster;
        this.roasterNotes = roasterNotes;
    }
}

class Block {
    constructor(timestamp, beanInformation, previousHash = ''){
        this.timestamp = timestamp;
        this.beanInformation = beanInformation;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.beanInformation) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingEntries = [];
    }

    createGenesisBlock() {
        return new Block("31/07/2018", "Genesis Block", "0");
    }

    minePendingEntries() {
        let block = new Block(Date.now(), this.pendingEntries);
        block.mineBlock(this.difficulty);

        console.log("Block mined successfully.");
        this.chain.push(block);

        this.pendingEntries = [];
        // no mining reward in this small example
    }

    createEntry(beanInformation) {
        this.pendingEntries.push(beanInformation);
    }

    getBeanInformation(id) {
        for (const block of this.chain) {
            for (const beanInformation of block.beanInformation) {
                if (beanInformation.id === id) {
                    console.log(Array(40).join("-"));
                    console.log(beanInformation);
                }
            }
        }
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let beantrail = new BlockChain();

beantrail.createEntry(new BeanInformation("RWA-482:9g7", "Ruanda", "Rowo", "20/09/2017", null, "Rwanda", null, null, null));
beantrail.createEntry(new BeanInformation("RWA-482:9g7", "Ruanda", "Rowo", "20/09/2017", "washed", "Morocco", null, null, null));
beantrail.createEntry(new BeanInformation("RWA-482:9g7", "Ruanda", "Rowo", "20/09/2017", "washed", "The Netherlands", null, null, null));
beantrail.createEntry(new BeanInformation("RWA-482:9g7", "Ruanda", "Rowo", "20/09/2017", "washed", "The Netherlands", "13/11/2017", "The Black Raven", "Notes of cherry, vanilla and salted charamel"));
beantrail.createEntry(new BeanInformation("RWA-482:9g7", "Ruanda", "Rowo", "20/09/2017", "washed", "Budapest", "13/11/2017", "The Black Raven", "Notes of cherry, vanilla and salted charamel"));

beantrail.minePendingEntries();
beantrail.getBeanInformation("RWA-482:9g7");