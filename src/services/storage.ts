import { FullDatabase, ListsData, Organization, Employee, Asset, SystemItem } from '../types';

export const INITIAL_LISTS: ListsData = {
  activityFields: ['سیاسی', 'انرژی', 'درمان', 'مالی', 'آموزشی', 'صنعتی', 'سایر دستگاه‌های خدماتی'],
  jobTitles: [
    'ریاست سازمان',
    'مدیریت حراست',
    'مدیریت فناوری اطلاعات سازمان',
    'کارشناس امنیت سایبری',
    'کارشناس ارشد شبکه و زیرساخت',
    'راهبر پایگاه داده و نرم‌افزار',
    'کارشناس سخت‌افزار و پشتیبانی',
    'مدیریت امور اداری و مالی',
    'کارشناس فناوری اطلاعات',
    'سایر'
  ],
  units: ['ریاست', 'حراست', 'فناوری اطلاعات', 'اداری و مالی', 'بازرسی و نظارت', 'حراست فیزیکی', 'روابط عمومی', 'سایر'],
  workplaces: [
    'اداره کل',
    'شهرستان ۱',
    'شهرستان ۲',
    'شهرستان ۳',
    'شهرستان ۴',
    'شهرستان ۵',
    'شهرستان ۶',
    'شهرستان ۷',
    'شهرستان ۸',
    'شهرستان ۹',
    'شهرستان ۱۰',
    'شهرستان ۱۱'
  ],
  assetTypes: [
    'سرور',
    'فایروال',
    'سوئیچ',
    'روتر',
    'مودم',
    'اکسس‌پوینت',
    'UPS',
    'NAS',
    'SAN Storage',
    'کامپیوتر',
    'لپ تاپ',
    'پرینتر',
    'دوربین',
    'NVR',
    'DVR',
    'تجهیزات VoIP',
    'تجهیزات دیتاسنتر',
    'رک',
    'سیستم مانیتورینگ',
    'تجهیزات امنیتی',
    'WAF',
    'Load Balancer',
    'HSM',
    'سایر'
  ],
  geoLocations: ['ستاد استانی', 'شهرستان های تابعه'],
  placementLocations: ['مرکز داده', 'اتاق سرور', 'واحد IT', 'حراست', 'اتاق مانیتورینگ', 'اتاق مدیریت', 'سایت پشتیبان', 'سایر'],
  counties: [
    'شهرستان ۱',
    'شهرستان ۲',
    'شهرستان ۳',
    'شهرستان ۴',
    'شهرستان ۵',
    'شهرستان ۶',
    'شهرستان ۷',
    'شهرستان ۸',
    'شهرستان ۹',
    'شهرستان ۱۰',
    'شهرستان ۱۱'
  ],
  operatingSystems: [
    'Windows Server',
    'Ubuntu',
    'CentOS',
    'Debian',
    'RedHat',
    'VMware ESXI',
    'MikroTik',
    'Cisco IOS',
    'Linux',
    'FortiOS',
    'ندارد',
    'سایر'
  ],
  systemTypes: [
    'اتوماسیون اداری',
    'وبسایت',
    'پرتال',
    'مالی',
    'منابع انسانی',
    'حضورغیاب',
    'مانیتورینگ',
    'ایمیل',
    'بکاپ',
    'امنیتی',
    'صنعتی',
    'SCADA',
    'دوربین',
    'پیامک',
    'VPN',
    'گزارش گیری',
    'احرازهویت',
    'تحت وب',
    'اپلیکیشن',
    'API',
    'سایر'
  ],
  yesNo: ['بله', 'خیر'],
  dbTypes: ['SQL Server', 'Mysql', 'PostgreSQL', 'Oracle', 'MongoDB', 'SQLite', 'MariaDB', 'Access', 'ندارد', 'سایر'],
  statuses: ['فعال', 'غیرفعال', 'نامشخص'],
  statuses1: ['خوب', 'متوسط', 'ضعیف', 'بحرانی', 'نامشخص']
};

