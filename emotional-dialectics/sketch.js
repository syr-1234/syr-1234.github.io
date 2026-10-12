/* ===============================
   Emotional Dialectics
   Dashboard vs Landscape
   =============================== */

// -------------------------------
// Simulated Emotional Dataset
// -------------------------------
let emotionalData = [
    { time: "Morning", happy: 75, calm: 80, anxious: 15, energetic: 70 },
    { time: "Afternoon", happy: 65, calm: 60, anxious: 35, energetic: 85 },
    { time: "Evening", happy: 85, calm: 90, anxious: 10, energetic: 40 },
    { time: "Night", happy: 40, calm: 95, anxious: 45, energetic: 20 }
];

let emotionTypes = ['happy', 'calm', 'anxious', 'energetic'];

let emotionColors = {
    happy: [255, 193, 7],      // Yellow — Happiness
    calm: [76, 175, 80],       // Green — Calm
    anxious: [156, 39, 176],   // Purple — Anxiety
    energetic: [33, 150, 243]  // Blue — Energy
};

// -------------------------------
// Global State
// -------------------------------
let currentMode = 'dashboard';
let modeToggleButton;
let modeDescriptionText;
let particles = [];

// -------------------------------
// Particle Class (Landscape Mode)
// -------------------------------
class Particle {
    constructor(dataPoint, emotionType) {
        this.data = dataPoint;
        this.emotion = emotionType;
        this.value = dataPoint[emotionType];

        this.color = emotionColors[emotionType];
        this.size = map(this.value, 0, 100, 3, 15);

        this.pos = createVector(
            random(width * 0.15, width * 0.85),
            random(height * 0.15, height * 0.85)
        );

        let baseSpeed = map(this.data.calm, 0, 100, 0.3, 0.05);
        this.vel = p5.Vector.random2D().mult(baseSpeed);

        this.anxietyFactor = map(this.data.anxious, 0, 100, 0.01, 0.08);
        this.noiseOffsetX = random(1000);
        this.noiseOffsetY = random(2000);
    }

    update() {
        let angleX = noise(this.noiseOffsetX) * TWO_PI * 2;
        let angleY = noise(this.noiseOffsetY) * TWO_PI * 2;

        let force = createVector(
            cos(angleX),
            sin(angleY)
        ).mult(this.anxietyFactor);

        // 👇 User participation without control
        let interactionFactor = map(mouseX, 0, width, 0.6, 1.4);
        this.vel.add(force.mult(interactionFactor));

        this.vel.limit(map(this.data.calm, 0, 100, 1.2, 0.4));
        this.pos.add(this.vel);

        this.noiseOffsetX += 0.01;
        this.noiseOffsetY += 0.01;

        this.handleBoundaries();
    }

    handleBoundaries() {
        let buffer = this.size;
        if (this.pos.x < buffer || this.pos.x > width - buffer) this.vel.x *= -1;
        if (this.pos.y < buffer || this.pos.y > height - buffer) this.vel.y *= -1;
        this.pos.x = constrain(this.pos.x, buffer, width - buffer);
        this.pos.y = constrain(this.pos.y, buffer, height - buffer);
    }

    display() {
        noStroke();
        let alpha = map(this.value, 0, 100, 120, 255);
        fill(this.color[0], this.color[1], this.color[2], alpha);

        circle(this.pos.x, this.pos.y, this.size);
    }

    connect(other) {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (d < 120) {
            let alpha = map(d, 0, 120, 120, 10);
            stroke(this.color[0], this.color[1], this.color[2], alpha);
            strokeWeight(0.6);
            line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        }
    }
}

// -------------------------------
// p5 Setup
// -------------------------------
function setup() {
    let canvas = createCanvas(900, 450);
    canvas.parent('sketch-holder');

    modeToggleButton = select('#modeToggle');
    modeDescriptionText = select('#modeDescription');
    modeToggleButton.mousePressed(toggleMode);

    initializeParticles();
    updateModeText();
}

