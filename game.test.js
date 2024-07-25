import {Game} from "./game";

describe("Game Tests", () => {
    let game;
    beforeEach(() => {
        game = new Game()
    })
    afterEach(() => {
        game.stop()
    })

    it('should return gridSize', () => {
        const game = new Game();

        game.settings = {
            gridSize: {
                columns: 10,
                rows: 10,
            }
        }


        //const settings = game.settings

        expect(game.settings.gridSize.rows).toBe(10)
        expect(game.settings.gridSize.columns).toBe(10)
    });

    it('should change status', () => {
        const game = new Game();

        game.settings = {
            gridSize: {
                columns: 10,
                rows: 10,
            }
        }

        expect(game.status).toBe('pending')
        game.start()
        expect(game.status).toBe('in-process')
    });

    it('should units have unique position', () => {
        for (let i = 0; i < 10; i++) {
            const game = new Game();

            game.settings = {
                gridSize: {
                    columns: 4,
                    rows: 3,
                }
            }

            game.start()

            expect([1, 2, 3, 4]).toContain(game.player1.position.x)
            expect([1, 2, 3]).toContain(game.player1.position.y)

            expect([1, 2, 3, 4]).toContain(game.player2.position.x)
            expect([1, 2, 3]).toContain(game.player2.position.y)

            expect(
                (game.player1.position.x !== game.player2.position.x ||
                    game.player1.position.y !== game.player2.position.y) &&
                (game.player1.position.x !== game.google.position.x ||
                    game.player1.position.y !== game.google.position.y) &&
                (game.player2.position.x !== game.google.position.x ||
                    game.player2.position.y !== game.google.position.y)
            ).toBe(true);
            game.stop()
        }

    });

    it('should google change position', async () => {
        for (let i = 0; i < 10; i++) {
            game = new Game()
            game.settings = {
                gridSize: {
                    columns: 4,
                    rows: 1,
                },
                googleJumpInterval: 100,
            }
            game.start()

            //google position
            const prevPosition = game.google.position.copy(); //создали копию позиции гугла
            //waiting
            await sleep(150)
            //compare positions
            expect(prevPosition.equal(game.google.position)).toBe(false)
            game.stop()
        }
    });

    it('should google be caught by player1 or player2 for one row', async () => {
        for (let i = 0; i < 10; i++) {
            game = new Game()        // setter
            game.settings = {
                gridSize: {
                    columns: 3, rows: 1,
                },
            }
            game.start()
            // p1 p2 g | p1 g p2 | p2 p1 g | p2 g p1 | g p1 p2 | g p2 p1        const diffForPlayer1 = game.google.position.x - game.player1.position.x
            const prevGooglePosition = game.google.position.copy()
            if (Math.abs(diffForPlayer1) === 2) {
                const diffForPlayer2 = game.google.position.x - game.player2.position.x
                if (diffForPlayer2 > 0) {
                    game.movePlayer2Right()
                } else {
                    game.movePlayer2Left()
                }
                expect(game.score[1].points).toBe(0)
                expect(game.score[2].points).toBe(1)
            } else {
                if (diffForPlayer1 > 0) {
                    game.movePlayer1Right()
                } else {
                    game.movePlayer1Left()
                }
                expect(game.score[1].points).toBe(1)
                expect(game.score[2].points).toBe(0)
            }
            expect(game.google.position.equal(prevGooglePosition)).toBe(false)
            game.stop();
        }
    })
    it('should google be caught by player1 or player2 for one column', async () => {
        for (let i = 0; i < 10; i++) {
            game = new Game()        // setter
            game.settings = {
                gridSize: {
                    columns: 1, rows: 3,
                },
            }
            game.start()
            // p1   p1   p2   p2    g    g        // p2   g    p1    g   p1   p2
            //  g   p2    g   p1   p2   p1        const diffForPlayer1 = game.google.position.y - game.player1.position.y
            const prevGooglePosition = game.google.position.copy()
            if (Math.abs(diffForPlayer1) === 2) {
                const diffForPlayer2 = game.google.position.y - game.player2.position.y
                if (diffForPlayer2 > 0) {
                    game.movePlayer2Down()
                } else {
                    game.movePlayer2Up()
                }
                expect(game.score[1].points).toBe(0)
                expect(game.score[2].points).toBe(1)
            } else {
                if (diffForPlayer1 > 0) {
                    game.movePlayer1Down()
                } else {
                    game.movePlayer1Up()
                }
                expect(game.score[1].points).toBe(1)
                expect(game.score[2].points).toBe(0)
            }
            expect(game.google.position.equal(prevGooglePosition)).toBe(false)
            game.stop();
        }
    })

    it("first or second player wins", () => {
        game = new Game();
        // setter
        game.settings = {
            pointsToWin: 3,
            gridSize: { columns: 3, rows: 1 }
        };
        game.start();

        // p1 p2 g | p1 g p2 | p2 p1 g | p2 g p1 | g p1 p2 | g p2 p1
        const diffForPlayer1 = game.google.position.x - game.player1.position.x;
        if (Math.abs(diffForPlayer1) === 2) {
            const diffForPlayer2 = game.google.position.x - game.player2.position.x;
            if (diffForPlayer2 > 0) {
                game.movePlayer2Right();
                game.movePlayer2Left();
                game.movePlayer2Right();
            } else {
                game.movePlayer2Left();
                game.movePlayer2Right();
                game.movePlayer2Left();
            }
            expect(game.status).toBe("finished");
            expect(game.score[1].points).toBe(0);
            expect(game.score[2].points).toBe(3);
        } else {
            if (diffForPlayer1 > 0) {
                game.movePlayer1Right();
                game.movePlayer1Left();
                game.movePlayer1Right();
            } else {
                game.movePlayer1Left();
                game.movePlayer1Right();
                game.movePlayer1Left();
            }

            expect(game.status).toBe("finished");
            expect(game.score[1].points).toBe(3);
            expect(game.score[2].points).toBe(0);
        }
    });


    const sleep = (delay) => {
        return new Promise(resolve => setTimeout(resolve, delay))
    }
})