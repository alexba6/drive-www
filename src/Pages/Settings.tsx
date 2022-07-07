import {FunctionComponent, useContext} from "react";

import {Template} from '../Template/Template'
import {ContextTheme} from "../Context/ContextTheme";


export const SettingsPage: FunctionComponent = () => {
    const themeContext = useContext(ContextTheme)

    return <Template.Provider>
        <Template.Bar>
            Theme
        </Template.Bar>
        <Template.Body>
            <button onClick={() => themeContext.toggleTheme()}>
                Passez au thème {themeContext.theme === 'light' ? 'foncé' : 'clair'}
            </button>
        </Template.Body>
    </Template.Provider>
}
