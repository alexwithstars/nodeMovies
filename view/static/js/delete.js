"use strict";
const qs = sel => document.querySelector(sel)
const qsa = sel => document.querySelectorAll(sel)
const gti = sel => document.getElementById(sel)
const gtg = sel => document.getElementsByTagName(sel)

const idForm = gti("idForm")
const id = gti("id")

import {Notify} from "./notify.js";
import {Form} from "./sendForm.js"

const form = new Form()

form.inps.forEach(entrie=>{
	entrie.toggleAttribute("disabled",true)
})
form.genre.toggleAttribute("disabled",true)

async function handler(e){
	e.preventDefault()
	const request = await fetch(`${location.origin}/movies/${id.value}`)
	const movie = await request.json()
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
	if(e.target==idForm){
		form.setForm(movie)
		form.removeListeners()
	}
}
idForm.addEventListener("submit",handler)