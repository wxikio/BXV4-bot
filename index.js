
const {
  Client,
  GatewayIntentBits,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActivityType,
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const SEP      = '━━━━━━━━━━━━━━━━━━━━━━━━━━';
const OWNER_ID = '1222217828770516992';

// ════════════════════════════════════════════════════════
//  READY
// ════════════════════════════════════════════════════════
client.once('ready', () => {
  console.log(`✅  Connecté → ${client.user.tag}`);
  client.user.setActivity('🛒 Shop | !cmd', { type: ActivityType.Watching });
});

// ════════════════════════════════════════════════════════
//  COMMANDES
// ════════════════════════════════════════════════════════
client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('!') || message.author.bot) return;

  if (message.author.id !== OWNER_ID) {
    return message.reply({ embeds: [
      new EmbedBuilder()
        .setColor(0xed4245)
        .setTitle('❌ Accès Refusé')
        .setDescription('Tu n\'es pas autorisé à utiliser ce bot.')
        .setFooter({ text: 'Bot privé • Accès restreint' }),
    ]});
  }

  const args = message.content.slice(1).trim().split(/ +/);
  const cmd  = args.shift().toLowerCase();

  // ════════════════════════════════════════════════════
  //  !cmd
  // ════════════════════════════════════════════════════
  if (cmd === 'cmd') {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('📋 Liste des Commandes')
      .setDescription('Toutes les commandes disponibles du bot.')
      .addFields(
        {
          name: '⚙️ Général',
          value:
            '`!setup` — Crée tous les salons & envoie les embeds\n' +
            '`!clear` — Supprime tous les salons du serveur\n' +
            '`!status <texte>` — Change le statut du bot\n' +
            '`!cmd` — Affiche cette liste',
        },
        {
          name: '💰 Prix des Produits',
          value:
            '🖥️ **FiveM Ready** — `0.13€`\n' +
            '💬 **Discord FA** — `0.05€`\n' +
            '🎮 **Steam FA** — `0.03€`\n' +
            '🎬 **Netflix** — `0.15€`\n' +
            '▶️ **YouTube Premium** — `1.00€`',
        },
        {
          name: '🎫 Tickets',
          value: 'Bouton **🎫 Ouvrir un Ticket** dans `🎫・ouvrir-ticket`\nBouton **🔒 Fermer** pour supprimer',
        },
      )
      .setFooter({
        text: `Demandé par ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    return message.channel.send({ embeds: [embed] });
  }

  // ════════════════════════════════════════════════════
  //  !status
  // ════════════════════════════════════════════════════
  if (cmd === 'status') {
    const newStatus = args.join(' ');
    if (!newStatus) return message.reply('❌ Usage : `!status <texte>`');

    client.user.setActivity(newStatus, { type: ActivityType.Watching });

    return message.channel.send({ embeds: [
      new EmbedBuilder()
        .setColor(0x57f287)
        .setTitle('✅ Statut Mis à Jour')
        .setDescription(`Nouveau statut :\n\`\`\`${newStatus}\`\`\``)
        .setFooter({ text: `Modifié par ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp(),
    ]});
  }

  // ════════════════════════════════════════════════════
  //  !clear
  // ════════════════════════════════════════════════════
  if (cmd === 'clear') {
    const msg = await message.reply('🗑️ Suppression de tous les salons en cours…');

    for (const [, channel] of message.guild.channels.cache) {
      if (channel.id === message.channel.id) continue;
      await channel.delete().catch(() => {});
    }

    await msg.edit('✅ Tous les salons ont été supprimés. Tape `!setup` pour tout recréer.');
    setTimeout(() => message.channel.delete().catch(() => {}), 3000);
    return;
  }

  // ════════════════════════════════════════════════════
  //  !setup
  // ════════════════════════════════════════════════════
  if (cmd === 'setup') {
    const msg = await message.reply('⏳ Setup en cours… quelques secondes.');
    await setupServer(message.guild);
    await msg.edit('✅ **Setup terminé !** Tous les salons et embeds ont été créés.');
  }
});

// ════════════════════════════════════════════════════════
//  BIENVENUE AUTO
// ════════════════════════════════════════════════════════
client.on('guildMemberAdd', async (member) => {
  const ch = member.guild.channels.cache.find((c) => c.name === '👋・bienvenue');
  if (!ch) return;

  const avatarURL = member.user.displayAvatarURL({ dynamic: true, size: 512 });

  const embed = new EmbedBuilder()
    .setColor(0x57f287)
    .setAuthor({ name: `${member.user.username} vient d'arriver !`, iconURL: avatarURL })
    .setTitle(`👋 Bienvenue sur ${member.guild.name} !`)
    .setDescription(
      `Salut ${member} ! On est ravis de t'accueillir 🎉\n\n` +
      `> 🛒 Consulte nos produits dans le **Shop**\n` +
      `> 🎫 Besoin d'aide ? Ouvre un **Ticket**\n` +
      `> 📜 Pense à lire les **règles**`
    )
    .setThumbnail(avatarURL)
    .addFields(
      { name: '👤 Membre', value: `${member}`, inline: true },
      { name: '🪪 ID', value: `\`${member.id}\``, inline: true },
      { name: '👥 Membre n°', value: `**${member.guild.memberCount}**`, inline: true }
    )
    .setImage(avatarURL)
    .setFooter({
      text: `${member.guild.name} • Shop Premium`,
      iconURL: member.guild.iconURL({ dynamic: true }) ?? undefined,
    })
    .setTimestamp();

  ch.send({ content: `${member}`, embeds: [embed] });
});

// ════════════════════════════════════════════════════════
//  BOUTONS TICKETS
// ════════════════════════════════════════════════════════
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'open_ticket') {
    const guild    = interaction.guild;
    const user     = interaction.user;
    const safeName = `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20)}`;

    const existing = guild.channels.cache.find((c) => c.name === safeName);
    if (existing)
      return interaction.reply({ content: `❌ Tu as déjà un ticket ouvert → ${existing}`, ephemeral: true });

    const cat = guild.channels.cache.find(
      (c) => c.type === ChannelType.GuildCategory && c.name.toLowerCase().includes('ticket')
    );

    const ch = await guild.channels.create({
      name: safeName,
      type: ChannelType.GuildText,
      parent: cat?.id ?? null,
      permissionOverwrites: [
        { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        {
          id: user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
        },
      ],
    });

    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 256 });

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setAuthor({ name: user.tag, iconURL: avatarURL })
      .setTitle('🎫 Ticket Ouvert')
      .setDescription(
        `Bonjour ${user} ! 👋\n\n` +
        `Un membre du **support** va te répondre sous peu.\n` +
        `Décris ta commande ou ton problème ci-dessous.`
      )
      .addFields(
        { name: '👤 Utilisateur', value: `${user}`, inline: true },
        { name: '🪪 ID', value: `\`${user.id}\``, inline: true },
        { name: '📅 Ouvert le', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
      )
      .setThumbnail(avatarURL)
      .setFooter({ text: 'Clique 🔒 pour fermer le ticket' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('close_ticket').setLabel('🔒 Fermer le Ticket').setStyle(ButtonStyle.Danger)
    );

    await ch.send({ content: `${user}`, embeds: [embed], components: [row] });
    return interaction.reply({ content: `✅ Ticket créé → ${ch}`, ephemeral: true });
  }

  if (interaction.customId === 'close_ticket') {
    await interaction.reply('🔒 Fermeture dans **5 secondes**…');
    setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
  }
});

