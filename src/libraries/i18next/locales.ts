import type { Resource } from 'i18next';

//
//

export const i18nResources: Resource = {
  'ar-sa': {
    common: {
      actions: {
        getStarted: 'ابدأ الآن',
        switchLanguage: 'English',
      },
      app: {
        description: 'قالب زد لتطبيقات تانستاك ستارت',
        name: 'سبارك',
      },
      navigation: {
        example: 'مثال',
        home: 'الرئيسية',
      },
    },
    pages: {
      example: {
        create: 'إنشاء جديد',
        description: 'هذه صفحة مثال توضح نمط الوحدة',
        errors: {
          load: 'تعذر تحميل العناصر',
        },
        form: {
          description: 'الوصف',
          email: 'البريد الإلكتروني',
          title: 'العنوان',
        },
        items: 'العناصر',
        status_active: 'نشط',
        status_draft: 'مسودة',
        status_inactive: 'غير نشط',
        title: 'صفحة المثال',
      },
      home: {
        subtitle: 'قالب زد لتطبيقات تانستاك ستارت',
        title: 'مرحبًا بك في سبارك',
      },
    },
    validation: {
      email: 'البريد الإلكتروني غير صالح',
      max: 'يجب ألا يتجاوز {{max}} أحرف',
      min: 'يجب أن يكون على الأقل {{min}} أحرف',
      required: 'هذا الحقل مطلوب',
    },
  },
  'en-sa': {
    common: {
      actions: {
        getStarted: 'Get Started',
        switchLanguage: 'العربية',
      },
      app: {
        description: 'Zid TanStack Start Boilerplate',
        name: 'Spark',
      },
      navigation: {
        example: 'Example',
        home: 'Home',
      },
    },
    pages: {
      example: {
        create: 'Create New',
        description: 'This is an example page demonstrating the module pattern',
        errors: {
          load: 'Failed to load items',
        },
        form: {
          description: 'Description',
          email: 'Email',
          title: 'Title',
        },
        items: 'Items',
        status_active: 'active',
        status_draft: 'draft',
        status_inactive: 'inactive',
        title: 'Example Page',
      },
      home: {
        subtitle: 'Zid TanStack Start Boilerplate',
        title: 'Welcome to Spark',
      },
    },
    validation: {
      email: 'Invalid email address',
      max: 'Must not exceed {{max}} characters',
      min: 'Must be at least {{min}} characters',
      required: 'This field is required',
    },
  },
};
