 import React from 'react';
 export const Cell = React.createClass({
	render: function() {
		const col = this.props.colId;
		const row = this.props.rowId;
		const size = this.props.size;
	

		return (<div className="cell" id={col}></div>);	
	},
});
export default Cell;