// ════════════════════════════════════════════════════════
//  SETUP SERVER
// ════════════════════════════════════════════════════════
async function setupServer(guild) {
  const readOnly = [{ id: guild.id, deny: [PermissionFlagsBits.SendMessages] }];
  const mkCat    = (name) => guild.channels.create({ name, type: ChannelType.GuildCategory });
  const mkText   = (name, parent, perms = readOnly) =>
    guild.channels.create({ name, type: ChannelType.GuildText, parent: parent.id, permissionOverwrites: perms });

  const catInfo    = await mkCat('📢 INFORMATIONS');
  const catShop    = await mkCat('🛒 SHOP');
  const catTickets = await mkCat('🎫 TICKETS');

  const chWelcome = await mkText('👋・bienvenue', catInfo);
  const chRules   = await mkText('📜・règles',    catInfo);
  await mkText('📣・annonces', catInfo);

  const chPrix    = await mkText('💰・prix',     catShop);
  const chFivem   = await mkText('🖥️・fivem',   catShop);
  const chSteam   = await mkText('🎮・steam',   catShop);
  const chDiscord = await mkText('💬・discord', catShop);
  const chNetflix = await mkText('🎬・netflix', catShop);
  const chYoutube = await mkText('▶️・youtube', catShop);

  const chTicket = await guild.channels.create({
    name: '🎫・ouvrir-ticket',
    type: ChannelType.GuildText,
    parent: catTickets.id,
    permissionOverwrites: readOnly,
  });

  // ── Bienvenue ───────────────────────────────────────
  await chWelcome.send({ embeds: [
    new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle(`🏠 Bienvenue sur ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setDescription(
        `Bienvenue sur le meilleur shop de comptes premium !\n\n` +
        `🛒 **Produits disponibles :**\n` +
        `> 🖥️ FiveM Ready [Fresh] — \`0.13€\`\n` +
        `> 🎮 Steam Full Access — \`0.03€\`\n` +
        `> 💬 Discord FA Accounts — \`0.05€\`\n` +
        `> 🎬 Netflix Lifetime — \`0.15€\`\n` +
        `> ▶️ YouTube Premium — \`1.00€\`\n\n` +
        `${SEP}\n` +
        `⚡ Livraison instantanée — Support 24/7\n` +
        `🎫 Ouvre un ticket pour commander`
      )
      .setFooter({ text: `${guild.name} • Shop Premium` })
      .setTimestamp(),
  ]});

  // ── Règles ──────────────────────────────────────────
  await chRules.send({ embeds: [
    new EmbedBuilder()
      .setColor(0xfee75c)
      .setTitle('📜 Règles du Serveur')
      .setDescription(
        `**1.** Respectez tous les membres.\n` +
        `**2.** Aucun spam, flood ou pub non autorisée.\n` +
        `**3.** Toute arnaque = ban permanent.\n` +
        `**4.** Lisez la description des produits avant d'acheter.\n` +
        `**5.** Le staff a le dernier mot.\n\n` +
        `> ✅ En rejoignant ce serveur, vous acceptez ces règles.`
      )
      .setFooter({ text: 'Non-respect = sanction immédiate' }),
  ]});

  // ── Prix ────────────────────────────────────────────
  await chPrix.send({ embeds: [
    new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle('💰 Prix de Nos Produits')
      .setDescription(`Liste complète de nos prix.\nOuvre un ticket pour commander !\n\n${SEP}`)
      .addFields(
        {
          name: '🛒 Produits',
          value:
            `🖥️ **FiveM Ready [Fresh]** \n> \`0.13€\` par compte\n\n` +
            `💬 **Discord FA Account** \n> \`0.05€\` par compte\n\n` +
            `🎮 **Steam Full Access** \n> \`0.03€\` par compte\n\n` +
            `🎬 **Netflix Lifetime** \n> \`0.15€\` par compte\n\n` +
            `▶️ **YouTube Premium** \n> \`1.00€\` par compte`,
        },
        { name: SEP, value: ' ' },
        {
          name: '📦 Informations',
          value:
            `⚡ Livraison **instantanée** après paiement\n` +
            `🛡️ Garantie **remplacement** incluse\n` +
            `🎫 Ouvre un **ticket** pour commander`,
        }
      )
      .setFooter({ text: '💰 Prix fixes • Paiement sécurisé' })
      .setTimestamp(),
  ]});

  // ── FiveM ───────────────────────────────────────────
  await chFivem.send({ embeds: [
    new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('🛡️ FiveM Ready [Fresh] – Full Access Accounts')
      .setDescription(`Get fresh **FiveM Ready** accounts instantly.\nIdeal for **unbans** and **spoofers**, fully compatible with FiveM servers.\n\n${SEP}`)
      .addFields(
        {
          name: '🛠️ Key Features',
          value:
            `🧾 **Email : Password Format** — easy to use, ready for login\n` +
            `🔐 **Full Access** — ability to change both e-mail & password\n` +
            `🧠 **Spoofer & Unban Ready** — optimized for FiveM use only\n` +
            `⚡ **Instant Delivery** — automated system for immediate access\n` +
            `📨 **Webmail Access** — included for full control\n` +
            `🔁 **Free Replacement** — available within warranty period\n` +
            `🛡️ **48h Warranty** — fast support & protection after purchase`,
        },
        { name: SEP, value: ' ' },
        {
          name: '💥 Why FiveM Ready Stands Out',
          value:
            `💡 Perfect for bypassing bans or starting fresh\n` +
            `🚀 Instant access after payment\n` +
            `🔁 Full account control included\n` +
            `🥇 First provider on the market offering stable FiveM accounts`,
        },
        { name: SEP, value: ' ' },
        { name: '💰 Prix', value: '> 🏷️ **0.13€** par compte' }
      )
      .setFooter({ text: '⚡ Instant Delivery • 🛡️ 48h Warranty' })
      .setTimestamp(),
  ]});

  // ── Steam ───────────────────────────────────────────
  await chSteam.send({ embeds: [
    new EmbedBuilder()
      .setColor(0x1b2838)
      .setTitle('🎮 Steam Full Access – Fresh Account')
      .setDescription(`Comptes Steam **Full Access**, neufs et prêts à l'emploi.\n\n${SEP}`)
      .addFields(
        {
          name: '✅ Ce qui est inclus',
          value:
            `🔑 **Full Access** — Username + Password + Email\n` +
            `📬 **Webmail Access** — contrôle total de l'email\n` +
            `📦 **Format** : \`Username : Password : Email : Email Password\`\n` +
            `⚡ **Livraison instantanée** après paiement\n` +
            `🆕 **Compte neuf** — jamais utilisé`,
        },
        { name: SEP, value: ' ' },
        { name: '💰 Prix', value: '> 🏷️ **0.03€** par compte' }
      )
      .setFooter({ text: '🎮 Steam Full Access • Livraison Instantanée' })
      .setTimestamp(),
  ]});

  // ── Discord ─────────────────────────────────────────
  await chDiscord.send({ embeds: [
    new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('💬 FA Discord Accounts – Full Access & Verified')
      .setDescription(`Comptes Discord **sécurisés, privés et vérifiés**, prêts à l'emploi.\n\n${SEP}`)
      .addFields(
        {
          name: '🧾 Types de Comptes',
          value:
            `📧 **E-Mail Verified** — Vérifié basique (2025)\n` +
            `📱 **E-Mail + Phone Verified** — Double vérifié (2025)\n` +
            `🕒 **3+ Months Aged** — Vieilli & vérifié\n` +
            `📅 **Year-Based** — 2023, 2020, 2019, 2017, 2016\n` +
            `💎 **Nitro 1 Mois + 2 Boosts** — Phone vérifié\n` +
            `🚀 **Nitro 3 Mois + 2 Boosts** — Phone vérifié`,
        },
        { name: SEP, value: ' ' },
        {
          name: '🧰 Ce qui est inclus',
          value:
            `🔐 Full access & identifiants modifiables\n` +
            `📧 Vérification email et/ou téléphone selon variante\n` +
            `🧼 Privé, non utilisé & 100% sûr\n` +
            `⚡ Livraison instantanée après paiement\n` +
            `🕒 Garantie remplacement 24h`,
        },
        { name: SEP, value: ' ' },
        { name: '💰 Prix', value: '> 🏷️ **0.05€** par compte' }
      )
      .setFooter({ text: '💬 Discord Premium • Garanti & Sécurisé' })
      .setTimestamp(),
  ]});

  // ── Netflix ─────────────────────────────────────────
  await chNetflix.send({ embeds: [
    new EmbedBuilder()
      .setColor(0xe50914)
      .setTitle('🎬 Netflix Lifetime Account')
      .setDescription(`Films & séries **illimités** — un paiement, accès à vie.\n\n${SEP}`)
      .addFields(
        {
          name: '✅ Ce qui est inclus',
          value:
            `🔥 **Netflix Premium** — Accès à vie\n` +
            `👪 **Jusqu'à 4 appareils** simultanément (UHD/4K)\n` +
            `🌍 **Sans restriction de région** — fonctionne partout\n` +
            `📱 **Compatible** Smart TV, téléphone, tablette & plus\n` +
            `⚡ **Livraison instantanée** après paiement\n` +
            `🛠️ **Support complet** inclus`,
        },
        { name: SEP, value: ' ' },
        { name: '💰 Prix', value: '> 🏷️ **0.15€** par compte' }
      )
      .setFooter({ text: '🎬 Netflix Premium • One-time Purchase' })
      .setTimestamp(),
  ]});

  // ── YouTube ─────────────────────────────────────────
  await chYoutube.send({ embeds: [
    new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle('▶️ YouTube Premium – Full Access (Own Account)')
      .setDescription(`Profite de **YouTube Premium** sans pubs, lecture arrière-plan, téléchargements & YouTube Music.\n\n${SEP}`)
      .addFields(
        {
          name: '🔐 Comment ça marche ?',
          value:
            `📩 Après l'achat, ouvre un **ticket** sur notre Discord\n` +
            `🔑 On t'envoie un compte **Full Access** (email + password)\n` +
            `👤 Tu peux changer le mot de passe & tout sécuriser`,
        },
        { name: SEP, value: ' ' },
        {
          name: '✅ Ce qui est inclus',
          value:
            `▶️ **YouTube Premium** — Compte Full Access\n` +
            `🔑 **Identifiants complets** — email + password\n` +
            `🔄 **Mot de passe & récupération modifiables**\n` +
            `📵 **Sans publicités** — lecture en arrière-plan\n` +
            `📥 **Téléchargements offline** — YouTube Music inclus\n` +
            `🌍 **Fonctionne partout** — PC, iOS, Android, TV\n` +
            `⚡ **Livraison & activation instantanées**\n` +
            `🛠️ **Support dédié** inclus`,
        },
        { name: SEP, value: ' ' },
        { name: '💰 Prix', value: '> 🏷️ **1.00€** par compte' }
      )
      .setFooter({ text: '▶️ YouTube Premium • Full Ownership & Control' })
      .setTimestamp(),
  ]});

  // ── Ticket Panel ────────────────────────────────────
  await chTicket.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle('🎫 Support & Commandes')
        .setDescription(
          `Besoin d'aide ou tu veux passer une commande ?\n\n` +
          `Clique sur le bouton ci-dessous pour ouvrir un **ticket privé**.\n` +
          `Notre équipe te répondra le plus vite possible.\n\n` +
          `${SEP}\n` +
          `⏱️ Temps de réponse : **< 10 minutes**\n` +
          `🛡️ Tous les achats sont **garantis**\n` +
          `📌 1 ticket par utilisateur`
        )
        .setFooter({ text: '🎫 Support • Shop Premium' })
        .setTimestamp(),
    ],
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('open_ticket').setLabel('🎫 Ouvrir un Ticket').setStyle(ButtonStyle.Primary)
      ),
    ],
  });
}

// ════════════════════════════════════════════════════════
//  LOGIN
// ════════════════════════════════════════════════════════
const TOKEN = process.env.TOKEN;
if (!TOKEN) { console.error('❌ TOKEN manquant dans les variables Railway.'); process.exit(1); }
client.login(TOKEN);
