# إطار التوافق مع الشريعة الإسلامية | Shariah Compliance Framework

## منصة نقاطي: إطار التوافق مع الشريعة الإسلامية لتداول USDT
## Niqati Platform: Shariah Compliance Framework for USDT Trading

### 1. مقدمة | Introduction

هذه الوثيقة توضح إطار التوافق مع الشريعة الإسلامية لمنصة نقاطي، والتي تتيح شراء وبيع وحدات USDT من خلال واجهة نقاط رقمية. تم تطوير هذا الإطار وفقًا لمعايير هيئة المحاسبة والمراجعة للمؤسسات المالية الإسلامية (AAOIFI) ومجلس الخدمات المالية الإسلامية (IFSB) ومتطلبات مصرف البحرين المركزي (CBB).

This document outlines the Shariah compliance framework for the Niqati platform, which enables the buying, selling, and transacting of USDT through a digital points interface. This framework has been developed in accordance with the standards of the Accounting and Auditing Organization for Islamic Financial Institutions (AAOIFI), the Islamic Financial Services Board (IFSB), and the requirements of the Central Bank of Bahrain (CBB).

### 2. التحديات الشرعية للأصول الرقمية | Shariah Challenges for Digital Assets

#### 2.1 القضايا الشرعية الرئيسية | Key Shariah Issues

| Issue | Description | Shariah Concern | Niqati's Approach |
|-------|-------------|-----------------|-------------------|
| **الغرر (عدم اليقين)** | Uncertainty in the transaction | Excessive uncertainty in the nature, price, or delivery of the asset | Clear pricing, immediate settlement, transparent fee structure |
| **القمار والميسر** | Gambling and games of chance | Speculative nature of cryptocurrency trading | Focus on utility and payment rather than speculation, real asset backing |
| **الربا (الفائدة)** | Interest-based transactions | Interest-bearing elements in cryptocurrency | Avoid interest-based mechanisms, ensure all revenue from permissible sources |
| **ملكية الأصول** | Asset ownership | Clear ownership and possession of assets | Clear documentation of ownership transfer, segregated wallets |
| **الاستخدام المشروع** | Permissible use | Assets used for permissible purposes | Screening and monitoring of transactions, prohibited industries exclusion |

### 3. هيكل الحوكمة الشرعية | Shariah Governance Structure

#### 3.1 هيئة الرقابة الشرعية | Shariah Supervisory Board (SSB)

```
┌─────────────────────────────────────────────────────┐
│           مجلس إدارة نقاطي | Niqati Board           │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│       هيئة الرقابة الشرعية | Shariah Supervisory    │
│                        Board                        │
└───────┬─────────────────┬────────────────────┬──────┘
        │                 │                    │
        ▼                 ▼                    ▼
┌───────────────┐ ┌───────────────┐  ┌──────────────────┐
│ تدقيق شرعي   │ │ مراجعة المنتج │  │ الفتاوى والقرارات │
│ Shariah Audit │ │Product Review │  │Fatawa & Resolutions│
└───────────────┘ └───────────────┘  └──────────────────┘
```

#### 3.2 أعضاء هيئة الرقابة الشرعية | SSB Members

تتكون هيئة الرقابة الشرعية من ثلاثة علماء على الأقل من ذوي الخبرة في فقه المعاملات المالية الإسلامية والأصول الرقمية.

The Shariah Supervisory Board consists of at least three scholars with expertise in Islamic financial transactions and digital assets.

### 4. التكييف الشرعي للنموذج | Shariah Characterization of the Model

#### 4.1 النموذج المعتمد | Adopted Model: الصرف + الوكالة (Exchange + Agency)

منصة نقاطي تعمل وفق نموذج مزدوج:
1. **عقد الصرف (Exchange Contract)**: تبادل العملات المحلية بـ USDT
2. **عقد الوكالة (Agency Contract)**: المنصة كوكيل في شراء وبيع نقاط رقمية مدعومة بـ USDT

