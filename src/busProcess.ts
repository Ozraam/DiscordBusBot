import fetch from "node-fetch";
import { parse, TextNode } from 'node-html-parser';

export async function getNextPassage(url: string) {
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
            let AllTimes = bus.querySelectorAll(".is-NextDeparture-Time-Value");
            let times = [];
            for (let t of AllTimes) {
                for (let child of t.childNodes) {
                    if (child instanceof TextNode) {
                        let value = child.rawText.trim();
                        if (value.length > 0) {
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


function compare(A: string, B: string) {
    let len = A.length > B.length ? B.length : A.length;
    let score = 0;
    for (let index = 0; index < len; index++) {
        if (A[index] == B[index]) score++;
    }
    return score;
}


function _find(toFind: string, arr: any) {
    let score = [];
    
    for (let i = 0; i < arr.length; i++) {
        let sc = compare(arr[i].name, toFind);
        if (sc != 0) score.push([sc, i]);
    }
    
    score.sort((a, b) => { return -(a[0] - b[0]); });
    console.log(score.slice(0,5));
    return score
}

export function find(toFind: string, arr: any) {
    toFind = toFind.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    let findi = [];
    let score = _find(toFind, arr);
    
    for (const sc of score) {
        findi.push(arr[sc[1]]);
    }
    //console.log(findi.slice(0,5));
    
    return findi
}