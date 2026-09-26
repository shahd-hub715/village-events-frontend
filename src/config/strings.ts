
import type { ChangeRequestType } from "../types/changeRequest";
import type { EventType } from "../types/event";

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  WEDDING: "عرس",
  GROOM_PARTY: "سهرة عريس",
  BRIDE_PARTY: "سهرة عروس"
};

export const EVENT_TYPE_OPTIONS = (
  Object.keys(EVENT_TYPE_LABELS) as EventType[]
).map((value) => ({ value, label: EVENT_TYPE_LABELS[value] }));

export const CHANGE_REQUEST_TYPE_LABELS: Record<ChangeRequestType, string> = {
  EDIT: "تعديل",
  DELETE: "حذف"
};

/** Levantine month names, matching how people in the village say dates. */
export const MONTH_NAMES = [
  "كانون الثاني",
  "شباط",
  "آذار",
  "نيسان",
  "أيار",
  "حزيران",
  "تموز",
  "آب",
  "أيلول",
  "تشرين الأول",
  "تشرين الثاني",
  "كانون الأول"
] as const;

export const strings = {
  hero: {
    eyebrow: "لوحة المناسبات المحلية",
    text: "هنا تجد المناسبات القادمة في القرية، من أعراس وسهرات، مرتّبة حسب التاريخ. وإذا كانت لديك مناسبة قريبة، سجّلها ليراها الجميع بعد مراجعتها.",
    primaryCta: "إضافة مناسبة",
    secondaryCta: "تصفّح المناسبات"
  },
  events: {
    heading: "المناسبات القادمة",
    yearFilterLabel: "تصفية حسب السنة",
    monthFilterLabel: "تصفية حسب الشهر",
    allMonths: "كل الأشهر",
    one: "مناسبة واحدة",
    many: (n: number) => `${n} مناسبات`,
    loadingCount: "جارٍ التحميل…",
    unavailableCount: "غير متاح",
    locationPrefix: "المكان:",
    notesLabel: "تفاصيل إضافية",
    searchPlaceholder: "ابحث باسم صاحب المناسبة",
    searchLabel: "بحث في المناسبات",
    searchClear: "مسح البحث"
  },
  loading: {
    label: "جارٍ تحميل المناسبات…"
  },
  error: {
    title: "تعذّر تحميل المناسبات",
    text: "لم نتمكّن من الوصول إلى الخدمة الآن. تحقّق من الاتصال بالإنترنت وحاول مرة أخرى.",
    retry: "إعادة المحاولة",
    generic: "صار خطأ غير متوقّع، حاول مرة أخرى."
  },
  empty: {
    titleYear: (year: number) => `لا توجد مناسبات مسجّلة في ${year}`,
    titleMonth: (monthYear: string) => `لا توجد مناسبات في ${monthYear}`,
    titleSearch: (term: string) => `ما في نتائج لـ "${term}"`,
    searchText: "جرّب اسمًا آخر أو امسح البحث.",
    text: "لم يُسجّل أحد مناسبة لهذه السنة حتى الآن. يمكنك أن تكون الأول.",
    cta: "إضافة مناسبة"
  },
  form: {
    title: "إضافة مناسبة",
    intro:
      "املأ التفاصيل وسيراجعها المسؤول قبل نشرها. رقم الهاتف وحده للتواصل معك ولا يظهر للزوّار.",
    close: "إغلاق النموذج",
    optional: "(اختياري)",
    fields: {
      personName: "اسم صاحب المناسبة",
      eventType: "نوع المناسبة",
      eventDate: "تاريخ المناسبة",
      location: "القاعة / المكان",
      contactPhone: "رقم الهاتف للتواصل",
      notes: "تفاصيل إضافية"
    },
    placeholders: {
      personName: "مثال: محمد أحمد",
      eventType: "اختر نوع المناسبة",
      location: "مثال: قاعة الأفراح",
      contactPhone: "05X-XXXXXXX",
      notes: "مثال: الاستقبال من الساعة السادسة"
    },
    phoneNote: "للمسؤول فقط، لا يُنشر على الموقع.",
    dateTakenHint:
      "يوجد مناسبة مسجّلة بهذا التاريخ. يمكنك المتابعة، وسيراجع المسؤول الطلب.",
    submit: "إرسال للمراجعة",
    submitting: "جارٍ الإرسال…",
    cancel: "إلغاء",
    validation: {
      personName: "اسم صاحب المناسبة مطلوب",
      eventType: "اختر نوع المناسبة",
      eventDate: "تاريخ المناسبة مطلوب",
      pastDate: "لا يمكن اختيار تاريخ في الماضي.",
      contactPhone: "رقم الهاتف مطلوب"
    }
  },
  submission: {
    successTitle: "تم إرسال مناسبتك للمراجعة",
    successText: "سيتم نشرها بعد مراجعتها والموافقة عليها.",
    conflictTitle: "يوجد مناسبة مسجلة بهذا التاريخ",
    conflictText: "يمكنك إرسال مناسبتك رغم ذلك، وسيتم مراجعة الطلب.",
    confirm: "إكمال وإرسال للمراجعة",
    cancel: "إلغاء",
    close: "إغلاق"
  },
  success: {
    title: "تم إرسال المناسبة للمراجعة بنجاح",
    text: "سيراجع المسؤول التفاصيل وتظهر المناسبة في القائمة بعد الموافقة.",
    conflictTitle: "تم إرسال طلبك مع تنبيه",
    dismiss: "إغلاق"
  },
  changeRequest: {
  cta: "طلب تعديل أو حذف مناسبة",
  title: "طلب تعديل أو حذف مناسبة",
  intro: "يصل طلبك إلى المسؤول ليراجعه. لا تتغيّر المناسبة ولا تُحذف تلقائيًا.",
  close: "إغلاق النموذج",
  fields: {
    requestType: "نوع الطلب",
    personName: "اسم صاحب المناسبة",
    eventDate: "تاريخ المناسبة",
    contactPhone: "رقم الهاتف للتواصل",
    requestedChanges: "تفاصيل الطلب"
  },
  placeholders: {
    personName: "كما يظهر في الموقع",
    contactPhone: "05X-XXXXXXX",
    detailsEmpty: "اكتب ما تريد تعديله، أو سبب طلب الحذف",
    details: {
      EDIT: "مثال: تغيير المكان إلى قاعة الأفراح",
      DELETE: "مثال: تم إلغاء المناسبة"
    }
  },
  phoneNote: "للمسؤول فقط، ليتأكد من صاحب الطلب.",
  submit: "إرسال الطلب",
  submitting: "جارٍ الإرسال…",
  cancel: "إلغاء",
  validation: {
    requestType: "اختر نوع الطلب",
    personName: "اسم صاحب المناسبة مطلوب",
    eventDate: "تاريخ المناسبة مطلوب",
    contactPhone: "رقم الهاتف مطلوب",
    requestedChanges: "اكتب تفاصيل الطلب"
  },
  successTitle: "تم إرسال طلبك",
  successText:
    "سيراجع المسؤول الطلب ويتواصل معك إذا احتاج. تبقى المناسبة كما هي حتى ذلك الحين.",
  successClose: "إغلاق"
},
  
  footer: {
    note: "تُنشر المناسبات بعد مراجعتها من المسؤول"
  }
} as const;
