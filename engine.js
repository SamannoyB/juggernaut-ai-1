const chess = require("chess.js");
const game = new chess.Chess('6k1/5ppp/8/8/8/8/6P1/4Q1K1 w - - 0 1');

// using chess.js to make things simpler :)

function evaluateBoard(fen) { // thanks to chatgpt-3.5 for helping me out with the position evaluation!
      let evaluation = 0; // initial evaluation

      const pieceValues = {
          'p': -1, 'r': -5, 'n': -3, 'b': -3, 'q': -9, 'k': 0,
          'P': 1, 'R': 5, 'N': 3, 'B': 3, 'Q': 9, 'K': 0
      }    // using respective piece values (<100)

      const boardState = fen.split(' ')[0];

      console.log("Board State:", boardState);
      
      for (let square of boardState) {
          if (pieceValues.hasOwnProperty(square)) {
                    evaluation += pieceValues[square];     // adding up the piece values according to the fen to calculate the material evaluation of this position                                 
          }
      } 

      console.log(evaluation)
} 
/* I am working on a deeper evaluation function with piece-square tables to evaluate the position
   Since position evaluation is dependent on something more than just Material Counting
*/

evaluateBoard('rnb1kbnr/ppp1pppp/8/8/2pN4/8/PP2PPPP/RNBQKB1R b KQkq - 0 4');

/* Using Negamax Algorithm
   No Alpha-Beta Pruning
   -negamax(params) determines the current state of the position -- maximising or minimizing
   adjust your depth nodes to get more search trees, however, your search time would be significantly increased
*/

function negamax(depth, color) { // thanks to chessprogramming.wiki and chatgpt-4 for helping me out with this algorithm
    if (game.isGameOver() || depth === 0) { 
        return 0;
    }

    let maxEval = Number.NEGATIVE_INFINITY; // setting the maximum evaluation to negative infinity

    let samples = game.moves({ verbose: true });
    let moves = samples.map(sample => sample.lan); // getting each move in the UCI format with the lan child

    for (let move of moves) { // iterating through each lan move
        game.move(move);     // making the move on the board
        let eval = -negamax(depth - 1, -color);     /* calling the negamax function with a negative and pushing a -color param to automatically revert values
                                                       like if it is white's turn, -negamax(depth -1, -1) since -1 is the opposite of initially given param 1
                                                       for black, its just the reverse. */
        game.undo();         // returning to the initial position on the board

        maxEval = Math.max(maxEval, eval);   // finding the maximum evaluation
    }

    return maxEval;
}

function makeBestMove(depth) { // making the best move
    let bestMove = null;
    let maxEval = Number.NEGATIVE_INFINITY;

    let samples = game.moves({ verbose: true });
    let moves = samples.map(sample => sample.lan);

    for (let move of moves) {
        game.move(move);
        let eval = -negamax(depth - 1, -1);   // calling negamax
        game.undo();

        if (eval > maxEval) {
            maxEval = eval;
            bestMove = move;
        }
    }

    return bestMove;
}

const bestMove = makeBestMove(2); // evaluating the best move at depth 2
console.log(bestMove) //your best Move
