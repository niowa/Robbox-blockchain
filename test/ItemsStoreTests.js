const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const { promisify } = require('util');
const { readFile } = require('fs');

const readFileAsync = promisify(readFile);

const assert = chai.assert;

const ItemsStore = artifacts.require('FilesStore.sol');

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

contract('ItemsStore', (accounts) => {
  context('After Deploy', () => {
    it('should be owned by creator', async () => {
      const storeContract = await ItemsStore.new();
      assert.equal(await storeContract.owner(), accounts[0]);
    });
  });
  describe('#setAdminAddress', () => {
    it('available only for owner', async () => {
      const storeContract = await ItemsStore.new({from: accounts[0]});
      assert.isRejected(storeContract.setAdminAddress(accounts[1], {from: accounts[1]}));
    });
    it('Cannot set address to 0', async  () => {
      const storeContract = await ItemsStore.new({from: accounts[0]});
      assert.isRejected(storeContract.setAdminAddress(0));
    });
    it('Sets admin address', async  () => {
      const storeContract = await ItemsStore.new({from: accounts[0]});
      await storeContract.setAdminAddress(accounts[1], {from: accounts[0]});
      assert.equal(await storeContract.adminAddress(), accounts[1]);
    });
  });




  describe('#addItem', () => {
    it('available only for admin', async  () => {
      const storeContract = await ItemsStore.new({from: accounts[0]});
      await storeContract.setAdminAddress(accounts[1], {from: accounts[0]});
      assert.isRejected(storeContract.addFile("test decsr", 100, {from: accounts[2]}));
    });
    it.only('creates new item and sets properties form parameters', async  () => {
      const storeContract = await ItemsStore.new({from: accounts[0]});

      const file = await readFileAsync('text.txt');

      await storeContract.addFile('1-1-1', 'test', 'js', 0, file.toString('hex'), {from: accounts[0]});

      const info = await storeContract.getFileInfo.call('1-1-1', { from: accounts[0] });
      console.log(info);
      // await storeContract.addFile('1-1-1', '0.0.1', 'test', 'js', 1, file.toString('hex'), {from: accounts[0]});
      //
      // await storeContract.addFile('1-1-2', '0.0.1', 'test', 'js', 0, file.toString('hex'), {from: accounts[0]});
      //
      // await storeContract.addFileVersion('1-1-2', '0.2', 0, file.toString('hex'), {from: accounts[0]});
      //
      const addFileEvent = () => new Promise((resolve, reject) => {
        const myEvent = storeContract.SaveFile({}, { fromBlock: 0, toBlock: 'latest'});

        myEvent.watch();

        myEvent.get(function(error, events) {
          if (error) {
            reject(error);
          } else {
            resolve(events.map(block => block.args));
          }
        });
        myEvent.stopWatching();
      });

      const addVersionEvent = () => new Promise((resolve, reject) => {
        const myEvent = storeContract.SaveFileVersion({}, { fromBlock: 0, toBlock: 'latest'});

        myEvent.watch();

        myEvent.get(function(error, events) {
          if (error) {
            reject(error);
          } else {
            resolve(events.map(block => block.args));
          }
        });
        myEvent.stopWatching();
      });

      // const addFile = await addFileEvent();
      const addVersion = await addVersionEvent();
      // console.log(addFile);
      console.log(addVersion);
      console.log(web3.toAscii(addVersion[0].version));

    });
  });



  describe('#changeItem', () => {
    it('available only for admin', async  () => {
      const storeContract = await ItemsStore.new({from: accounts[0]});
      await storeContract.setAdminAddress(accounts[1], {from: accounts[0]});
      const id = await storeContract.addItem.call("test decsr", 100, {from: accounts[1]});
      assert.isRejected(storeContract.changeItem.call("test decsr two", 200, id, {from: accounts[2]}));
    });
    it('changes existing item and sets properties form parameters', async  () => {
      const storeContract = await ItemsStore.new({from: accounts[0]});
      await storeContract.setAdminAddress(accounts[1], {from: accounts[0]});
      const id = await storeContract.addItem.call("test decsr", 100, {from: accounts[1]});
      await storeContract.addItem("test decsr", 100, {from: accounts[1]});
      await storeContract.changeItem("test decsr two", 200, id, {from: accounts[1]});
      await sleep(1000);
      assert.equal((await storeContract.items(id))[0], "test decsr two");
      assert.equal((await storeContract.items(id))[1], 200);
    });
  });
});