#### 4.2 الهيكل الشرعي | Shariah Structure

```
┌────────────────┐    ┌1. صرف | Exchange┐    ┌────────────────┐
│                │    │ عملة محلية ─────>│    │                │
│                │    │                  │    │                │
│  المستخدم     │<───┤ <───── USDT      │    │     المنصة     │
│   User         │    └──────────────────┘    │   Platform     │
│                │                            │                │
│                │    ┌2. وكالة | Agency┐     │                │
│                │───>│ رسوم الوكالة ───>│    │                │
└────────────────┘    └──────────────────┘    └────────────────┘
```

### 5. الامتثال للمعايير الشرعية | Compliance with Shariah Standards

#### 5.1 معايير AAOIFI ذات الصلة | Relevant AAOIFI Standards

| Standard | Title | Application in Niqati |
|----------|-------|------------------------|
| **المعيار الشرعي رقم 1** | Trading in Currencies | Governs the exchange of local currency for USDT |
| **المعيار الشرعي رقم 23** | Agency and the Act of an Uncommissioned Agent | Governs the platform's role as agent |
| **المعيار الشرعي رقم 44** | Obtaining and Deploying Liquidity | Guides liquidity management practices |
| **المعيار الشرعي رقم 59** | Sale of Debt | Ensures compliant debt trading practices |

#### 5.2 معايير مصرف البحرين المركزي | Central Bank of Bahrain Standards

متوافق مع متطلبات المجلد السادس للخدمات المالية الإسلامية الصادر عن مصرف البحرين المركزي، خاصةً:
- قسم BC-3.1: المتطلبات الشرعية
- قسم BC-3.2: متطلبات الرقابة الشرعية
- قسم BC-3.3: التدقيق الشرعي

### 6. التدقيق الشرعي للمكونات التقنية | Shariah Audit of Technical Components

#### 6.1 تقييم مكونات النظام | System Component Assessment

| Component | Shariah Requirements | Technical Implementation |
|-----------|----------------------|--------------------------|
| **User Wallet** | - No mixing with non-Shariah compliant funds<br>- Clear ownership<br>- Immediate settlement | - Segregated wallet architecture<br>- Blockchain-based ownership records<br>- Real-time settlement process |
| **Trading Engine** | - No interest-based transactions<br>- No excessive uncertainty<br>- Transparent pricing | - Fixed fee model instead of interest<br>- Real-time price discovery<br>- Transparent fee structure |
| **USDT Custody** | - Clear ownership<br>- No unauthorized use of funds<br>- Asset backing | - Multi-signature wallets<br>- Segregated accounts<br>- Regular proof of reserves |
| **Platform Revenue** | - Halal sources of income<br>- No revenue from prohibited activities | - Fixed fee structure<br>- Transaction fees<br>- No interest-based income |

### 7. ضوابط المعاملات الشرعية | Shariah Transaction Controls

#### 7.1 شروط عقد الصرف | Currency Exchange Conditions

- **التقابض (Immediate Settlement)**: يجب أن تتم التسوية فوريًا بمجرد تأكيد الدفع
- **التماثل (Equivalence)**: تبادل القيمة المكافئة بسعر السوق العادل
- **التراضي (Mutual Consent)**: موافقة صريحة من الطرفين على شروط المعاملة
- **الملكية (Ownership)**: نقل واضح للملكية دون فترات تعليق أو عدم يقين

#### 7.2 معالجة رسوم المنصة | Platform Fee Treatment

تكييف رسوم المنصة شرعًا كأجر وكالة (Agency Fee)، وليس فائدة (Interest):

- رسوم ثابتة أو نسبة مئوية من قيمة المعاملة
- رسوم معلنة مسبقًا وشفافة تمامًا
- لا ترتبط بمدة الاحتفاظ بالأصول
- مقابل خدمات حقيقية (تسهيل التبادل، الأمان، التوثيق)

