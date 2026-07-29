


const getProfile = async(req,res)=>{

 const userId = req.user.id;


 const cachedUser = await redis.hgetall(
   `user:${userId}`
 );


 if(Object.keys(cachedUser).length){
    return res.json(cachedUser);
 }


 const user = await prisma.user.findUnique({
    where:{
       id:userId
    },
    select:{
       id:true,
       name:true,
       email:true,
       avatar:true,
       city:true
    }
 });


 await redis.hset(
   `user:${user.id}`,
   user
 );


 await redis.expire(
   `user:${user.id}`,
   3600
 );


 return res.json(user);

}

const update_user_profile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const {
      name,
      avatar,
      city,
      region,
      postalCode
    } = req.body;


    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        avatar,
        city,
        region,
        postalCode,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        city: true,
        region: true,
        postalCode: true,
      },
    });


    // invalidate redis cache
    await redis.del(
      `user:${userId}`
    );


    return res.status(200).json(
      responses.ok_response(
        updatedUser,
        "Profile updated successfully"
      )
    );


  } catch (error) {
    next(error);
  }
};

