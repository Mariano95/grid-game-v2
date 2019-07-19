import React from 'react';
import Grid from './components/Grid';
import doge from './assets/Doge.png';
import evilDoge from './assets/Evil_doge.png';


export default class App extends React.Component {
	constructor(props) {
		super(props);
		var initial_state = 
		{
			board: [ [ 0, 0, 0], [ 0, 0, 0], [ 0, 0, 0] ],
			cases: {
				0: null,
				1: doge,
				2: evilDoge
			},
			players: {1: {name: "Doge", wins: 0},
					  2: {name: "Evil doge", wins: 0}},
			playingPlayer: 1,
			game_ended: false,
			tokensQty: 0
		};
		this.state = initial_state;

		this.reset = this.reset.bind(this);
		this.handleClick = this.handleClick.bind(this);
		
		this.clicking = false;

		this.callAPI();
	};

	callAPI() {
		const axios = require('axios');
		axios.get("http://localhost:3000/player/retrieve?user_name=Doge")
			.then(res => {
				if (res.data){
					let players = this.state.players;
					players[1] = {name: res.data.name, wins: res.data.wins}
					this.setState({ players: players })
				}
			})
			.catch(error => { console.log(error) })
			.finally();
		
		axios.get("http://localhost:3000/player/retrieve?user_name=Evil+doge")
			.then(res => {
				if (res.data){
					let players = this.state.players;
					players[2] = {name: res.data.name, wins: res.data.wins}
					this.setState({ players: players })
				}
			})
			.catch(error => { console.log(error) })
			.finally();
	}

	render() {
		return(
			<div className="MainContainer">

				<div className="PlayerBoard">
					{this.state.players[1].name}
					<div className="Status">
						{this.state.players[1].wins} WINS
					</div>
				</div>
					
				<div className="Wrapper">
					<div className="ResetContainer">
						<input type="button" value="RESET BOARD" onClick={this.reset}></input>
					</div>
					<Grid handleClick={this.handleClick} cases={this.state.cases} board={this.state.board} /> 
					<div className="GameResultContainer">
						{this.showWinner()}
					</div>
				</div>
				

				<div className="PlayerBoard">
					{this.state.players[2].name}
					<div className="Status">
						{this.state.players[2].wins} WINS
					</div>
				</div>
			</div>
		)
	};

	handleClick (row, col) {
		console.log(this.state.tokensQty)
		if (this.clicking) {
			return;
		}
		if (this.state.game_ended === false){
			let board = [ ...this.state.board ];
			let values = Object.keys(this.state.cases);
			if (board[row][col] === 0){
				board[row][col] = parseInt(values[this.state.playingPlayer]);
				this.clicking = true;
				this.setState({ board }, () => { 
					this.clicking = false;
					
				});


				let new_token_qty = this.state.tokensQty + 1;
				this.winnerExists();
				this.game();
			}
		}
	};

	game(){
		if(this.state.playingPlayer === 1){
			this.setState({playingPlayer: 2});
		}
		else{
			this.setState({playingPlayer: 1});
		}
	};

	winnerExists(){
		if(this.state.board[0][0]===this.state.board[1][1] && this.state.board[1][1]===this.state.board[2][2] && this.state.board[2][2]!==0) {
			this.endGame();
		}

		if(this.state.board[0][2]===this.state.board[1][1] && this.state.board[1][1]===this.state.board[2][0] && this.state.board[2][0]!==0) {
			this.endGame();
		}

		[0, 1, 2].map( (i) => { 
			if(this.state.board[0][i]===this.state.board[1][i] && this.state.board[1][i]===this.state.board[2][i] && this.state.board[2][i]!==0) {
				this.endGame();
			} 
			return 1;
		})
		
		this.state.board.map( (row) => { 
			if(row[0]===row[1] && row[1]===row[2] && row[2]!==0) {
				this.endGame();
			} 
			return 1;
		})
	};

	endGame(){
		let p = this.state.players;
		p[this.state.playingPlayer].wins += 1;
		this.setState({players: p, game_ended: true});

		let playingPlayer = this.state.players[
			this.state.playingPlayer
		];
	};

	showWinner(){
		if (this.state.game_ended){
			let winner_key = Object.keys(this.state.players).filter( (el) => { return parseInt(el) !== this.state.playingPlayer} );
			return(
			this.state.players[winner_key].name + " wins"
			);
		}
		else{
			if (this.state.tokensQty >= 9){
				return(
				"DRAW"
				);
			}
		}
	};

	reset(){
		this.setState({
			board: [ [ 0, 0, 0,], [ 0, 0, 0], [ 0, 0, 0] ],
			game_ended: false,
			tokensQty: 0

		})
	};
};

