# دليل تطبيق قاعدة السفر | Travel Rule Implementation Guide

## منصة نقاطي: تنفيذ متطلبات قاعدة السفر لتحويلات USDT

## 1. مقدمة | Introduction

هذه الوثيقة توضح كيفية تنفيذ منصة نقاطي لمتطلبات "قاعدة السفر" وفقًا لتوصيات مجموعة العمل المالي (FATF) والأنظمة المحلية في منطقة الشرق الأوسط وشمال إفريقيا. تعد قاعدة السفر أحد أهم المتطلبات التنظيمية لمقدمي خدمات الأصول الافتراضية (VASPs).

This document outlines how the Niqati platform implements the "Travel Rule" requirements in accordance with the Financial Action Task Force (FATF) recommendations and local regulations in the MENA region. The Travel Rule is one of the most significant regulatory requirements for Virtual Asset Service Providers (VASPs).

## 2. نظرة عامة على قاعدة السفر | Travel Rule Overview

### 2.1 تعريف | Definition

قاعدة السفر هي متطلب تنظيمي يلزم مقدمي خدمات الأصول الافتراضية بتبادل معلومات محددة عن المرسل والمستفيد في تحويلات الأصول الرقمية التي تتجاوز حدًا معينًا (عادة 1,000 دولار أمريكي).

The Travel Rule is a regulatory requirement that mandates Virtual Asset Service Providers (VASPs) to exchange specific originator and beneficiary information for virtual asset transfers above a certain threshold (typically USD 1,000).

### 2.2 المتطلبات الأساسية | Core Requirements

```
┌─────────────────────────────────────────────────────────────────┐
│                    Travel Rule Data Requirements                │
├─────────────────┬───────────────────────────────────────────────┤
│ Originator      │ • Full Name                                  │
│ Information     │ • Account Number (Wallet Address)            │
│ (Sender)        │ • Physical Address OR National ID Number OR  │
│                 │   Customer ID Number OR Date & Place of Birth │
├─────────────────┼───────────────────────────────────────────────┤
│ Beneficiary     │ • Full Name                                  │
│ Information     │ • Account Number (Wallet Address)            │
│ (Receiver)      │                                              │
└─────────────────┴───────────────────────────────────────────────┘
```

## 3. تنفيذ قاعدة السفر في منصة نقاطي | Travel Rule Implementation in Niqati

### 3.1 المكونات الأساسية | Core Components

#### 3.1.1 نظام تبادل معلومات قاعدة السفر | Travel Rule Information Exchange System

```
┌───────────────┐     ┌───────────────────┐     ┌──────────────┐
│               │     │                   │     │              │
│ Niqati VASP  │◀───▶│ Travel Rule       │◀───▶│ Other VASPs  │
│ System       │     │ Protocol Solution  │     │              │
│               │     │                   │     │              │
└───────┬───────┘     └───────────────────┘     └──────────────┘
        │
        │
┌───────▼───────┐     ┌───────────────────┐
│               │     │                   │
│ Compliance    │◀───▶│ Customer KYC      │
│ Screening     │     │ Database          │
│               │     │                   │
└───────────────┘     └───────────────────┘
```

#### 3.1.2 التدفق التشغيلي | Operational Flow

1. **تحديد التحويلات المشمولة**: التعرف على التحويلات التي تتجاوز عتبة 1,000 دولار أمريكي
2. **جمع بيانات المرسل**: استرجاع المعلومات المطلوبة من قاعدة بيانات KYC
3. **التحقق من المستفيد**: تحديد ما إذا كان المستفيد يستخدم VASP آخر
4. **إرسال المعلومات**: إرسال البيانات المطلوبة إلى VASP المستفيد
5. **استلام البيانات**: استلام معلومات المرسل عند تلقي التحويلات
6. **التحقق والموافقة**: فحص المعلومات المستلمة مقابل قوائم العقوبات وإجراءات AML
7. **الاحتفاظ بالسجلات**: الاحتفاظ بالمعلومات لمدة 5 سنوات كحد أدنى

