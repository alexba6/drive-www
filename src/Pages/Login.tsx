import {FunctionComponent, MutableRefObject, useContext, useRef, useState} from 'react'
import { Button, Card, Form, FormGroup, InputGroup, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'

import { useHistory, Link } from 'react-router-dom'
import FaSolidKey from '../Icons/FaSolidKey'
import FaSolidUser from '../Icons/FaSolidUser'
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
			<Card style={{ width: '400px' }}>
				<Card.Header>
					<h1>Connexion</h1>
				</Card.Header>
				<Card.Body>
					<FormGroup>
						<InputGroup className="mb-3">
							<InputGroup.Text>
								<FaSolidUser />
							</InputGroup.Text>
							<Form.Control type="text" isInvalid={false} ref={loginRef} placeholder="Email ou nom d'utilisateur" />
							<Form.Control.Feedback type="invalid">{/*{loginError}*/}</Form.Control.Feedback>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<InputGroup>
							<InputGroup.Text>
								<FaSolidKey />
							</InputGroup.Text>
							<Form.Control type="password" ref={passwordRef} isInvalid={false} placeholder="Mot de passe" />
							<Form.Control.Feedback type="invalid">{/*{passwordError}*/}</Form.Control.Feedback>
						</InputGroup>
					</FormGroup>
					<div className="text-end m-2">
						<Link to="/renew-password">Mot de passe oublié ?</Link>
					</div>
					<hr />
					<Button className="w-100 mb-3" onClick={onLogin} disabled={loading}>
						{loading ? (
							<Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
						) : (
							'Connexion'
						)}
					</Button>
				</Card.Body>
			</Card>
		</div>
	)
}
