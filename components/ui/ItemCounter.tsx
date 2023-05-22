import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { FC } from "react";

interface Props {
currentValue:number,
maxValue?:number,
updatedQuantity?:(quantity:number)=>void
}

export const ItemCounter:FC<Props> = ({currentValue,maxValue,updatedQuantity})=>{

    const addProductInCart =()=>{
        if(currentValue === maxValue) return 
        currentValue ++
        updatedQuantity!(currentValue)
    }

    const removeProductFromCart =()=>{
        if(currentValue === 1) return 
        currentValue --
        updatedQuantity!(currentValue)
    }


    return(
        <Box display="flex" alignItems="center">
            <IconButton  onClick={removeProductFromCart} >
                <RemoveCircleOutline />
            </IconButton>
            <Typography sx={{width:40, textAlign:"center" }}>{currentValue}</Typography>
            <IconButton onClick={addProductInCart}>
                <AddCircleOutline />
            </IconButton>
        </Box>
    )
}