# نموذج Tippin.me (كاسكس) لمشروع Zplix

هذا دليل سريع لتنفيذ حل مشابه لـ Tippin.me باستخدام شبكة البرق (Lightning Network) للبيتكوين. Tippin.me هو في الأصل تطبيق لإنشاء صفحات "تبرعات" ولكنه مفتوح المصدر ويمكن تعديله لتلبية احتياجاتك.

## الميزات الرئيسية

✓ سهل الإعداد والتثبيت
✓ يستخدم واجهة بسيطة وجذابة
✓ الكود المصدري متاح ويسهل التغيير
✓ مثالي إذا أردنا بناء حل مخصص بسرعة

## كيف يعمل

يعتمد Tippin.me على شبكة البرق (Lightning Network) التي تتيح مدفوعات بيتكوين فورية بعمولات منخفضة جدًا. يمكن استخدام واجهة برمجة التطبيقات الخاصة بشبكة البرق لإنشاء نظام مشابه.

## المتطلبات

1. خادم يدعم Node.js
2. عقدة شبكة البرق (LND أو c-lightning)
3. معرفة بالـ JavaScript و Express.js

## تنفيذ نموذج أولي

سنقوم بإنشاء تطبيق Express.js بسيط يحاكي وظيفة Tippin.me:

### هيكل المشروع:

```
tippin-demo/
├── server.js           # خادم Express الرئيسي
├── lightning/          # مكتبات الاتصال بشبكة البرق
├── public/             # ملفات الواجهة الأمامية
├── views/              # قوالب EJS
└── package.json        # تبعيات المشروع
```

### ملف package.json:

```json
{
  "name": "zplix-tippin-demo",
  "version": "1.0.0",
  "description": "نموذج لتطبيق شبيه بـ Tippin.me لمشروع Zplix",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "ejs": "^3.1.6",
    "ln-service": "^53.0.0",
    "qrcode": "^1.5.0",
    "dotenv": "^10.0.0",
    "body-parser": "^1.19.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.15"
  }
}
```

### مثال لملف server.js:

```javascript
const express = require('express');
const { createInvoice, checkInvoice } = require('./lightning/lnd');
const QRCode = require('qrcode');
const app = express();

// إعدادات الخادم
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.render('index', { title: 'Zplix Tippin Demo' });
});

// إنشاء فاتورة جديدة
app.post('/api/invoice', async (req, res) => {
  try {
    const { amount, description } = req.body;
    
    // إنشاء فاتورة عبر شبكة البرق
    const invoice = await createInvoice({
      tokens: amount, // المبلغ بالساتوشي
      description: description || 'Zplix Tippin Demo',
      expires_at: new Date(Date.now() + 3600000).toISOString(), // ساعة واحدة
    });
    
    // إنشاء رمز QR للدفع
    const qr = await QRCode.toDataURL(invoice.request);
    
    res.json({
      id: invoice.id,
      paymentRequest: invoice.request,
      qrCode: qr,
      description: invoice.description,
      amount: invoice.tokens,
      expiresAt: invoice.expires_at,
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// التحقق من حالة الدفع
app.get('/api/invoice/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await checkInvoice({ id });
    
    res.json({
      paid: invoice.is_confirmed,
      amount: invoice.tokens,
      settledAt: invoice.confirmed_at,
    });
  } catch (error) {
    console.error('Error checking invoice:', error);
    res.status(500).json({ error: 'Failed to check invoice' });
  }
});

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## كيفية الاستخدام في Zplix

1. قم بتثبيت عقدة Lightning Network (LND أو c-lightning)
2. قم بتنفيذ تطبيق Express.js المذكور أعلاه
3. قم بتخصيص واجهة المستخدم حسب احتياجات Zplix
4. استخدم واجهة برمجة التطبيقات لإنشاء فواتير وزر تبرعات

### مثال لتضمين زر تبرعات:

```html
<!-- زر تبرع بسيط -->
<a href="https://yourserver.com/tip?recipient=zplix&amount=10000" class="lightning-button">
  تبرع عبر Lightning ⚡
</a>

<!-- أو iframe للتضمين المباشر -->
<iframe 
  src="https://yourserver.com/embed/zplix" 
  width="320" 
  height="420" 
  frameborder="0">
</iframe>
```

## التكلفة والصيانة

- تكلفة استضافة منخفضة (~$5-10 شهريًا)
- لا يتطلب عقدة بيتكوين كاملة (فقط عقدة Lightning)
- سهل الصيانة والتحديث

## الملخص

حل مشابه لـ Tippin.me هو الخيار الأمثل إذا كنت:
- تبحث عن نظام مدفوعات/تبرعات بسيط
- ترغب بالاستفادة من سرعة وانخفاض تكاليف شبكة البرق
- تريد نظامًا سهل التخصيص والتعديل
- لا تحتاج إلى جميع الميزات المتقدمة التي يوفرها BTCPay Server

[مزيد من المعلومات عن Lightning Network](https://lightning.network/)
