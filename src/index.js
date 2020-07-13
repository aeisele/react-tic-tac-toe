import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square"
                onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square value={this.props.squares[i]}
                    onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        const boardSize = 3;
        let squares = [];
        for (let i = 0; i < boardSize; i++) {
            let row = [];
            for (let j = 0; j < boardSize; j++) {
                row.push(this.renderSquare(i * boardSize + j));
            }
            squares.push(<div key={i} className={"board-row"}>{row}</div>);
        }
        return (
            <div>{squares}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                row: null,
                col: null
            }],
            stepNumber: 0,
            xIsNext: true,
            selectedStep: 0,
            sortOrder: 'ASC',
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        const rowCol = calculateRowCol(i);

        this.setState({
            history: history.concat([{
                squares: squares,
                row: rowCol.row,
                col: rowCol.col,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            selectedStep: history.length
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            selectedStep: step
        })
    }

    toggleSortOrder() {
        this.setState({
            sortOrder: this.state.sortOrder === 'ASC' ? 'DESC' : 'ASC',
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            const coordinates = step.row ? ' (' + step.row + ', ' + step.col + ')' : '';
            return (
                <li key={move} className={move === this.state.selectedStep ? 'selected-step' : 'unselected-step'}>
                    <button onClick={() => this.jumpTo(move)}>{desc}{coordinates}</button>
                </li>
            );
        });

        if (this.state.sortOrder !== 'ASC') {
            moves.reverse();
        }

        let status;
        if (winner) {
            status = 'Winner ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>
                        <button onClick={() => this.toggleSortOrder()}>{this.state.sortOrder}</button>
                    </div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function calculateRowCol(i) {
    return {
        row: Math.floor(i / 3) + 1,
        col: i % 3 + 1,
    }
}