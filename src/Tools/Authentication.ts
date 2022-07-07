import { AuthenticationKey } from "../Context/ContextAuthentication";



export const getAuthorization = (authKey: AuthenticationKey): string => [
    authKey.id,
    authKey.key
].join(':')
