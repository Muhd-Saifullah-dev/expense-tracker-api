const { get_categories } = require("./category.controller")

const categoryRoute=require("express").Router()

categoryRoute.get("/",get_categories)

module.exports=categoryRoute