import os
import time
import json
import random
import string
import qrcode
from io import BytesIO
import base64
from flask import Flask, render_template, request, redirect, url_for, jsonify, Response

# إنشاء تطبيق فلاسك
app = Flask(__name__)

# معرّف فريد للجلسة الحالية
SESSION_ID = ''.join(random.choices(string.ascii_letters + string.digits, k=10))

# مُحاكاة قاعدة بيانات المدفوعات (في الإصدار الحقيقي تُخزّن في قاعدة بيانات)
payments_db = {}

# قراءة ملف التكوين
def read_config():
    """قراءة إعدادات التكوين من الملف"""
    try:
        # في النسخة الحقيقية يتم قراءة ملف TOML
        # هنا نستخدم قيم ثابتة للتوضيح
        return {
            "title": "Zplix SatSale Demo",
            "currency": "BTC",
            "amount": "100000",  # ساتوشي
            "template": {
                "name": "Zplix Payment Gateway",
                "description": "تجربة بوابة دفع بيتكوين لمشروع Zplix",
                "primary_color": "#1e90ff",
                "accent_color": "#4CAF50",
                "background_color": "#f8f8f8",
                "show_logo": True,
                "logo_url": "https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg"
            }
        }
    except Exception as e:
        print(f"خطأ في قراءة ملف التكوين: {e}")
        return {}

# توليد عنوان بيتكوين جديد (محاكاة)
def generate_bitcoin_address():
    """توليد عنوان بيتكوين جديد (محاكاة)"""
    # هذا عنوان للتجربة فقط، في الإصدار الكامل يتم توليد عنوان حقيقي
    # من المفتاح العام الموسع (xpub)
    return "bc1q" + ''.join(random.choices(string.ascii_lowercase + string.digits, k=38))

# إنشاء رمز QR لعنوان بيتكوين
def generate_qr_code(data):
    """إنشاء رمز QR من البيانات"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    # تحويل الصورة إلى سلسلة base64
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

# إنشاء طلب دفع جديد
def create_payment_request(amount):
    """إنشاء طلب دفع جديد"""
    address = generate_bitcoin_address()
    payment_id = ''.join(random.choices(string.ascii_letters + string.digits, k=20))
    timestamp = int(time.time())
    
    payment_data = {
        "id": payment_id,
        "amount": amount,
        "address": address,
        "status": "pending",
        "created_at": timestamp,
        "expires_at": timestamp + 3600,  # صالح لمدة ساعة
        "qr_code": generate_qr_code(f"bitcoin:{address}?amount={float(amount)/100000000}")
    }
    
    payments_db[payment_id] = payment_data
    return payment_data

# تحقق من حالة الدفع (محاكاة)
def check_payment_status(payment_id):
    """تحقق من حالة الدفع (محاكاة)"""
    if payment_id not in payments_db:
        return {"status": "not_found"}
    
    payment = payments_db[payment_id]
    current_time = int(time.time())
    
    # محاكاة احتمالية استلام الدفع (20%)
    if payment["status"] == "pending":
        # إذا تم تجاوز وقت انتهاء الصلاحية
        if current_time > payment["expires_at"]:
            payment["status"] = "expired"
        # فرصة 20% لاستلام الدفع في كل تحقق
        elif random.random() < 0.2:
            payment["status"] = "paid"
            payment["paid_at"] = current_time
    
    payments_db[payment_id] = payment
    return payment

# الصفحة الرئيسية - نموذج الدفع
@app.route("/")
def index():
    config = read_config()
    amount = request.args.get('amount', config.get('amount', '100000'))
    payment = create_payment_request(amount)
    
    return render_template('index.html', 
                          payment=payment,
                          config=config,
                          amount_btc=float(amount)/100000000)  # تحويل من ساتوشي إلى BTC

# التحقق من حالة الدفع عبر AJAX
@app.route("/api/check-payment/<payment_id>")
def api_check_payment(payment_id):
    payment = check_payment_status(payment_id)
    return jsonify(payment)

# معالج التنبيهات webhook (للتكامل مع أنظمة أخرى)
@app.route("/api/webhook", methods=["POST"])
def webhook_handler():
    try:
        data = request.json
        # هنا يتم معالجة التنبيه الوارد من خدمة تتبع المدفوعات
        # وتحديث حالة الدفع في قاعدة البيانات
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

# صفحة نجاح الدفع
@app.route("/payment/success")
def payment_success():
    config = read_config()
    return render_template('success.html', config=config)

if __name__ == "__main__":
    # التأكد من وجود مجلد القوالب
    if not os.path.exists("templates"):
        os.makedirs("templates")
    
    app.run(host="0.0.0.0", port=8000, debug=True)
