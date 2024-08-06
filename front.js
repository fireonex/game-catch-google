import {Game} from "./game.js";
import {EventEmitter} from "./eventEmitter.js";

// Создаем экземпляр EventEmitter
const eventEmitter = new EventEmitter();

// Создаем экземпляр Game, передавая в него eventEmitter
const game = new Game(eventEmitter);

// Устанавливаем настройки для игры
game.settings = {
    gridSize: {
        rows: 5,
        columns: 5
    },
    googleJumpInterval: 3000, //ms
    pointsToWin: 10
};

// Находим элемент таблицы по ID
const tableElement = document.getElementById('grid');
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');

// Запускаем игру
game.start();

window.addEventListener('keydown', (e) => {
    console.log(e)
    switch (e.key) {
        case 'ArrowUp':
            game.movePlayer2Up();
            break;
        case 'ArrowDown':
            game.movePlayer2Down();
            break;
        case 'ArrowLeft':
            game.movePlayer2Left();
            break;
        case 'ArrowRight':
            game.movePlayer2Right();
            break;
        case 'w':
            game.movePlayer1Up();
            break;
        case 's':
            game.movePlayer1Down();
            break;
        case 'a':
            game.movePlayer1Left();
            break;
        case 'd':
            game.movePlayer1Right();
            break;
    }
})

// Функция для рендеринга таблицы
const render = () => {
    // Очищаем содержимое таблицы
    tableElement.innerHTML = '';
    score1.innerHTML = '';
    score2.innerHTML = '';

    score1.append(game.score[1].points)
    score2.append(game.score[2].points)


    // Создаем строки и ячейки таблицы
    for (let y = 1; y <= game.settings.gridSize.rows; y++) {
        const trElement = document.createElement('tr');
        tableElement.append(trElement);

        for (let x = 1; x <= game.settings.gridSize.columns; x++) {
            const tdElement = document.createElement('td');
            trElement.append(tdElement);

            // Проверяем позиции объектов и добавляем изображения
            if (game.google.position.x === x && game.google.position.y === y) {
                const imgElement = document.createElement('img');
                imgElement.src = './assets/google.png';
                imgElement.alt = 'google image';
                tdElement.append(imgElement);
            }

            if (game.player1.position.x === x && game.player1.position.y === y) {
                const imgElement = document.createElement('img');
                imgElement.src = './assets/first.png';
                imgElement.alt = 'player1 image';
                tdElement.append(imgElement);
            }

            if (game.player2.position.x === x && game.player2.position.y === y) {
                const imgElement = document.createElement('img');
                imgElement.src = './assets/second.png';
                imgElement.alt = 'player2 image';
                tdElement.append(imgElement);
            }
        }
    }
};

// Выполняем рендеринг таблицы
render();

// Подписываемся на событие 'changePosition'
eventEmitter.subscribe('changePosition', render);

// Добавление логов для проверки позиций игроков и google
console.log('Initial positions:');
console.log('Player1 position:', game.player1.position);
console.log('Player2 position:', game.player2.position);
console.log('Google position:', game.google.position);
