# 100 Days of Code Discord Bot

This bot is designed to manage the Discord channel for the 100 Days of Code challenge. It helps keep track of participants and ensures they are actively participating by sending daily messages.

## Features

### Daily Message Check

The bot checks the messages sent by participants each day. If a participant hasn't sent a message by 11:00 PM, the bot will send a reminder message listing the participants who haven't sent their daily message.

### Slash Commands

The bot includes a slash command to display the list of users who are still participating in the challenge.

#### `/remaining-participants`

Displays the list of users who are still in the 100 Days of Code challenge.

## Setup

1. Clone the repository.
2. Install the dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file based on the `.env.example` file and fill in the required values:
   ```env
   TOKEN=
   CLIENT_ID=
   GUILD_ID=
   CHANNEL_ID=
   ROLE_100_DAYS_OF_CODE=
   ```
4. Deploy the commands:
   ```sh
   node deploy-commands.js
   ```
5. Start the bot:
   ```sh
   node index.js
   ```

## Dependencies

- [discord.js](https://discord.js.org/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [node-cron](https://www.npmjs.com/package/node-cron)
- [sequelize](https://sequelize.org/)
- [sqlite3](https://www.npmjs.com/package/sqlite3)

## License

This project is licensed under the ISC License.
