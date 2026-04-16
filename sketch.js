let donorType = ""; 
let recipientType = "B+"; 
let bloodOptions = ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"];
let message = "Sélectionnez une fiole de sang pour commencer";
let explanation = "L'explication scientifique apparaîtra ici après le test.";
let selReceveur;
let ecgPoints = []; 

function setup() {
  createCanvas(windowWidth, windowHeight);

  // قائمة اختيار المستقبل
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
  background(245);
  
  // 1. العنوان
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
  text("Conception Scientifique : Ilham Najji", width/2, 65);

  // 2. لوحة المتبرعين
  drawDonorPanel();

  // 3. منطقة المريض والتحليل
  drawHospitalScene(width / 2 - 100, height / 2 + 20, donorType, recipientType);

  // 4. لوحة الشرح البيداغوجي (Pedagogical Panel)
  drawExplanationPanel();

  // 5. شريط الحالة
  drawStatusBar();

  if (donorType !== "") {
    drawStylizedDrop(mouseX, mouseY, donorType);
  }
}

function drawDonorPanel() {
  fill(236, 240, 241);
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
    let isOver = mouseX > 40 && mouseX < 180 && mouseY > yPos-20 && mouseY < yPos+20;
    fill(donorType === bloodOptions[i] ? color(192, 57, 43) : 255);
    rect(40, yPos - 20, 140, 35, 10);
    fill(donorType === bloodOptions[i] ? 255 : 50);
    textStyle(BOLD);
    text(bloodOptions[i], 110, yPos + 5);
    if (mouseIsPressed && isOver) donorType = bloodOptions[i];
  }
}

function drawHospitalScene(x, y, donor, recipient) {
  let isTouching = dist(mouseX, mouseY, x, y) < 100;
  let status = 0; 
  
  if (isTouching && donor !== "") {
    if (canDonate(donor, recipient)) {
      status = 1;
      message = "✅ TRANSFUSION RÉUSSIE";
      getScientificExplanation(donor, recipient, true);
    } else {
      status = 2;
      message = "❌ ERREUR DE TRANSFUSION";
      getScientificExplanation(donor, recipient, false);
    }
  }

  // شاشة ECG
  drawECG(x + 180, y - 50, status);

  // السرير والمريض
  fill(189, 195, 199);
  rect(x - 100, y + 60, 200, 15, 5);
  
  let pColor = status === 2 ? color(192, 57, 43) : (status === 1 ? color(46, 204, 113) : color(243, 156, 18));
  fill(pColor);
  rect(x - 50, y - 20, 100, 80, 15);
  fill(status === 2 ? 150 : color(255, 224, 189));
  ellipse(x, y - 60, 80, 80);
  
  drawFaceExpressions(x, y - 60, status);

  fill(44, 62, 80);
  textSize(18);
  text("PATIENT : " + recipient, x, y - 115);
}

function drawExplanationPanel() {
  let panelX = width - 350;
  let panelY = height / 2;
  
  fill(255);
  stroke(41, 128, 185);
  strokeWeight(2);
  rect(panelX, panelY, 320, 180, 10);
  
  noStroke();
  fill(41, 128, 185);
  rect(panelX, panelY, 320, 40, 10, 10, 0, 0);
  
  fill(255);
  textAlign(CENTER);
  textSize(16);
  textStyle(BOLD);
  text("ANALYSE SCIENTIFIQUE", panelX + 160, panelY + 25);
  
  fill(50);
  textSize(14);
  textStyle(NORMAL);
  textAlign(LEFT);
  textWrap(WORD);
  text(explanation, panelX + 20, panelY + 60, 280);
}

function getScientificExplanation(donor, recipient, success) {
  if (success) {
    if (donor === "O-") explanation = "O- est le donneur universel. Ses globules rouges ne possèdent aucun antigène (A, B, ou Rh), donc le système immunitaire ne les attaque pas.";
    else if (donor === recipient) explanation = "Le sang est identique. Le receveur accepte parfaitement ses propres types d'antigènes.";
    else if (recipient === "AB+") explanation = "AB+ est le receveur universel. Il possède déjà tous τα antigènes, donc son corps ne produit pas d'anticorps contre le sang injecté.";
    else explanation = "Le transfert est possible car le donneur ne possède pas d'antigènes étrangers que le receveur pourrait rejeter.";
  } else {
    explanation = "DANGER ! Le receveur possède des anticorps qui attaquent les antigènes étrangers du donneur (" + donor + "). Cela provoque une agglutination mortelle.";
  }
}

function drawECG(x, y, status) {
  fill(0);
  stroke(status === 2 ? color(255, 0, 0) : color(46, 204, 113));
  strokeWeight(2);
  rect(x, y, 160, 100, 5);
  
  noFill();
  beginShape();
  for (let i = 0; i < ecgPoints.length; i++) {
    vertex(x + i, y + 50 + ecgPoints[i]);
  }
  endShape();
  
  let nextPoint = (status === 2) ? 0 : sin(frameCount * 0.2) * 10;
  if (status !== 2 && frameCount % 30 < 5) nextPoint = -30;
  
  ecgPoints.push(nextPoint);
  if (ecgPoints.length > 160) ecgPoints.shift();
  noStroke();
}

function drawFaceExpressions(x, y, status) {
  stroke(0);
  strokeWeight(2);
  noFill();
  if (status === 1) { // Joyeux
    ellipse(x - 15, y - 5, 8, 8); ellipse(x + 15, y - 5, 8, 8);
    arc(x, y + 15, 30, 15, 0, PI);
  } else if (status === 2) { // Décédé
    line(x - 15, y - 10, x - 5, y); line(x - 15, y, x - 5, y - 10);
    line(x + 5, y - 10, x + 15, y); line(x + 5, y, x + 15, y - 10);
    arc(x, y + 20, 20, 10, PI, 0);
  } else { // Neutre
    line(x-15, y-5, x-5, y-5); line(x+5, y-5, x+15, y-5);
    line(x-10, y+15, x+10, y+15);
  }
  noStroke();
}

function drawStatusBar() {
  fill(52, 73, 94);
  rect(0, height - 40, width, 40);
  fill(255);
  textAlign(LEFT);
  textSize(13);
  text("  Expertise Master : Ilham Najji | Simulateur Didactique v3.0", 20, height - 15);
  textAlign(CENTER);
  text(message, width/2, height - 15);
}

function drawStylizedDrop(x, y, label) {
  fill(192, 57, 43);
  ellipse(x, y, 40, 40);
  triangle(x - 20, y - 5, x + 20, y - 5, x, y - 35);
  fill(255);
  textAlign(CENTER);
  textStyle(BOLD);
  text(label, x, y + 5);
}

function canDonate(donor, recipient) {
  if (donor === recipient || donor === "O-") return true;
  if (recipient === "AB+") return true;
  if (donor === "O+" && recipient.includes("+")) return true;
  if (donor === "A-") if (recipient.includes("A") || recipient.includes("AB")) return true;
  if (donor === "A+") if (recipient === "A+" || recipient === "AB+") return true;
  if (donor === "B-") if (recipient.includes("B") || recipient.includes("AB")) return true;
  if (donor === "B+") if (recipient === "B+" || recipient === "AB+") return true;
  if (donor === "AB-") if (recipient === "AB+" || recipient === "AB-") return true;
  return false;
}
