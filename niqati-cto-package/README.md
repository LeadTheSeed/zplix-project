# Niqati Platform - حزمة تطوير منصة نقاطي

## نظرة عامة | Overview

هذه الحزمة تحتوي على جميع المستندات والملفات التقنية اللازمة لتطوير منصة نقاطي، وهي منصة لشراء وبيع USDT بواجهة نقاط رقمية للمستخدمين في منطقة الشرق الأوسط وشمال إفريقيا.

This package contains all the technical documentation and files needed to develop the Niqati platform, which is a USDT buying/selling platform with a digital points interface for users in the MENA region.

## محتويات الحزمة | Package Contents

### 1. وثائق سير العمل | Workflow Documents

- `niqati-workflow-index.html` - الصفحة الرئيسية للوثائق مع زر تبديل اللغة (الإنجليزية/العربية)
- `niqati_workflow_doc_part1.html` - الملخص التنفيذي ونظرة عامة على المشروع
- `niqati_workflow_doc_part2.html` - هندسة النظام ومصادقة المستخدم
- `niqati_workflow_doc_part3.html` - تكامل بوابة الدفع والعملات المشفرة
- `niqati_workflow_doc_part4.html` - محفظة المستخدم وتدفق الشراء
- `niqati-payment-strategy.html` - استراتيجية الدفع المعدلة (التحويل البنكي فقط في البداية)

### 2. الملفات التقنية الأساسية | Core Technical Files

- `technical-architecture.md` - شرح تفصيلي للبنية التقنية وكيف أن المنصة هي منصة تداول USDT بواجهة نقاط
- `api-specifications.yaml` - مواصفات API كاملة بصيغة OpenAPI
- `docker-compose.yml` - ملف Docker Compose لتشغيل البنية التحتية
- `README-TECHNICAL.md` - دليل تقني شامل للتنفيذ
- `package.json` - ملف npm مع جميع المكتبات المطلوبة
- `.env.example` - ملف متغيرات البيئة النموذجي
- `database-schema.md` - مخطط قاعدة البيانات لمنصة نقاطي

### 3. وثائق الامتثال والأمان | Compliance & Security Documents

- `regulatory-compliance-matrix.md` - مصفوفة الامتثال التنظيمي للمنطقة (VARA، CBB، SAMA)
- `wallet-security-architecture.md` - بنية أمان المحافظ والأصول الرقمية
- `travel-rule-implementation.md` - دليل تطبيق قاعدة السفر للعملات المشفرة
- `shariah-compliance-framework.md` - إطار التوافق مع الشريعة الإسلامية للمنصة

### 4. وثائق التكامل التقني | Technical Integration Documents

- `blockchain-integration-guide.md` - دليل تكامل منصات البلوك تشين (TRC20/ERC20/BEP20)

## كيفية البدء | Getting Started

1. ابدأ بمراجعة `niqati-workflow-index.html` للحصول على نظرة عامة على الوثائق.
2. راجع `technical-architecture.md` و `README-TECHNICAL.md` لفهم البنية الأساسية للمشروع.
3. استخدم `regulatory-compliance-matrix.md` لفهم المتطلبات التنظيمية للمنطقة.
4. راجع `wallet-security-architecture.md` لتنفيذ بنية المحافظ الآمنة.
5. استخدم `docker-compose.yml` لإعداد بيئة التطوير.
6. راجع `api-specifications.yaml` للحصول على تفاصيل كاملة عن واجهات API.
7. استخدم `blockchain-integration-guide.md` لتطبيق دعم شبكات USDT المختلفة.

## ملاحظات مهمة | Important Notes

- في مرحلة الإطلاق الأولية، ستدعم المنصة **التحويلات البنكية فقط** كوسيلة دفع.
- المنصة في جوهرها هي منصة لتداول USDT مع واجهة نقاط رقمية سهلة الاستخدام.
- يجب الالتزام بجميع متطلبات الأمان والامتثال المذكورة في الوثائق.
- تطبيق التوافق مع الشريعة الإسلامية مطلوب خاصة لدخول السوق البحريني.
- تطبيق قاعدة السفر (Travel Rule) إلزامي للامتثال لمعايير FATF ومتطلبات VARA.

## مخطط قاعدة البيانات | Database Schema

يمكنك العثور على مخطط قاعدة البيانات الكامل في الملف `database-schema.md`.

## الرسومات البيانية | Diagrams

في مجلد `diagrams` ستجد رسومات تفصيلية لهندسة النظام وتدفقات البيانات.

## أولويات التنفيذ | Implementation Priorities

1. **المرحلة الأولى (أولوية قصوى)** - Q4 2025
   - بنية المحافظ الآمنة
   - تكامل التحويل البنكي
   - الامتثال التنظيمي الأساسي
   - تكامل شبكة TRC20

2. **المرحلة الثانية (أولوية عالية)** - Q1 2026
   - تنفيذ قاعدة السفر
   - التوافق مع الشريعة الإسلامية
   - تكامل شبكة ERC20
   - لوحة تحكم المشرف

3. **المرحلة الثالثة (أولوية متوسطة)** - Q2-Q3 2026
   - دعم شبكات إضافية
   - تكامل وسائل دفع إضافية
   - واجهة برمجة تطبيقات للتجار

## تواصل مع فريق التطوير | Contact Development Team

إذا كانت لديك أي أسئلة تقنية، يرجى التواصل مع فريق التطوير:

- البريد الإلكتروني: tech@niqati.com
- مدير المشروع: +971-XX-XXX-XXXX

---

© 2025 منصة نقاطي | Niqati Platform
