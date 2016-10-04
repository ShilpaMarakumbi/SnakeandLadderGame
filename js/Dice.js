
 import React from 'react';
 export const Dice = React.createClass({
	
      RollDice: function(){
		  this.props.AfterClick();
      },
      render: function(){
		     var diceState;
			 var dice_url="./images/dice"+this.props.NumberOnDice+".svg";
    if (this.props.diceState) {
        diceState =<div id='sixRollState'>You have {this.props.diceState>0?(4-this.props.diceState):0} Chances to roll..</div>;
    } 
        return(
             <div >
		     <div id='text'><img alt="0" className="dice_class" src={dice_url} /> <div id="extrastatus">{this.props.snakeLadStatus}</div></div>
		     <button className='roll' onClick={this.RollDice}>Roll dice</button>
				 {diceState}
			
			 <div id='currentPlayer'> Now its {this.props.currentplayer} 's turn</div>
			</div>
        );
      }	
});

export default Dice;
 
