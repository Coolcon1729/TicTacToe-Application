import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button 
            className="square"
            onClick={props.onClick}
            style={{backgroundColor: props.background}}
        >
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                background={this.props.backgrounds[i]}
                key={i}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
  
    render() {
        let items = [];
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 0; j < 3; j++) {
                row.push(this.renderSquare(3 * i + j));
            }
            items.push(<div className="board-row" key={i}>{row}</div>);
        }
        return (
            <div>
                {items}
            </div>
        );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                backgrounds: Array(9).fill("white"),
                changed: null
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) return;
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([{
                squares: squares,
                backgrounds: current.backgrounds,
                changed: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            history: this.state.history,
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        let current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            let desc;
            if (move) {
                desc = `Go to move #${move} (${step.squares[step.changed]} at position [${Math.ceil((step.changed + 1) / 3)}, ${step.changed % 3 + 1}])`;
                desc = move === this.state.stepNumber ? <strong>{desc}</strong> : desc;
            } else {
                desc = `Go to game start`;
            }
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        
        let status;
        if (winner) {
            status = `${winner[0]} is the winner!`;
            let backgrounds = current.backgrounds.slice();
            for (let i of winner.slice(1)) backgrounds[i] = "lightgreen";
            current.backgrounds = backgrounds;
        } else if (this.state.stepNumber === 9) {
            status = `Draw!`;
        } else {
            status = `It's ${this.state.xIsNext ? "X" : "O"}'s turn!`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        backgrounds={current.backgrounds}
                        onClick={(i) => this.handleClick(i)}
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
  
// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
        const [a, b, c] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], a, b, c];
        }
    }
    return null;
}
  