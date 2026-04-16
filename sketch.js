let donorType = ""; 
let recipientType = "B+"; // ستتغير الآن عبر القائمة
let bloodOptions = ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"];
let message = "Sélectionnez une fiole de sang pour commencer";
let selReceveur; // المتغير الخاص بقائمة المستقبل

function setup() {
  createCanvas(800, 550);

  // إضافة قائمة اختيار فصيلة المستقبل في مكان لا يؤثر على الرسم
  let label = createP('Choisir le Receveur :');
  label.position(600, 90);
  label.style('font-family', 'sans-serif');
  label.style('font-weight', 'bold');

  selReceveur = createSelect();
  selReceveur.position(600, 130);
  selReceveur.style('width', '100px');
  selReceveur.style('padding', '5px');
  
  // إضافة الخيارات للقائمة
  bloodOptions.forEach(type => selReceveur.option(type));
  
  // ضبط القيمة الافتراضية لتكون B+ كما في كودك الأصلي
  selReceveur.selected('B+');

  // تحديث فصيلة المستقبل فور تغيير الاختيار
  selReceveur.changed(() => {
    recipientType = selReceveur.value();
    message = "Receveur changé en : " + recipientType;
  });
}

function draw() {
  background(250);
  
  // رسم واجهة المختبر (Panel)
  noStroke();
  fill(41, 128, 185); 
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

  // 1. القائمة الجانبية للمتبرع
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

  // 2. منطقة المريض (نمرر لها recipientType المتغير)
  drawHospitalScene(500, 280, donorType, recipientType);

  // 3. شريط الحالة بالأسفل
  fill(52, 73, 94);
  rect(0, height - 40, width, 40);
  fill(255);
  textSize(15);
  text(message, width/2, height - 15);

  // 4. رسم قطرة الدم
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

  // رسم السرير الطبي
  fill(189, 195, 199);
  rect(x - 100, y + 60, 200, 10, 5);
  rect(x - 90, y + 70, 10, 30);
  rect(x + 80, y + 70, 10, 30);
  
  // رسم المريض
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
  // قواعد التوافق العلمي
  if (donor === recipient) return true;
  if (donor === "O-") return true;
  if (recipient === "AB+") return true;
  if (donor === "O+" && recipient.includes("+")) return true;
  if (donor === "A-") {
    if (recipient === "A+" || recipient === "A-" || recipient === "AB+" || recipient === "AB-") return true;
  }
  if (donor === "A+" && (recipient === "A+" || recipient === "AB+")) return true;
  if (donor === "B-") {
    if (recipient === "B+" || recipient === "B-" || recipient === "AB+" || recipient === "AB-") return true;
  }
  if (donor === "B+" && (recipient === "B+" || recipient === "AB+")) return true;
  if (donor === "AB-" && (recipient === "AB+" || recipient === "AB-")) return true;
  
  return false;
}
