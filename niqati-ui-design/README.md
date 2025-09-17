# نظام تصميم منصة نقاطي | Niqati Platform Design System

![](https://via.placeholder.com/1200x200/7B3FF2/FFFFFF?text=Niqati+Design+System)

## 🌟 نظرة عامة | Overview

هذا المجلد يحتوي على نظام التصميم الشامل لمنصة نقاطي، منصة تداول USDT بواجهة نقاط رقمية موجهة لسوق الشرق الأوسط وشمال إفريقيا. تم تصميم النظام مع التركيز على تجربة مستخدم متميزة، واجهات سهلة الاستخدام، والتوافق مع الشريعة الإسلامية.

This folder contains the comprehensive design system for Niqati Platform, a USDT trading platform with a digital points interface targeted at the MENA market. The system is designed with a focus on exceptional user experience, intuitive interfaces, and Shariah compliance.

## 📂 هيكل المجلدات | Folder Structure

```
UI_UX_DESIGN/
│
├── 01-Design_System/           # نظام التصميم
│   ├── colors/                 # لوحات الألوان ومتغيراتها
│   ├── typography/             # الخطوط والمقاسات
│   ├── spacing/                # نظام المسافات
│   ├── icons/                  # الأيقونات والرموز
│   └── grid/                   # نظام الشبكة
│
├── 02-Desktop_Views/           # واجهات سطح المكتب
│   ├── authentication/         # شاشات المصادقة
│   ├── dashboard/              # لوحة التحكم الرئيسية
│   ├── wallet/                 # المحفظة وعمليات التحويل
│   ├── trading/                # واجهات التداول
│   ├── settings/               # الإعدادات والحساب
│   ├── admin/                  # لوحة الإدارة
│   ├── merchant/               # واجهة التاجر
│   ├── kyc/                    # إجراءات KYC
│   └── compliance/             # واجهات الامتثال
│
├── 03-Mobile_Views/            # واجهات الموبايل
│   ├── authentication/
│   ├── dashboard/
│   ├── wallet/
│   ├── trading/
│   └── settings/
│
├── 04-User_Journey/            # رحلات المستخدم
│   ├── user_flows/             # مخططات التدفق
│   ├── wireframes/             # المخططات الأولية
│   └── prototypes/             # النماذج التفاعلية
│
├── 05-Components/              # مكتبة المكونات
│   ├── buttons/
│   ├── inputs/
│   ├── cards/
│   ├── modals/
│   ├── tables/
│   ├── notifications/
│   └── loaders/
│
├── 06-Documentation/           # الوثائق والأدلة
│   ├── design_guidelines/      # إرشادات التصميم
│   ├── developer_guides/       # أدلة المطورين
│   └── accessibility/          # معايير سهولة الوصول
│
├── 07-Assets/                  # الأصول والموارد
│   ├── images/
│   ├── illustrations/
│   └── animations/
│
└── 08-Prototypes/              # النماذج الأولية
    ├── html_prototype/         # نموذج HTML
    ├── figma_designs/          # تصاميم Figma
    └── interactive_demos/      # عروض توضيحية تفاعلية
```

## 🎨 الملفات المتاحة حالياً | Currently Available Files

1. **نظام التصميم الأساسي | Core Design System**
   - [`01-Design_System/colors/color_system.html`](01-Design_System/colors/color_system.html) - نظام الألوان الكامل
   - [`01-Design_System/typography/typography_system.html`](01-Design_System/typography/typography_system.html) - نظام الخطوط

2. **مكتبة المكونات | Components Library**
   - [`05-Components/buttons/button_components.html`](05-Components/buttons/button_components.html) - مكونات الأزرار

3. **واجهات سطح المكتب | Desktop Views**
   - [`02-Desktop_Views/authentication/login_page.html`](02-Desktop_Views/authentication/login_page.html) - صفحة تسجيل الدخول

4. **الوثائق | Documentation**
   - [`MASTER_PLAN.md`](MASTER_PLAN.md) - خطة تصميم UI/UX الشاملة

## 🚀 كيفية الاستخدام | How to Use

1. **للمصممين | For Designers**
   - يمكن استخدام ملفات نظام التصميم كمرجع لتطبيق الهوية البصرية في Figma أو Adobe XD
   - بناء تصاميم جديدة باستخدام المكونات والأنماط الموجودة

2. **للمطورين | For Developers**
   - استخدام متغيرات CSS المحددة في ملفات النظام
   - الرجوع إلى مكتبة المكونات لتنفيذ عناصر واجهة المستخدم
   - عرض النماذج الأولية لفهم تفاعلات المستخدم

3. **لفريق المنتج | For Product Team**
   - استخدام الوثائق ورحلات المستخدم لفهم تجربة المستخدم
   - مراجعة النماذج التفاعلية لاختبار سيناريوهات الاستخدام

## 🛠️ الخطط المستقبلية | Future Plans

- إضافة المزيد من مكونات واجهة المستخدم
- تطوير نماذج لجميع شاشات التطبيق
- إنشاء دليل تفصيلي للمطورين
- تحسين دعم الوسائط المتعددة والأجهزة المختلفة

## 🔄 سير العمل | Workflow

1. استعرض [`MASTER_PLAN.md`](MASTER_PLAN.md) لفهم الرؤية والمتطلبات
2. ابدأ بدراسة نظام التصميم الأساسي (الألوان والخطوط)
3. استكشف المكونات الفردية
4. راجع نماذج الواجهات الكاملة
5. اطلع على وثائق رحلة المستخدم

---

© 2025 منصة نقاطي | Niqati Platform
