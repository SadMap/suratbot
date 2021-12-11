const discord = require("discord.js");
const kargolar = require("./kargo.json")
const fs = require("node:fs/promises")
const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES] });
client.login("token")
client.on("ready", function () { 
    
    console.log("Client ready") 
    require("./cronjob").init(client)
})
const prefix = "?"
client.on("messageCreate",async function (message) {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
    if (command == "kargoekle") {
        if (!args[0] || !message.mentions.channels.first() ||!message.mentions.channels.first().isText()) {
            return message.reply("Yanlış  Kullanım Doğru Kullanım : ?kargoekle [takipkodu] [takipkanalı]")
        }
        if(!message.guild.me.permissionsIn(message.mentions.channels.first()).has("MANAGE_WEBHOOKS")) {
            return message.channel.send("Webhook Oluşturma Yetkim Yok :(");
          }
        else {
            const webhook = await message.mentions.channels.first().createWebhook("Sürat Kargo",{avatar:"https://www.suratkargo.com.tr/assets/images/favicon.png"})
            const kargo = {
                takipkodu:args[0],
                kanal:message.mentions.channels.first().id,
                wevhookurl:webhook.url,
                sonhareket:null
            }
            kargolar.array.push(kargo)
            await fs.writeFile("./kargo.json", JSON.stringify(kargolar))
            await message.reply("Kargo Başarıyla Eklendi")
            require("./cronjob").hello(client,kargo)
        }
    }
})