const discord = require("discord.js")
const a = {
    takipkodu:"",
    kanal:"",
    wevhookurl:"",
    sonhareket:""
}
let job;
/**
 * 
 * @param {discord.Client} client 
 */
module.exports.init = async function (client) {
    const croner = require("croner");
    const fs = require("node:fs/promises");
    const kargolar = require("./kargo.json")
    const sürat = require("./süratkargo");
    job = croner('* * * * *', async ()  => {
        kargolar.array.forEach(async item => {
            const kargo = new sürat();
            await kargo.init(item)
            const webhook = new discord.WebhookClient({url:item.wevhookurl})
            const kargohareketler = await kargo.kargohareketleri()
            const kargohareket=kargohareketler[0]
            if (item.sonhareket == null) {
                const embed = new discord.MessageEmbed();
                embed.setTitle(`Hareket: ${kargohareket.HareketTipi}-${kargohareket.HareketYeri}`)
                embed.setColor("RANDOM")
                embed.setImage(kargo.getImage())
                embed.setDescription(`Tüm Hareketler : \n${kargohareketler.map(hareket => `Hareket: ${hareket.HareketTipi}-${hareket.HareketYeri} Hareket Tarihi ${hareket.HareketTarihi}`).join("\n")}`)
                webhook.send({content:`${item.takipkodu} Numaralı Kargonun Kaydedilen İlk Hareketi :`,embeds:[embed]})
                webhook.send(`${kargo.takipkodu} Numaralı Kargo İçin Güncellemeler Bu kanala gönderilecek
Sonraki Güncelleme :<t:${job.next().getTime()/1000}>`)
item.sonhareket = `Hareket: ${kargohareket.HareketTipi}-${kargohareket.HareketYeri}`
                await fs.writeFile("kargo.json", JSON.stringify(kargolar))
            }
            else if (item.sonhareket !== `Hareket: ${kargohareket.HareketTipi}-${kargohareket.HareketYeri}`) {
                const embed = new discord.MessageEmbed();
                embed.setTitle(`Hareket: ${kargohareket.HareketTipi}-${kargohareket.HareketYeri}`)
                embed.setColor("RANDOM")
                embed.setImage(kargo.getImage())
                embed.setDescription(`Tüm Hareketler : \n${kargohareketler.map(hareket => `Hareket: ${hareket.HareketTipi}-${hareket.HareketYeri} Hareket Tarihi ${hareket.HareketTarihi}`).join("\n")}`)
                webhook.send({content:`${item.takipkodu} Numaralı Kargon Hareket Etti:`,embeds:[embed]})
                webhook.send(`${kargo.takipkodu} Numaralı Kargo İçin Güncellemeler Bu kanala gönderilecek
Sonraki Güncelleme :<t:${job.next().getTime()/1000}>`)
item.sonhareket = `Hareket: ${kargohareket.HareketTipi}-${kargohareket.HareketYeri}`
await fs.writeFile("kargo.json", JSON.stringify(kargolar))
            }
        })
    });
}
/**
 * 
 * @param {discord.Client} client 
 * @param {a} kargo 
 */
module.exports.hello = async function (client,kargo) {
    const webhook = new discord.WebhookClient({url:kargo.wevhookurl})
    webhook.send(`${kargo.takipkodu} Numaralı Kargo İçin Güncellemeler Bu kanala gönderilecek
Sonraki Güncelleme :<t:${job.next().getTime()/1000}>`)
}