export const INITIAL_ORGANIZATION: Organization[] = [
  {
    id: 1,
    name: 'اداره کل فناوری اطلاعات و ارتباطات استان',
    activityField: 'سایر دستگاه‌های خدماتی',
    orgLevel: 'ستاد استانی (رده ۱)',
    nationalId: '14008273619',
    address: 'خیابان فلسطین، میدان فرهنگ، ساختمان مرکزی سازمان',
    city: 'مرکز استان',
    province: 'استان',
    phone: '۰۲۱-۸۸۴۵۶۷۸۹',
    fax: '۰۲۱-۸۸۴۵۶۷۹۰',
    email: 'info@org.gov.ir',
    website: 'https://org.gov.ir',
    employeeCount: 145,
    publicIp: '185.120.45.10',
    mainDomain: 'org.gov.ir',
    description: 'ستاد مرکزی و هماهنگی زیرساخت‌های فناوری و سامانه‌های استانی'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 1,
    fullName: 'مهندس محمدرضا رضایی',
    jobTitle: 'مدیریت فناوری اطلاعات سازمان',
    unit: 'فناوری اطلاعات',
    workplace: 'اداره کل',
    nationalCode: '0078923412',
    mobile: '09121112233',
    landline: '021-88456711',
    email: 'm.rezaei@org.gov.ir',
    startDate: '1398/04/15',
    description: 'مسئول کلان زیرساخت و فناوری اطلاعات سازمان'
  },
  {
    id: 2,
    fullName: 'مهندس سارا محمدی',
    jobTitle: 'کارشناس امنیت سایبری',
    unit: 'حراست',
    workplace: 'اداره کل',
    nationalCode: '0065412893',
    mobile: '09122223344',
    landline: '021-88456712',
    email: 's.mohammadi@org.gov.ir',
    startDate: '1400/02/01',
    description: 'راهبری فایروال، سیستم‌های SIEM و تست نفوذ'
  },
  {
    id: 3,
    fullName: 'مهندس علی کمالی',
    jobTitle: 'کارشناس ارشد شبکه و زیرساخت',
    unit: 'فناوری اطلاعات',
    workplace: 'اداره کل',
    nationalCode: '0058741239',
    mobile: '09123334455',
    landline: '021-88456714',
    email: 'a.kamali@org.gov.ir',
    startDate: '1399/08/10',
    description: 'نگهداری سوئیچ‌ها، روترها و مجازی‌سازی دیتاسنتر'
  },
  {
    id: 4,
    fullName: 'رضا طاهری',
    jobTitle: 'کارشناس سخت‌افزار و پشتیبانی',
    unit: 'فناوری اطلاعات',
    workplace: 'شهرستان ۱',
    nationalCode: '0041239875',
    mobile: '09124445566',
    landline: '021-88456718',
    email: 'r.taheri@org.gov.ir',
    startDate: '1401/06/20',
    description: 'پشتیبانی سیستم‌های کلاینتی و شبکه شهرستان ۱'
  }
];

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 1,
    assetType: 'سرور',
    brandModel: 'HPE ProLiant DL380 Gen10',
    propertyCode: 'AST-1402-001',
    ipAddress: '192.168.10.15',
    macAddress: 'B4:96:91:2A:4F:10',
    geoLocation: 'ستاد استانی',
    placementLocation: 'مرکز داده',
    county: 'شهرستان ۱',
    operatingSystem: 'VMware ESXI',
    firmwareVersion: 'v7.0 U3',
    purchaseDate: '1400/05/10',
    warrantyEndDate: '1403/05/10',
    importanceLevel: 'حیاتی',
    supportStatus: 'فعال',
    healthStatus: 'خوب',
    description: 'سرور اصلی میزبانی ماشین‌های مجازی اتوماسیون و پرتال'
  },
  {
    id: 2,
    assetType: 'فایروال',
    brandModel: 'Fortinet FortiGate 200F',
    propertyCode: 'AST-1402-002',
    ipAddress: '192.168.10.1',
    macAddress: '70:4C:A5:18:9D:2C',
    geoLocation: 'ستاد استانی',
    placementLocation: 'مرکز داده',
    county: 'شهرستان ۱',
    operatingSystem: 'FortiOS',
    firmwareVersion: 'v7.2.5',
    purchaseDate: '1401/02/15',
    warrantyEndDate: '1404/02/15',
    importanceLevel: 'حیاتی',
    supportStatus: 'فعال',
    healthStatus: 'خوب',
    description: 'فایروال لبه شبکه و کنترل ترافیک اینترنت و DMZ'
  },
  {
    id: 3,
    assetType: 'سوئیچ',
    brandModel: 'Cisco Catalyst 3850-48P-S',
    propertyCode: 'AST-1401-089',
    ipAddress: '192.168.10.2',
    macAddress: '00:2A:6A:11:90:EE',
    geoLocation: 'ستاد استانی',
    placementLocation: 'اتاق سرور',
    county: 'شهرستان ۱',
    operatingSystem: 'Cisco IOS',
    firmwareVersion: '16.12.4',
    purchaseDate: '1399/11/01',
    warrantyEndDate: '1402/11/01',
    importanceLevel: 'مهم',
    supportStatus: 'منقضی',
    healthStatus: 'متوسط',
    description: 'سوئیچ توزیع طبقات و پورت‌های PoE دوربین‌ها'
  },
  {
    id: 4,
    assetType: 'SAN Storage',
    brandModel: 'HPE MSA 2060 SAS Storage',
    propertyCode: 'AST-1402-045',
    ipAddress: '192.168.10.25',
    macAddress: '9C:D1:77:81:4A:BC',
    geoLocation: 'ستاد استانی',
    placementLocation: 'مرکز داده',
    county: 'شهرستان ۱',
    operatingSystem: 'ندارد',
    firmwareVersion: 'IN100P003',
    purchaseDate: '1402/01/20',
    warrantyEndDate: '1405/01/20',
    importanceLevel: 'حیاتی',
    supportStatus: 'فعال',
    healthStatus: 'خوب',
    description: 'فضای ذخیره‌سازی اشتراکی کلاستر مجازی‌سازی و بکاپ'
  },
  {
    id: 5,
    assetType: 'UPS',
    brandModel: 'APC Smart-UPS RT 10000VA On-Line',
    propertyCode: 'AST-1399-014',
    ipAddress: '192.168.10.99',
    macAddress: '00:C0:B7:6E:19:22',
    geoLocation: 'ستاد استانی',
    placementLocation: 'مرکز داده',
    county: 'شهرستان ۱',
    operatingSystem: 'ندارد',
    firmwareVersion: 'v4.2.1',
    purchaseDate: '1399/04/10',
    warrantyEndDate: '1401/04/10',
    importanceLevel: 'حیاتی',
    supportStatus: 'بدون پشتیبانی',
    healthStatus: 'ضعیف',
    description: 'باتری‌ها نیازمند تعویض در سه‌ماهه آینده'
  },
  {
    id: 6,
    assetType: 'روتر',
    brandModel: 'MikroTik CCR1009-7G-1C-1S+',
    propertyCode: 'AST-1400-033',
    ipAddress: '192.168.20.1',
    macAddress: '48:8F:5A:90:33:12',
    geoLocation: 'شهرستان های تابعه',
    placementLocation: 'اتاق سرور',
    county: 'شهرستان ۲',
    operatingSystem: 'MikroTik',
    firmwareVersion: 'RouterOS v7.8',
    purchaseDate: '1400/09/12',
    warrantyEndDate: '1402/09/12',
    importanceLevel: 'مهم',
    supportStatus: 'فعال',
    healthStatus: 'خوب',
    description: 'روتر ارتباطی شبکه اختصاصی بین شهرستان ۲ و ستاد مرکزی'
  }
];

