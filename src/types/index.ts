export interface ListsData {
  activityFields: string[];      // حوزه فعالیت
  jobTitles: string[];           // سمت
  units: string[];               // واحد
  workplaces: string[];          // محل کار
  assetTypes: string[];          // نوع دارایی
  geoLocations: string[];        // محل جغرافیایی استقرار تجهیزات
  placementLocations: string[];  // محل استقرار
  counties: string[];            // شهرستان
  operatingSystems: string[];    // سیستم عامل
  systemTypes: string[];         // نوع سامانه
  yesNo: string[];               // بله/خیر
  dbTypes: string[];             // نوع دیتابیس
  statuses: string[];            // وضعیت
  statuses1: string[];           // وضعیت ۱
}

export interface Organization {
  id: number;
  name: string;                  // نام سازمان
  activityField: string;         // حوزه فعالیت
  orgLevel: string;              // سطح / رده سازمانی
  nationalId: string;            // شناسه ملی
  address: string;               // آدرس
  city: string;                  // شهر
  province: string;              // استان
  phone: string;                 // تلفن
  fax: string;                   // فکس
  email: string;                 // ایمیل
  website: string;               // وبسایت
  employeeCount: number;         // تعداد کارمندان
  publicIp: string;              // ip اینترنتی
  mainDomain: string;            // دامنه اصلی
  description: string;           // توضیحات
}

export interface Employee {
  id: number;
  fullName: string;              // نام و نام خانوادگی
  jobTitle: string;              // سمت
  unit: string;                  // واحد
  workplace: string;             // محل کار
  nationalCode: string;          // کدملی
  mobile: string;                // موبایل
  landline: string;              // تلفن ثابت
  email: string;                 // ایمیل
  startDate: string;             // تاریخ شروع به کار در این واحد و سمت
  description: string;           // توضیحات
}

export interface Asset {
  id: number;
  assetType: string;             // نوع دارایی
  brandModel: string;            // برند و مدل
  propertyCode: string;          // کد اموال
  ipAddress: string;             // ip آدرس
  macAddress: string;            // آدرس مک
  geoLocation: string;           // محل جغرافیایی استقرار تجهیزات
  placementLocation: string;     // محل استقرار
  county: string;                // شهرستان
  operatingSystem: string;       // سیستم عامل
  firmwareVersion: string;       // نسخه Firmware
  purchaseDate: string;          // تاریخ خرید
  warrantyEndDate: string;       // تاریخ پایان گارانتی
  importanceLevel: string;       // سطح اهمیت (حیاتی، مهم، عادی)
  supportStatus: string;         // وضعیت پشتیبانی
  healthStatus: string;          // وضعیت سلامت/فنی (وضعیت ۱)
  description: string;           // توضیحات
}

export interface SystemItem {
  id: number;
  systemName: string;            // نام سامانه
  systemType: string;            // نوع سامانه
  isInternetFacing: string;      // تحت اینترنت (بله/خیر)
  domainOrIp: string;            // دامنه یا ip
  internalIp: string;            // ip داخلی
  operatingSystem: string;       // سیستم عامل
  databaseType: string;          // نوع دیتابیس
  contractor: string;            // شرکت پیمانکار
  systemManager: string;         // مسئول سامانه
  backupStatus: string;          // وضعیت بکاپ
  mfaEnabled: string;            // احرازهویت چندمرحلهای
  monitoring: string;            // مانیتورینگ
  securityStatus: string;        // وضعیت امنیت (خوب، متوسط، ضعیف، بحرانی، نامشخص)
  lastSecurityTestDate: string;  // تاریخ آخرین تست امنیت
  sslExpiryDate: string;         // تاریخ انقضا SSL
  description: string;           // توضیحات
}

export interface FullDatabase {
  lists: ListsData;
  organizations: Organization[];
  employees: Employee[];
  assets: Asset[];
  systems: SystemItem[];
}
