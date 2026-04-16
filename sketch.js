let donorType = ""; 
let recipientType = "B+"; 
let bloodOptions = ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"];
let message = "Sélectionnez une fiole de sang pour commencer";
let explanation = "L'explication scientifique apparaîtra ici après le test.";
let selReceveur;
let ecgPoints = []; 
let backgroundElements = []; // لتخزين عناصر الخلفية

function setup() {
  createCanvas(windowWidth, windowHeight);

  // إنشاء عناصر الخلفية مرة واحدة لتحسين الأداء
  createBackgroundElements();

  // قائمة اختيار المستقبل
  let label = createP('Choisir le Receveur :');
  label.position(width - 220, 90);
  label.style('font-family', 'sans-serif');
  label.style('font-weight', 'bold');

  selReceveur = createSelect();
  selReceveur.position(width - 220, 130);
  selReceveur.style('width', '120px');
  selReceveur.style('padding', '5px');
  selReceveur.style('border-radius', '5px');
  selReceveur.style('border', '1px solid #ccc');
  
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
  createBackgroundElements(); // إعادة إنشاء العناصر عند تغيير حجم الشاشة
}

function draw() {
  // 1. رسم الخلفية الطبية
  drawMedicalBackground();
  
  // 2. العنوان
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
  text("Conception Didactique : Ilham Najji", width/2, 65);

  // 3. لوحة المتبرعين
  drawDonorPanel();

  // 4. منطقة المريض والتحليل
  drawHospitalScene(width / 2 - 120, height / 2 + 20, donorType, recipientType);

  // 5. لوحة الشرح البيداغوجي
  drawExplanationPanel();

  // 6. شريط الحالة
  drawStatusBar();

  // 7. قطرة الدم المسحوبة
  if (donorType !== "") {
    drawStylizedDrop(mouseX, mouseY, donorType);
  }
}

// --- وظائف الرسم الجديدة للخلفية الطبية ---

function createBackgroundElements() {
  backgroundElements = [];
  // إضافة رفوف اختبار عشوائية
  for (let i = 0; i < 5; i++) {
    backgroundElements.push({
      type: 'rack',
      x: random(width * 0.6, width * 0.9),
      y: random(height * 0.2, height * 0.5),
      tubes: floor(random(3, 7))
    });
  }
  // إضافة جزيئات عائمة (رموز بيولوجية مبسطة)
  for (let i = 0; i < 20; i++) {
    backgroundElements.push({
      type: 'particle',
      x: random(width),
      y: random(height),
      size: random(5, 15),
      speed: random(0.2, 1)
    });
  }
}

function drawMedicalBackground() {
  background(240, 245, 250); // لون خلفية أزرق فاتح جداً (طبي)

  // رسم شبكة خفيفة كخلفية هندسية
  stroke(220, 230, 240);
  strokeWeight(0.5);
  for (let x = 0; x < width; x += 50) line(x, 0, x, height);
  for (let y = 0; y < height; y += 50) line(0, y, width, y);
  noStroke();

  // رسم الرفوف وأنابيب الاختبار
  for (let el of backgroundElements) {
    if (el.type === 'rack') {
      drawTestTubeRack(el.x, el.y, el.tubes);
    } else if (el.type === 'particle') {
      fill(200, 220, 240, 150);
      ellipse(el.x, el.y, el.size);
      // تحريك الجزيئات ببطء
      el.y -= el.speed;
      if (el.y < -el.size) el.y = height + el.size;
    }
  }
}

function drawTestTubeRack(x, y, numTubes) {
  let rackWidth = numTubes * 25 + 10;
  fill(180, 190, 200);
  rect(x, y, rackWidth, 10, 5); // قاعدة الرف
  fill(200, 210, 220);
  rect(x + 5, y - 5, rackWidth - 10, 5, 2); // الجزء العلوي

  for (let i = 0; i < numTubes; i++) {
    let tubeX = x + 15 + i * 25;
    drawTestTube(tubeX, y - 5);
  }
}

function drawTestTube(x, y) {
  let tubeHeight = 50;
  let tubeWidth = 15;
  
  // الزجاج
  stroke(150, 180, 200);
  strokeWeight(1);
  fill(255, 255, 255, 100);
  rect(x, y - tubeHeight, tubeWidth, tubeHeight, 0, 0, 7, 7);
  
  // السائل (ألوان عشوائية طبية)
  noStroke();
  let colors = [color(192, 57, 43, 180), color(41, 128, 185, 180), color(243, 156, 18, 180)];
  fill(random(colors));
  let fillHeight = random(10, tubeHeight - 10);
  rect(x + 2, y - fillHeight - 2, tubeWidth - 4, fillHeight, 0, 0, 5, 5);
  
  // السدادة
  fill(100);
  rect(x, y - tubeHeight - 5, tubeWidth, 5, 2);
}

// --- الوظائف الأصلية (دون تغيير) ---

function drawDonorPanel() {
  fill(236, 240, 241, 220); // إضافة شفافية قليلاً
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
    
    // تصميم الأزرار كقوارير صغيرة
    fill(donorType === bloodOptions[i] ? color(192, 57, 43) : 255);
    rect(40, yPos - 20, 140, 35, 17); // زوايا دائرية أكثر
    
    // رقبة القارورة
    fill(donorType === bloodOptions[i] ? color(150, 40, 30) : 230);
    rect(40, yPos - 20, 15, 35, 17, 0, 0, 17);
    
    fill(donorType === bloodOptions[i] ? 255 : 50);
    textStyle(BOLD);
    text(bloodOptions[i], 120, yPos + 5);
    
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
  drawECG(x + 190, y - 50, status);

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
  textStyle(BOLD);
  text("PATIENT : " + recipient, x, y - 115);
}

function drawExplanationPanel() {
  let panelX = width - 350;
  let panelY = height / 2;
  
  fill(255, 240); // إضافة شفافية قليلاً
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
    explanation = "DANGER ! Le receveur possède des anticorps qui attaquent les antigènes étrangers du donneور (" + donor + "). Cela provoque une agglutination mortelle.";
  }
}

function drawECG(x, y, status) {
  fill(0, 200); // إضافة شفافية قليلاً
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
  text("  Expertise Master هندسة التكوين والوسائط الرقمية : Ilham Najji | Simulateur Didactique v4.0", 20, height - 15);
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
