import { ISize } from "@/interfaces";
import { Box, Button } from "@mui/material";
import { FC } from "react";

interface Props{
    selectedSize?: ISize;
    sizes:ISize[],
    getSelectedSize:(size:ISize)=>void
}

export const SizeSelector : FC <Props> = ({selectedSize,sizes,getSelectedSize}) => {
  return (
    <Box>
       {
        sizes.map((size)=>(
            <Button
            key={size}
            onClick={()=>getSelectedSize(size)}
            size="small"
            color={selectedSize === size ? "primary" : "info"} 
            >
                {size}
            </Button>
        ))
       } 
    </Box>
  )
}
