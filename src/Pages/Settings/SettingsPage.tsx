import React, {FunctionComponent, useContext} from "react";

import {Template} from '../../Template/Template'
import {ContextTheme} from "../../Context/ContextTheme";
import {Button} from "../../Components/Button/Button";


export const SettingsPage: FunctionComponent = () => {
    const themeContext = useContext(ContextTheme)

    return <Template.Provider>
        <Template.Bar>
            Theme
        </Template.Bar>
        <Template.Body>
            <Button onClick={() => themeContext.toggleTheme()} variant='primary'>
                Passez au thème {themeContext.theme === 'light' ? 'foncé' : 'clair'}
            </Button>
        </Template.Body>
    </Template.Provider>
}
