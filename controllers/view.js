import {viewModel} from "../models/local/view.js"
import {lookup} from "mime-types"

export class viewController{
	static async cors(req,res,next){
		res.header("Access-Control-Allow-Origin","*")
		res.header("Access-Control-Allow-Methods","*")
		next()
	}
	static async getPage(req,res,next){
		const {page}=req.params
		const response=await viewModel.getResource({url:`../view/${page}.html`})
		if(response) return res.header("content-type","text/html; charset=utf-8").send(response)
		next()
	}
	static async getResource(req,res,next){
		let {url}=req
		const type=lookup(url)
		if(!type){
			return next()
		}
		const response=await viewModel.getResource({url})
		if(response) return res.header("content-type",type).send(response)
		next()
	}
	static async error(req,res,next){
		res.status(404)
		const response=await viewModel.getResource({url:"../view/error.html"})
		if(response) return res.header("content-type","text/html; charset=utf-8").send(response)
		next()
	}
}