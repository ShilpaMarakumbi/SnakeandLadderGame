 import React from 'react';
 import Cell from  './Cell';
export const Board = React.createClass({
	render: function() {
		var cells = [];
		for (var i = 100; i > 0; i--) {
			cells.push(<Cell key={i} colId={i}/>);
		}
		console.log(this.props.type);
		if(this.props.type=="single")
		return (
			<div id="container" className="container">
				{cells}
				
		   <img className='player' id ='player1' src='images/player1.svg' />
		   <img className='player' id ='system' src='images/system.svg' />
		   </div>
		  
		);
		else{
			return (
			<div id="container" className="container">
				{cells}
			
		   <img className='player' id ='player1' src='images/player1.svg' />
		   <img className='player' id ='player2' src='images/player2.svg' />
		   <img className='player' id ='player3' src='images/player3.svg' />
		   </div>
		  
		);
		}
	},
});

export default Board;