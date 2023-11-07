import { useState } from "react"
import confetti from "canvas-confetti"
import { Square } from "./components/Square.jsx"
import { TURNS, WINNER_COMBOS } from "./constants.js"
import { WinnerModal } from "./components/WinnerModal.jsx"

function App() {

  const [board, setBoard] = useState(() => {
    const boardFromStorage = JSON.parse(window.localStorage.getItem('board'))
    return boardFromStorage 
    ? boardFromStorage 
    : Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = JSON.parse(window.localStorage.getItem('turn'))
    return (turnFromStorage === TURNS.X) ? TURNS.O : TURNS.X
  })
  const [winner, setWinner] = useState(null)
  
  const checkWinner = (boardToCheck) => {
    for(const combo of WINNER_COMBOS) {
      const [a, b, c] = combo
      if(
        boardToCheck[a] === boardToCheck[b] 
        && boardToCheck[b] === boardToCheck[c]
        && boardToCheck[a]
        ) {
          return boardToCheck[a]
        }
    }
    return null
  }

  const checkEndGame = (newBoard) => {
    return newBoard.every((val) => val !== null)
  }
  
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    window.localStorage.clear()
  }

  const updateBoard = (index) => {
    if(board[index] == null && !winner) {
      const newBoard = [...board]
      newBoard[index] = turn
      setBoard(newBoard)

      const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
      setTurn(newTurn)
      const newWinner = checkWinner(newBoard)

      window.localStorage.setItem('board', JSON.stringify(newBoard))
      window.localStorage.setItem('turn', JSON.stringify(turn))

      if(newWinner) {
        confetti()
        setWinner(newWinner)
      } else if(checkEndGame(newBoard)) {
        setWinner(false)
      }
    } 
  }

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <footer>
          <button onClick={resetGame}>Empezar de nuevo</button>
      </footer>
      <section className="game">
        {
          board.map((square, index) => {
            return (
              <Square key={index}
                      index={index}
                      updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
      
      <WinnerModal winner={winner} resetGame={resetGame}/>
    </main>
  )
}

export default App
