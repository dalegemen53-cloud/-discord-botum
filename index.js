const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express');
const app = express();

// Render'ın botu 7/24 açık tutması için gereken can simidi web sunucusu
app.get('/', (req, res) => {
    res.send('Bot 7/24 Aktif ve Cayır Cayır Çalışıyor kanka!');
});
app.listen(process.argv[3] || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Senin Discord ID'ni buraya çaktım kanka, kurucu sensin!
const KURUCU_ID = "1313190167418503259"; 

client.on('ready', () => {
    console.log(`${client.user.tag} olarak giriş yapıldı! Sistem hazır kurucum.`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // 1. KURUCU MUAFİYETİ (Sen yazdıysan filtreleri saniyede deler geçer)
    if (message.author.id === KURUCU_ID) {
        // Kurucuya özel komut: !log
        if (message.content === '!log') {
            return message.reply('👑 **Kurucu Girişi Başarılı!** Son bot logları: Sistem stabil, uyarılardan muafsınız başkan.');
        }
        return; 
    }

    // 2. KÜFÜR VE FİLTRE SİSTEMİ (Sadece kurucu harici elemanlara söker)
    const yasakliKelimeler = ['orospu', 'piç', 'sik', 'amk', 'göt']; 
    const mesajIcerigi = message.content.toLowerCase();

    if (yasakliKelimeler.some(kelime => mesajIcerigi.includes(kelime))) {
        try {
            await message.delete();
            const uyarilmaEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('⚠️ SİSTEM UYARISI')
                .setDescription(`${message.author}, o kelimeyi o dilinden hemen söküp alırım kanka! Bu sunucuda o kelimeler yasak.`)
                .setTimestamp();
            
            await message.channel.send({ embeds: [uyarilmaEmbed] });
        } catch (err) {
            console.log("Mesaj silme yetkim yok kanka: ", err);
        }
    }
});

// Tokeni Render'ın içinden güvenle çekeceğiz
client.login(process.env.TOKEN);
            
