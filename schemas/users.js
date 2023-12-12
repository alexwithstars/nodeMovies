import zod from "zod"

const userSchema=zod.object({
	username:zod.string().min(5).max(50),
	password:zod.string().min(8).max(50),
	email:zod.string().email().min(4).max(255)
})
const credentialsSchema=zod.object({
	username:zod.string().min(5).max(50),
	password:zod.string().min(8).max(50),
})
const updateSchema=zod.object({
	username:zod.string().min(5).max(50),
	password:zod.string().min(8).max(50),
	newpassword:zod.string().min(8).max(50),
	email:zod.string().email().min(4).max(255)
})

export function validateUser(input){
	return userSchema.safeParseAsync(input)
}
export function partialValidateUser(input){
	return userSchema.partial().safeParseAsync(input)
}
export function userCredentials(input){
	return credentialsSchema.safeParseAsync(input)
}