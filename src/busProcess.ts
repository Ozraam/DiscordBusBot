import fetch from "node-fetch";
import { parse, TextNode } from 'node-html-parser';

async function getNextPassage(url: string) {
    const response = await fetch(url);
    if (response.ok) {

        console.log("info - Bus stop get properly");
        //parse the html
        const body = await response.text();
        const root = parse(body);

        //get all bus line name/direction
        const allBusInfo = root.querySelectorAll(".is-NextDepartures-Row");
        let allBus = []

        //for each bus, get the next passage
        for (let bus of allBusInfo) {
            let nameZone = bus.querySelector(".is-NextDepartures-Cell_Destination").querySelector(".is-NextDepartures-Cell-C2")
            let name: string = nameZone.childNodes[0].rawText.trim()

            //recupere le temps avant le/les prochains bus
            let AllTimes = allBusInfo[0].querySelectorAll(".is-NextDeparture-Time-Value");
            let times = [];
            for(let t of AllTimes) {
                for(let child of t.childNodes) {
                    if (child instanceof  TextNode) {
                        let value = child.rawText.trim();
                        if(value.length > 0) {
                            times.push(value);
                        }
                    }
                }
            }
            //add the bus direction and times in the array
            let current = {
                name: name,
                times: times
            };
            allBus.push(current);
        }

        console.log("info - All stop's bus proccesed");
        return allBus;

    } else {
        console.log("Error - Next Bus not get")
        return null;
    }
}

function reduceData(data: Array<Array <string> >) : Array<Array <string> >{
    data.shift();
    let dataN = [];
    let alName = [];
    for (let index = 0; index < data.length; index++) {
        let element = data[index];
        let name = element[2];
        name = name.slice(1,name.length-1);

        let url = element[7];
        if (!alName.includes(name)){
            dataN.push([name, url]);
            alName.push(name);
        }
    }
    return dataN;
}


function find(toFind:string, arr:Array<Array<string>>) {

    if(toFind.length == 0) {
        return [];
    }
    toFind = toFind.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    
    let findi = [];
    for(let occ of arr) {
        
        
        if(occ[0].startsWith(toFind)) {
            findi.push(occ.slice());
        }
    }
    if(findi.length == 0) {
        findi = find(toFind.slice(0,toFind.length-1), arr);
    }
    return findi
}