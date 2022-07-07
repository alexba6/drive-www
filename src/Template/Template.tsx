import React, {FunctionComponent, MouseEvent, ReactNode, useMemo} from 'react'
import {useHistory, useLocation} from 'react-router-dom'

import {HeaderHomeLogo} from '../Components/Header/HeaderHomeLogo'
import {ButtonCircle} from '../Components/Button/ButtonCircle'
import MdiCogOutline from '../Icons/MdiCogOutline'
import {StatDiskUse} from '../Components/Stat/StatDiskUse'
import {InputSearch} from '../Components/Input/InputSearch'
import UilBars from '../Icons/UilBars'

import {RoutePath, RoutesPath} from "../Config/Routes";

import styles from './Template.module.sass'

type TemplateNavigationLinkProps = {
    route: RoutePath
}

type TemplateProviderProps = {
    children: ReactNode
}

const TemplateHeader: FunctionComponent = () => {
    const history = useHistory()

    return <div className={styles.templateHeaderContainer}>
        <div className={styles.templateHeaderLogoFrame}>
            <HeaderHomeLogo onClick={() => history.push('/my-drive')}/>
        </div>
        <div className={styles.templateHeaderSearchFrame}>
            <InputSearch/>
        </div>
        <div className={styles.templateHeaderSettingsFrame}>
            <ButtonCircle icon={<MdiCogOutline fontSize={20}/>} size={35} onClick={() => {
            }}/>
        </div>
        <div className={styles.templateHeaderButtonMenuFrame}>
            <button>
                <UilBars/>
            </button>
        </div>
    </div>
}

const TemplateNavigationLink: FunctionComponent<TemplateNavigationLinkProps> = (props) => {
    const history = useHistory()
    const location = useLocation()
    const active = useMemo(() => props.route.target === location.pathname, [props.route, location])

    const redirect = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        event.stopPropagation()
        history.push(props.route.target)
    }

    return (
        <li className={styles.templateNavigationLinkFrameContainer}>
            <a href={props.route.target} onClick={redirect}>
                <div className={styles.templateNavigationLinkFrame} active={active ? 'active' : 'down'}>
                    <div className={styles.templateNavigationLinkIconFrame}>{props.route.icon}</div>
                    <div>
                        <span>{props.route.name}</span>
                    </div>
                </div>
            </a>
        </li>
    )
}


const TemplateNavigation: FunctionComponent = () => {
    return (
        <div className={styles.templateNavigationContainer}>
            <nav>
                <ul>
                    <TemplateNavigationLink route={RoutesPath.myDrive}/>
                    <TemplateNavigationLink route={RoutesPath.sharedWithMe}/>
                    <TemplateNavigationLink route={RoutesPath.recent}/>
                    <TemplateNavigationLink route={RoutesPath.starred}/>
                    <TemplateNavigationLink route={RoutesPath.trash}/>
                    <li>
                        <hr/>
                    </li>
                    <TemplateNavigationLink route={RoutesPath.quota}/>
                    <TemplateNavigationLink route={RoutesPath.settings}/>
                </ul>
            </nav>
        </div>
    )
}

const TemplateBar: FunctionComponent = (props) => {
    return <div className={styles.templateBarFrame}>
        {props.children}
    </div>
}

const TemplateAction: FunctionComponent = (props) => {
    return <div className={styles.templateActionFrame}>
        {props.children}
    </div>
}

const TemplateBody: FunctionComponent = (props) => {
    return <div className={styles.templateContentFrame}>
        {props.children}
    </div>
}

const TemplateProvider: FunctionComponent<TemplateProviderProps> = (props) => {
    return (
        <div className={styles.templateContainer}>
            <TemplateHeader/>
            <TemplateNavigation/>
            <div className={styles.templateStatContainer}>
                <StatDiskUse currentUse={Math.floor(Math.random() * 10 ** 13)} maxAllowed={10 ** 13}/>
            </div>
            {props.children}
        </div>
    )
}


export const Template = {
    Provider: TemplateProvider,
    Bar: TemplateBar,
    Action: TemplateAction,
    Body: TemplateBody
}
