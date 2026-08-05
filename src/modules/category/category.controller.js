const { prisma, responses } = require("@/shared")


const get_categories=async(req,res,next)=>{
  try {
    const categories=await prisma.category.findMany({})
    if(!categories){
      return res.status(400).json(responses.bad_request_error("categories not found"))
    }

    return res.status(200).json(responses.ok_response({categories},"categories fetch successfully"))

  } catch (error) {
    next(error)
  }
}

module.exports={get_categories}