let donorType = ""; 
let recipientType = "B+"; 
let bloodOptions = ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"];
let message = "Sélectionnez une fiole de sang pour commencer";
let selReceveur;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // قائمة اختيار المستقبل (جهة اليمين)
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
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(250);
  
  // 1. الشريط العلوي
  noStroke();
  fill(41, 128, 185); 
  rect(0, 0, width, 80);
  
  fill(255);
  textAlign(CENTER);
  textSize(28);
  textStyle(BOLD);
  text("SIMULATEUR DE TRANSFUSION", width/2, 40);
  
  textSize(16);
  textStyle(ITALIC);
  text("Réalisé par : Ilham Najji", width/2, 65);

  // 2. منطقة المتبرعين (Donneurs) - جهة اليسار
  fill(236, 240, 241);
  rect(20, 100, 180, 450, 15); // تكبير المستطيل قليلاً
  
  // إضافة كلمة DONNEURS كعنوان للقائمة
  fill(44, 62, 80);
  textSize(18);
  textStyle(BOLD);
  textAlign(CENTER);
  text("DONNEURS", 110, 130); 
  
  // خط فاصل بسيط تحت كلمة DONNEURS
  stroke(189, 195, 199);
  line(50, 140, 170, 140);
  noStroke();

  for (let i = 0; i < bloodOptions.length; i++) {
    let yPos = 175 + i * 45; // إزاحة الأزرار للأسفل لترك مساحة للعنوان
    let isOver = mouseX > 40 && mouseX < 180 && mouseY > yPos-20 && mouseY < yPos+20;
    
    fill(donorType === bloodOptions[i] ? color(192, 57, 43) : 255);
    rect(40, yPos - 20, 140, 35, 10);
    
    fill(donorType === bloodOptions[i] ? 255 : 50);
    textSize(16);
    textStyle(BOLD);
    text(bloodOptions[i], 110, yPos + 5);

    if (mouseIsPressed && isOver) {
      donorType = bloodOptions[i];
      message = "Test : " + donorType + " ➔ " + recipientType;
    }
  }

  // 3. منطقة المريض
  drawHospitalScene(width / 2 + 50, height / 2 + 20, donorType, recipientType);

  // 4. شريط الحالة السفلي
  fill(52, 73, 94);
  rect(0, height - 40, width, 40);
  fill(255);
  textSize(14);
  textAlign(LEFT);
  text("  Copyright © 2026 | Ilham Najji", 20, height - 15);
  
  textAlign(CENTER);
  text(message, width/2, height - 15);

  // 5. قطرة الدم
  if (donorType !== "") {
    drawStylizedDrop(mouseX, mouseY, donorType);
  }
}

function drawHospitalScene(x, y, donor, recipient) {
  let isTouching = dist(mouseX, mouseY, x, y) < 100;
  let reactionColor = color(255);
  
  if (isTouching && donor !== "") {
    if (canDonate(donor, recipient)) {
      reactionColor = color(46, 204, 113); 
      message = "✅ COMPATIBLE : " + donor + " peut sauver " + recipient;
    } else {
      reactionColor = color(231, 76, 60); 
      message = "❌ DANGER : Agglutination détectée !";
    }
  }

  fill(189, 195, 199);
  rect(x - 100, y + 60, 200, 10, 5);
  rect(x - 90, y + 70, 10, 30);
  rect(x + 80, y + 70, 10, 30);
  
  fill(243, 156, 18); 
  if (isTouching && donor !== "") fill(reactionColor);
  rect(x - 50, y - 20, 100, 80, 15);
  
  fill(255, 224, 189); 
  ellipse(x, y - 60, 70, 70);
  
  stroke(0, 50);
  line(x-15, y-60, x-5, y-60);
  line(x+5, y-60, x+15, y-60);
  noStroke();

  fill(44, 62, 80);
  textSize(20);
  textStyle(BOLD);
  text("RECEVEUR (PATIENT) : " + recipient, x, y - 110);
}

function drawStylizedDrop(x, y, label) {
  fill(192, 57, 43);
  noStroke();
  ellipse(x, y, 45, 45);
  triangle(x - 22, y - 5, x + 22, y - 5, x, y - 40);
  
  fill(255);
  textSize(16);
  textStyle(BOLD);
  text(label, x, y + 5);
}

function canDonate(donor, recipient) {
  if (donor === recipient) return true;
  if (donor === "O-") return true;
  if (recipient === "AB+") return true;
  if (donor === "O+" && recipient.includes("+")) return true;
  if (donor === "A-") {
    if (recipient.startsWith("A") || recipient.startsWith("AB")) return true;
  }
  if (donor === "A+" && (recipient === "A+" || recipient === "AB+")) return true;
  if (donor === "B-") {
    if (recipient.startsWith("B") || recipient.startsWith("AB")) return true;
  }
  if (donor === "B+" && (recipient === "B+" || recipient === "AB+")) return true;
  if (donor === "AB-") {
    if (recipient === "AB+" || recipient === "AB-") return true;
  }
  return false;
}
