import { FC, useReducer } from 'react'
import { uiReducer, UiContext } from './'

export interface UiState {
    isMenuOpen: boolean
}

const UI_INITIAL_STATE : UiState = {
    isMenuOpen: false
}

interface Props {
    children:JSX.Element
}

export const UiProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE)

    const toogleSideMenu = ()=>{
        dispatch({type: "[Ui] - ToggleMenu" })
    }

    return (
        <UiContext.Provider value={
            {
                ...state,

                //Methods
                toogleSideMenu
            }
        }>
            {children}
        </UiContext.Provider>
    )
}