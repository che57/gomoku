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

        console.log(this.state.history);
    }

    handleClick(rowIndex, columnIndex) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        // if (calculateWinner(squares) || squares[i]) {
        //     return;
        // }
        if (squares[rowIndex][columnIndex]) {
            return;
        }
        squares[rowIndex][columnIndex] = this.state.xIsNext ? "X" : "O";
        console.log('history: ', history);
        history.push({squares: squares});
        this.setState({
            // history: history.concat([
            //     {
            //         squares: squares
            //     }
            // ]),
            history: history,
            stepNumber: history.length - 1,
            xIsNext: !this.state.xIsNext
        });
    }

    //TODO: re-implement time travel function
    //TODO: figure out why all history elements changed when push one new history
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        console.log('step#: ', this.state.stepNumber);
        console.log('current squares: ', current);
        const winner = calculateWinner(current.squares);
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
        if (winner) {
            status = "Winner: " + winner;
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

function calculateWinner(squares) {
    // const lines = [
    //     [0, 1, 2],
    //     [3, 4, 5],
    //     [6, 7, 8],
    //     [0, 3, 6],
    //     [1, 4, 7],
    //     [2, 5, 8],
    //     [0, 4, 8],
    //     [2, 4, 6]
    // ];
    // for (let i = 0; i < lines.length; i++) {
    //     const [a, b, c] = lines[i];
    //     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    //         return squares[a];
    //     }
    // }
    return null;
}


export default Game;

