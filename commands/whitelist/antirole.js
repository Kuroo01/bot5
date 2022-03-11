const db = require('quick.db');
const Discord = require('discord.js');
const {
    blue,
    logs,
    owner,
    emojiAttention,
    prefix
} = require('../../../config.json');
const emojis = require('../../../emojis.json')
module.exports = {
    name: 'antirole',
    description: 'Désactive / Active l\'antirole',
    aliases: ['antirole', 'Antirole'],
    usage: 'antirole [on/off]',
    perms: `\`Whitelist\``,

    async execute(message, args, client, lang) {

        let prefixchange;
        if (!prefixchange) {
            prefixchange = prefix
        } else {
            prefixchange = db.get(`${message.guild.id}.prefix`)
        }

        let logchannel;
        if (db.get(`${message.guild.id}.Logs`)) {
            logchannel = message.guild.channels.cache.get(db.get(`${message.guild.id}.Logs`))
        } else {
            logchannel = message.guild.channels.cache.find((ch) => ch.name === logs)
        }

        let color;
        if (db.get(`${message.guild.id}.Color`)) {
            color = db.get(`${message.guild.id}.Color`)
        } else {
            color = blue;
        }

        const WLAlready = new Discord.MessageEmbed()
            .setColor(color)
            .setDescription(`${emojis.alert} <@${message.author.id}> ${lang.WhitelistNoInWL}`)
            .setTimestamp()
            .setFooter(`${client.user.username} `, `${client.user.displayAvatarURL()}`);

        if  (db.get(`${message.guild.id}.WLUsers`) === undefined || db.get(`${message.guild.id}.WLUsers`) === null) {
            if (message.guild.owner) {
                db.push(`${message.guild.id}.WLUsers`, message.guild.owner.id);
            }
        } else if 
         (db.get(`${message.guild.id}.Owners`) === undefined || db.get(`${message.guild.id}.Owners`) === null) {
            db.push(`${message.guild.id}.Owners`, message.guild.owner.id);
        }

        
        if (!message.guild.owner) return;
        if (!db.get(`${message.guild.id}.WLUsers`).includes(message.author.id)) {
            return message.channel.send(WLAlready);
        }

        if (args[0] === 'on') {
            db.set(`${message.guild.id}.antiRole`, true);
            message.channel.send({
                embed: {
                    color: color,
                    description: `${lang.BanAction} ${lang.AntiRoleEnable} \n ${lang.BanAuthor} <@${message.author.id}>`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} `,
                    },
                },
            });

            if (!logchannel) return
            logchannel.send({
                embed: {
                    color: color,
                    description: `${lang.BanAction} ${lang.AntiRoleEnable} \n ${lang.BanAuthor} <@${message.author.id}>`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} `,
                    },
                },
            });
        } else if (args[0] === 'off') {
            db.set(`${message.guild.id}.antiRole`, false);
            message.channel.send({
                embed: {
                    color: color,
                    description: `${lang.BanAction} ${lang.AntiRoleDisable} \n ${lang.BanAuthor} <@${message.author.id}>`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} `,
                    },
                },
            });

            if (!logchannel) return
            logchannel.send({
                embed: {
                    color: color,
                    description: `${lang.BanAction} ${lang.AntiRoleDisable} \n ${lang.BanAuthor} <@${message.author.id}>`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} `,
                    },
                },
            });
        } else {
            message.channel.send({
                embed: {
                    color: color,
                    description: `${lang.WhitelistPreciseOFFoON} ${lang.AntiRoleFinalWord}`,
                    footer: {
                        icon_url: `${client.user.displayAvatarURL()}`,
                        text: `${client.user.username} `,
                    },
                },
            });
        }
    },
};
