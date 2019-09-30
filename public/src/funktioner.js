"use strict"

function uppdateraAllt() {
    const propsAndVals = JSON.parse(window.sessionStorage.getItem("propsAndVals"))

    const tableOverview = document.querySelector(".overview")
    addOverview(tableOverview, propsAndVals)

    const tablesDetail = document.querySelectorAll(".browsers table")

    for (const tableDetail of tablesDetail) {
        addPropsAndVals(tableDetail, propsAndVals)
        if (tableDetail.children.length > 1) {
            tableDetail.nextElementSibling.style.display = "block"
        }
    }
}

function addPropsAndVals(table, propsAndVals) {

    const showingProps = table.children.length - 1
    const numberOfProps = 5 + showingProps
    const browser = table.dataset.browser

    // ska göras till funk(samma används redan ovan)
    for (let i = showingProps; i < numberOfProps; i++) {
        if (propsAndVals[browser] && propsAndVals[browser][i]) {
            const tr = document.createElement("tr")
            const prop = document.createElement("td")
            prop.innerText = propsAndVals[browser][i][0]
            const support = document.createElement("td")
            support.innerText = propsAndVals[browser][i][1]
            tr.appendChild(prop)
            tr.appendChild(support)
            table.append(tr)
        }
    }
}

function addOverview(tableOverview, testobjekt) {
    const rows = tableOverview.children[1].children
    for (const row of rows) {
        const browser = row.dataset.browser
        if (testobjekt[browser]) {
            row.children[1].innerText = testobjekt[browser][0][1]
        }
    }
}

async function kontrollAvFiler(uppladdadeFiler) {
    let godkandaFilerString = ""

    for (const fil of uppladdadeFiler) {
        if (fil.name.includes(".css") && fil.type === "text/css") {
            //kollar så det är rätt filändelse och typ, ifall man ändrat i HTML-filen
            // lägg till fler kontroller
            godkandaFilerString += await fil.text()
        } else {
            // snygga till felmeddelandet så det blir mer anpassade varningar beroende på fel
            alert(`The file '${fil.name}' was excluded from the results.\nReason(s):\n * Wrong file format - Only CSS files allowed`)
        }
    }

    return godkandaFilerString
}