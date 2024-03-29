import  { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import { AdminLayout } from '../../../components/layouts'
import { IProduct, ISize, ITypes } from '../../../interfaces';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { dbProducts } from '../../../database';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { tesloApi } from '@/api';
import { Product } from '@/models';
import { useRouter } from 'next/router';


const validTypes  = ['shirts','pants','hoodies','hats']
const validGender = ['men','women','kid','unisex']
const validSizes = ['XS','S','M','L','XL','XXL','XXXL']

interface FormData {
    _id:string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: string[];
    slug: string;
    tags: string[];
    title: string;
    type: string;
    gender: string;
}

interface Props {
    product: IProduct;
    isNew: Boolean
}

const ProductAdminPage:FC<Props> = ({ product , isNew }) => {

    const router = useRouter()

    const fileInputRef = useRef<HTMLInputElement>(null)

    const [newTagValue,setNewTagValue] = useState("")
    const [isSaving, setIsSaving] = useState(false)


    const {register,handleSubmit,formState:{errors}, getValues, setValue,watch} = useForm<FormData>({
        defaultValues: product
    })

    useEffect(()=>{

        const subscription = watch((value,{name,type})=>{
            if(name === "title"){
                const newSlug = value.title?.trim().replaceAll(" ","_").replaceAll("'","").toLocaleLowerCase() || ""

                setValue("slug",newSlug)
            }
        })

        return ()=> subscription.unsubscribe()
    },[watch,setValue])


    const onChangeSize = (size:string)=>{
        const currentSizes = getValues("sizes")

        if(currentSizes.includes(size)){
            setValue("sizes", currentSizes.filter((s=>s !== size)), {shouldValidate:true})
            return
        }

        setValue("sizes",[...currentSizes,size], {shouldValidate:true})

    }

 

    const onAddTag = ()=>{
        const tags = getValues("tags")
        if(newTagValue.trim() == "") {
           return
        }
        if(tags.includes(newTagValue.trim())){
            alert("Etiqueta ya existente ")
            return 
        }
        setValue("tags", [...tags,newTagValue.trim().toLocaleLowerCase()], {shouldValidate:true})
        setNewTagValue("")
    
    }

    const onDeleteTag = ( tag: string ) => {
        const tags = getValues("tags")
        setValue("tags",tags.filter((t)=> t !== tag), {shouldValidate:true})
    }

    const onFilesSelected = async ( {target}:ChangeEvent<HTMLInputElement> )=>{
        if(!target.files || target.files.length === 0){
            return 
        }
        

        try {
            for(const file of target.files){
                const formData = new FormData()
                formData.append("file",file)
                const {data} = await tesloApi.post<{message:string}>("/admin/upload",formData)
                setValue("images", [...getValues("images"), data.message], {shouldValidate:true} )
            }
        } catch (error) {
            console.log(error)
        }
        }

        const onDeleteImg = (img:string)=>{
            console.log(img)
            setValue("images",getValues("images").filter((i)=>i !== img, {shouldValidate:true} ))
        }

    const onSubmit = async (formData:FormData) =>{
        if(formData.images.length < 2) return alert("Minimo 2 imagenes")

        setIsSaving(true)
    
        try {
    
         const {data} = await tesloApi({
             url:"/admin/products",
             method: isNew ? "POST" : "PUT",
             data:formData
         })
         if(!formData._id){
            router.replace(`/admin/products/${data.slug}`)
         }else{
             setIsSaving(false)
         }
         
        } catch (error) {
         setIsSaving(false)
        }
    }

    return (
        <AdminLayout 
            title={'Producto'} 
            subTitle={`Editando: ${ product.title }`}
            icon={ <DriveFileRenameOutline /> }
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button 
                        color="secondary"
                        startIcon={ <SaveOutlined /> }
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled={isSaving}
      
                        >
                        Guardar
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    <Grid item xs={12} sm={ 6 }>

                        <TextField
                            label="Título"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('title', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                            error={ !!errors.title }
                            helperText={ errors.title?.message }
                        />

                        <TextField
                            label="Descripción"
                            variant="filled"
                            fullWidth 
                            multiline={false}
                            sx={{ mb: 1 }}
                            { ...register('description', {
                                required: 'Este campo es requerido',
                            })}
                            error={ !!errors.description }
                            helperText={ errors.description?.message }
                        />

                        <TextField
                            label="Inventario"
                            type='number'
                            variant="filled"
                            multiline={false}
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('inStock', {
                                required: 'Este campo es requerido',
                                minLength: { value: 0, message: 'Mínimo de valor cero' }
                            })}
                            error={ !!errors.inStock }
                            helperText={ errors.inStock?.message }
                        />
                        
                        <TextField
                            label="Precio"
                            type='number'
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('price', {
                                required: 'Este campo es requerido',
                                minLength: { value: 0, message: 'Mínimo de valor cero' }
                            })}
                            error={ !!errors.price }
                            helperText={ errors.price?.message }
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Tipo</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues("type") }
                                onChange={ ({target})=> setValue("type",target.value, {shouldValidate: true}) }
                            >
                                {
                                    validTypes.map( option => (
                                        <FormControlLabel 
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Género</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues("gender") }
                                onChange={ ({target})=> setValue("gender",target.value, {shouldValidate: true}) }
                            >
                                {
                                    validGender.map( option => (
                                        <FormControlLabel 
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormGroup>
                            <FormLabel>Tallas</FormLabel>
                            {
                                validSizes.map(size => (
                                    <FormControlLabel key={size} control={<Checkbox checked={getValues("sizes").includes(size)} />} label={ size }
                                    onChange={()=>onChangeSize(size)}
                                    />
                                ))
                            }
                        </FormGroup>

                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={ 6 }>
                        <TextField
                        multiline={false}
                            label="Slug - URL"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            { ...register('slug', {
                                required: 'Este campo es requerido',
                                validate:(val)=>val.trim().includes(" ") ? "No puede tener espacios en blanco" : undefined
                            })}
                            error={ !!errors.slug }
                            helperText={ errors.slug?.message }
                            
                        />

                        <TextField
                        multiline={false}
                            label="Etiquetas"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            helperText="Presiona [spacebar] para agregar"
                            value={newTagValue}
                            onChange={(e)=>setNewTagValue(e.target.value)}
                            onKeyPress={(e)=>e.code === "Space" ? onAddTag() : ""}
                        />
                        
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                        component="ul">
                            {
                                getValues("tags").map((tag) => {

                                return (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={ () => onDeleteTag(tag)}
                                        color="primary"
                                        size='small'
                                        sx={{ ml: 1, mt: 1}}
                                    />
                                );
                            })}
                        </Box>

                        <Divider sx={{ my: 2  }}/>
                        
                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb:1}}>Imágenes</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={ <UploadOutlined /> }
                                sx={{ mb: 3 }}
                                onClick={()=> fileInputRef.current?.click()}
                            >
                                Cargar imagen
                            </Button>

                            <input type='file' multiple 
                    accept='image/png, image/gif, image/jpeg  ' style={{display:"none"}} ref={fileInputRef}
                    onChange={onFilesSelected}
                    />

                            <Chip 
                                label="Es necesario al 2 imagenes"
                                color='error'
                                variant='outlined'
                                sx={{display: getValues("images")?.length < 2 ?  "flex" : "none"}}
                            />

                            <Grid container spacing={2}>
                                {
                                    getValues("images").map( img => (
                                        <Grid item xs={4} sm={3} key={img}>
                                            <Card>
                                                <CardMedia 
                                                    component='img'
                                                    className='fadeIn'
                                                    image={ img }
                                                    alt={ img }
                                                />
                                                <CardActions>
                                                    <Button fullWidth color="error" onClick={()=>onDeleteImg(img)}>
                                                        Borrar
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>

                        </Box>

                    </Grid>

                </Grid>
            </form>
        </AdminLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    
    const { slug = ''} = query;

    let product : IProduct | null

    let isNew : Boolean 

    if(slug === "new"){
        const tempProduct = JSON.parse(JSON.stringify(new Product()))
        delete tempProduct._id
        tempProduct.images = ["img1.jpg","img2.jpg"]
        product = tempProduct
        isNew = true
    }else{
        product = await dbProducts.getProductBySlug(slug.toString());
        isNew = false
    }
    
    

    if ( !product ) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }
    

    return {
        props: {
            product,
            isNew
        }
    }
}


export default ProductAdminPage