### 3.2 البروتوكولات المعتمدة | Supported Protocols

منصة نقاطي ستدعم البروتوكولات التالية لتبادل معلومات قاعدة السفر:

| Protocol | Description | Implementation Priority |
|----------|-------------|-------------------------|
| **TRP (Travel Rule Protocol)** | Protocol by crypto travel rule compliance platform | Phase 1 - Immediate |
| **OpenVASP** | Open protocol for VASP data exchange | Phase 1 - Immediate |
| **TRISA** | Travel Rule Information Sharing Alliance | Phase 2 - Q1 2026 |
| **Sygna Bridge** | Travel rule compliance API | Phase 2 - Q1 2026 |
| **Shyft Network** | Blockchain-based compliance framework | Phase 3 - Q2 2026 |

## 4. متطلبات قاعدة السفر الإقليمية | Regional Travel Rule Requirements

### 4.1 متطلبات الإمارات العربية المتحدة | UAE Requirements

- **الجهة التنظيمية**: هيئة تنظيم الأصول الافتراضية (VARA)
- **العتبة**: 1,000 درهم إماراتي (حوالي 270 دولار أمريكي)
- **متطلبات خاصة**:
  - تطبيق قاعدة السفر على جميع التحويلات الداخلية والخارجية
  - الاحتفاظ بالبيانات لمدة 5 سنوات
  - الإبلاغ عن المعاملات المشبوهة من خلال نظام goAML

### 4.2 متطلبات المملكة العربية السعودية | Saudi Arabia Requirements

- **الجهة التنظيمية**: البنك المركزي السعودي (SAMA)
- **العتبة**: 3,750 ريال سعودي (حوالي 1,000 دولار أمريكي)
- **متطلبات خاصة**:
  - التحقق الإلزامي من خلال نظام "أبشر"
  - تقديم تقارير منتظمة إلى وحدة التحريات المالية السعودية
  - إجراءات تحقق إضافية للتحويلات الكبيرة (فوق 37,500 ريال سعودي)

### 4.3 متطلبات البحرين | Bahrain Requirements

- **الجهة التنظيمية**: مصرف البحرين المركزي (CBB)
- **العتبة**: 383 دينار بحريني (حوالي 1,000 دولار أمريكي)
- **متطلبات خاصة**:
  - الامتثال للمجلد 6 من قواعد CBB للأصول المشفرة
  - التحقق المزدوج من هوية المستفيد
  - تقييم مخاطر مفصل لكل تحويل عابر للحدود

## 5. المتطلبات التقنية | Technical Requirements

### 5.1 مواصفات API | API Specifications

```json
// مثال لطلب API لإرسال معلومات قاعدة السفر
// Example API request for sending Travel Rule information
{
  "transfer_id": "tr-20250917-10032",
  "timestamp": "2025-09-17T13:45:22Z",
  "amount": "15000",
  "asset_type": "USDT",
  "blockchain": "TRC20",
  "originator": {
    "vasp_name": "Niqati Platform",
    "vasp_id": "VARA1234567",
    "customer_name": "Mohammed Ahmed",
    "customer_id": "NQT-7632590",
    "wallet_address": "TVaJesZUcDCp1LtyHJjMJkYuAqUHBVYfG7",
    "identification": {
      "type": "national_id",
      "value": "784-XXXX-XXXXXXX-X",
      "country": "AE"
    }
  },
  "beneficiary": {
    "vasp_name": "Recipient Platform",
    "vasp_id": "CBB9876543",
    "customer_name": "Sara Abdullah",
    "wallet_address": "TCJahgJypJkiT4JbfVWJ1ZHs5PM3UNoKPt"
  },
  "signature": "0x8a724a2b7e05c..."
}
```

### 5.2 احتياطات الخصوصية والأمان | Privacy and Security Safeguards

- **تشفير البيانات**: تشفير نهاية-إلى-نهاية لجميع المعلومات المتبادلة (AES-256)
- **إدارة المفاتيح**: نظام آمن لإدارة مفاتيح التشفير
- **حماية البيانات**: امتثال تام لقوانين حماية البيانات الإقليمية
- **التخزين الآمن**: تخزين مشفر للمعلومات الحساسة
- **التدقيق**: سجل تدقيق كامل لجميع عمليات تبادل المعلومات

