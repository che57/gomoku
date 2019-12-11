import React from 'react';
import logo from './logo.svg';
import './App.css';

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rowIndex: this.props.rowIndex,
            columnIndex: this.props.columnIndex
        };
    }
    render(){
        return (
            <button className="square" onClick={this.props.onClick}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {

    renderSquare(rowIndex, columnIndex) {
        let key = rowIndex.toString() + ',' + columnIndex.toString();
        return (
            <Square
                key = {key}
                value = {this.props.squares[rowIndex][columnIndex]}
                onClick={() => this.props.onClick(rowIndex, columnIndex)}
            />
        );
    }
    render() {
        const squares = this.props.squares;
        const width = this.props.width;
        const height = this.props.height;

        const board = squares.map((row, rowIndex) => {
            return(
                <div className="board-row" key = {rowIndex}>
                    {
                        row.map((column, columnIndex) => {
                            return this.renderSquare(rowIndex, columnIndex);
                        })
                    }
                </div>
            )
        })

        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 30,
            height: 30,
            history: [],
            stepNumber: 0,
            xIsNext: true,
            test: 'test',
            winner: null
        };
        // init the board based on the given width and height
        // squares will be a 2D array with [rowIndex][columnIndex]
        let initSquares = new Array(this.state.height).fill(null);
        for (let i = 0; i < initSquares.length; i++){
            initSquares[i] = new Array(this.state.width).fill(null);
        }
        this.state.history = [
            {
                squares: initSquares
            }
        ];

        // THIS IS NOT WORKING since js fill the previous array with same null array
        //
        // this.state.history = [
        //     {
        //         squares: Array(this.state.height).fill(Array(this.state.width).fill(null))
        //     }
        // ];

        // original history structure
        // this.state.history = [
        //     {
        //         squares: Array(9).fill(null)
        //     }
        // ];

    }

    handleClick(rowIndex, columnIndex) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squaresRow = current.squares.slice();
        const squares = new Array(squaresRow.length);
        for (let i = 0; i < squares.length; i++){
            squares[i] = squaresRow[i].slice();
        }

        if (squares[rowIndex][columnIndex] || this.state.winner != null) {
            return;
        }
        squares[rowIndex][columnIndex] = this.state.xIsNext ? "X" : "O";
        history.push({squares: squares});
        this.setState({
            history: history,
            stepNumber: history.length - 1,
            xIsNext: !this.state.xIsNext
        });
        this.calculateWinner(squares, rowIndex, columnIndex);
    }

    jumpTo(step) {
        this.setState({
            winner: null,
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    calculateWinner(squares, rowIndex, columnIndex) {

        console.log('checking winner');

        const squaresRow = squares.slice();
        const squaresCopy = new Array(squaresRow.length);
        for (let i = 0; i < squaresCopy.length; i++){
            squaresCopy[i] = squaresRow[i].slice();
        }
        let player = this.state.xIsNext ? 'X' : 'O';
        //check vertical direction winner:
        const verticalRangeLowerBound = (rowIndex - 4 >= 0) ? (rowIndex - 4) : 0;
        const verticalRangeUpperBound = (rowIndex + 4 < squaresCopy.length) ? (rowIndex + 4) : squaresCopy.length - 1;
        let verticalIndicator = null;
        for (let i = verticalRangeLowerBound; i <= verticalRangeUpperBound; i++){
            const squareChecked = squaresCopy[i][columnIndex];
            // start counting when square equals to player
            if (squareChecked === player && verticalIndicator === null){
                verticalIndicator = i;
            }
            // start checking result when square doesn't equal to player
            else if (squareChecked !== player && verticalIndicator !== null){
                let result = i - verticalIndicator;
                if (result >= 5){
                    this.setState({
                        winner: player
                    });
                    console.log('vertical win');
                    return;
                }
                // if player doesn't win within this loop, reset indicator;
                verticalIndicator = null;
            }
        }
        // in case all squares on the row are same as player
        if (verticalIndicator !== null){
            let result = verticalRangeUpperBound - verticalIndicator;
            if (result >= 4){
                this.setState({
                    winner: player
                });
                console.log('vertical win');
                return;
            }
            // if player doesn't win within this loop, reset indicator;
            verticalIndicator = null;
        }

        //check horizontal direction winner:
        const horizontalRangeLowerBound = (columnIndex - 4 >= 0) ? (columnIndex - 4) : 0;
        const horizontalRangeUpperBound = (columnIndex + 4 < squaresCopy[0].length) ? (columnIndex + 4) : squaresCopy[0].length - 1;
        let horizontalIndicator = null;
        for (let i = horizontalRangeLowerBound; i <= horizontalRangeUpperBound; i++){
            const squareChecked = squaresCopy[rowIndex][i];
            // start counting when square equals to player
            if (squareChecked === player && horizontalIndicator === null){
                horizontalIndicator = i;
            }
            // start checking result when square doesn't equal to player
            else if (squareChecked !== player && horizontalIndicator !== null){
                let result = i - horizontalIndicator;
                if (result >= 5){
                    this.setState({
                        winner: player
                    });
                    console.log('horizontal win');
                    return;
                }
                // if player doesn't win within this loop, reset indicator;
                horizontalIndicator = null;
            }
        }
        // in case all squares on the row are same as player
        if (horizontalIndicator !== null){
            let result = horizontalRangeUpperBound - horizontalIndicator;
            if (result >= 4){
                this.setState({
                    winner: player
                });
                console.log('horizontal win');
                return;
            }
            // if player doesn't win within this loop, reset indicator;
            horizontalIndicator = null;
        }

        //check 45 degree direction winner:
        const degree45ColumnLowerRange = (columnIndex - 4 >= 0) ? 4 : columnIndex;
        const degree45ColumnUpperRange = (columnIndex + 4 < squaresCopy[0].length) ? 4 : squaresCopy[0].length - 1 - columnIndex;
        const degree45RowLowerRange = (rowIndex - 4 >= 0) ? 4 : rowIndex;
        const degree45RowUpperRange = (rowIndex + 4 < squaresCopy.length) ? 4 : squaresCopy.length - 1 - rowIndex;
        const degree45LowerRange = 0 - Math.min(degree45ColumnLowerRange, degree45RowUpperRange);
        const degree45UpperRange = Math.min(degree45ColumnUpperRange, degree45RowLowerRange);
        let degree45Indicator = null;
        for (let i = degree45LowerRange; i <= degree45UpperRange; i++){
            const squareChecked = squaresCopy[rowIndex - i][columnIndex + i];
            // start counting when square equals to player
            if (squareChecked === player && degree45Indicator === null){
                degree45Indicator = i;
            }
            // start checking result when square doesn't equal to player
            else if (squareChecked !== player && degree45Indicator !== null){
                let result = i - degree45Indicator;
                if (result >= 5){
                    this.setState({
                        winner: player
                    });
                    console.log('degree 45 win');
                    return;
                }
                // if player doesn't win within this loop, reset indicator;
                degree45Indicator = null;
            }
        }
        // in case all squares on the row are same as player
        if (degree45Indicator !== null){
            let result = degree45UpperRange - degree45Indicator;
            if (result >= 4){
                this.setState({
                    winner: player
                });
                console.log('degree 45 win');
                return;
            }
            // if player doesn't win within this loop, reset indicator;
            degree45Indicator = null;
        }

        //check -45 degree direction winner:
        const degree315LowerRange = 0 - Math.min(degree45ColumnLowerRange, degree45RowLowerRange);
        const degree315UpperRange = Math.min(degree45ColumnUpperRange, degree45RowUpperRange);
        let degree315Indicator = null;
        for (let i = degree315LowerRange; i <= degree315UpperRange; i++){
            const squareChecked = squaresCopy[rowIndex + i][columnIndex + i];
            // start counting when square equals to player
            if (squareChecked === player && degree315Indicator === null){
                degree315Indicator = i;
            }
            // start checking result when square doesn't equal to player
            else if (squareChecked !== player && degree315Indicator !== null){
                let result = i - degree315Indicator;
                if (result >= 5){
                    this.setState({
                        winner: player
                    });
                    console.log('degree -45 win');
                    return;
                }
                // if player doesn't win within this loop, reset indicator;
                degree315Indicator = null;
            }
        }
        // in case all squares on the row are same as player
        if (degree315Indicator !== null){
            let result = degree315UpperRange - degree315Indicator;
            if (result >= 4){
                this.setState({
                    winner: player
                });
                console.log('degree -45 win');
                return;
            }
            // if player doesn't win within this loop, reset indicator;
            degree315Indicator = null;
        }

        this.setState({
            winner: null
        });
    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const width = this.state.width;
        const height =this.state.height;

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (this.state.winner) {
            status = "Winner: " + this.state.winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(rowIndex, columnIndex) => this.handleClick(rowIndex, columnIndex)}
                        width = {width}
                        height = {height}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

export default Game;