export const INITIAL_SYSTEMS: SystemItem[] = [
  {
    id: 1,
    systemName: 'سامانه یکپارچه اتوماسیون اداری',
    systemType: 'اتوماسیون اداری',
    isInternetFacing: 'بله',
    domainOrIp: 'oa.org.gov.ir',
    internalIp: '192.168.10.50',
    operatingSystem: 'Windows Server',
    databaseType: 'SQL Server',
    contractor: 'شرکت برید خاورمیانه',
    systemManager: 'مهندس محمدرضا رضایی',
    backupStatus: 'بله',
    mfaEnabled: 'بله',
    monitoring: 'بله',
    securityStatus: 'خوب',
    lastSecurityTestDate: '1403/02/10',
    sslExpiryDate: '1404/05/20',
    description: 'گردش مکاتبات اداری، نامه‌های محرمانه و فرآیندهای درون‌سازمانی'
  },
  {
    id: 2,
    systemName: 'پرتال اطلاع‌رسانی و خدمات الکترونیک',
    systemType: 'وبسایت',
    isInternetFacing: 'بله',
    domainOrIp: 'portal.org.gov.ir',
    internalIp: '192.168.10.60',
    operatingSystem: 'Ubuntu',
    databaseType: 'PostgreSQL',
    contractor: 'شرکت داده‌پردازی رایان',
    systemManager: 'مهندس علی کمالی',
    backupStatus: 'بله',
    mfaEnabled: 'خیر',
    monitoring: 'بله',
    securityStatus: 'متوسط',
    lastSecurityTestDate: '1402/10/15',
    sslExpiryDate: '1403/09/01',
    description: 'پرتال اصلی مراجعین، درخواست‌های عمومی و انتشار مناقصات'
  },
  {
    id: 3,
    systemName: 'سامانه حقوق و دستمزد و حسابداری مالی',
    systemType: 'مالی',
    isInternetFacing: 'خیر',
    domainOrIp: '192.168.10.75',
    internalIp: '192.168.10.75',
    operatingSystem: 'Windows Server',
    databaseType: 'SQL Server',
    contractor: 'شرکت همکاران سیستم',
    systemManager: 'مهندس محمدرضا رضایی',
    backupStatus: 'بله',
    mfaEnabled: 'بله',
    monitoring: 'بله',
    securityStatus: 'خوب',
    lastSecurityTestDate: '1403/01/25',
    sslExpiryDate: 'ندارد',
    description: 'کاملاً ایزوله در شبکه داخلی LAN بدون دسترسی اینترنت'
  },
  {
    id: 4,
    systemName: 'سامانه نظارت تصویری و دوربین‌های امنیتی',
    systemType: 'دوربین',
    isInternetFacing: 'خیر',
    domainOrIp: '192.168.30.10',
    internalIp: '192.168.30.10',
    operatingSystem: 'Linux',
    databaseType: 'SQLite',
    contractor: 'شرکت ایمن‌سازان پارس',
    systemManager: 'مهندس سارا محمدی',
    backupStatus: 'خیر',
    mfaEnabled: 'خیر',
    monitoring: 'خیر',
    securityStatus: 'ضعیف',
    lastSecurityTestDate: '1401/11/05',
    sslExpiryDate: 'ندارد',
    description: 'نیاز به فعال‌سازی بکاپ آرشیو و ارتقای فریم‌ور دوربین‌ها'
  },
  {
    id: 5,
    systemName: 'سامانه حضور و غیاب کارکنان و گیت تردد',
    systemType: 'حضورغیاب',
    isInternetFacing: 'خیر',
    domainOrIp: '192.168.10.82',
    internalIp: '192.168.10.82',
    operatingSystem: 'Windows Server',
    databaseType: 'SQL Server',
    contractor: 'شرکت علم و صنعت',
    systemManager: 'مهندس علی کمالی',
    backupStatus: 'بله',
    mfaEnabled: 'خیر',
    monitoring: 'بله',
    securityStatus: 'متوسط',
    lastSecurityTestDate: '1402/08/14',
    sslExpiryDate: 'ندارد',
    description: 'متصل به دستگاه‌های اثر انگشت و چهره‌زنی ورودی'
  }
];

const STORAGE_KEY = 'PORTABLE_ASSET_MGMT_DB_V1';

export const getStoredDatabase = (): FullDatabase => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.lists && parsed.assets && parsed.systems) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading database from storage, falling back to defaults', e);
  }

  const defaultDb: FullDatabase = {
    lists: INITIAL_LISTS,
    organizations: INITIAL_ORGANIZATION,
    employees: INITIAL_EMPLOYEES,
    assets: INITIAL_ASSETS,
    systems: INITIAL_SYSTEMS
  };
  saveDatabase(defaultDb);
  return defaultDb;
};

export const saveDatabase = (db: FullDatabase): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
};

export const resetDatabaseToDefaults = (): FullDatabase => {
  const defaultDb: FullDatabase = {
    lists: INITIAL_LISTS,
    organizations: INITIAL_ORGANIZATION,
    employees: INITIAL_EMPLOYEES,
    assets: INITIAL_ASSETS,
    systems: INITIAL_SYSTEMS
  };
  saveDatabase(defaultDb);
  return defaultDb;
};
