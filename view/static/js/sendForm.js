"use strict";
const qs = sel => document.querySelector(sel)
const qsa = sel => document.querySelectorAll(sel)
const gti = sel => document.getElementById(sel)
const gtg = sel => document.getElementsByTagName(sel)

import {Notify} from "./notify.js"
import {movieForm} from "./movieForm.js"

export class Form{
	constructor(){
		this.form = gti("form")
		this.form.appendChild(movieForm)
		this.inps = qsa("#form input[name]")
		this.genre = gti("genre")
		this.newGenres = gti("genres")
		this.genresOptions = gti("genresOptions")
		this.allInputs = qsa("form input[id]")
		this.inpsub = qs("#form input[type='submit']")
		this.inpsub.value = form.getAttribute("type")
		this.candidateGenres=[]
		this.pressed=false
		;(async ()=>{
			const request = await fetch(`${location.origin}/movies/genres`)
			const genres = await request.json()
			const fragment = document.createDocumentFragment()
			genres.forEach(entrie=>{
				const option = document.createElement("option")
				option.setAttribute("value",entrie)
				fragment.appendChild(option)
			})
			this.genresOptions.appendChild(fragment)
		})()
		this.genre.toggleAttribute("required",true)
		this.genre.addEventListener("keydown",e=>{
			if(e.key=="Enter"){
				e.preventDefault()
				this.pressed=true
			}
		})
		this.genre.addEventListener("keyup",e=>{
			if(e.key=="Enter" && this.pressed){
				this.pressed=false
				this.#setCandidate(this.genre.value)
				this.genre.value=''
				sessionStorage.setItem("genre",this.candidateGenres)
			}
		})
		this.inps.forEach(entrie=>entrie.addEventListener("keydown",e=>{
			if(e.key=="Enter"){
				e.preventDefault()
				const index = (()=>{
					let index=0
					for(let i of this.form){
						if(i==e.target) return index
						index++
					}
				})()
				this.form[(index+1)%form.length].focus()
			}
		}))
		this.allInputs.forEach(entrie=>entrie.addEventListener("keyup",e=>{
			sessionStorage.setItem(entrie.name,entrie.value)
			entrie.classList.toggle("not-empty",entrie.value.trim().length>0)
		}))
		this.form.addEventListener("submit",async (e)=>{
			e.preventDefault()
			let inputs = [...this.form]
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
			newMovie.genre = this.candidateGenres
			const method = this.form.getAttribute("method").toUpperCase()
			this.inpsub.classList.add("loading")
			const request = await fetch(`${location.origin}/${method=="POST" ? "movies" : `movies/${gti("id").value}`}`,{
				method,
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
			this.inpsub.classList.remove("loading")
			if(!request) return
			const response = await request.json()
			this.allInputs.forEach(entrie=>{
				gti(`message-${entrie.id}`).classList.add("valid")
			})
			if(response.error){
				if(typeof response.error=="string"){
					new Notify({
						text:response.error,
						color:"#f88",
						time:3000
					})
					return
				}
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
			if(method=="POST"){
				new Notify({
					text:`Pelicula registrada con el id: ${response.id}`,
					id:response.id,
					color:"#8f8",
					time:8000
				})
			}
			else{
				new Notify({
					text:"Registro actualizado",
					color:"#8f8",
				})
			}
			this.allInputs.forEach(entrie=>{
				entrie.value=''
				sessionStorage.setItem(entrie.id,'')
				entrie.classList.toggle("not-empty",entrie.value.trim().length>0)
			})
			this.candidateGenres=[]
			this.newGenres.innerHTML=''
		})
		const movie = {}
		this.inps.forEach(entrie=>{
			movie[entrie.name]=sessionStorage.getItem(entrie.name) ?? ''
		})
		movie["genre"]=sessionStorage.getItem("genre")
		this.setForm(movie)
	}
	#setCandidate = (candidate)=>{
		const text=candidate.trim()
		if(!text) return
		const gen=document.createElement("div")
		gen.textContent=text
		gen.addEventListener("click",this.#listener)
		this.candidateGenres.push(text)
		this.genre.toggleAttribute("required",this.candidateGenres.length<1)
		this.newGenres.appendChild(gen)
	}
	#listener = (e)=>{
		this.candidateGenres.splice(this.candidateGenres.indexOf(e.target.textContent),1)
		this.genre.toggleAttribute("required",this.candidateGenres.length<1)
		this.newGenres.removeChild(e.target)
		sessionStorage.setItem("genre",this.candidateGenres)
	}
	removeListeners(){
		[...this.newGenres.children].forEach(entrie=>{
			entrie.removeEventListener("click",this.#listener)
		})
	}
	setForm(movie){
		this.inps.forEach(entrie=>{
			entrie.value=movie[entrie.name] ?? ''
			sessionStorage.setItem(entrie.name,entrie.value)
			entrie.classList.toggle("not-empty",entrie.value.trim().length>0)
		})
		let gens = movie["genre"]
		if(gens){
			this.candidateGenres=[]
			this.newGenres.innerHTML=''
			if(typeof gens=="string") gens=gens.split(',')
			gens.forEach(entrie=>this.#setCandidate(entrie))
		}
		sessionStorage.setItem("genre",this.candidateGenres)
	}
}