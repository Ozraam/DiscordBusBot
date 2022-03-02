"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs_1 = require("fs");
var discord_js_1 = require("discord.js");
var bus = require("./busProcess");
var UserFilter = /** @class */ (function () {
    function UserFilter() {
        this.on = true;
        this.list = [];
    }
    return UserFilter;
}());
function readToken() {
    var token = { token: process.env.TOKEN };
    return token;
}
function filtre(buss, user) {
    var busss = [];
    console.log(fliterConfig.has(user));
    if (fliterConfig.has(user)) {
        var fil = fliterConfig.get(user);
        console.log("TEST");
        if (!fil.on)
            return buss;
        for (var _i = 0, buss_1 = buss; _i < buss_1.length; _i++) {
            var b = buss_1[_i];
            console.log(b.shortName, fil);
            if (fil.list.includes(b.shortName)) {
                busss.push(b);
            }
        }
        return busss;
    }
    else
        return buss;
}
function setEmebd(bus_, message) {
    return __awaiter(this, void 0, void 0, function () {
        var lineTime, embed, _i, lineTime_1, buss, times, _a, _b, tim;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, bus.getNextPassage(bus_.url)];
                case 1:
                    lineTime = _c.sent();
                    lineTime = filtre(lineTime, message.author);
                    embed = new discord_js_1.MessageEmbed().setTitle(bus_.name)
                        .setThumbnail("https://storage.googleapis.com/is-wp-55-prod/uploads-prod/2020/03/cropped-logo_met_min-1.png")
                        .setAuthor({ name: "Ozraam", iconURL: "https://styles.redditmedia.com/t5_w4hl3/styles/profileIcon_k1wvp2mtezk81.png" });
                    console.log(lineTime);
                    for (_i = 0, lineTime_1 = lineTime; _i < lineTime_1.length; _i++) {
                        buss = lineTime_1[_i];
                        times = "";
                        for (_a = 0, _b = buss.times; _a < _b.length; _a++) {
                            tim = _b[_a];
                            times += tim;
                            if (!tim.includes(":"))
                                times += " min";
                            times += "\n";
                        }
                        if (times.trim().length == 0)
                            times = "null";
                        embed.addField(buss.name, times);
                    }
                    message.channel.send({ embeds: [embed] });
                    return [2 /*return*/];
            }
        });
    });
}
var Bot = /** @class */ (function () {
    function Bot(token) {
        var _this = this;
        this.client = new discord_js_1.Client({
            intents: ["GUILDS", "GUILD_MESSAGES"]
        });
        this.client.on("ready", function (client) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Bot ".concat(client.user.username, " running"));
                return [2 /*return*/];
            });
        }); });
        this.client.on("messageCreate", this.onMessage);
        this.client.login(token.token);
    }
    Bot.prototype.onMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var line, bus_, cmd, line, lines, embed, f, n, _i, lines_1, line, fil_1, fil_2, fil, embed;
            return __generator(this, function (_a) {
                if (attenteSuggestion.size > 0) {
                    if (attenteSuggestion.has(message.author)) {
                        console.log("".concat(message.author.username + message.author.discriminator, " request ").concat(message.content));
                        line = Number(message.content.trim());
                        if (isNaN(line)) {
                            attenteSuggestion["delete"](message.author);
                            return [2 /*return*/];
                        }
                        if (line < 1 || line > 10)
                            return [2 /*return*/];
                        line--;
                        bus_ = attenteSuggestion.get(message.author)[line];
                        setEmebd(bus_, message);
                        return [2 /*return*/];
                    }
                }
                if (message.author.bot || !message.content.startsWith(prefix))
                    return [2 /*return*/];
                cmd = message.content.replace(prefix, "");
                if (cmd.startsWith("a")) {
                    cmd = cmd.replace("a", "").trim();
                    line = bus.find(cmd, stops)[0];
                    setEmebd(line, message);
                }
                // Commande !l
                else if (cmd.startsWith("l")) {
                    cmd = cmd.replace("l", "").trim();
                    lines = bus.find(cmd, stops).slice(0, 10);
                    embed = new discord_js_1.MessageEmbed().setTitle("Arret sugérer")
                        .setAuthor({ name: "Ozraam", iconURL: "https://styles.redditmedia.com/t5_w4hl3/styles/profileIcon_k1wvp2mtezk81.png" });
                    f = "";
                    n = 1;
                    for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                        line = lines_1[_i];
                        f += n + " - " + line.name + "\n";
                        n++;
                    }
                    embed.addField("Arret disponible:", f);
                    embed.description = "Taper 1-10 pour afficher les prochain passage";
                    message.channel.send({ embeds: [embed] });
                    attenteSuggestion.set(message.author, lines);
                    console.log(attenteSuggestion.size);
                }
                // Commande !f
                else if (cmd.startsWith("f")) {
                    cmd = cmd.replace("f", "").trim();
                    if (cmd == "switch") {
                        if (!fliterConfig.has(message.author))
                            return [2 /*return*/];
                        fil_1 = fliterConfig.get(message.author);
                        fil_1.on = !fil_1.on;
                        fliterConfig.set(message.author, fil_1);
                        message.channel.send("Filter for ".concat(message.author, " has been set on ").concat(fil_1.on ? "ON" : "OFF"));
                        return [2 /*return*/];
                    }
                    else if (cmd.startsWith("remove") || cmd.startsWith("r ")) {
                        if (cmd.startsWith("remove"))
                            cmd = cmd.replace("remove", "").trim();
                        else
                            cmd = cmd.replace("r", "").trim();
                        fil_2 = fliterConfig.get(message.author);
                        if (fil_2.list.includes(cmd)) {
                            fil_2.list.splice(fil_2.list.indexOf(cmd), 1);
                        }
                        if (fil_2.list.length != 0) {
                            fliterConfig.set(message.author, fil_2);
                            message.channel.send("".concat(message.author, " filtre ").concat(cmd, " supprimer"));
                        }
                        else {
                            fliterConfig["delete"](message.author);
                            message.channel.send("".concat(message.author, " Plus aucun filtre, retour aux filtre par defaut"));
                        }
                        return [2 /*return*/];
                    }
                    if (!fliterConfig.has(message.author)) {
                        fliterConfig.set(message.author, new UserFilter());
                    }
                    fil = fliterConfig.get(message.author);
                    fil.list.push(cmd);
                    fliterConfig.set(message.author, fil);
                    message.channel.send("Filtre ajouter");
                }
                // commande help
                else if (cmd.startsWith("h") || cmd.startsWith("help")) {
                    embed = new discord_js_1.MessageEmbed().setTitle("Aide")
                        .setAuthor({ name: "Ozraam", iconURL: "https://styles.redditmedia.com/t5_w4hl3/styles/profileIcon_k1wvp2mtezk81.png" })
                        .addField("".concat(prefix, "a NomArret"), "Affiche l'arriver des prochains bus à l'arret donner")
                        .addField("".concat(prefix, "l NomArret"), "Affiche une liste d'arret potentiel par rapport aux texte donner")
                        .addField("".concat(prefix, "f [r] filtre"), "ajoute un filtre qui sera appliquer aux prochaine recherche\najoutez r dans la commande pour supprimer le filtre");
                    message.channel.send({ embeds: [embed] });
                }
                return [2 /*return*/];
            });
        });
    };
    return Bot;
}());
var prefix = "?";
var attenteSuggestion = new discord_js_1.Collection();
var stops = JSON.parse((0, fs_1.readFileSync)("./src/data/stops.json").toString());
var fliterConfig = new Map();
function main() {
    var token = readToken();
    console.log("Bot is starting...");
    var bot = new Bot(token);
    //console.log(bot)
}
main();
