"use strict"

const fs = require("fs");
const fileCheck = "./css/testfil.css" //filen som ska läsas
const fileSource = fs.readdirSync("./properties/") // hämtar alla grundfiler från moz - array med filnamn + ändelse




// console.log(fileSource)
fs.readFile("./properties/" + fileSource[100], "utf-8", (err, string) => {
    console.log(string)
})


fs.readFile(fileCheck, "utf-8", (err, string) => {
    // läser in testfil test.css
    if (err) {
        console.log(err)
    } else {
        const propVals = letaProps(string)
        // console.log(propVals)
    }
})

function letaProps(string) {
    const regexFirst = /\{[\w\s:\n;',#.()\/%-]+\}/g //Tar bort ID:n, klasser m.fl
    const propVals = {} //props med alla värden

    let stringRen = string.match(regexFirst)
    for (let i = 0; i < stringRen.length; i++) {
        stringRen[i] = stringRen[i].replace(/[\t\n\r{}]/g, "").trim().split(";") // tar fram alla props tillsammans med värden
        for (let k in stringRen[i]) {
            stringRen[i][k] = stringRen[i][k].trim().split(":") //särar på props och värden
            if (stringRen[i][k].length > 1) {
                if (!propVals[stringRen[i][k][0]]) {
                    propVals[stringRen[i][k][0]] = [] //görs till array för lättare bearbetning sen
                }
                propVals[stringRen[i][k][0]].push(stringRen[i][k][1].trim())
            }
        }
    }
    return propVals
}