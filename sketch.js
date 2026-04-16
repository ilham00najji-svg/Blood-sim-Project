let donorType = ""; 
let recipientType = "B+"; 
let bloodOptions = ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"];
let message = "Sélectionnez une fiole de sang pour commencer";
let explanation = "L'explication scientifique apparaîtra ici après le test.";
let selReceveur;
let ecgPoints = []; 
let particles = []; // الجزيئات العامة العائمة

function setup() {
  createCanvas(windowWidth, windowHeight);

  // إنشاء الجزيئات العائمة
  for (let i = 0; i < 25; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(5, 12),
      speed: random(0.2, 0.8)
    });
  }

  let label = createP('Choisir le Receveur :');
  label.position(width - 220, 90);
  label.style('font-family', 'sans-serif');
  label.style('font-weight', 'bold');

  selReceveur = createSelect();
  selReceveur.position(width - 220, 130);
  selReceveur.style('width', '120px');
  selReceveur.style('padding', '5px');
  
  bloodOptions.forEach(type => selReceveur.option(type));
  selReceveur.selected('B+');

  selReceveur.changed(() => {
    recipientType = selReceveur.value();
    message = "Receveur changé en : " + recipientType;
    explanation = "Nouvelle analyse en attente...";
    donorType = "";
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // 1. الخلفية مع الجزيئات العامة
  background(240, 245, 250);
  drawParticles();
  
  // 2. العنوان المحدث
  noStroke();
  fill(41, 128, 185); 
  rect(0, 0, width, 80);
  fill(255);
  textAlign(CENTER);
  textSize(26);
  textStyle(BOLD);
  text("STATION DE TRANSFUSION : ANALYSE PÉDAGOGIQUE", width/2, 40);
  textSize(14);
  textStyle(ITALIC);
  text("Réalisée par : Ilham Najji", width/2, 65);

  // 3. لوحة المتبرعين
  drawDonorPanel();

  // 4. منطقة المريض
  drawHospitalScene(width / 2 - 120, height / 2 + 20, donorType, recipientType);

  // 5. لوحة الشرح البيداغوجي
  drawExplanationPanel();

  // 6. شريط الحالة
  drawStatusBar();

  if (donorType !== "") {
    drawStylizedDrop(mouseX, mouseY, donorType);
  }
}

function drawParticles() {
  noStroke();
  fill(200, 220, 240, 150);
  for (let p of particles) {
    ellipse(p.x, p.y, p.size);
    p.y -= p.speed;
    if (p.y < -p.size) p.y = height + p.size;
  }
}

function drawDonorPanel() {
  fill(236, 240, 241, 230); 
  rect(20, 100, 180, 460, 15);
  fill(44, 62, 80);
  textSize(18);
  textStyle(BOLD);
  textAlign(CENTER);
  text("DONNEURS", 110, 130);
  stroke(189, 195, 199);
  line(50, 140, 170, 140);
  noStroke();

  for (let i = 0; i < bloodOptions.length; i++) {
    let yPos = 175 + i * 45;
    let isOver = mouseX > 4
