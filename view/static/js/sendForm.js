"use strict";
const qs = sel => document.querySelector(sel)
const qsa = sel => document.querySelectorAll(sel)
const gti = sel => document.getElementById(sel)
const gtg = sel => document.getElementsByTagName(sel)

import {Notify} from "./notify.js"
import {movieForm} from "./movieForm.js"

const form = gti("form")
form.appendChild(movieForm)
const inps = qsa("form input[name]")
const genre = gti("genre")
const newGenres = gti("genres")
const genresOptions = gti("genresOptions")
const allInputs = qsa("input[id]")

let candidateGenres=[]
genre.toggleAttribute("required",true)
let pressed=false
genre.addEventListener("keydown",e=>{
	if(e.key=="Enter"){
		e.preventDefault()
		pressed=true
	}
})

// set options
;(async function(){
	const request = await fetch(`${location.origin}/movies/genres`)
	const genres = await request.json()
	const fragment = document.createDocumentFragment()
	genres.forEach(entrie=>{
		const option = document.createElement("option")
		option.setAttribute("value",entrie)
		fragment.appendChild(option)
	})
	genresOptions.appendChild(fragment)
})()

function setCandidate(candidate){
	const text=candidate.trim()
	if(!text) return
	const gen=document.createElement("div")
	gen.textContent=text
	gen.addEventListener("click",e=>{
		candidateGenres.splice(candidateGenres.indexOf(e.target.textContent),1)
		genre.toggleAttribute("required",candidateGenres.length<1)
		newGenres.removeChild(e.target)
		sessionStorage.setItem("genre",candidateGenres)
	})
	candidateGenres.push(text)
	genre.toggleAttribute("required",candidateGenres.length<1)
	newGenres.appendChild(gen)
}

genre.addEventListener("keyup",e=>{
	if(e.key=="Enter" && pressed){
		pressed=false
		setCandidate(genre.value)
		genre.value=''
		sessionStorage.setItem("genre",candidateGenres)
	}
})

inps.forEach(entrie=>entrie.addEventListener("keydown",e=>{
	if(e.key=="Enter"){
		e.preventDefault()
		const index = (function(){
			let index=0
			for(let i of form){
				if(i==e.target) return index
				index++
			}
		})()
		form[(index+1)%form.length].focus()
	}
}))
;(function(){
	inps.forEach(entrie=>{
		entrie.value=sessionStorage.getItem(entrie.name) ?? ''
		entrie.classList.toggle("not-empty",entrie.value.trim().length>0)
	})
	let gens = sessionStorage.getItem("genre")
	if(gens){
		gens.split(",").forEach(entrie=>setCandidate(entrie))
	}
})()
allInputs.forEach(entrie=>entrie.addEventListener("keyup",e=>{
	sessionStorage.setItem(entrie.name,entrie.value)
	entrie.classList.toggle("not-empty",entrie.value.trim().length>0)
}))


form.addEventListener("submit",async (e)=>{
	e.preventDefault()
	let inputs = [...form]
	let newMovie ={}
	inputs.forEach(entrie=>{
		if(entrie.name){
			if(entrie.type=="number"){
				newMovie[entrie.name]=parseFloat(entrie.value)
				return
			}
			newMovie[entrie.name]=entrie.value
		}
	})
	newMovie.genre = candidateGenres
	const post = await fetch(`${location.origin}/movies`,{
		method:form.method,
		headers:{
			"Content-Type":"application/json"
		},
		body:JSON.stringify(newMovie)
	}).catch(e=>{
		new Notify({
			text:"Failed fetch, view console"
		})
		console.log("Fetch error: ",e)
	})
	if(!post) return
	const response = await post.json()
	allInputs.forEach(entrie=>{
		gti(`message-${entrie.id}`).classList.add("valid")
	})
	if(response.error){
		response.error.forEach(entrie=>{
			gti(`message-${entrie.path[0]}`).classList.remove("valid")
		})
		new Notify({
			text:`Registro incorrecto`,
			color:"#f88",
			time:3000
		})
		return
	}
	new Notify({
		text:`Pelicula registrada con el id: ${response.id}`,
		id:response.id,
		color:"#8f8",
		time:8000
	})
	allInputs.forEach(entrie=>{
		entrie.value=''
		sessionStorage.setItem(entrie.id,'')
		entrie.classList.toggle("not-empty",entrie.value.trim().length>0)
		newGenres.innerHTML=''
		candidateGenres=[]
	})
})