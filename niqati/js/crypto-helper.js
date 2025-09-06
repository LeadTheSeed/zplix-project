/**
 * وظائف مساعدة للتشفير وإنشاء الكوبونات الآمنة
 */

// المفتاح السري للتشفير - يجب تغييره في الإنتاج وتخزينه بشكل آمن
const SECRET_KEY = 'Niqati_Secret_Key_2025_ZPLIX_Secure_Coupons';

/**
 * إنشاء كوبون آمن باستخدام HMAC-SHA256
 * @param {Object} orderData - بيانات الطلب
 * @returns {String} - كود الكوبون المشفر
 */
async function generateSecureCoupon(orderData) {
    try {
        // إنشاء سلسلة من بيانات الطلب
        const dataString = `${orderData.ticketNumber}|${orderData.timestamp}|${orderData.productName}|${orderData.quantity}`;
        
        // تحويل النص والمفتاح إلى بيانات ثنائية
        const encoder = new TextEncoder();
        const data = encoder.encode(dataString);
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(SECRET_KEY),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        // إنشاء التوقيع
        const signature = await crypto.subtle.sign('HMAC', key, data);
        
        // تحويل التوقيع إلى سلسلة Base64
        const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        
        // إنشاء الكوبون بتنسيق مناسب
        const prefix = orderData.productName.substring(0, 2).toUpperCase();
        const timestamp = Math.floor(Date.now() / 1000).toString(36);
        const shortHash = base64Signature.substring(0, 16);
        
        // تنسيق الكوبون بشكل مقروء: PREFIX-TIMESTAMP-HASH
        return `${prefix}-${timestamp}-${shortHash}`.match(/.{1,4}/g).join('-');
    } catch (error) {
        console.error('Error generating secure coupon:', error);
        // استخدام طريقة احتياطية في حالة الخطأ
        return generateFallbackCoupon(orderData);
    }
}

/**
 * طريقة احتياطية لإنشاء كوبون في حالة فشل الطريقة الرئيسية
 * @param {Object} orderData - بيانات الطلب
 * @returns {String} - كود الكوبون
 */
function generateFallbackCoupon(orderData) {
    const prefix = orderData.productName.substring(0, 2).toUpperCase();
    const timestamp = Math.floor(Date.now() / 1000).toString(36);
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    return `${prefix}-${timestamp}-${randomPart}`.match(/.{1,4}/g).join('-');
}

/**
 * إنشاء كود تفعيل آمن للإدارة
 * @returns {String} - كود التفعيل
 */
function generateActivationCode() {
    const prefix = 'ACT';
    const randomPart1 = Math.floor(1000 + Math.random() * 9000);
    const randomPart2 = Math.floor(1000 + Math.random() * 9000);
    
    return `${prefix}-${randomPart1}-${randomPart2}`;
}

/**
 * التحقق من صحة الكوبون
 * @param {String} coupon - الكوبون المراد التحقق منه
 * @param {Object} orderData - بيانات الطلب الأصلية
 * @returns {Boolean} - هل الكوبون صالح
 */
async function verifyCoupon(coupon, orderData) {
    try {
        // إعادة إنشاء الكوبون من البيانات الأصلية
        const regeneratedCoupon = await generateSecureCoupon(orderData);
        
        // مقارنة الكوبون المقدم مع الكوبون المعاد إنشاؤه
        return coupon === regeneratedCoupon;
    } catch (error) {
        console.error('Error verifying coupon:', error);
        return false;
    }
}

// تصدير الوظائف للاستخدام في الملفات الأخرى
window.cryptoHelper = {
    generateSecureCoupon,
    generateActivationCode,
    verifyCoupon
};
