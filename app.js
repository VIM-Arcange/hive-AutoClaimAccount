const { Client, PrivateKey, Asset } = require('@hiveio/dhive');
const keys = require("../hive-keys.js")

const fs = require('fs');
let config = JSON.parse(fs.readFileSync('config.json'));

const nodemailer = require("nodemailer")
const email = config.email;
const smtp = nodemailer.createTransport({
  host: email.smtp,
  port: email.port,
  secure: false,
  ignoreTLS: true
})

const hiveClient = new Client(config.nodes);

const bDebug = process.env.DEBUG==="true"

const msSecond = 1 * 1000
const msMinute = 60 * msSecond
const msHour = 60 * msMinute
const second = 1
const minute = 60 * second
const hour = 60 * minute

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function notify(subject,body="") {
  try {
    const info = await smtp.sendMail({
      from: email.from,
      to: email.to,
      subject: subject,
      text: body,
      html: body
    })
  }
  catch(e) {
    console.error(e)
  }
}

function datetoISO(date) {
  return date.toISOString().replace(/T|Z/g," ")
}

function log(message) {
  console.log(`${datetoISO(new Date())} - ${message}`)
}

function logerror(message, info="") {
  console.error(`${datetoISO(new Date())} - ${message}`)
  if(!bDebug) {
    notify(`[hive-AutoClaimAccount] ${message}`, info)
  }
}

function logdebug(message) {
  if(bDebug || config.debug) console.log(`${datetoISO(new Date())} - ${message}`);
}

const service = async () => {
  try {
    // Reload config
    config = JSON.parse(fs.readFileSync('config.json'))
    // Get Accounts RCs
    const result = await hiveClient.call('rc_api', 'find_rc_accounts', { accounts: config.accounts.filter(o => o.active).map(o => o.name) })

    for(item of result.rc_accounts) {
      const rcp = Number(item.rc_manabar.current_mana) / Number(item.max_rc) * 100
      const min_rc = config.accounts.find(o => o.name==item.account).min_rc || 99
      logdebug(`${item.account}\t- rc=${rcp.toFixed(2)} min_rc=${min_rc}`)
      if( rcp >= min_rc ) {
        const op = [
          'claim_account',
          {
            creator: item.account,
            fee: Asset.from('0.000 HIVE'),
            extensions: []
          }
        ]

        try {
          const privateKey = PrivateKey.fromString(keys.find(o => o.name==item.account).active)
          const res  = await hiveClient.broadcast.sendOperations([op], privateKey)
          log(`${item.account} successfully claimed a discounted account (txid=${res.id})`);
          await sleep(getRndInteger(3,9) * msSecond)
        } catch(e) {
          logerror(`claim_account failed for ${item.account}: ${e.message}`, JSON.stringify(op))
        }
      }
    }
  } catch (e) {
    logerror(e.message)
  }
}

async function test() {
  service()
}

(async () => {
  if(bDebug) {
    log("Debug Started ")
    test()
  } else {
    if((config.interval || 0) < 60) {
      config.interval = 300
    }

    log("Service Started ")
    log(`HTTP Node: ${config.node}`)
    log(`Interval: ${config.interval} seconds`)
    for(account of config.accounts) log(`Account: ${account.name}`)

    service();
    //Running `service` function every INTERVAL minutes
    setInterval(service, config.interval * msSecond)
  }
})()
