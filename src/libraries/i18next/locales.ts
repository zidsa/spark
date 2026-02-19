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
        description: 'هذه صفحة مثال توضح نمط الوحدة',
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
        description: 'This is an example page demonstrating the module pattern',
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
