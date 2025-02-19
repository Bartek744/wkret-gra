const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const infoDiv = document.getElementById("info");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const screwWidth = 20;
const screwHeight = 60;
let screwX = canvas.width / 2 - screwWidth / 2;
let screwY = canvas.height / 2 - screwHeight / 2;
let screwAngle = 0;
const targetAngle = 0;
const sensitivity = 0.5;
let score = 0;
let gameRunning = true;
let deviceOrientationSupported = false;

function drawScrew() {
    ctx.save();
    ctx.translate(screwX + screwWidth / 2, screwY + screwHeight / 2);
    ctx.rotate(screwAngle * Math.PI / 180);
    ctx.fillStyle = "gray";
    ctx.fillRect(-screwWidth / 2, -screwHeight / 2, screwWidth, screwHeight);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    for (let i = -screwHeight / 2 + 10; i < screwHeight / 2; i += 10) {
        ctx.beginPath();
        ctx.moveTo(-screwWidth / 2, i);
        ctx.lineTo(screwWidth / 2, i);
        ctx.stroke();
    }
    ctx.restore();
}

function drawSpine() {
    ctx.fillStyle = "#a77878"; // Bardziej cielisty kolor
    ctx.fillRect(canvas.width / 2 - 40, canvas.height / 2 - 100, 80, 200);
    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width / 2 - 10, canvas.height / 2 - 5, 20, 10);
}


function handleOrientation(event) {
    if (!gameRunning) return;

    let tiltLR = event.gamma;
    screwAngle = tiltLR * sensitivity;
    screwAngle = Math.max(-90, Math.min(90, screwAngle));

    if (Math.abs(screwAngle - targetAngle) < 5) {
        score++;
        screwY += 0.5;
        if (screwY > canvas.height / 2 + 50) {
            gameRunning = false;
            infoDiv.innerText = "Śruba wkręcona! Wynik: " + score;
        }
    } else {
        if (score > 0) score--;
    }

    infoDiv.innerText = "Wynik: " + score + " Kąt: " + screwAngle.toFixed(2);
}

function gameLoop() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpine();
    drawScrew();
    requestAnimationFrame(gameLoop);
}

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function(event) {
        if (event.gamma !== null) {
            deviceOrientationSupported = true;
            handleOrientation(event);
        } else {
          infoDiv.innerText = "Twoje urządzenie nie wspiera sterowania ruchem.";
            gameRunning = false;
        }
    });
} else {
  infoDiv.innerText = "Twoje urządzenie nie wspiera sterowania ruchem.";
    gameRunning = false;

}


// Service Worker registration (dla PWA)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
            console.log('Service Worker zarejestrowany:', registration);
        })
        .catch((error) => {
            console.error('Błąd rejestracji Service Workera:', error);
        });
}


gameLoop();
