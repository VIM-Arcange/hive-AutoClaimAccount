# steem-AutoClaimAccount
Automatically claim Hive blockchain discounted accounts  

This app is built to regularly check your available Resource Credits (RC) and claim for an account creation ticket if your RC is above a predifined threshold.

### How to Use

- Clone this repository
- Make sure you have latest LTS or greater version of Node JS installed
- Go inside the cloned folder and type `npm install`
- Rename `.env.example` to `.env` and add your Hive username and active  WIF
- To start the app, type `npm start`

By default the RC threshold is set to 30 billion. Actually, account claim cost is around 11 billion RC.
If your RC quota raise over the threshold, the app will claim for a new account.
You can easily change the RC threshold in the `.env` configuration file.

### 
To run the app continuously in background, you can use use [PM2](https://pm2.io/). 
Generate `ecosystem.config.js` file with `pm2 init` command, add environment variables in the file.

When you are done start the bot with following command.

`pm2 start ecosystem.config.js --env production`

### Technologies
- Node JS
- dSteem

### Contributing

If you want to contribute to this project, you can  fork the repo and make changes. If you have any suggestions or want to report bugs, please create an issue.