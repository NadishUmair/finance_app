
exports.updateWorkSpace= async(req,res)=>{
    try {
         const {currency}=req.body;
          
         const updated= await prisma.orgnization.update({
            where: {id:req.user.orgId},
            data: currency
         })

         return res.status(200).json({
            success:true,
            data:updated
         })

    } catch (error) {
         res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message || String(error)
         })
    }
}