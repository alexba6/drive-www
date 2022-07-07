import {FunctionComponent, MutableRefObject, useContext, useRef, useState} from 'react'
import { toast } from 'react-toastify'

import { useHistory } from 'react-router-dom'
import {ContextAuthentication} from "../Context/ContextAuthentication";

export const LoginPage: FunctionComponent = () => {
	const history = useHistory()
	const authenticationContext = useContext(ContextAuthentication)
	const loginRef = useRef<HTMLInputElement>(null)
	const passwordRef = useRef<HTMLInputElement>(null)
	const [loading, setLoading] = useState(false)

	const onLogin = async (): Promise<void> => {
		const extractValue = (ref: MutableRefObject<HTMLInputElement | null>): string | null => {
			if (ref.current) {
				return String(ref.current?.value)
			}
			return null
		}
		const [login, password] = [extractValue(loginRef), extractValue(passwordRef)]

		if (!login || !password) {
			return
		}
		setLoading(true)
		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					login, password
				})
			})
			const json = await res.json()
			authenticationContext.set(json.authorization)
			history.push('/my-drive')
		} catch (e) {
			toast.error('Cannot login :(')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="d-flex align-items-center justify-content-center h-100">
			<h1>Connexion</h1><br/>
			<input type="text" ref={loginRef} placeholder="Email ou nom d'utilisateur" /><br/>
			<input type="password" ref={passwordRef} placeholder="Mot de passe" /><br/>
			<button onClick={onLogin}>
				{loading ? 'Pending...' : 'Connexion'}
			</button>
		</div>
	)
}