// -------------------------------
// p5 Draw Loop
// -------------------------------
function draw() {
    if (currentMode === 'dashboard') {
        drawDashboard();
    } else {
        drawLandscape();
    }
}

// -------------------------------
// Mode Toggle
// -------------------------------
function toggleMode() {
    currentMode = currentMode === 'dashboard' ? 'landscape' : 'dashboard';
    updateModeText();
}

function updateModeText() {
    if (currentMode === 'dashboard') {
        modeToggleButton.html('Switch to Landscape View');
        modeDescriptionText.html(
            'Current Mode: <strong>Dashboard</strong> — Quantified, standardized emotional data.'
        );
    } else {
        modeToggleButton.html('Switch to Dashboard View');
        modeDescriptionText.html(
            'Current Mode: <strong>Landscape</strong> — Experiential, generative interpretation.'
        );
    }
}

// -------------------------------
// Particle Initialization
// -------------------------------
function initializeParticles() {
    particles = [];
    for (let d of emotionalData) {
        for (let emotion of emotionTypes) {
            let count = floor(map(d[emotion], 0, 100, 4, 16));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(d, emotion));
            }
        }
    }
}

// -------------------------------
// Dashboard Mode
// -------------------------------
function drawDashboard() {
    background(255);

    fill(40);
    textSize(20);
    textAlign(LEFT);
    text("Emotional Data Dashboard — Quantified Analysis", 30, 35);

    let chartX = 80;
    let chartY = 90;
    let chartWidth = width - 300;
    let chartHeight = height - 160;

    stroke(220);
    for (let i = 0; i <= 5; i++) {
        let y = chartY + chartHeight - (i / 5) * chartHeight;
        line(chartX, y, chartX + chartWidth, y);
        noStroke();
        fill(120);
        textSize(12);
        textAlign(RIGHT);
        text(i * 20 + "%", chartX - 10, y + 4);
        stroke(220);
    }

    let barGroupWidth = chartWidth / emotionalData.length;

    for (let i = 0; i < emotionalData.length; i++) {
        let d = emotionalData[i];
        let x = chartX + i * barGroupWidth;

        fill(80);
        noStroke();
        textAlign(CENTER);
        text(d.time, x + barGroupWidth / 2, chartY + chartHeight + 25);

        for (let j = 0; j < emotionTypes.length; j++) {
            let emotion = emotionTypes[j];
            let value = d[emotion];
            let barWidth = (barGroupWidth - 40) / emotionTypes.length;
            let barHeight = map(value, 0, 100, 0, chartHeight);

            fill(...emotionColors[emotion]);
            rect(
                x + j * barWidth + 20,
                chartY + chartHeight - barHeight,
                barWidth - 6,
                barHeight,
                4
            );
        }
    }

    // Emotion Legend (explicit semantics)
    let legendX = chartX + chartWidth + 30;
    let legendY = chartY;

    fill(60);
    textSize(14);
    text("Emotion Categories", legendX, legendY - 10);

    emotionTypes.forEach((emotion, i) => {
        fill(...emotionColors[emotion]);
        rect(legendX, legendY + i * 28, 16, 16, 4);

        fill(80);
        textSize(13);
        text(
            emotion.charAt(0).toUpperCase() + emotion.slice(1),
            legendX + 24,
            legendY + i * 28 + 13
        );
    });
}

// -------------------------------
// Landscape Mode
// -------------------------------
function drawLandscape() {
    background(15, 20, 30);

    fill(220);
    textSize(13);
    noStroke();
    textAlign(LEFT);
    text(
        "Move cursor to subtly influence the emotional landscape",
        15,
        25
    );

    for (let p of particles) {
        p.update();
        p.display();
    }

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < i + 25 && j < particles.length; j++) {
            particles[i].connect(particles[j]);
        }
    }
}