## 6. تحديات التنفيذ والحلول | Implementation Challenges & Solutions

| التحدي Challenge | الحل Solution |
|------------------|---------------|
| **تنوع البروتوكولات** | تطبيق واجهة موحدة تدعم بروتوكولات متعددة |
| **الامتثال المتباين** | تخصيص مسارات عمل حسب المنطقة الجغرافية |
| **خصوصية البيانات** | نظام حقوق وصول دقيق مع تشفير متعدد الطبقات |
| **تجزئة السوق** | المشاركة في تحالفات صناعية لتوحيد المعايير |
| **تأخير المعاملات** | عمليات متوازية وتحسين الأداء |

## 7. خارطة طريق التنفيذ | Implementation Roadmap

### 7.1 المراحل الرئيسية | Key Phases

| Phase | Timeline | Activities |
|-------|----------|------------|
| **المرحلة 1: التأسيس** | Q4 2025 | - اختيار وتكامل مزود بروتوكول قاعدة السفر<br>- تطوير API داخلية<br>- تنفيذ تخزين البيانات الآمن |
| **المرحلة 2: التكامل** | Q1 2026 | - إنشاء اتصالات مع VASPs الإقليمية<br>- اختبار تبادل البيانات<br>- تكامل أنظمة فحص العقوبات |
| **المرحلة 3: التوسع** | Q2 2026 | - إضافة دعم بروتوكولات إضافية<br>- تحسين أداء وموثوقية النظام<br>- التكامل مع شبكات بلوكتشين متعددة |
| **المرحلة 4: الأتمتة** | Q3 2026 | - أتمتة فحص وموافقة التحويلات<br>- تطبيق تعلم الآلة لكشف الاحتيال<br>- تكامل إعداد التقارير التنظيمية |

## 8. أفضل الممارسات | Best Practices

- **التوحيد**: استخدام تنسيقات بيانات وبروتوكولات معيارية
- **التكرار**: أنظمة متكررة لضمان استمرارية التشغيل
- **الأمان**: مراجعات أمنية منتظمة وتدقيق الكود
- **المراقبة**: مراقبة مستمرة لنقل البيانات وتنبيهات في الوقت الفعلي
- **الامتثال**: فحص منتظم مقابل قوائم العقوبات وقواعد AML

## 9. الاستنتاجات والخطوات التالية | Conclusions & Next Steps

تنفيذ قاعدة السفر عنصر حاسم في استراتيجية الامتثال لمنصة نقاطي. من خلال اعتماد نهج شامل يجمع بين التكنولوجيا المتقدمة والالتزام بالمتطلبات التنظيمية، ستكون المنصة قادرة على تقديم خدمات آمنة ومتوافقة مع القوانين في سوق تداول USDT في منطقة الشرق الأوسط وشمال إفريقيا.

Implementing the Travel Rule is a critical element in Niqati platform's compliance strategy. By adopting a comprehensive approach that combines advanced technology with regulatory compliance, the platform will be able to provide secure and legally compliant services in the MENA region's USDT trading market.

### الخطوات المقبلة | Next Steps:

1. تعيين مسؤول قاعدة السفر لقيادة تنفيذ المشروع
2. اختيار مزود حل قاعدة السفر واستكمال التكامل
3. إنشاء شراكات استراتيجية مع VASPs الإقليمية الرئيسية
4. تطوير إجراءات تشغيلية موحدة للتعامل مع استثناءات قاعدة السفر

---

*تم إعداد هذه الوثيقة وفقًا للإرشادات التنظيمية الحالية اعتبارًا من سبتمبر 2025 وتخضع للمراجعة المنتظمة مع تطور اللوائح.*

*This document has been prepared according to current regulatory guidelines as of September 2025 and is subject to regular review as regulations evolve.*

*Last Updated: September 2025*
