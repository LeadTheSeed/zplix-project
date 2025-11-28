# نموذج BTCPay Server لمشروع Zplix

هذا دليل سريع لتنفيذ BTCPay Server كحل دفع بالبيتكوين. يتميز BTCPay Server بكونه حلاً كاملاً ومفتوح المصدر لمعالجة مدفوعات البيتكوين والعملات الرقمية الأخرى.

## الميزات الرئيسية

✓ لامركزي ومفتوح المصدر: الأموال تذهب مباشرة من العميل إلى محفظتك.
✓ لا يوجد طرف ثالث: لا يوجد وسيط بينك وبين العملاء.
✓ متكامل: يدعم Webhooks، مما يجعله مثاليًا للأنظمة الكاملة.
✓ لا توجد رسوم: مجاني تمامًا باستثناء تكاليف استضافة الخادم.

## متطلبات التثبيت

1. خادم لينكس
2. دومين
3. معرفة أساسية بالشبكات وإدارة الخوادم

## طريقة التثبيت

### الطريقة 1: باستخدام Docker (الأسهل)

```bash
# 1. تثبيت Docker
sudo apt-get update
sudo apt-get install -y docker.io docker-compose

# 2. تحميل BTCPay Server
git clone https://github.com/btcpayserver/btcpayserver-docker
cd btcpayserver-docker

# 3. إعداد بيئة العمل
export BTCPAY_HOST="yourdomain.com"
export NBITCOIN_NETWORK="mainnet"
export BTCPAYGEN_CRYPTO1="btc"
export BTCPAYGEN_LIGHTNING="clightning"

# 4. إنشاء ملفات التكوين
. ./btcpay-setup.sh -i

# 5. بدء الخدمة
cd compose
docker-compose up -d
```

### الطريقة 2: التثبيت باستخدام منصة استضافة جاهزة

يمكنك استخدام خدمات مثل [Luna Node](https://lunanode.com/) أو [Digital Ocean](https://www.digitalocean.com/) التي توفر صور BTCPay Server جاهزة للاستخدام.

## الاستخدام في مشروع Zplix

1. بعد التثبيت، قم بإنشاء متجر جديد من لوحة التحكم
2. قم بإعداد مفاتيح API للتكامل مع تطبيقات الويب
3. استخدم واجهة برمجة التطبيقات لإنشاء فواتير الدفع

### مثال للتكامل مع تطبيق ويب:

```javascript
// إنشاء فاتورة جديدة باستخدام BTCPay Server API
async function createInvoice(amount, currency, orderDescription) {
  const response = await fetch('https://your-btcpay-server.com/api/v1/stores/yourStoreId/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer yourApiKey'
    },
    body: JSON.stringify({
      amount: amount,
      currency: currency,
      metadata: {
        orderId: 'zplix-' + Date.now(),
        description: orderDescription
      }
    })
  });
  
  return await response.json();
}

// استخدام الدالة
const invoice = await createInvoice(100, 'USD', 'طلب منتج من Zplix');
const paymentUrl = invoice.checkoutLink;
// توجيه المستخدم إلى رابط الدفع
window.location.href = paymentUrl;
```

## التكلفة والصيانة

- تكلفة استضافة الخادم: ~$10-50 شهرياً حسب المواصفات
- يتطلب صيانة دورية وتحديثات للبرمجيات
- يتطلب عقدة بيتكوين كاملة (مساحة تخزينية كبيرة >500GB)

## الملخص

BTCPay Server هو الحل الأمثل إذا كنت:
- تبحث عن نظام دفع كامل المواصفات
- تمتلك الموارد اللازمة لتشغيل وصيانة الخادم
- تفضل التحكم الكامل بدون وسطاء
- تحتاج إلى دعم تكاملات متعددة (مثل المتاجر الإلكترونية)

[مزيد من المعلومات على الموقع الرسمي](https://btcpayserver.org/)
