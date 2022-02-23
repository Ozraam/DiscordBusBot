import { readFileSync } from "fs";
import { Client, Collection, Message, MessageEmbed, User } from "discord.js";
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
        

        if(attenteSuggestion.size > 0) {
            
            if(attenteSuggestion.has(message.author)) {
                console.log(`${message.author.username + message.author.discriminator} request ${message.content}`);
                
                let line = Number(message.content.trim())
                if(isNaN(line)) {
                    attenteSuggestion.delete(message.author)
                    return
                }

                if(line < 1 || line > 10) return;
                line--;
                let bus_ = attenteSuggestion.get(message.author)[line]
                

                let lineTime = await bus.getNextPassage(bus_.url);
                let embed = new MessageEmbed().setTitle(bus_.name);
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
                return
            }
        }

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
        else if (cmd.startsWith("f")) {
            cmd = cmd.replace("f","").trim();
            let lines = bus.find(cmd,stops).slice(0,10);
            let embed = new MessageEmbed().setTitle("Arret sugérer");
            let f = ""
            let n = 1
            for (const line of lines) {
                f += n + " - " +line.name + "\n";
                n++
            }
            embed.addField("Arret (par ordre du plus probable):", f);
            
            embed.description = "Taper 1-10 pour afficher les prochain passage"
            message.channel.send({embeds:[embed]})

            attenteSuggestion.set(message.author, lines);

            console.log(attenteSuggestion.size)
        }
    }
}

let attenteSuggestion : Collection<User, any[]> = new Collection();
let stops = JSON.parse(readFileSync("./src/data/stops.json").toString());
function main() {
    let token = readToken();

    console.log("Bot is starting...");

    let bot : Bot = new Bot(token);

    //console.log(bot)
}

main()