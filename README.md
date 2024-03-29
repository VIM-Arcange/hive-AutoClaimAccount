# hive-AutoClaimAccount
Automatically claim Hive blockchain discounted accounts  

This app is built to regularly check your available Resource Credits (RC) and claim for an account creation ticket if your RC is above a predefined threshold.

### How to Use

#### Locally

- Clone this repository
- Make sure you have latest LTS or greater version of Node JS installed
- Go inside the cloned folder and type `npm install`
- Rename `config.json.example` to `config.json` and configure your Hive username and active key
- To start the app, type `npm start`

#### Docker

- Clone this repository
- Make sure you have [docker installed](https://docs.docker.com/install/)
- Go inside the cloned folder and type `docker build -t autoclaim .`
- Start a container with `docker run --rm autoclaim`

By default the RC threshold is set to 30 billion. Actually, account claim cost is around 11 billion RC.
If your RC quota raise over the threshold, the app will claim for a new account.
You can easily change the RC threshold in the `.env` configuration file or with docker command.

### Run in background

#### Conventional way

To run the app continuously in background, you can use use [PM2](https://pm2.io/). 
Generate `ecosystem.config.js` file with `pm2 init` command, add environment variables in the file.

When you are done start the bot with following command.

`pm2 start ecosystem.config.js --env production`

#### Docker way

You can start a container in detached mode with `docker run --name autoclaim --rm -d autoclaim`.

If you want to inspect container logs, type `docker logs autoclaim`

### Technologies
- Node JS
- dhive
- Docker (optional)

### Contributing

If you want to contribute to this project, you can fork the repo and make changes. If you have any suggestions or want to report bugs, please create an issue.