### 8. المنتجات والخدمات المتوافقة مع الشريعة | Shariah-Compliant Products & Services

#### 8.1 خدمات التداول الأساسية | Core Trading Services

| Service | Shariah Structure | Compliance Requirements |
|---------|-------------------|-------------------------|
| **شراء USDT (نقاط)** | عقد صرف (Currency Exchange) | - تسليم فوري<br>- سعر سوق عادل<br>- رسوم شفافة |
| **بيع USDT (نقاط)** | عقد صرف (Currency Exchange) | - تسليم فوري<br>- سعر سوق عادل<br>- رسوم شفافة |
| **تحويل USDT (نقاط)** | وكالة (Agency) | - رسوم خدمة محددة<br>- نقل ملكية واضح |
| **حفظ USDT (نقاط)** | وديعة (Safe Custody) | - لا استخدام للأموال<br>- لا فائدة<br>- ضمان الأمان |

#### 8.2 الخدمات المستقبلية المحتملة | Potential Future Services

| Service | Shariah Structure | Key Requirements |
|---------|-------------------|------------------|
| **المرابحة في النقاط** | Murabaha (Cost-Plus Sale) | - شراء حقيقي للأصول<br>- هامش ربح معلوم<br>- ترتيب البيع الصحيح |
| **الوكالة الاستثمارية** | Investment Agency | - استثمار في أنشطة متوافقة<br>- رسوم وكالة محددة<br>- مشاركة في المخاطر |

### 9. عملية التدقيق الشرعي | Shariah Audit Process

#### 9.1 دورة التدقيق | Audit Cycle

```
┌───────────────┐
│ تخطيط التدقيق │
│  Audit Plan   │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  جمع الأدلة   │
│ Evidence      │
│ Collection    │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ تقييم الامتثال│
│ Compliance    │
│ Assessment    │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  تقرير التدقيق│
│ Audit Report  │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  خطة التصحيح  │
│ Remediation   │
│ Plan          │
└───────────────┘
```

#### 9.2 نطاق التدقيق | Audit Scope

- **مراجعة العقود**: جميع عقود المستخدمين والشروط والأحكام
- **تدقيق المنتجات**: جميع المنتجات والخدمات المقدمة
- **مراجعة الإجراءات**: عمليات التداول وإدارة المحافظ
- **تدقيق الإيرادات**: جميع مصادر إيرادات المنصة
- **مراجعة التسويق**: جميع المواد التسويقية والإعلانية

### 10. شهادة التوافق مع الشريعة | Shariah Compliance Certification

#### 10.1 عملية الشهادة | Certification Process

1. **الفحص الأولي**: مراجعة هيكل المنصة ونموذج العمل
2. **مراجعة المستندات**: تدقيق جميع العقود والاتفاقيات
3. **تدقيق العمليات**: فحص تفصيلي لعمليات التداول والتسوية
4. **المراجعة التقنية**: تحليل المكونات التقنية وتدفقات البيانات
5. **إصدار الشهادة**: توثيق الامتثال بشهادة رسمية

#### 10.2 شروط التجديد | Renewal Requirements

- تدقيق شرعي سنوي
- مراجعة مستمرة للمنتجات الجديدة
- تحديثات ربع سنوية للهيئة الشرعية
- تقارير انحرافات فورية

### 11. التحديات الشرعية الخاصة بـ USDT | USDT-Specific Shariah Challenges

#### 11.1 قضايا USDT الشرعية | USDT Shariah Issues

| Issue | Concern | Mitigation |
|-------|---------|------------|
| **الاحتياطي النقدي** | USDT reserves include interest-bearing securities | - Ensure platform activities are Shariah-compliant<br>- Separate the utility of USDT from its backing<br>- Focus on USDT as medium of exchange |
| **ربط بالدولار الأمريكي** | Currency pegging concerns | - Treat as currency exchange<br>- Immediate settlement<br>- No speculation on peg changes |
| **تأجيل التسوية** | Potential for delayed settlement | - Real-time transaction monitoring<br>- Immediate settlement protocol<br>- Contingency for network congestion |

