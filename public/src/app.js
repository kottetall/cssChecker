"use strict"

window.onload = () => {

    // FÖR TEST TAS BORT VID LIVE

    const testobjekt = {
        chrome: [
            ['user-select', '54'],
            ['transition', '26'],
            ['quotes', '11'],
            ['box-shadow', '10'],
            ['border-radius', '4'],
            ['font-weight', '2'],
            ['border', '1'],
            ['outline', '1'],
            ['font-size', '1'],
            ['font', '1'],
            ['vertical-align', '1']
        ]
    }

    window.sessionStorage.setItem("propsAndVals", JSON.stringify(testobjekt))

    // FÖR TEST TAS BORT VID LIVE

    document.querySelector("#fileinput").addEventListener("change", async (e) => {
        const uppladdadeFiler = e.target.files
        const godkandaFilerString = await kontrollAvFiler(uppladdadeFiler)
    })


    document.querySelector(".test").addEventListener("click", (e) => {
        console.log("funkar")
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
    })

    const extenders = document.querySelectorAll(".extender")
    for (const extend of extenders) {
        extend.addEventListener("click", (e) => {

            const propsAndVals = JSON.parse(window.sessionStorage.getItem("propsAndVals"))

            const tableDetail = e.target.previousElementSibling
            addPropsAndVals(tableDetail, propsAndVals)
        })
    }
}