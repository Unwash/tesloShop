import jwt from "jsonwebtoken"

export const signToken = (_id:string,email:string) =>{

if(!process.env.JWT_SECRET_SEED){
    throw new Error("Falta Semilla jwt, verificar variables de entorno")
}

return jwt.sign(
    // PAYLOAD
    {_id,email},
    // SEED
    process.env.JWT_SECRET_SEED,
    // OPCIONES
    {expiresIn:"30d"}
)


}

export const isValidToken = (token:string):Promise<string> =>{


    if(!process.env.JWT_SECRET_SEED){
        throw new Error("Falta Semilla jwt, verificar variables de entorno")
    }

    return new Promise((resolve,reject)=>{
        try{
            jwt.verify(token,process.env.JWT_SECRET_SEED || "",(err,payload)=>{


                if(err) return reject("JWT no es válido")

                const {_id} = payload as {_id:string}

                resolve(_id)

            })
        }catch(error){
            console.log(error)
            reject("JWT no es válido")
        }
    })

}