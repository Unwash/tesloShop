import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from "formidable"
import {v2 as cloudinary} from "cloudinary"

cloudinary.config(process.env.CLOUDINARU_URL || "")

type Data = {
    message: string
}

export const config = {
    api:{
        bodyParser:false
    }
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
 switch(req.method){
    case "POST":
        return UploadFile(req,res)
        default:
            return res.status(400).json({ message: 'Bad request' })
 }
}

const saveFile = async(file: formidable.File[]): Promise <string> =>{

const Pathfile = file[0].filepath

const {secure_url} = await cloudinary.uploader.upload(Pathfile)

return secure_url

}

const parseFiles = async(req:NextApiRequest): Promise<string> =>{

  return new Promise( async (resolve,reject)=>{

    const form = formidable({});

    try {
    const [fields,files] = await form.parse(req)

    const filePath = await saveFile(files.file as formidable.File[])

    resolve(filePath)

    } catch (error) {
      reject(error)
    }

  
  })


}

const  UploadFile = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {

    const imageUrl = await parseFiles(req)
    
    return res.json({message:imageUrl})

  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Ocurrio un error"})
  }
}
