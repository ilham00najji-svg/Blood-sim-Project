let selDonneur, selReceveur;
let resultMsg = "";
let bgColor = "#f0f0f0";

function setup() {
  createCanvas(600, 400);
  
  // تنسيق النصوص
  textAlign(CENTER);
  textSize(18);

  // إنشاء قائمة اختيار المتبرع (Donneur)
  createP('اختبر فصيلة المتبرع (Donneur):').position(20, 0);
  selDonneur = createSelect();
  selDonneur.position(50, 40);
  addOptions(selDonneur);

  // إنشاء قائمة اختيار المستقبل (Receveur)
  createP('اختبر فصيلة المستقبل (Receveur):').position(20, 70);
  selReceveur = createSelect();
  selReceveur.position(50, 110);
  addOptions(selReceveur);
}

function addOptions(sel) {
  let types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  types.forEach(type => sel.option(type));
}

function draw() {
  background(bgColor);
  
  let donneur = selDonneur.value();
  let receveur = selReceveur.value();
  
  checkCompatibility(donneur, receveur);

  // رسم العناصر البصرية
  fill(255);
  rect(150, 180, 300, 150, 20); // صندوق النتيجة
  
  fill(0);
  text("المتبرع: " + donneur, width/2, 220);
  text("المستقبل: " + receveur, width/2, 250);
  
  // عرض النتيجة
  textSize(22);
  fill(resultMsg.includes("ممكن") ? "green" : "red");
  text(resultMsg, width/2, 300);
  textSize(18);
}

function checkCompatibility(d, r) {
  // منطق قواعد نقل الدم العلمي
  let compatible = false;
  
  // تبسيط المنطق: O- يعطي الجميع، AB+ يستقبل من الجميع، إلخ
  if (d === r) compatible = true;
  else if (d === "O-") compatible = true;
  else if (r === "AB+") compatible = true;
  else if (d === "O+" && r.includes("+")) compatible = true;
  else if (d.startsWith("A") && r.startsWith("A") && (d.includes("-") || r.includes("+"))) compatible = true;
  else if (d.startsWith("B") && r.startsWith("B") && (d.includes("-") || r.includes("+"))) compatible = true;
  else if (d.startsWith("A-") && r.startsWith("AB")) compatible = true;
  else if (d.startsWith("B-") && r.startsWith("AB")) compatible = true;
  else if (d === "A+" && r === "AB+") compatible = true;
  else if (d === "B+" && r === "AB+") compatible = true;

  if (compatible) {
    resultMsg = "✅ نقل الدم ممكن";
    bgColor = "#e6fffa"; // لون خلفية مريح للعين
  } else {
    resultMsg = "❌ نقل الدم غير ممكن (خطر)";
    bgColor = "#fff5f5";
  }
}
