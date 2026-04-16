let donorType = ""; 
let recipientType = "B+"; 
let bloodOptions = ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"];
let message = "Sélectionnez une fiole de sang pour commencer";
let selReceveur;
let pulseX = 0; // لتحريك خط نبض القلب
let ecgPoints = []; // نقاط رسم النبض

function setup() {
  createCanvas(windowWidth, windowHeight);
  pulseX = width / 2 + 200; // مكان شاشة النبض

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
    donorType = "";
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(245);
  
  // 1. الهيدر الاحترافي
  noStroke();
  fill(41, 128, 185); 
  rect(0, 0, width, 80);
  fill(255);
  textAlign(CENTER);
  textSize(28);
  textStyle(BOLD);
  text("STATION DE TRANSFUSION VIRTUELLE", width/2, 40);
  textSize(16);
  textStyle(ITALIC);
  text("Expertise Pédagogique : Ilham Najji", width/2, 65);

  // 2. قائمة المتبرعين (Donneurs)
  drawDonorPanel();

  // 3. منطقة المريض وشاشة النبض
  drawHospitalScene(width / 2 - 50, height / 2 + 20, donorType, recipientType);

  // 4. شريط الحالة السفلي
  drawStatusBar();

  // 5. قطرة الدم المسحوبة
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
    text(bloodOptions[i], 110, yPos + 5);
    if (mouseIsPressed && isOver) {
      donorType = bloodOptions[i];
    }
  }
}

function drawHospitalScene(x, y, donor, recipient) {
  let isTouching = dist(mouseX, mouseY, x, y) < 100;
  let status = 0; // 0: انتظار، 1: نجاح، 2: خطر
  
  if (isTouching && donor !== "") {
    status = canDonate(donor, recipient) ? 1 : 2;
  }

  // رسم شاشة نبض القلب (ECG Monitor)
  drawECG(x + 220, y - 50, status);

  // رسم السرير
  fill(189, 195, 199);
  rect(x - 100, y + 60, 200, 15, 5);
  
  // جسم المريض
  let pColor = status === 2 ? color(192, 57, 43) : (status === 1 ? color(46, 204, 113) : color(243, 156, 18));
  fill(pColor);
  rect(x - 50, y - 20, 100, 80, 15);
  
  // الرأس والوجه
  let hColor = status === 2 ? color(150) : color(255, 224, 189);
  fill(hColor);
  ellipse(x, y - 60, 80, 80);
  
  drawFaceExpressions(x, y - 60, status);

  // نصوص توضيحية
  fill(44, 62, 80);
  textSize(20);
  text("PATIENT : " + recipient, x, y - 120);
  
  if (status === 1) message = "✅ COMPATIBLE : Le patient reçoit le sang avec succès.";
  else if (status === 2) message = "❌ AGGLUTINATION : Arrêt cardiaque détecté !";
  else message = "En attente de transfusion...";
}

function drawECG(x, y, status) {
  fill(0);
  stroke(46, 204, 113);
  strokeWeight(2);
  rect(x, y, 150, 100, 5);
  
  // رسم خط النبض
  noFill();
  beginShape();
  for (let i = 0; i < ecgPoints.length; i++) {
    vertex(x + i, y + 50 + ecgPoints[i]);
  }
  endShape();
  
  // منطق حركة النبض
  let nextPoint = 0;
  if (status === 2) {
    nextPoint = 0; // خط مستقيم (موت)
    stroke(255, 0, 0);
  } else {
    // حركة نبض طبيعية
    nextPoint = sin(frameCount * 0.2) * 10;
    if (frameCount % 30 < 5) nextPoint = -30; // القفزة الكبيرة في النبض
  }
  
  ecgPoints.push(nextPoint);
  if (ecgPoints.length > 150) ecgPoints.shift();
  noStroke();
}

function drawFaceExpressions(x, y, status) {
  stroke(0);
  strokeWeight(2);
  if (status === 1) { // سعيد
    ellipse(x - 15, y - 5, 8, 8);
    ellipse(x + 15, y - 5, 8, 8);
    arc(x, y + 15, 30, 15, 0, PI);
  } else if (status === 2) { // ميت
    line(x - 15, y - 10, x - 5, y); line(x - 15, y, x - 5, y - 10);
    line(x + 5, y - 10, x + 15, y); line(x + 5, y, x + 15, y - 10);
    arc(x, y + 20, 20, 10, PI, 0);
  } else { // انتظار
    line(x - 15, y - 5, x - 5, y - 5);
    line(x + 5, y - 5, x + 15, y - 5);
    line(x - 10, y + 15, x + 10, y + 15);
  }
  noStroke();
}

function drawStatusBar() {
  fill(52, 73, 94);
  rect(0, height - 40, width, 40);
  fill(255);
  textAlign(LEFT);
  textSize(14);
  text("  © 2026 | Simulation Educative par Ilham Najji", 20, height - 15);
  textAlign(CENTER);
  text(message, width/2, height - 15);
}

function drawStylizedDrop(x, y, label) {
  fill(192, 57, 43);
  ellipse(x, y, 40, 40);
  triangle(x - 20, y - 5, x + 20, y - 5, x, y - 35);
  fill(255);
  textSize(14);
  text(label, x, y + 5);
}

function canDonate(donor, recipient) {
  if (donor === recipient || donor === "O-") return true;
  if (recipient === "AB+") return true;
  if (donor === "O+" && recipient.includes("+")) return true;
  if (donor === "A-") if (recipient.includes("A") || recipient.includes("AB")) return true;
  if (donor === "A+" && (recipient === "A+" || recipient === "AB+")) return true;
  if (donor === "B-") if (recipient.includes("B") || recipient.includes("AB")) return true;
  if (donor === "B+" && (recipient === "B+" || recipient === "AB+")) return true;
  if (donor === "AB-") if (recipient === "AB+" || recipient === "AB-") return true;
  return false;
}
