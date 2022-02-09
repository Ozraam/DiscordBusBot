import { readFileSync } from "fs";
import { Client, Message, MessageEmbed } from "discord.js";
import * as bus from "./busProcess";
 
interface Token {
    token: string
}

function readToken() {
    let token : Token = JSON.parse(readFileSync("./src/TOKEN.json").toString());
    return token;
}

class Bot {
    private client: Client;
    constructor(token: Token) {
        this.client = new Client({
            intents: ["GUILDS", "GUILD_MESSAGES"]
        });

        this.client.on("ready", async (client) => {
            console.log(`Bot ${client.user.username} running`);
        });

        this.client.on("messageCreate", this.onMessage);

        this.client.login(token.token);
    }

    async onMessage(message:Message) {
        
        if(message.author.bot || !message.content.startsWith("!")) return;
        let cmd = message.content.replace("!","");

        if(cmd.startsWith("a")) {
            cmd = cmd.replace("a","").trim();
            let line = bus.find(cmd,stops)[0]
            let lineTime = await bus.getNextPassage(line.url);
            let embed = new MessageEmbed().setTitle(line.name);
            console.log(lineTime);
            
            for(let buss of lineTime) {
                let times = ""

                for (const tim of buss.times) {
                    times += tim
                    if(!tim.includes(":")) times += " min"
                    times+="\n"
                }
                if (times.trim().length == 0) times = "null"
                embed.addField(buss.name, times)
            }

            message.channel.send({ embeds:[embed]})
        }
    }
}


let stops = JSON.parse(readFileSync("./src/data/stops.json").toString());
function main() {
    let token = readToken();

    console.log("Bot is starting...");

    let bot : Bot = new Bot(token);

    //console.log(bot)
}

main()