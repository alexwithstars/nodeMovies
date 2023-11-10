"use strict";
const qs = sel => document.querySelector(sel)
const qsa = sel => document.querySelectorAll(sel)
const gti = sel => document.getElementById(sel)
const gtg = sel => document.getElementsByTagName(sel)

const idForm = gti("idForm")
const id = gti("id")
const idSub = qs("#idForm input[type='submit']")

import {Notify} from "./notify.js";
import {Form} from "./sendForm.js"

const form = new Form()

async function handler(e){
	e.preventDefault()
	idSub.classList.add("loading")
	const request = await fetch(`${location.origin}/movies/${id.value}`)
	const movie = await request.json()
	idSub.classList.remove("loading")
	gti(`message-id`).classList.add("valid")
	if(movie.error){
		id.scrollIntoView({block:"center",behavior:"smooth"})
		gti(`message-id`).classList.remove("valid")
		new Notify({
			text:movie.error,
			color:"#f88",
			time:3000
		})
		return
	}
	if(e.target==idForm) form.setForm(movie)
}
idForm.addEventListener("submit",handler)
form.form.addEventListener("submit",handler)

globalThis.navigation.addEventListener('navigate', (event) => {
    const toUrl = new URL(event.destination.url)

    // es una página externa? si es así, lo ignoramos
    if (location.origin !== toUrl.origin) return

    // si es una navegación en el mismo dominio (origen)
    event.intercept({
      async handler () {
        const data = await fetchPage(toUrl.pathname)

        // utilizar la api de View Transition API
        document.startViewTransition(() => {
          // el scroll hacia arriba del todo
          document.body.innerHTML = data
          document.documentElement.scrollTop = 0
        })
      }
    })
  })