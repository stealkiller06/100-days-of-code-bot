const cron = require('node-cron');
const moment = require('moment-timezone');


const TIMEZONE = 'America/Caracas'; // GMT -4

cron.schedule('0 23 * * *', async () => {

    try {

        const client = require("../index.js")

        const guild = client.guilds.cache.get(process.env.GUILD_ID); // Replace with your guild ID

        if (!guild) throw new Error('Guild not found')


        const channel = guild.channels.cache.get(process.env.CHANNEL_ID); // Replace with your channel ID

        if (!channel || !channel.isTextBased()) throw new Error('Channel not found or is not a text channel')

        const startOfToday = moment().tz(TIMEZONE).startOf('day').toDate();
        const endOfDay = moment().tz(TIMEZONE).endOf('day').toDate();

        await guild.members.fetch(); // Fetch all members in the guild

        const role100DaysOfCodeData = guild.roles.cache.get(process.env.ROLE_100_DAYS_OF_CODE);

        if (!role100DaysOfCodeData) {
            throw new Error('Role not found');
        }


        const last100Messages = await channel.messages.fetch({ limit: 100, });
        const messagesSentToday = last100Messages.filter(message => {
            const messageDate = message.createdAt;
            return messageDate >= startOfToday && messageDate <= endOfDay;
        });


        const usernameOfpeopleSentMessagesToday = messagesSentToday.map(message => message.author.username);

        const usersNotMessagedToday = role100DaysOfCodeData.members.filter(member => !usernameOfpeopleSentMessagesToday.includes(member.user.username));

        let message = `<@&${process.env.ROLE_100_DAYS_OF_CODE}> Listado de personas que no mandaron sus actualizaciones hoy (Si apareces dos días seguidos en esta lista estarás eliminado del reto): \n\n`;

        usersNotMessagedToday.forEach(member => {
            message += `<@${member.user.id}>, `;
        });

        console.log(message)
        channel.send(message)


    } catch (error) {
        console.error(error)
    }
});