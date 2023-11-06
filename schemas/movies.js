import zod from "zod"
import {lookup} from "mime-types"

const movieSchema=zod.object({
	title: zod.string(),
	year: zod.number().int().min(1900).max(new Date().getYear()+1900),
	director: zod.string(),
	duration: zod.number().int().positive(),
	rate: zod.number().min(0).max(10).default(5),
	poster: zod.string().url().refine(url=>{
		const type = lookup(url)
		if(!type){
			return false
		}
		const [img]=type.split("/")
		return img=="image"
	}),
	genre: zod.array(
		zod.enum(['action','animation','adventure','crime','comedy','drama','fantasy','romance','horror','thriller','sci-fi','biography'])
	).refine(value=>value.length>0,{message:"genre cannot be empty"})
})

export function validateMovie(input){
	if(input.genre){
		try{
			input.genre=[...new Set(input.genre.map(entrie=>entrie.toLowerCase()))]
		}catch{}
	}
	return movieSchema.safeParse(input)
}

export function partialValidateMovie(input){
	if(input.genre){
		try{
			input.genre=[...new Set(input.genre.map(entrie=>entrie.toLowerCase()))]
		}catch{}
	}
	return movieSchema.partial().safeParse(input)
}