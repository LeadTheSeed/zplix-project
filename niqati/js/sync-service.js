/**
 * خدمة المزامنة للتواصل بين مختلف صفحات وأجزاء التطبيق
 * يستخدم BroadcastChannel للتواصل بين علامات التبويب المختلفة بشكل موثوق
 */

class SyncService {
    constructor() {
        this.listeners = new Map();
        
        // إنشاء قناة البث إذا كانت مدعومة من المتصفح
        if (typeof BroadcastChannel !== 'undefined') {
            this.channel = new BroadcastChannel('niqati_sync');
            this.channel.onmessage = this.handleMessage.bind(this);
            console.log('BroadcastChannel initialized successfully');
        } else {
            console.warn('BroadcastChannel not supported in this browser. Falling back to storage events.');
            window.addEventListener('storage', this.handleStorageEvent.bind(this));
        }
        
        // إضافة مستمع للأحداث من localStorage كاحتياط إضافي
        window.addEventListener('storage', this.handleStorageEvent.bind(this));
    }
    
    /**
     * معالجة الرسائل القادمة من قناة البث
     * @param {MessageEvent} event - حدث الرسالة
     */
    handleMessage(event) {
        const { type, data } = event.data;
        this.notifyListeners(type, data);
    }
    
    /**
     * معالجة أحداث التخزين (للمتصفحات التي لا تدعم BroadcastChannel)
     * @param {StorageEvent} event - حدث التخزين
     */
    handleStorageEvent(event) {
        if (event.key && event.key.endsWith('Timestamp')) {
            // استخراج نوع الحدث من اسم المفتاح (مثل pendingTicketsTimestamp)
            const type = event.key.replace('Timestamp', '');
            this.notifyListeners(type, { updated: true });
        }
    }
    
    /**
     * إشعار المستمعين المسجلين للحدث
     * @param {string} type - نوع الحدث
     * @param {object} data - بيانات الحدث
     */
    notifyListeners(type, data) {
        if (this.listeners.has(type)) {
            const callbacks = this.listeners.get(type);
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in listener callback for ${type}:`, error);
                }
            });
        }
    }
    
    /**
     * تسجيل مستمع لنوع محدد من الأحداث
     * @param {string} type - نوع الحدث للاستماع إليه
     * @param {function} callback - الدالة التي سيتم استدعاؤها عند وقوع الحدث
     */
    subscribe(type, callback) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        
        this.listeners.get(type).add(callback);
        return () => this.unsubscribe(type, callback);
    }
    
    /**
     * إلغاء تسجيل مستمع
     * @param {string} type - نوع الحدث
     * @param {function} callback - الدالة المراد إلغاء تسجيلها
     */
    unsubscribe(type, callback) {
        if (this.listeners.has(type)) {
            this.listeners.get(type).delete(callback);
        }
    }
    
    /**
     * إرسال حدث عبر قناة البث ومزامنة localStorage
     * @param {string} type - نوع الحدث
     * @param {object} data - بيانات الحدث
     * @param {boolean} localOnly - إذا كان صحيحًا، لن يتم بث الحدث عبر قناة البث
     */
    publish(type, data = {}, localOnly = false) {
        // تحديث localStorage
        const timestamp = Date.now();
        localStorage.setItem(`${type}Timestamp`, timestamp);
        
        // إشعار المستمعين المحليين
        this.notifyListeners(type, data);
        
        // إرسال عبر قناة البث إذا كانت متوفرة
        if (!localOnly && this.channel) {
            this.channel.postMessage({ type, data, timestamp });
        }
    }
    
    /**
     * وظيفة مساعدة لتخزين بيانات في localStorage مع نشر إشعار
     * @param {string} key - مفتاح التخزين
     * @param {any} value - القيمة المراد تخزينها
     */
    setWithSync(key, value) {
        // تخزين البيانات
        localStorage.setItem(key, JSON.stringify(value));
        
        // نشر إشعار بالتحديث
        this.publish(key, { updated: true });
    }
    
    /**
     * وظيفة مساعدة لجلب بيانات من localStorage
     * @param {string} key - مفتاح التخزين
     * @param {any} defaultValue - قيمة افتراضية إذا لم يكن المفتاح موجودًا
     * @returns {any} - القيمة المخزنة أو القيمة الافتراضية
     */
    get(key, defaultValue = null) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    }
}

// إنشاء نسخة عالمية من خدمة المزامنة
window.syncService = new SyncService();
