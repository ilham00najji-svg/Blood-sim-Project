let donorType = ""; 
let recipientType = "B+"; 
let bloodOptions = ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"];
let message = "Sélectionnez une fiole de sang pour commencer";

function setup() {
  createCanvas(800, 550);
}

function draw() {
  // خلفية متدرجة بسيطة (Gradient-like)
  background(250);
  
  // رسم واجهة المختبر (Panel)
  noStroke();
  fill(41, 128, 185); // لون أزرق احترافي
  rect(0, 0, width, 80);
  
  // العنوان
  fill(255);
  textAlign(CENTER);
  textSize(28);
  textStyle(BOLD);
  text("SIMULATEUR DE TRANSFUSION", 400, 40);
  
  textSize(14);
  textStyle(NORMAL);
  text("Réalisé par : ILHAM", 400, 65);

  // 1. القائمة الجانبية بتصميم عصري
  fill(236, 240, 241);
  rect(20, 100, 180, 430, 15);
  
  for (let i = 0; i < bloodOptions.length; i++) {
    let yPos = 135 + i * 48;
    let isOver = dist(mouseX, mouseY, 110, yPos) < 20;
    
    // رسم زر الخيار
    fill(donorType === bloodOptions[i] ? color(192, 57, 43) : 255);
    rect(40, yPos - 20, 140, 40, 10);
    
    // نص الفصيلة
    fill(donorType === bloodOptions[i] ? 255 : 50);
    textAlign(CENTER);
    textSize(16);
    text(bloodOptions[i], 110, yPos + 5);

    if (mouseIsPressed && isOver) {
      donorType = bloodOptions[i];
      message = "Test : " + donorType + " ➔ " + recipientType;
    }
  }

  // 2. منطقة المريض (تصميم أيقوني)
  drawHospitalScene(500, 280, donorType, recipientType);

  // 3. شريط الحالة بالأسفل
  fill(52, 73, 94);
  rect(0, height - 40, width, 40);
  fill(255);
  textSize(15);
  text(message, width/2, height - 15);

  // 4. رسم قطرة الدم (تأثير بصري جميل)
  if (donorType !== "") {
    drawStylizedDrop(mouseX, mouseY, donorType);
  }
}

function drawHospitalScene(x, y, donor, recipient) {
  let isTouching = dist(mouseX, mouseY, x, y) < 100;
  let reactionColor = color(255);
  
  if (isTouching && donor !== "") {
    if (canDonate(donor, recipient)) {
      reactionColor = color(46, 204, 113); // أخضر زمردي
      message = "✅ COMPATIBLE : " + donor + " peut sauver " + recipient;
    } else {
      reactionColor = color(231, 76, 60); // أحمر مرجاني
      message = "❌ DANGER : Agglutination détectée !";
    }
  }

  // رسم السرير الطبي
  fill(189, 195, 199);
  rect(x - 100, y + 60, 200, 10, 5);
  rect(x - 90, y + 70, 10, 30);
  rect(x + 80, y + 70, 10, 30);
  
  // رسم المريض (Minimalist Icon)
  fill(243, 156, 18); // لون برتقالي للجسم (ثوب المستشفى)
  if (isTouching && donor !== "") fill(reactionColor);
  rect(x - 50, y - 20, 100, 80, 15);
  
  fill(255, 224, 189); // الرأس
  ellipse(x, y - 60, 70, 70);
  
  // تفاصيل الرأس (نوم)
  stroke(0, 50);
  line(x-15, y-60, x-5, y-60);
  line(x+5, y-60, x+15, y-60);
  noStroke();

  fill(44, 62, 80);
  textSize(18);
  text("PATIENT : " + recipient, x, y - 110);
}

function drawStylizedDrop(x, y, label) {
  fill(192, 57, 43);
  noStroke();
  ellipse(x, y, 45, 45);
  triangle(x - 22, y - 5, x + 22, y - 5, x, y - 40);
  
  fill(255);
  textSize(16);
  text(label, x, y + 5);
}

function canDonate(donor, recipient) {
  if (donor === "O-" || donor === recipient) return true;
  if (recipient === "AB+") return true;
  if (donor === "O+" && recipient.includes("+")) return true;
  if (donor === "A-" && (recipient.includes("A") || recipient.includes("AB"))) return true;
  if (donor === "B-" && (recipient.includes("B") || recipient.includes("AB"))) return true;
  return false;
}