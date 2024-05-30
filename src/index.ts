import { Client } from "discord.js-selfbot-v13";
import { config } from "dotenv";
import transforms from "./transforms";
config();
const bot = new Client();
bot.login(process.env.TOKEN);
bot.on("ready", async () => {
  console.log("Bot is ready!");

  const CHANNEL1 = await bot.channels.fetch(process.env.CHANNEL1!);
  const CHANNEL2 = await bot.channels.fetch(process.env.CHANNEL2!);

  if (!CHANNEL1?.isText() || !CHANNEL2?.isText()) {
    console.error("Invalid channel ID");
    process.exit(1);
  }

  bot.on("messageCreate", async (message) => {
    if (message.author.id === bot.user?.id) return;

    let content = message.content;

    if (!content) return;

    if (![CHANNEL1.id, CHANNEL2.id].includes(message.channel.id)) return;
    
    for (const replace of (message.channel.id === CHANNEL1.id ? transforms["1to2"] : transforms["2to1"])) {
      content = content.replace(replace[0], replace[1]);
    }

    if (message.channel.id === CHANNEL1.id) {
      await CHANNEL2.send(content);
    } else if (message.channel.id === CHANNEL2.id) {
      await CHANNEL1.send(content);
    }
  })
});