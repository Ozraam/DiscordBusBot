import { readFileSync } from "fs";
import { Client, Collection, Message, MessageEmbed, User } from "discord.js";
import * as bus from "./busProcess";
 
interface Token {
    token: string
}

class UserFilter {
    on: boolean;
    list: string[];
    constructor() {
        this.on = true;
        this.list = [];
    }
}

function readToken() {
    let token : Token = JSON.parse(readFileSync("./src/TOKEN.json").toString());
    return token;
}


function filtre(buss: any[], user: User) {
    let busss = []
    console.log(fliterConfig.has(user));
    
    if(fliterConfig.has(user)) {
        let fil = fliterConfig.get(user);
        console.log("TEST");
        
        if (!fil.on) return buss

        for(let b of buss) {
            console.log(b.shortName, fil);
            
            if(fil.list.includes(b.shortName) ) {
                busss.push(b);
        }
        }
        return busss
    } else return buss
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

                lineTime = filtre(lineTime, message.author)

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
            lineTime = filtre(lineTime, message.author)
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
        // Commande !l
        else if (cmd.startsWith("l")) {
            cmd = cmd.replace("l","").trim();
            let lines = bus.find(cmd,stops).slice(0,10);
            let embed = new MessageEmbed().setTitle("Arret sugérer");
            let f = ""
            let n = 1
            for (const line of lines) {
                f += n + " - " +line.name + "\n";
                n++
            }
            embed.addField("Arret (par ordre du plus probable):", f);
            
            embed.description = "Taper 1-10 pour afficher les prochain passage";
            message.channel.send({embeds:[embed]});

            attenteSuggestion.set(message.author, lines);

            console.log(attenteSuggestion.size);
        }
        // Commande !f
        else if(cmd.startsWith("f")) {
            cmd = cmd.replace("f","").trim();

            if(cmd == "switch") {
                if(!fliterConfig.has(message.author)) return;

                let fil = fliterConfig.get(message.author);

                fil.on = !fil.on

                fliterConfig.set(message.author, fil);

                message.channel.send(`Filter for ${message.author} has been set on ${fil.on ? "ON" : "OFF"}`)
                return
            } else if(cmd.startsWith("remove") || cmd.startsWith("r ")) {
                if(cmd.startsWith("remove")) cmd = cmd.replace("remove", "").trim();
                else cmd = cmd.replace("r", "").trim();

                let fil = fliterConfig.get(message.author);
                if(fil.list.includes(cmd)) {
                    fil.list.splice(fil.list.indexOf(cmd),1);
                }
                
                if(fil.list.length != 0) {
                    fliterConfig.set(message.author, fil);
                    message.channel.send(`${message.author} filtre ${cmd} supprimer`);
                } else {
                    fliterConfig.delete(message.author);
                    message.channel.send(`${message.author} Plus aucun filtre, retour aux filtre par defaut`);
                }
                return
            }

            if(!fliterConfig.has(message.author)) {
                fliterConfig.set(message.author, new UserFilter());
            }

            let fil = fliterConfig.get(message.author);

            fil.list.push(cmd)

            fliterConfig.set(message.author, fil);

            message.channel.send("Filtre ajouter")
        }

    }
}

let attenteSuggestion : Collection<User, any[]> = new Collection();
let stops = JSON.parse(readFileSync("./src/data/stops.json").toString());
let fliterConfig : Map<User, UserFilter> = new Map();

function main() {
    let token = readToken();

    console.log("Bot is starting...");

    let bot : Bot = new Bot(token);

    //console.log(bot)
}

main()