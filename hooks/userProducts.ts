import useSWR, {SWRConfiguration} from "swr"
import { IProduct } from '../interfaces/products';




export const useProducts = (url:string, config:SWRConfiguration = {}) =>{
    const {data,error} = useSWR <IProduct[]>(`/api${url}`,config)

    return {
        products:data || [],
        isLoading:!data && !error,
        isError:error   
    }
}