#### 11.2 فتاوى ذات صلة | Relevant Fatawa

- **هيئة المراجعة الشرعية لمصرف البحرين المركزي**: الفتوى رقم 2023/5 بشأن تداول الأصول الرقمية المستقرة
- **مجمع الفقه الإسلامي الدولي**: القرار 2021/3 حول العملات الرقمية المستقرة
- **دار الإفتاء المصرية**: فتوى رقم 2024/18 حول استخدام العملات المستقرة في المعاملات

### 12. آليات تصحيح الانحرافات الشرعية | Shariah Deviation Correction Mechanisms

#### 12.1 أنواع الانحرافات | Types of Deviations

- **انحرافات العقود**: خلل في تطبيق شروط العقود الشرعية
- **انحرافات العمليات**: خلل في تنفيذ العمليات والإجراءات
- **انحرافات الإيرادات**: إيرادات من مصادر غير متوافقة

#### 12.2 إجراءات التصحيح | Remediation Procedures

- **التصحيح الفوري**: تصحيح الخلل فور اكتشافه
- **التنقية**: تنقية أي إيرادات غير متوافقة عبر التبرع للأعمال الخيرية
- **التعويض**: تعويض المتضررين من الانحرافات
- **التوثيق**: توثيق الانحرافات وإجراءات التصحيح
- **تحسين النظام**: تعديل الأنظمة لمنع تكرار الانحرافات

### 13. خطة التطوير الشرعي | Shariah Development Plan

#### 13.1 خارطة طريق التوافق الشرعي | Shariah Compliance Roadmap

| Phase | Timeline | Key Activities |
|-------|----------|----------------|
| **المرحلة 1: التأسيس** | Q4 2025 | - تعيين هيئة الرقابة الشرعية<br>- إعداد السياسات والإجراءات الشرعية<br>- تطوير نماذج العقود المتوافقة |
| **المرحلة 2: التنفيذ** | Q1 2026 | - تطبيق الضوابط الشرعية على المنتجات<br>- تدريب الموظفين على الالتزام الشرعي<br>- إنشاء نظام التدقيق الشرعي |
| **المرحلة 3: التوسع** | Q2 2026 | - توسيع نطاق المنتجات المتوافقة<br>- تعزيز آليات المراقبة الشرعية<br>- الحصول على شهادات الامتثال الإقليمية |
| **المرحلة 4: الريادة** | Q3 2026 | - تطوير معايير شرعية للأصول الرقمية<br>- المشاركة في المبادرات التنظيمية<br>- نشر أبحاث وتقارير في المجال |

### 14. الخلاصة | Conclusion

إطار التوافق مع الشريعة الإسلامية لمنصة نقاطي يوفر هيكلًا شاملًا يضمن امتثال المنصة للمعايير الشرعية المعتمدة. من خلال تبني نموذج مزدوج من الصرف والوكالة، وتطبيق ضوابط صارمة على العمليات والعقود، تهدف المنصة لتقديم حلول مالية رقمية متوافقة مع أحكام الشريعة الإسلامية لعملاء منطقة الشرق الأوسط وشمال إفريقيا.

The Shariah compliance framework for the Niqati platform provides a comprehensive structure ensuring the platform's adherence to established Shariah standards. By adopting a dual model of currency exchange and agency, and applying strict controls on operations and contracts, the platform aims to provide Shariah-compliant digital financial solutions to customers in the MENA region.

---

*تم إعداد هذه الوثيقة بالتشاور مع خبراء في الشريعة والتمويل الإسلامي وتخضع لمراجعة وموافقة هيئة الرقابة الشرعية.*

*This document has been prepared in consultation with Shariah and Islamic finance experts and is subject to review and approval by the Shariah Supervisory Board.*

*Last Updated: September 2025*
