import React, { useEffect, useState } from 'react'
import web3 from './web3'
import lottery from './lottery'

function App() {
	const [manager, setManager] = useState('')
	const [players, setPlayers] = useState([])
	const [balance, setBalance] = useState('')
	const [value, setValue] = useState('')
	const [message, setMessage] = useState('')

	useEffect(() => {
		const fetch = async () => {
			const manager = await lottery.methods.manager().call()
			const players = await lottery.methods.getPlayers().call()
			const balance = await web3.eth.getBalance(lottery.options.address)

			setManager(manager)
			setPlayers(players)
			setBalance(balance)
		}
		fetch()
	}, [])

	const handleSubmit = async (e) => {
		e.preventDefault()

		const accounts = await web3.eth.getAccounts()
		setMessage('Wating on transaction success...')
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei(value, 'ether'),
		})
		setMessage('You have been entered!')
	}

	const handleClick = async () => {
		const accounts = await web3.eth.getAccounts()
		setMessage('Wating on transaction success...')
		await lottery.methods.pickWinner().send({
			from: accounts[0],
		})
		setMessage('The winner has been picked!')
	}

	return (
		<div>
			<h2>Lottery Contract</h2>
			<p>
				This Contract is managed by {manager} <br />
				There are currently {players.length} people entered competing to win{' '}
				{web3.utils.fromWei(balance, 'ether')} ether!
			</p>
			<hr />
			<form onSubmit={handleSubmit}>
				<h4>Want to try your luck?</h4>
				<div>
					<label>Amount of ether to enter </label>
					<input value={value} onChange={(e) => setValue(e.target.value)} />
				</div>
				<button>Enter</button>
			</form>

			<hr />
			<h4>Ready to pick a winner?</h4>
			<button onClick={handleClick}>Pick a winner</button>
			<hr />

			<h1>{message}</h1>
		</div>
	)
}

export default App
