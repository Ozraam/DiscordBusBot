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
exports.find = exports.getNextPassage = void 0;
var node_fetch_1 = require("node-fetch");
var node_html_parser_1 = require("node-html-parser");
function getNextPassage(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, body, root, allBusInfo, allBus, _i, allBusInfo_1, bus, nameZone, name_1, lianeName, AllTimes, times, _a, AllTimes_1, t, _b, _c, child, value, current;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, node_fetch_1["default"])(url)];
                case 1:
                    response = _d.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    console.log("info - Bus stop get properly");
                    return [4 /*yield*/, response.text()];
                case 2:
                    body = _d.sent();
                    root = (0, node_html_parser_1.parse)(body);
                    allBusInfo = root.querySelectorAll(".is-NextDepartures-Row");
                    allBus = [];
                    //for each bus, get the next passage
                    for (_i = 0, allBusInfo_1 = allBusInfo; _i < allBusInfo_1.length; _i++) {
                        bus = allBusInfo_1[_i];
                        nameZone = bus.querySelector(".is-NextDepartures-Cell_Destination").querySelector(".is-NextDepartures-Cell-C2");
                        name_1 = nameZone.childNodes[0].rawText.trim();
                        lianeName = bus.querySelector(".is-Line-C1").childNodes[0].rawText;
                        AllTimes = bus.querySelectorAll(".is-NextDeparture-Time-Value");
                        times = [];
                        for (_a = 0, AllTimes_1 = AllTimes; _a < AllTimes_1.length; _a++) {
                            t = AllTimes_1[_a];
                            for (_b = 0, _c = t.childNodes; _b < _c.length; _b++) {
                                child = _c[_b];
                                if (child instanceof node_html_parser_1.TextNode) {
                                    value = child.rawText.trim();
                                    if (value.length > 0) {
                                        times.push(value);
                                    }
                                }
                            }
                        }
                        current = {
                            name: name_1,
                            times: times,
                            shortName: lianeName
                        };
                        allBus.push(current);
                    }
                    console.log("info - All stop's bus proccesed");
                    return [2 /*return*/, allBus];
                case 3:
                    console.log("Error - Next Bus not get");
                    return [2 /*return*/, null];
            }
        });
    });
}
exports.getNextPassage = getNextPassage;
function compare(A, B) {
    var len = A.length > B.length ? B.length : A.length;
    var score = 0;
    for (var index = 0; index < len; index++) {
        if (A[index] == B[index])
            score++;
    }
    return score;
}
function _find(toFind, arr, select) {
    if (select === void 0) { select = function (x) { return x; }; }
    var score = [];
    for (var i = 0; i < arr.length; i++) {
        var sc = compare(select(arr[i]), toFind);
        if (sc != 0)
            score.push([sc, i]);
    }
    score.sort(function (a, b) { return -(a[0] - b[0]); });
    console.log(score.slice(0, 5));
    return score;
}
function find(toFind, arr, select) {
    if (select === void 0) { select = function (x) { return x.name; }; }
    toFind = toFind.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    var findi = [];
    var score = _find(toFind, arr, select);
    for (var _i = 0, score_1 = score; _i < score_1.length; _i++) {
        var sc = score_1[_i];
        findi.push(arr[sc[1]]);
    }
    //console.log(findi.slice(0,5));
    return findi;
}
exports.find = find;
