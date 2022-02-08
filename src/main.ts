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



async function main() {
    console.log(await getNextPassage("https://services.lemet.fr/fr/biv/arret/26311"));

}

main()