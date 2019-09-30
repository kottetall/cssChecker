"use strict"

window.onload = () => {

    document.querySelector("#skicka").addEventListener("click", async (e) => {
        e.preventDefault()
        const input = document.querySelector("#fileinput")
        //Skickar alla uppladdade filer och gör en grundkoll samt konverterar dem till en lång string
        const godkandString = await kontrollAvFiler(input.files)
        const data = {
            text: godkandString
        }

        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }

        const response = await fetch("upload/", fetchOptions)
        const svar = await response.json()
        //Sparar det lokalt så man inte behöver kontakta servern vid varje bearbetning av datan
        window.sessionStorage.setItem("propsAndVals", JSON.stringify(svar))

        uppdateraAllt()

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