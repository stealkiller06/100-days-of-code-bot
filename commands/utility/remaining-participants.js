const { SlashCommandBuilder } = require('discord.js');

const PING_SLASH_COMMAND = {
    data: new SlashCommandBuilder()
        .setName('remaining-participants')
        .setDescription('Show the remaining participants in the 100 days of code challenge'),
    async execute(interaction) {
        const client = require('../../index.js');

        const guild = await client.guilds.fetch(process.env.GUILD_ID);

        const channel = await client.channels.fetch(process.env.CHANNEL_ID);
        if (!channel?.isTextBased()) {
            console.error(`Channel with ID ${process.env.CHANNEL_ID} not found or is not a text channel.`);
            client.destroy();
            return;
        }



        await guild.members.fetch(); // Fetch all members in the guild

        const role = guild.roles.cache.get(process.env.ROLE_100_DAYS_OF_CODE);

        const members = role.members;


        let message = 'Estos son los participantes restantes:\n';
        members.forEach(member => {
            message += `${member.user.displayName}\n`;
        });

        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        await interaction.reply(message);

    }
}

module.exports = PING_SLASH_COMMAND;