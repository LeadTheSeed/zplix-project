/**
 * خدمة توليد الكوبونات الآمنة - محاكاة لخدمة الخادم الخلفي (Backend)
 * هذا الملف هو محاكاة مؤقتة. في الإنتاج، يجب نقل هذا المنطق بالكامل إلى الخادم!
 */

(function() {
    // هام: هذا مفتاح سري مؤقت للمحاكاة فقط!
    // في الإنتاج، يجب أن يكون المفتاح السري على الخادم فقط
    // ولا يتم الكشف عنه أبدًا في الجانب الأمامي
    const SECRET_KEY = 'DO_NOT_USE_THIS_IN_PRODUCTION_' + Math.random().toString(36).substring(2, 15);
    
    /**
     * خدمة محاكاة الخادم الخلفي لتوليد الكوبونات
     */
    class SecureCouponService {
        constructor() {
            this.couponCache = new Map(); // تخزين مؤقت للكوبونات التي تم توليدها مسبقًا
            console.log('Secure Coupon Service initialized (SIMULATED BACKEND)');
        }
        
        /**
         * محاكاة طلب API للخادم لتوليد كوبون آمن
         * @param {Object} orderData - بيانات الطلب
         * @returns {Promise} - وعد يعيد كود الكوبون
         */
        generateCoupon(orderData) {
            // محاكاة تأخير الشبكة (100-300ms)
            const networkDelay = Math.floor(Math.random() * 200) + 100;
            
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        // التحقق من البيانات المطلوبة
                        if (!orderData || !orderData.ticketNumber || !orderData.timestamp) {
                            throw new Error('Invalid order data: missing required fields');
                        }
                        
                        // التحقق من الكاش: هل تم توليد هذا الكوبون مسبقًا؟
                        const cacheKey = orderData.ticketNumber;
                        if (this.couponCache.has(cacheKey)) {
                            console.log('Using cached coupon for ticket:', cacheKey);
                            resolve(this.couponCache.get(cacheKey));
                            return;
                        }
                        
                        // توليد الكوبون
                        const coupon = this._generateSecureCoupon(orderData);
                        
                        // تخزين في الكاش
                        this.couponCache.set(cacheKey, coupon);
                        
                        // سجل للتدقيق
                        this._logCouponGeneration(orderData.ticketNumber, coupon);
                        
                        // إعادة الكوبون
                        resolve(coupon);
                    } catch (error) {
                        console.error('Error generating coupon:', error);
                        reject(error);
                    }
                }, networkDelay);
            });
        }
        
        /**
         * توليد كوبون آمن - محاكاة لمنطق الخادم الخلفي
         * @private
         */
        _generateSecureCoupon(orderData) {
            // إنشاء بذرة للكوبون
            const seed = `${orderData.ticketNumber}|${orderData.timestamp}|${SECRET_KEY}`;
            
            // إنشاء قيمة هاش
            let hash = 0;
            for (let i = 0; i < seed.length; i++) {
                hash = ((hash << 5) - hash) + seed.charCodeAt(i);
                hash |= 0; // تحويل إلى عدد صحيح 32 بت
            }
            
            // تحويل الهاش إلى سلسلة محارف مشفرة
            const hashStr = Math.abs(hash).toString(36).toUpperCase();
            
            // إنشاء بادئة من اسم المنتج
            const prefix = (orderData.productName || 'NQ').substring(0, 2).toUpperCase();
            
            // إنشاء قيمة وسطية من الطابع الزمني
            const timestamp = Math.floor(orderData.timestamp / 1000).toString(36).toUpperCase();
            
            // إنشاء قيمة عشوائية مشتقة من الهاش
            const randomPart = Math.abs(hash).toString(36).substring(0, 8).toUpperCase();
            
            // دمج الأجزاء
            const couponParts = [prefix, timestamp, randomPart, hashStr.substring(0, 4)];
            
            // تنسيق الكوبون بشكل مقروء: PREFIX-TIMESTAMP-RANDOM-HASH
            return couponParts.join('-');
        }
        
        /**
         * تسجيل عملية توليد الكوبون للتدقيق
         * @private
         */
        _logCouponGeneration(ticketNumber, coupon) {
            // في الإنتاج، سيتم تسجيل ذلك في قاعدة بيانات الخادم
            console.log(`Coupon generated for ticket ${ticketNumber}: ${coupon}`);
            
            // تخزين سجل التدقيق في localStorage كمحاكاة
            let auditLogs = JSON.parse(localStorage.getItem('auditLogs')) || [];
            auditLogs.push({
                action: 'GENERATE_COUPON',
                timestamp: new Date().toISOString(),
                ticketNumber: ticketNumber,
                details: { coupon: coupon }
            });
            localStorage.setItem('auditLogs', JSON.stringify(auditLogs));
        }
        
        /**
         * التحقق من صحة الكوبون
         * @param {String} coupon - الكوبون المراد التحقق منه
         * @param {Object} orderData - بيانات الطلب الأصلية
         * @returns {Promise} - وعد يعيد قيمة منطقية
         */
        verifyCoupon(coupon, orderData) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    try {
                        // في الإنتاج، سيتم التحقق على الخادم
                        const expectedCoupon = this._generateSecureCoupon(orderData);
                        const isValid = coupon === expectedCoupon;
                        resolve(isValid);
                    } catch (error) {
                        console.error('Error verifying coupon:', error);
                        resolve(false);
                    }
                }, 200);
            });
        }
        
        /**
         * إنشاء كود تفعيل آمن للإدارة
         * @returns {Promise} - وعد يعيد كود التفعيل
         */
        generateActivationCode() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    try {
                        // إنشاء كود تفعيل بتنسيق ACT-XXXX-XXXX
                        const prefix = 'ACT';
                        const randomPart1 = Math.floor(1000 + Math.random() * 9000);
                        const randomPart2 = Math.floor(1000 + Math.random() * 9000);
                        const code = `${prefix}-${randomPart1}-${randomPart2}`;
                        resolve(code);
                    } catch (error) {
                        console.error('Error generating activation code:', error);
                        resolve('ACT-ERROR');
                    }
                }, 100);
            });
        }
    }
    
    // تصدير الخدمة
    window.couponService = new SecureCouponService();
})();
