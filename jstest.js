import {encryptStr,getDictionary,decryptStr} from "./utils/encrypt.js"	
const base = getDictionary("1")
const chr = n=>String.fromCodePoint(n)
const ord = n=>n.codePointAt(0)

console.log(ord(""))