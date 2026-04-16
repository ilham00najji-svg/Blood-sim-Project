let selReceveur; // متغير للقائمة
let receveur = "A+"; // الفصيلة الافتراضية

function setup() {
  createCanvas(600, 400); // حافظي على نفس مقاساتك القديمة
  
  // إضافة قائمة الاختيار في مكان جانبي لا يخرب الرسم
  selReceveur = createSelect();
  selReceveur.position(20, 20); // يظهر في أعلى اليسار
  selReceveur.option('A+');
  selReceveur.option('A-');
  selReceveur.option('B+');
  selReceveur.option('B-');
  selReceveur.option('AB+');
  selReceveur.option('AB-');
  selReceveur.option('O+');
  selReceveur.option('O-');
  
  // عندما نغير الاختيار، تتحدث الفصيلة فوراً
  selReceveur.changed(() => {
    receveur = selReceveur.value();
  });
}

function draw() {
  // هنا ضعي كود الرسم القديم الخاص بكِ (شكل المريض والدم)
  // فقط تأكدي أن الكود يستخدم المتغير الذي اسمه "receveur" 
  // لكي تتغير النتائج بناءً على ما تختارينه من القائمة.
  
  background(255); 
  // ... (باقي كود الرسم الخاص بكِ)
  
  fill(0);
  text("فصيلة المستقبل الحالية: " + receveur, 20, 60);
}
