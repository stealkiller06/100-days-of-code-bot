const cron = require('node-cron');
const moment = require('moment-timezone');
const fs = require('fs').promises;
const path = require('path');

const TIMEZONE = 'America/Caracas'; // GMT -4

cron.schedule('35 23 * * *', async () => {
    try {
        const client = require("../index.js")
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        if (!guild) throw new Error('Guild not found')

        const channel = guild.channels.cache.get(process.env.CHANNEL_ID);
        if (!channel || !channel.isTextBased()) throw new Error('Channel not found or is not a text channel')

        const startOfToday = moment().tz(TIMEZONE).startOf('day').toDate();
        const endOfDay = moment().tz(TIMEZONE).endOf('day').toDate();

        await guild.members.fetch();

        const role100DaysOfCodeData = guild.roles.cache.get(process.env.ROLE_100_DAYS_OF_CODE);
        if (!role100DaysOfCodeData) {
            throw new Error('Role not found');
        }

        const last100Messages = await channel.messages.fetch({ limit: 100 });
        const messagesSentToday = last100Messages.filter(message => {
            const messageDate = message.createdAt;
            return messageDate >= startOfToday && messageDate <= endOfDay;
        });

        const usernameOfpeopleSentMessagesToday = messagesSentToday.map(message => message.author.username);
        const usersNotMessagedToday = role100DaysOfCodeData.members.filter(member => !usernameOfpeopleSentMessagesToday.includes(member.user.username));

        // Read the previous day's data
        const dataFilePath = path.join(__dirname, 'usersNotMessaged.json');
        let previousData = {};
        try {
            const fileContent = await fs.readFile(dataFilePath, 'utf8');
            previousData = JSON.parse(fileContent);
        } catch (error) {
            console.log('No previous data found or error reading file:', error.message);
        }

        let message = `<@&${process.env.ROLE_100_DAYS_OF_CODE}> Listado de personas que no mandaron sus actualizaciones hoy: \n\n`;
        let usersToRemoveRole = [];

        usersNotMessagedToday.forEach(member => {
            message += `<@${member.id}>, `;

            if (previousData[member.id]) {
                usersToRemoveRole.push(member);
            }
        });

        // Remove roles and send notification
        if (usersToRemoveRole.length > 0) {
            let removalMessage = 'Los siguientes usuarios han sido removidos del reto por no enviar actualizaciones por dos días consecutivos:\n\n';
            for (const member of usersToRemoveRole) {
                await member.roles.remove(role100DaysOfCodeData);
                removalMessage += `<@${member.id}>, `;
            }
            await channel.send(removalMessage);
        }

        // Save current data for next day's comparison
        const currentData = Object.fromEntries(usersNotMessagedToday.map(member => [member.id, true]));
        await fs.writeFile(dataFilePath, JSON.stringify(currentData), 'utf8');

        console.log(message);
        await channel.send(message);

    } catch (error) {
        console.error(error);
    }
});