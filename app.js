const { Client, PrivateKey, Asset } = require('@hiveio/dhive');
const dotnev = require('dotenv');

dotnev.config();

const hiveClient = new Client('https://api.hive.blog');
hiveClient.database.getVersion().then((res) => {
  //console.log("blockchain version",res.blockchain_version)
  if (res.blockchain_version !== '0.23.0') {
    hiveClient.updateOperations(true)
  }
})

const config = {
  HIVE_ACCOUNT: process.env.HIVE_ACCOUNT,
  ACTIVE_WIF: process.env.ACTIVE_WIF,
  RC_THRESHOLD: process.env.RC_THRESHOLD,
};

const log = (message) => {
  console.log(`${new Date().toString()} - ${message}`);
};

// Returns an account's Resource Credits data
async function getRC(username) {
  return hiveClient.call('rc_api', 'find_rc_accounts', { accounts: [username] });
}

const startProcessing = async () => {
  const op = ['claim_account', {
    creator: config.HIVE_ACCOUNT,
    fee: Asset.from('0.000 HIVE'),
    extensions: [],
  }];  

  try {
    // Load account info
    const ac = await getRC(config.HIVE_ACCOUNT);
    if (ac.rc_accounts.length > 0) {
      const rc = Number(ac.rc_accounts[0].rc_manabar.current_mana);
      log(config.HIVE_ACCOUNT + '\'s RC is ' + rc.toString());
      if( rc > config.RC_THRESHOLD * 1000000000000 ) {
        hiveClient.broadcast.sendOperations([op], PrivateKey.from(config.ACTIVE_WIF))
        .then((res) => {
          console.log(res);
          log('You have successfully claimed a discounted account');
        })
        .catch(err => {
          log(err);
        });
      }
    }
  } catch (e) {
    log(e.message);
  }
};

(async () => {
  log("Process Started ")
  console.log("user: " + config.HIVE_ACCOUNT + " - Thresold: " + config.RC_THRESHOLD.toString())
  startProcessing();

  // Running `startProcessing` function every hour
  setInterval(startProcessing, 1 * 60 * 60 * 1000);
})();
