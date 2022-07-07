import React, { ReactNode } from 'react'
import MdiServer from "../Icons/MdiServer";
import MdiAccountSupervisorOutline from "../Icons/MdiAccountSupervisorOutline";
import MdiClockTimeEightOutline from "../Icons/MdiClockTimeEightOutline";
import MdiStarOutline from "../Icons/MdiStarOutline";
import MdiCloudOutline from "../Icons/MdiCloudOutline";
import MdiCogOutline from "../Icons/MdiCogOutline";
import MdiTrashCanOutline from "../Icons/MdiTrashCanOutline";

export type RoutePath = {
    name: string,
    icon?: ReactNode,
    target: string
}


export const RoutesPath: {[key: string]: RoutePath} = {
    login: {
        name: 'Login',
        target: '/login'
    },
    myDrive: {
        name: 'Mon Drive',
        target: '/my-drive',
        icon: <MdiServer />
    },
    sharedWithMe: {
        name: 'Partagés avec moi',
        target: '/shared-with-me',
        icon: <MdiAccountSupervisorOutline />
    },
    recent: {
        name: 'Partagés avec moi',
        target: '/recent',
        icon: <MdiClockTimeEightOutline />
    },
    starred: {
        name: 'Suvis',
        target: '/starred',
        icon: <MdiStarOutline />
    },
    trash: {
       name: 'Corbeille',
       target: '/trash',
       icon: <MdiTrashCanOutline />
    },
    quota: {
        name: 'Espace de stockage',
        target: '/quota',
        icon: <MdiCloudOutline />
    },
    settings: {
        name: 'Paramètres',
        target: '/settings',
        icon: <MdiCogOutline />
    }
}
