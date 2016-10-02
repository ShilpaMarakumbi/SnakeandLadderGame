  import React from 'react';
  import * as ReactDOM from 'react-dom';
  var dragula = require('react-dragula');
  import Dice from  './js/Dice';
  import Board from  './js/Board';

  let Player = (function() {
	'use strict';
     /*Constructor function for the player*/
	function Player(name) {
		
		let throwsDone = 0;
		let sixRoller = 0;
		let laddersClimbed = 0;
		let snakesEncountered = 0;
		
	
		
		/*Implement Singleton pattern*/
		if (!(this instanceof Player)) {
			return new Player(name);
		}
		
		this.actaul_pos=1; 
		this.name = name.toLowerCase();
		this.perfect_throws=[];
		
		this.throwsDoneUpdate = function(){
			throwsDone++;
		};
		this.throwsRet = function(){
			return throwsDone;
		};
		this.sixRollerUpdate = function(){
			sixRoller++;
		};
		this.sixRollerRet = function(){
			return sixRoller;
		};
		this.laddersClimbedUpdate = function(){
			laddersClimbed++;
		};
		this.laddersClimbedRet = function(){
			return laddersClimbed;
		};
		this.snakesEncounteredUpdate = function(){
			snakesEncountered++;
		};
		this.snakesEncounteredRet = function(){
			return snakesEncountered;
		};
		/*purpose:to move the position of player
		  input : num (current position where it needs to be moved)
		  output : player moved to given position
		*/
		this.movePlayer=function(num){
			var player_id="#"+this.name;
			this.actaul_pos=num;
			if(this.actaul_pos>100){ 
				$(player_id).css({top: 0, left:450,position:'absolute'});
			}
			else{
				var pos=$(player_id).offset();
				var left_position=((num-1)%10)*50;
				num= (num%10==0)?num-1:num;
				var top_position=500-(Math.floor(num/10)+1)*50;
				$(player_id).css({top: (top_position), left:(left_position+10),position:'absolute'});
			}
		}
		
		/*purpose:to calculate perfect throws given the player current position
		  input :
		         1.position (player's current position)
				 2.snk      (snake array)
				 3.lad      (ladder array)
		  output:logged to console after each players move
		*/
		this.perfectThrows = function(position,snk,lad){
			
			let snakes = snk;
			let ladders = lad;
			let queue = [];
			let perfectThrows = [];
		    let visited = [];
		    let i = 0;
            queue.push(position-1);
			for (i = 0; i < 100; i++) {
				visited[i] = false;
			}
			while(queue.length){
			let current_pos = queue.shift();
			if(current_pos==100) break;

			for(i = current_pos+1; (i <= current_pos+6) && (i < 100); i++){
				if(!visited[i]){
					visited[i] = true;
					let perfect_flag = false; 
					snakes.forEach(function(snake){
						if(i == snake.head){
							perfect_flag = true;
							queue.push(snake.tail);
						}
					});
					ladders.forEach(function(ladder){
						if(i == ladder.bottom){
							perfect_flag = true;
							queue.push(ladder.top);
						}
					});

					if(!perfect_flag){
						queue.push(i);
						perfectThrows.push(i-current_pos);
					}
				}
			}
		}
		return perfectThrows;
	}
}
	return Player;
}());
  
  //snake constructor 
  function Snake(head,tail)
  {
	  this.head=head;
	  this.tail=tail;
  }
  //ladder constructor
  function Ladder(bottom,top)
  {
	  this.bottom=bottom;
	  this.top=top;
  }
  

