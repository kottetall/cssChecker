"use strict"

// !!! Mappen "properties" behövs för att köra programmet. Dock har jag ännu inte kollat licenserna som gäller och därför följs den inte av GIT

const fs = require("fs");
const fileCheck = "./css/testfil.css" //filen som ska läsas
const fileSource = fs.readdirSync("./properties/") // hämtar alla grundfiler från moz - array med filnamn + ändelse
const browsers = [
    "chrome",
    "chrome_android",
    "edge",
    "firefox",
    "firefox_android",
    "ie",
    "opera",
    "safari",
    "safari_ios",
    "webview_android"
]

fs.readFile(fileCheck, "utf-8", (err, string) => {
    // läser in testfil test.css
    console.log(typeof fileCheck)
    if (err) {
        console.log(err)
    } else {
        const propVals = letaProps(string) //Kollar vilka "egenskaper" som finns
        const props = findCommon(Object.keys(propVals), fileSource) //Hittar de filer från Moz som är kopplade till resp egenskap
        const customJson = createCustomJson(props["commonProps"]) //Skapar Json med de egenskaper som finns i projektet tillsammans med vilka webbläsare/versioner som de är kompatibla med
        const compatList = compatCheck(customJson) //Listar vad som är komp med resp webbläsare och sorterar detta utifrån den första versionen när det blev tillagd
        // console.log(compatList)
        // console.log(props["missingProps"])
        // console.log(compatList)

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

function findCommon(check, source) {
    const commonProps = []
    const missingProps = []

    for (let i = 0; i < source.length; i++) {
        source[i] = source[i].replace(".json", "")
    }

    for (const c of check) {
        if (source.includes(c)) {
            commonProps.push(c)
        } else {
            missingProps.push(c)
        }
    }

    return {
        commonProps: commonProps,
        missingProps: missingProps
    }
}

function createCustomJson(commonProps) {
    const customJson = {}
    for (const prop of commonProps) {

        let temp = require(`./properties/${prop}.json`)

        customJson[prop] = {}
        for (const browser of browsers) {
            customJson[prop][browser] = temp.css.properties[prop]["__compat"].support[browser]
        }
    }
    return customJson
}

function compatCheck(customJson) {
    const overview = {}

    for (const browser of browsers) {
        overview[browser] = []
    }

    for (const custom in customJson) {
        for (const browser of browsers) {
            if (!Array.isArray(customJson[custom][browser])) {
                overview[browser].push([custom, customJson[custom][browser].version_added])
            } else {
                overview[browser].push([custom, customJson[custom][browser][0].version_added])
            }
        }
    }


    for (const over in overview) {
        overview[over].sort((a, b) => {
            a[1] = a[1].toString().replace("≤", "")
            b[1] = b[1].toString().replace("≤", "")
            return (a[1] === false) ? -1 : b[1] - a[1]
        })
    }
    return overview
}