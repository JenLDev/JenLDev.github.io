// public/client.js
const socket = io();
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 5;

let player;

socket.on('player', (data) => {
  player = data;
});

socket.on('state', (players) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const id in players) {
    const p = players[id];
    if (p.movement) {
      ctx.fillStyle = p.id === 1 ? 'white' : 'red';
      ctx.fillRect(p.movement.x, p.movement.y, paddleWidth, paddleHeight);
    }
  }

  if (players.ball) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(players.ball.x, players.ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fill();
  }
});

document.addEventListener('mousemove', (event) => {
  if (player) {
    const y = event.clientY - canvas.offsetTop - paddleHeight / 2;
    socket.emit('movement', { x: player.id === 1 ? 0 : canvas.width - paddleWidth, y: Math.max(Math.min(y, canvas.height - paddleHeight), 0) });
  }
});

function startGame() {
  if (player && player.id === 1) {
    socket.emit('start');
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    startGame();
  }
});
