document.addEventListener('DOMContentLoaded', () => {
    let isGameOver = false;
    const container = document.querySelector('.game-container');
    const bird = container.querySelector('.bird');
    const sky = container.querySelector('.sky');
    const overlay = container.querySelector('.overlay');

    const startButton = container.querySelector('#btn-start');
    const retryButton = container.querySelector('#btn-retry');

    const initialBirdLeft = 100;
    const initialBirdBottom = sky.offsetHeight / 2;
    const birdPosition = {
        left: initialBirdLeft,
        bottom: initialBirdBottom,
    };

    const borders = {
        top: sky.offsetHeight,
        bottom: 0,
        left: 0,
        right: sky.offsetWidth - bird.offsetWidth,
    }

    const gravity = 2;
    const gap = 500;

    function updateBirdPosition() {
        // when bird touched ground
        if (birdPosition.bottom <= borders.bottom) {
            gameOver();
            return;
        }

        birdPosition.bottom -= gravity;
        bird.style.bottom = `${birdPosition.bottom}px`;
        bird.style.left = `${birdPosition.left}px`;
    }

    function handleKeyup(e) {
        switch (e.code) {
            case 'ArrowUp':
                jump();
                break;
            case 'ArrowDown':
                dive();
                break;
            default:
                break;
        }
    }

    function jump() {
        if (birdPosition.bottom + bird.offsetHeight > borders.top) return;
    
        birdPosition.bottom += 30;
        bird.style.bottom = `${birdPosition.bottom}px`;
    }

    function dive() {
        if (birdPosition.bottom <= borders.bottom + 20) return;
    
        birdPosition.bottom -= 20;
        bird.style.bottom = `${birdPosition.bottom}px`;
    }

    function generateObstacle() {
        const obstaclePosition = {
            left: sky.offsetWidth, // start from right side of screen
            bottom: Math.floor(Math.random() * 60),
        };

        const bottomObstacle = document.createElement('div');
        const topObstacle = document.createElement('div');

        if (!isGameOver) {
            bottomObstacle.classList.add('obstacle');
            topObstacle.classList.add('obstacle');
            topObstacle.classList.add('top');
        }

        sky.appendChild(bottomObstacle);
        sky.appendChild(topObstacle);

        bottomObstacle.style.left = `${obstaclePosition.left}px`;
        topObstacle.style.left = `${obstaclePosition.left}px`;
        bottomObstacle.style.height = `${bottomObstacle.offsetHeight + obstaclePosition.bottom}px`;
        bottomObstacle.style.bottom = `0px`;
        topObstacle.style.bottom = `${obstaclePosition.bottom + gap}px`;

        function moveObstacle() {
            obstaclePosition.left -= 2;
            bottomObstacle.style.left = `${obstaclePosition.left}px`;
            topObstacle.style.left = `${obstaclePosition.left}px`;

            if (obstaclePosition.left + bottomObstacle.offsetWidth <= borders.left) {
                clearInterval(moveLeft);
                sky.removeChild(bottomObstacle);
                sky.removeChild(topObstacle);
            }

            if (isGameOver) {
                clearInterval(moveLeft);
            }

            if(isBumped(obstaclePosition.left, bottomObstacle.offsetWidth, obstaclePosition.bottom + gap, bottomObstacle.offsetHeight)) {
                gameOver();
                clearInterval(moveLeft);
            }
        }

         // calculate bird's hitbox
        function isBumped(obstacleLeft, obstacleWidth, gapTop, gapBottom) {
            const hitRight = birdPosition.left + bird.offsetWidth >= obstacleLeft;
            const hitLeft = birdPosition.left < obstacleLeft + obstacleWidth;

            const hitTop = birdPosition.bottom + bird.offsetHeight >= gapTop;
            const hitBottom = birdPosition.bottom <= gapBottom;

            return (hitRight && hitLeft && hitTop) || (hitRight && hitLeft && hitBottom);
        }

        let moveLeft = setInterval(moveObstacle, 20);
        if (!isGameOver) setTimeout(generateObstacle, 2000);
    }

    function gameOver() {
        clearInterval(gameTimerId);
        isGameOver = true;
        document.removeEventListener('keyup', handleKeyup);

        document.querySelector('.game-over-wrap').classList.remove('hide');
        overlay.classList.remove('hide');
    }

    let gameTimerId = null;

    function startGame() {
        document.querySelector('.game-start-wrap').classList.add('hide');
        document.querySelectorAll('.obstacle').forEach(obstacle => obstacle.remove());

        birdPosition.left = initialBirdLeft;
        birdPosition.bottom = initialBirdBottom;

        overlay.classList.add('hide');
        gameTimerId = setInterval(updateBirdPosition, 20);
        document.addEventListener('keyup', handleKeyup);
        generateObstacle();
    }

    startButton.addEventListener('click', startGame);

    retryButton.addEventListener('click', () => {
        document.querySelector('.game-over-wrap').classList.add('hide');
        isGameOver = false;
        startGame();
    });
})