document.addEventListener('DOMContentLoaded', () => {
            const cells = document.querySelectorAll('.cell');
            const statusText = document.querySelector('.status');
            const resetButton = document.querySelector('.reset-button');
            const modeToggleButton = document.getElementById('mode-toggle-button');
            const modalOverlay = document.getElementById('result-modal');
            const modalMessage = document.getElementById('modal-message');
            const modalCloseButton = document.getElementById('modal-close-button');

            let board = ['', '', '', '', '', '', '', '', ''];
            let currentPlayer = 'X';
            let gameActive = true;
            let isVsComputer = false;

            const winConditions = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ];

            const showModal = (message) => {
                modalMessage.textContent = message;
                modalOverlay.classList.add('active');
            };

            const hideModal = () => {
                modalOverlay.classList.remove('active');
            };

            const handleResultValidation = () => {
                let roundWon = false;
                for (let i = 0; i < winConditions.length; i++) {
                    const winCondition = winConditions[i];
                    const a = board[winCondition[0]];
                    const b = board[winCondition[1]];
                    const c = board[winCondition[2]];
                    if (a === '' || b === '' || c === '') {
                        continue;
                    }
                    if (a === b && b === c) {
                        roundWon = true;
                        winCondition.forEach(index => {
                            cells[index].classList.add('win');
                        });
                        break;
                    }
                }

                if (roundWon) {
                    showModal(`Player ${currentPlayer} has won!`);
                    gameActive = false;
                    return;
                }

                const roundDraw = !board.includes('');
                if (roundDraw) {
                    showModal('It\'s a Draw!');
                    gameActive = false;
                    return;
                }

                // Switch player
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                statusText.textContent = `Player ${currentPlayer}'s turn`;
                statusText.style.color = 'var(--text-color)';

                if (isVsComputer && currentPlayer === 'O') {
                    // Computer's turn
                    setTimeout(computerMove, 500);
                }
            };

            const handleCellClick = (e) => {
                const clickedCell = e.target;
                const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

                if (board[clickedCellIndex] !== '' || !gameActive || (isVsComputer && currentPlayer === 'O')) {
                    return;
                }

                board[clickedCellIndex] = currentPlayer;
                clickedCell.textContent = currentPlayer;
                clickedCell.classList.add(currentPlayer.toLowerCase());
                
                handleResultValidation();
            };

            const computerMove = () => {
                // Get available cells
                const availableCells = [];
                for (let i = 0; i < board.length; i++) {
                    if (board[i] === '') {
                        availableCells.push(i);
                    }
                }

                // Simple AI logic
                let moveIndex;

                // 1. Check for winning move
                for (let i = 0; i < winConditions.length; i++) {
                    const [a, b, c] = winConditions[i];
                    if (board[a] === 'O' && board[b] === 'O' && board[c] === '') { moveIndex = c; break; }
                    if (board[a] === 'O' && board[c] === 'O' && board[b] === '') { moveIndex = b; break; }
                    if (board[b] === 'O' && board[c] === 'O' && board[a] === '') { moveIndex = a; break; }
                }

                // 2. Block player's winning move
                if (moveIndex === undefined) {
                    for (let i = 0; i < winConditions.length; i++) {
                        const [a, b, c] = winConditions[i];
                        if (board[a] === 'X' && board[b] === 'X' && board[c] === '') { moveIndex = c; break; }
                        if (board[a] === 'X' && board[c] === 'X' && board[b] === '') { moveIndex = b; break; }
                        if (board[b] === 'X' && board[c] === 'X' && board[a] === '') { moveIndex = a; break; }
                    }
                }

                // 3. Take center
                if (moveIndex === undefined && board[4] === '') {
                    moveIndex = 4;
                }

                // 4. Take a corner
                if (moveIndex === undefined) {
                    const corners = [0, 2, 6, 8];
                    for (let corner of corners) {
                        if (board[corner] === '') {
                            moveIndex = corner;
                            break;
                        }
                    }
                }

                // 5. Take any random spot
                if (moveIndex === undefined) {
                    const randomIndex = Math.floor(Math.random() * availableCells.length);
                    moveIndex = availableCells[randomIndex];
                }

                // Make the move
                if (moveIndex !== undefined) {
                    board[moveIndex] = currentPlayer;
                    cells[moveIndex].textContent = currentPlayer;
                    cells[moveIndex].classList.add(currentPlayer.toLowerCase());
                    handleResultValidation();
                }
            };

            const handleResetGame = () => {
                gameActive = true;
                currentPlayer = 'X';
                board = ['', '', '', '', '', '', '', '', ''];
                statusText.textContent = isVsComputer ? 'Player X vs. Computer' : 'Player X vs. Player O';
                statusText.style.color = 'red';
                cells.forEach(cell => {
                    cell.textContent = '';
                    cell.classList.remove('x', 'o', 'win');
                });
                hideModal();
            };

            const toggleMode = () => {
                isVsComputer = !isVsComputer;
                modeToggleButton.textContent = isVsComputer ? 'Playing vs. Computer' : 'Playing vs. Player';
                handleResetGame();
            };

            // Event listeners
            cells.forEach(cell => {
                cell.addEventListener('click', handleCellClick);
            });
            resetButton.addEventListener('click', handleResetGame);
            modeToggleButton.addEventListener('click', toggleMode);
            modalCloseButton.addEventListener('click', handleResetGame);
        });
