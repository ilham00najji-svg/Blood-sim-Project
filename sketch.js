let donorType = ""; 
let recipientType = "B+"; 
let bloodOptions = ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"];
let message = "Sélectionnez une fiole de sang pour commencer";
let selReceveur;

function setup() {
  // جعل الكانفاس يملأ الشاشة بالكامل
  createCanvas(windowWidth, windowHeight);

  // وضع قائمة اختيار المستقبل في جهة اليمين
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

// تحديث حجم الشاشة تلقائياً إذا قام المستخدم بتكبير المتصفح
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(250);
  
  // 1. الشريط العلوي (الهيدر) بعرض الشاشة كاملاً
  noStroke();
  fill(41, 128, 185); 
  rect(0, 0, width, 80);
  
  fill(255);
  textAlign(CENTER);
  textSize(28);
  textStyle(BOLD);
  text("SIMULATEUR DE TRANSFUSION", width/2, 40);
  
  textSize(14);
  textStyle(NORMAL);
  text("Réalisé par : ILHAM", width/2, 65);

  // 2. القائمة الجانبية للمتبرع
  fill(236, 240, 241);
  rect(20, 100, 180, 430, 15);
  
  for (let i = 0; i < bloodOptions.length; i++) {
    let yPos = 135 + i * 48;
    let isOver = mouseX > 40 && mouseX < 180 && mouseY > yPos-20 && mouseY < yPos+20;
    
    fill(donorType === bloodOptions[i] ? color(192, 57, 43) : 255);
    rect(40, yPos - 20, 140, 40, 10);
    
    fill(donorType === bloodOptions[i] ? 255 : 50);
    textAlign(CENTER);
    textSize(16);
    text(bloodOptions[i], 110, yPos + 5);

    if (mouseIsPressed && isOver) {
      donorType = bloodOptions[i];
      message = "Test : " + donorType + " ➔ " + recipientType;
    }
  }

  // 3. منطقة المريض (موضعة في وسط الشاشة)
  drawHospitalScene(width / 2 + 50, height / 2 + 20, donorType, recipientType);

  // 4. شريط الحالة السفلي بعرض الشاشة كاملاً
  fill(52, 73, 94);
  rect(0, height - 40, width, 40);
  fill(255);
  textSize(15);
  text(message, width/2, height - 15);

  // 5. رسم قطرة الدم المسحوبة
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

  // السرير الطبي
  fill(189, 195, 199);
  rect(x - 100, y + 60, 200, 10, 5);
  rect(x - 90, y + 70, 10, 30);
  rect(x + 80, y + 70, 10, 30);
  
  // جسم المريض
  fill(243, 156, 18); 
  if (isTouching && donor !== "") fill(reactionColor);
  rect(x - 50, y - 20, 100, 80, 15);
  
  // الرأس
  fill(255, 224, 189); 
  ellipse(x, y - 60, 70, 70);
  
  stroke(0, 50);
  line(x-15, y-60, x-5, y-60);
  line(x+5, y-60, x+15, y-60);
  noStroke();

  // نص الفصيلة فوق المريض
  fill(44, 62, 80);
  textSize(20);
  textStyle(BOLD);
  text("PATIENT : " + recipient, x, y - 110);
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