/*Gameboard which renders all the UI's according to the state*/
const GameBoard = React.createClass({
	  /*for implementing drag and drop fecature of score card*/
	   componentDidMount: function () {
			 var container = ReactDOM.findDOMNode(this);
			 dragula([container]);
	    },
  
		getInitialState: function() {
			var ladders_arr=[new Ladder(3,51),new Ladder(6,27),new Ladder(20,60),new Ladder(36,55),new Ladder(63,95),new Ladder(68,98)];
			var snakes_arr=[new Snake(25,5),new Snake(34,1),new Snake(47,19),new Snake(65,52),new Snake(87,57),new Snake(91,61),new Snake(99,69)];
			return {
				gameStatus: 0, 	//0:Not started 1:Started 2:End
				gamestateText: "Game is Not Started",
				numofPlayers: 1,
				gameType:"",
				dice: 'Roll the dice',
				diceNum:0,
				currentPlayer: 0,
				isSixRepeat: 0,
				totalThrows:0,
				players:[new Player("player1"),new Player("system")],
				ladders:ladders_arr,
				snakes:snakes_arr
			};
		},
	/*purpose:to change heading in gaming mode
		  input :
		        single or multiplayer game
		  output:set status accordingly
	*/
    onGameType:function(event){
		let game_type=event.currentTarget.id;
		//single player game
		if(game_type=="single"){
			this.setState({
				gameStatus:1,
				gameType:game_type,
				gamestateText:"Game Started (of Single Player)!!"
			});
			 
		}
		//multiple player game
		else{
			this.setState({
				gameStatus:1,
				gameType:game_type,
				gamestateText:"Game Started (of Multiple Players)!!",
				players:[new Player("player1"),new Player("player2"),new Player("player3")],
				numofPlayers:3
				
			});
		}
	
	},
		/*purpose:on click handler of roll dice
		  input :
		       
		  output:roll the dice and move the player
	*/
	RollTheDice: function() {
		const  num=Math.floor(Math.random() * 6) + 1  ;
		var sixState=this.state.isSixRepeat;
		var total_throws=this.state.totalThrows;
		var Sgame_status=this.state.gameStatus;
		var Sgame_text=this.state.gamestateText;
		if(sixState>=2)
			 sixState=0;
		else if (num==6 || sixState){
				sixState++;
		}
		
		if(this.state.gameType=="single")
		   var game_status=this.playSingleplayerGame(num);
	    else{
		   var game_status=this.playMultiplayerGame(num);
		   	
		}
		   //Game Ended
		if(game_status==2){
			   console.log("Game over won by "+this.state.players[this.state.currentPlayer].name);
			    Sgame_status=3;
				Sgame_text="Game over won by "+this.state.players[this.state.currentPlayer].name;  
		}
		if ( sixState) ;
		else 
		   total_throws++;
		
	    if(this.state.gameType=="multiple"){
					  this.setState({
			currentPlayer: (total_throws)%(this.state.players.length),
			
		   });
		}
		this.setState({
			diceNum: num,
			isSixRepeat:sixState,
			totalThrows:total_throws,
			gameStatus:Sgame_status,
			gamestateText:Sgame_text
		});
	},
	
	/*purpose:to chcek if the ladder is climbed or not 
		  input :players current position  
		  output: return the ladder top position
	 */
	getLadderClimbed:function(pos){
		var ret=-1;
		(this.state.ladders).forEach(function(x){
			
			if(x.bottom==pos){
				ret= x.top;
			}
		});
		return ret;
	},
	/*purpose:to chcek if the snake is bit or not 
		  input :players current position  
		  output: return the snake tail position 
	 */
	getSnakeEncountered:function(pos){
		var ret=-1;
		(this.state.snakes).forEach(function(x){
			
			if(x.head==pos){
				ret= x.tail;
			}
		});
		return ret;
	},
		/*purpose:move the single player players
		  input :num (dice rolled number)    
		  output:move the player and automatically move the system
	    */
	playSingleplayerGame:function(num){
		var current_player=this.state.currentPlayer;
		var currentplayer=this.state.players[current_player];
		var actualPos=currentplayer.actaul_pos;
	    var sixState=this.state.isSixRepeat;
		
		if(num==6){
		   currentplayer.sixRollerUpdate();
		}
		currentplayer.perfect_throws=currentplayer.perfectThrows(actualPos,this.state.snakes,this.state.ladders).toString();
		currentplayer.movePlayer(actualPos+num);
		currentplayer.throwsDoneUpdate();
		actualPos=currentplayer.actaul_pos;
		let ladder_top=this.getLadderClimbed(actualPos);

		if(ladder_top!=-1){
		   currentplayer.movePlayer(ladder_top);
		   currentplayer.laddersClimbedUpdate();
		}
		 
		let snake_bottom=this.getSnakeEncountered(actualPos);
		if(currentplayer.actaul_pos>=100)
				return 2;
		if(snake_bottom!=-1){
			currentplayer.movePlayer(snake_bottom);
			currentplayer.snakesEncounteredUpdate();
		}
		console.log(sixState);
		if ( sixState>0)
		     var curr_player=this.state.currentPlayer;
		else
			 var curr_player=this.state.currentPlayer==1?0:1;
		this.setState({
			currentPlayer: curr_player,	
		});
		if(curr_player==1){
		   var self=this;
		   setTimeout(function(){
			   self.RollTheDice();
		   },1000);
		}
		   return 1;
	},
	/*purpose: decide the players turn in round robin manner
		  input :num (dice rolled number)    
		  output:move the player  who gets his turn
	*/
	playMultiplayerGame:function(num){
		let players=this.state.players;
		
			var whose_turn = players[this.state.totalThrows%(players.length)];
			console.log(whose_turn);

			whose_turn.throwsDoneUpdate();
			var actualPos=whose_turn.actaul_pos;
            whose_turn.perfect_throws=whose_turn.perfectThrows(actualPos,this.state.snakes,this.state.ladders).toString();
			
			
			 whose_turn.movePlayer(actualPos+num);
			 actualPos=whose_turn.actaul_pos;
			
			 let ladder_top=this.getLadderClimbed(actualPos);

		  if(ladder_top!=-1){
			  whose_turn.movePlayer(ladder_top);
			  whose_turn.laddersClimbedUpdate();
		  }
		 
		 let snake_bottom=this.getSnakeEncountered(actualPos);
		 
		 if(snake_bottom!=-1){
			whose_turn.movePlayer(snake_bottom);
			whose_turn.snakesEncounteredUpdate();
		  }
			
			
			if(whose_turn.actaul_pos>=100)
				return 2;
			  if(num==6){
				  whose_turn.sixRollerUpdate();
			  }
			 console.log( whose_turn.name+whose_turn.sixRollerRet());
		
		return 1;
	},
	/*purpose:back to main page
	*/
	gobackToGame:function(){
		this.setState(this.getInitialState());
	},
	  render:function(){
		  const game_status=this.state.gameStatus;
		  var curr_player=this.state.players[this.state.currentPlayer].name;
		  var players=this.state.players;
		  var playersInfo=[];
		  players.forEach(function(player){
			  
			  var src1="./images/"+player.name+".svg";
			  playersInfo.push(<div key={player.name}> <img className="player_image" src={src1} />
				  {player.name}({player.actaul_pos})
				  <div>Perfect Throws :</div>
				  <div className="perfectThrows">{player.perfect_throws}</div>
			  </div>
			  )
		  });
		  if(game_status==0)
			  return (<div id="gamechoose"><h3>Choose How you want to play the Snake & Ladder Game</h3>
		  <button onClick={this.onGameType} id='single' className='gameType'>Single</button>
		  <button onClick={this.onGameType} id='multiple'  className='gameType'>Multiplayer</button></div>)
		  else if(game_status==1)
		  return (<div id="gameboard"><h2>Snake and Ladder Game</h2><h3>{this.state.gamestateText}<button className="go_back" onClick={this.gobackToGame}>Go back to Game</button></h3>
	     <Board size={100} type={this.state.gameType} />
		   <div id='dicearea'>
		 <Dice NumberOnDice={this.state.diceNum} AfterClick={this.RollTheDice} diceState={this.state.isSixRepeat} currentplayer={curr_player}/>
		 <div className="playersInfo">{playersInfo}</div>
		   </div>
		    </div>
		  )
		  else{
			  
			  let scores=[];
			  players.forEach(function(player){
				 
				  scores.push(
				   <div  key={player.name} className='scoreCards'>
				   <div  className='scores'>
				  
				    <p>{player.name} Game Info</p>
					<ul>
					 <li>Ladders Climbed : {player.laddersClimbedRet()}</li>
					 <li>Snakes Encountered : {player.snakesEncounteredRet()}</li>
					 <li>No. of sixes : {player.sixRollerRet()}</li>
					 <li>No. of Throws : {player.throwsRet()}</li>
					</ul>
				   </div>
				   </div>
				  );
			  });
			  return(
		  <div className="container"><h3>{this.state.gamestateText}</h3><button id='backToGame' onClick={this.gobackToGame}>Go Back to Game</button>{scores}</div>
			  )
		  }
	  }
  })
  export default GameBoard;
  