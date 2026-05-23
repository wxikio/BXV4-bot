const { Client, GatewayIntentBits, ActivityType, ChannelType } = require('discord.js');

const TOKEN = process.env.TOKEN;
if (!TOKEN) { console.error("❌ TOKEN manquant dans les variables Railway."); process.exit(1); }

const DELETE_AFTER_MS = 3000;
const processing = new Set();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once('ready', () => {
  console.log(`✅ Connecté → ${client.user.tag}`);
  client.user.setActivity('👀 Ping random !', { type: ActivityType.Watching });
});

client.on('guildMemberAdd', async (member) => {
  if (processing.has(member.id)) return;
  processing.add(member.id);
  setTimeout(() => processing.delete(member.id), 5000);

  try {
    const me = member.guild.members.me;
    const textChannels = member.guild.channels.cache.filter((c) =>
      c.type === ChannelType.GuildText &&
      c.permissionsFor(me).has('SendMessages') &&
      c.permissionsFor(me).has('ManageMessages')
    );
    if (textChannels.size === 0) return console.warn('❌ Aucun salon disponible.');
    const randomChannel = textChannels.random();
    const msg = await randomChannel.send(` ${member} `);
    setTimeout(() => msg.delete().catch(() => {}), DELETE_AFTER_MS);
    console.log(`📨 Ping dans #${randomChannel.name}`);
  } catch (err) {
    console.error('Erreur ping random :', err.message);
  }
});

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
client.login(TOKEN);
