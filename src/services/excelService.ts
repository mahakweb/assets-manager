import * as XLSX from 'xlsx';
import { FullDatabase, ListsData, Organization, Employee, Asset, SystemItem } from '../types';

// Persian headers for Sheet 2: مشخصات سازمان
const ORG_HEADERS_MAP: Record<string, keyof Organization> = {
  'ردیف': 'id',
  'شناسه': 'id',
  'کد': 'id',
  'نام سازمان': 'name',
  'حوزه فعالیت': 'activityField',
  'سطح / رده سازمانی': 'orgLevel',
  'رده سازمانی': 'orgLevel',
  'سطح سازمانی': 'orgLevel',
  'شناسه ملی': 'nationalId',
  'آدرس': 'address',
  'شهر': 'city',
  'استان': 'province',
  'تلفن': 'phone',
  'فکس': 'fax',
  'ایمیل': 'email',
  'وبسایت': 'website',
  'وب سایت': 'website',
  'تعداد کارمندان': 'employeeCount',
  'ip اینترنتی': 'publicIp',
  'آی پی اینترنتی': 'publicIp',
  'IP اینترنتی': 'publicIp',
  'دامنه اصلی': 'mainDomain',
  'توضیحات': 'description'
};

// Persian headers for Sheet 3: لیست کارکنان
const EMP_HEADERS_MAP: Record<string, keyof Employee> = {
  'ردیف': 'id',
  'شناسه': 'id',
  'نام و نام خانوادگی': 'fullName',
  'نام': 'fullName',
  'سمت': 'jobTitle',
  'عنوان شغلی': 'jobTitle',
  'واحد': 'unit',
  'محل کار': 'workplace',
  'کدملی': 'nationalCode',
  'کد ملی': 'nationalCode',
  'موبایل': 'mobile',
  'شماره تماس': 'mobile',
  'تلفن ثابت': 'landline',
  'ایمیل': 'email',
  'تاریخ شروع به کار در این واحد و سمت': 'startDate',
  'تاریخ شروع به کار': 'startDate',
  'سازمان': 'organizationName',
  'نام سازمان': 'organizationName',
  'توضیحات': 'description'
};

// Persian headers for Sheet 4: لیست تجهیزات یا دارایی‌ها
const ASSET_HEADERS_MAP: Record<string, keyof Asset> = {
  'ردیف': 'id',
  'شناسه': 'id',
  'سازمان': 'organizationName',
  'نام سازمان': 'organizationName',
  'نوع دارایی': 'assetType',
  'نوع تجهیز': 'assetType',
  'برند و مدل': 'brandModel',
  'مدل': 'brandModel',
  'کد اموال': 'propertyCode',
  'شماره اموال': 'propertyCode',
  'ip آدرس': 'ipAddress',
  'IP آدرس': 'ipAddress',
  'آدرس IP': 'ipAddress',
  'آدرس مک': 'macAddress',
  'MAC Address': 'macAddress',
  'مک آدرس': 'macAddress',
  'محل جغرافیایی استقرار تجهیزات': 'geoLocation',
  'محل جغرافیایی': 'geoLocation',
  'محل استقرار': 'placementLocation',
  'شهرستان': 'county',
  'سیستم عامل': 'operatingSystem',
  'نسخه Firmware': 'firmwareVersion',
  'نسخه فریمور': 'firmwareVersion',
  'تاریخ خرید': 'purchaseDate',
  'تاریخ پایان گارانتی': 'warrantyEndDate',
  'سطح اهمیت': 'importanceLevel',
  'وضعیت پشتیبانی': 'supportStatus',
  'وضعیت': 'healthStatus',
  'وضعیت سلامت': 'healthStatus',
  'وضعیت ۱': 'healthStatus',
  'توضیحات': 'description'
};

// Persian headers for Sheet 5: سامانه‌ها و سرویس‌ها
const SYSTEM_HEADERS_MAP: Record<string, keyof SystemItem> = {
  'ردیف': 'id',
  'شناسه': 'id',
  'سازمان': 'organizationName',
  'نام سازمان': 'organizationName',
  'نام سامانه': 'systemName',
  'نوع سامانه': 'systemType',
  'تحت اینترنت': 'isInternetFacing',
  'دامنه یا ip': 'domainOrIp',
  'دامنه یا IP': 'domainOrIp',
  'دامنه': 'domainOrIp',
  'ip داخلی': 'internalIp',
  'IP داخلی': 'internalIp',
  'سیستم عامل': 'operatingSystem',
  'نوع دیتابیس': 'databaseType',
  'دیتابیس': 'databaseType',
  'شرکت پیمانکار': 'contractor',
  'پیمانکار': 'contractor',
  'مسئول سامانه': 'systemManager',
  'وضعیت بکاپ': 'backupStatus',
  'بکاپ': 'backupStatus',
  'احرازهویت چندمرحلهای': 'mfaEnabled',
  'احراز هویت دومرحله‌ای': 'mfaEnabled',
  'احراز هویت دو مرحله ای': 'mfaEnabled',
  'MFA': 'mfaEnabled',
  'مانیتورینگ': 'monitoring',
  'وضعیت امنیت': 'securityStatus',
  'تاریخ آخرین تست امنیت': 'lastSecurityTestDate',
  'تاریخ انقضا SSL': 'sslExpiryDate',
  'انقضای SSL': 'sslExpiryDate',
  'توضیحات': 'description'
};

// Helper to normalize keys
const normalizeKey = (key: string): string => {
  return key.trim().replace(/\s+/g, ' ');
};

/**
 * Export full 5 sheets to Excel file
 */
export const exportFullWorkbookToExcel = (db: FullDatabase, filename = 'اطلاعات پایه سازمان.xlsx'): void => {
  const wb = XLSX.utils.book_new();

  // 1. Lists Sheet (Pivot column lists)
  const maxListLen = Math.max(
    db.lists.activityFields.length,
    db.lists.jobTitles.length,
    db.lists.units.length,
    db.lists.workplaces.length,
    db.lists.assetTypes.length,
    db.lists.geoLocations.length,
    db.lists.placementLocations.length,
    db.lists.counties.length,
    db.lists.operatingSystems.length,
    db.lists.systemTypes.length,
    db.lists.yesNo.length,
    db.lists.dbTypes.length,
    db.lists.statuses.length,
    db.lists.statuses1.length
  );

  const listsRows: Record<string, string>[] = [];
  for (let i = 0; i < maxListLen; i++) {
    listsRows.push({
      'حوزه فعالیت': db.lists.activityFields[i] || '',
      'سمت': db.lists.jobTitles[i] || '',
      'واحد': db.lists.units[i] || '',
      'محل کار': db.lists.workplaces[i] || '',
      'نوع دارایی': db.lists.assetTypes[i] || '',
      'محل جغرافیایی استقرار تجهیزات': db.lists.geoLocations[i] || '',
      'محل استقرار': db.lists.placementLocations[i] || '',
      'شهرستان': db.lists.counties[i] || '',
      'سیستم عامل': db.lists.operatingSystems[i] || '',
      'نوع سامانه': db.lists.systemTypes[i] || '',
      'بله/خیر': db.lists.yesNo[i] || '',
      'نوع دیتابیس': db.lists.dbTypes[i] || '',
      'وضعیت': db.lists.statuses[i] || '',
      'وضعیت ۱': db.lists.statuses1[i] || ''
    });
  }
  const listsWs = XLSX.utils.json_to_sheet(listsRows);
  XLSX.utils.book_append_sheet(wb, listsWs, 'لیست‌های پایه');

  // 2. Organizations Sheet
  const orgRows = db.organizations.map((org) => ({
    'ردیف': org.id,
    'نام سازمان': org.name,
    'حوزه فعالیت': org.activityField,
    'سطح / رده سازمانی': org.orgLevel,
    'شناسه ملی': org.nationalId,
    'آدرس': org.address,
    'شهر': org.city,
    'استان': org.province,
    'تلفن': org.phone,
    'فکس': org.fax,
    'ایمیل': org.email,
    'وبسایت': org.website,
    'تعداد کارمندان': org.employeeCount,
    'ip اینترنتی': org.publicIp,
    'دامنه اصلی': org.mainDomain,
    'توضیحات': org.description
  }));
  const orgWs = XLSX.utils.json_to_sheet(orgRows);
  XLSX.utils.book_append_sheet(wb, orgWs, 'مشخصات سازمان');

  // 3. Employees Sheet
  const empRows = db.employees.map((emp) => ({
    'ردیف': emp.id,
    'نام و نام خانوادگی': emp.fullName,
    'سمت': emp.jobTitle,
    'واحد': emp.unit,
    'محل کار': emp.workplace,
    'کدملی': emp.nationalCode,
    'موبایل': emp.mobile,
    'تلفن ثابت': emp.landline,
    'ایمیل': emp.email,
    'تاریخ شروع به کار در این واحد و سمت': emp.startDate,
    'توضیحات': emp.description
  }));
  const empWs = XLSX.utils.json_to_sheet(empRows);
  XLSX.utils.book_append_sheet(wb, empWs, 'لیست کارکنان');

  // 4. Assets Sheet
  const assetRows = db.assets.map((ast) => ({
    'ردیف': ast.id,
    'نوع دارایی': ast.assetType,
    'برند و مدل': ast.brandModel,
    'کد اموال': ast.propertyCode,
    'ip آدرس': ast.ipAddress,
    'آدرس مک': ast.macAddress,
    'محل جغرافیایی استقرار تجهیزات': ast.geoLocation,
    'محل استقرار': ast.placementLocation,
    'شهرستان': ast.county,
    'سیستم عامل': ast.operatingSystem,
    'نسخه Firmware': ast.firmwareVersion,
    'تاریخ خرید': ast.purchaseDate,
    'تاریخ پایان گارانتی': ast.warrantyEndDate,
    'سطح اهمیت': ast.importanceLevel,
    'وضعیت پشتیبانی': ast.supportStatus,
    'وضعیت ۱': ast.healthStatus,
    'توضیحات': ast.description
  }));
  const assetWs = XLSX.utils.json_to_sheet(assetRows);
  XLSX.utils.book_append_sheet(wb, assetWs, 'لیست تجهیزات یا دارایی‌ها');

  // 5. Systems Sheet
  const sysRows = db.systems.map((sys) => ({
    'ردیف': sys.id,
    'نام سامانه': sys.systemName,
    'نوع سامانه': sys.systemType,
    'تحت اینترنت': sys.isInternetFacing,
    'دامنه یا ip': sys.domainOrIp,
    'ip داخلی': sys.internalIp,
    'سیستم عامل': sys.operatingSystem,
    'نوع دیتابیس': sys.databaseType,
    'شرکت پیمانکار': sys.contractor,
    'مسئول سامانه': sys.systemManager,
    'وضعیت بکاپ': sys.backupStatus,
    'احرازهویت چندمرحلهای': sys.mfaEnabled,
    'مانیتورینگ': sys.monitoring,
    'وضعیت امنیت': sys.securityStatus,
    'تاریخ آخرین تست امنیت': sys.lastSecurityTestDate,
    'تاریخ انقضا SSL': sys.sslExpiryDate,
    'توضیحات': sys.description
  }));
  const sysWs = XLSX.utils.json_to_sheet(sysRows);
  XLSX.utils.book_append_sheet(wb, sysWs, 'سامانه‌ها و سرویس‌ها');

  XLSX.writeFile(wb, filename);
};

/**
 * Export single table as Excel
 */
export const exportSingleTableToExcel = (
  sheetName: string,
  rows: Record<string, unknown>[],
  filename: string
): void => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
};

/**
 * Export complete 4-sheet dossier for a single organization
 */
export const exportSingleOrganizationDossier = (
  org: Organization,
  db: FullDatabase,
  filename?: string
): void => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: مشخصات سازمان
  const orgRows = [{
    'ردیف': org.id,
    'نام سازمان': org.name,
    'حوزه فعالیت': org.activityField,
    'سطح / رده سازمانی': org.orgLevel,
    'شناسه ملی': org.nationalId,
    'آدرس': org.address,
    'شهر': org.city,
    'استان': org.province,
    'تلفن': org.phone,
    'فکس': org.fax,
    'ایمیل': org.email,
    'وبسایت': org.website,
    'تعداد کارمندان': org.employeeCount,
    'ip اینترنتی': org.publicIp,
    'دامنه اصلی': org.mainDomain,
    'توضیحات': org.description
  }];
  const orgWs = XLSX.utils.json_to_sheet(orgRows);
  XLSX.utils.book_append_sheet(wb, orgWs, 'مشخصات سازمان');

  // Sheet 2: تجهیزات سازمان
  const orgAssets = db.assets.filter(a => a.organizationId === org.id || a.organizationName === org.name);
  const assetRows = orgAssets.map(ast => ({
    'ردیف': ast.id,
    'نوع دارایی': ast.assetType,
    'برند و مدل': ast.brandModel,
    'کد اموال': ast.propertyCode,
    'ip آدرس': ast.ipAddress,
    'آدرس مک': ast.macAddress,
    'محل استقرار': ast.placementLocation,
    'شهرستان': ast.county,
    'سیستم عامل': ast.operatingSystem,
    'نسخه Firmware': ast.firmwareVersion,
    'تاریخ خرید': ast.purchaseDate,
    'تاریخ پایان گارانتی': ast.warrantyEndDate,
    'سطح اهمیت': ast.importanceLevel,
    'وضعیت پشتیبانی': ast.supportStatus,
    'وضعیت ۱': ast.healthStatus,
    'توضیحات': ast.description
  }));
  const assetWs = XLSX.utils.json_to_sheet(assetRows.length > 0 ? assetRows : [{ 'پیام': 'هیچ تجهیزی برای این سازمان ثبت نشده است' }]);
  XLSX.utils.book_append_sheet(wb, assetWs, 'لیست تجهیزات');

  // Sheet 3: سامانه‌های سازمان
  const orgSystems = db.systems.filter(s => s.organizationId === org.id || s.organizationName === org.name);
  const sysRows = orgSystems.map(sys => ({
    'ردیف': sys.id,
    'نام سامانه': sys.systemName,
    'نوع سامانه': sys.systemType,
    'تحت اینترنت': sys.isInternetFacing,
    'دامنه یا ip': sys.domainOrIp,
    'ip داخلی': sys.internalIp,
    'سیستم عامل': sys.operatingSystem,
    'نوع دیتابیس': sys.databaseType,
    'شرکت پیمانکار': sys.contractor,
    'مسئول سامانه': sys.systemManager,
    'وضعیت بکاپ': sys.backupStatus,
    'احرازهویت چندمرحلهای': sys.mfaEnabled,
    'مانیتورینگ': sys.monitoring,
    'وضعیت امنیت': sys.securityStatus,
    'تاریخ آخرین تست امنیت': sys.lastSecurityTestDate,
    'تاریخ انقضا SSL': sys.sslExpiryDate,
    'توضیحات': sys.description
  }));
  const sysWs = XLSX.utils.json_to_sheet(sysRows.length > 0 ? sysRows : [{ 'پیام': 'هیچ سامانه‌ای برای این سازمان ثبت نشده است' }]);
  XLSX.utils.book_append_sheet(wb, sysWs, 'سامانه‌ها و سرویس‌ها');

  // Sheet 4: کارکنان سازمان
  const orgEmps = db.employees.filter(e => e.organizationId === org.id || e.organizationName === org.name);
  const empRows = orgEmps.map(emp => ({
    'ردیف': emp.id,
    'نام و نام خانوادگی': emp.fullName,
    'سمت': emp.jobTitle,
    'واحد': emp.unit,
    'محل کار': emp.workplace,
    'کدملی': emp.nationalCode,
    'موبایل': emp.mobile,
    'تلفن ثابت': emp.landline,
    'ایمیل': emp.email,
    'تاریخ شروع به کار': emp.startDate,
    'توضیحات': emp.description
  }));
  const empWs = XLSX.utils.json_to_sheet(empRows.length > 0 ? empRows : [{ 'پیام': 'هیچ کارمندی برای این سازمان ثبت نشده است' }]);
  XLSX.utils.book_append_sheet(wb, empWs, 'لیست کارکنان');

  const finalName = filename || `شناسنامه_جامع_${org.name.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(wb, finalName);
};

/**
 * Parse an Excel file and import records
 */
export interface ImportSummary {
  listsCount: number;
  orgsCount: number;
  employeesCount: number;
  assetsCount: number;
  systemsCount: number;
  sheetsFound: string[];
}

export const importWorkbookFromExcel = async (
  file: File,
  currentDb: FullDatabase
): Promise<{ updatedDb: FullDatabase; summary: ImportSummary }> => {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });

  const updatedDb: FullDatabase = JSON.parse(JSON.stringify(currentDb));
  const summary: ImportSummary = {
    listsCount: 0,
    orgsCount: 0,
    employeesCount: 0,
    assetsCount: 0,
    systemsCount: 0,
    sheetsFound: wb.SheetNames
  };

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' });
    if (!rawData || rawData.length === 0) continue;

    const lowerSheet = sheetName.toLowerCase();

    // Check for Lists sheet
    if (sheetName.includes('پایه') || lowerSheet.includes('list')) {
      const newLists: Partial<ListsData> = {
        activityFields: [],
        jobTitles: [],
        units: [],
        workplaces: [],
        assetTypes: [],
        geoLocations: [],
        placementLocations: [],
        counties: [],
        operatingSystems: [],
        systemTypes: [],
        yesNo: [],
        dbTypes: [],
        statuses: [],
        statuses1: []
      };

      for (const row of rawData) {
        for (const [colName, val] of Object.entries(row)) {
          const strVal = String(val || '').trim();
          if (!strVal) continue;
          const cleanCol = normalizeKey(colName);

          if (cleanCol.includes('فعالیت') && !newLists.activityFields?.includes(strVal)) newLists.activityFields?.push(strVal);
          if (cleanCol.includes('سمت') && !newLists.jobTitles?.includes(strVal)) newLists.jobTitles?.push(strVal);
          if (cleanCol.includes('واحد') && !newLists.units?.includes(strVal)) newLists.units?.push(strVal);
          if (cleanCol.includes('محل کار') && !newLists.workplaces?.includes(strVal)) newLists.workplaces?.push(strVal);
          if (cleanCol.includes('نوع دارایی') && !newLists.assetTypes?.includes(strVal)) newLists.assetTypes?.push(strVal);
          if (cleanCol.includes('جغرافیایی') && !newLists.geoLocations?.includes(strVal)) newLists.geoLocations?.push(strVal);
          if (cleanCol.includes('محل استقرار') && !newLists.placementLocations?.includes(strVal)) newLists.placementLocations?.push(strVal);
          if (cleanCol.includes('شهرستان') && !newLists.counties?.includes(strVal)) newLists.counties?.push(strVal);
          if (cleanCol.includes('سیستم عامل') && !newLists.operatingSystems?.includes(strVal)) newLists.operatingSystems?.push(strVal);
          if (cleanCol.includes('نوع سامانه') && !newLists.systemTypes?.includes(strVal)) newLists.systemTypes?.push(strVal);
          if (cleanCol.includes('بله/خیر') && !newLists.yesNo?.includes(strVal)) newLists.yesNo?.push(strVal);
          if (cleanCol.includes('دیتابیس') && !newLists.dbTypes?.includes(strVal)) newLists.dbTypes?.push(strVal);
          if (cleanCol === 'وضعیت' && !newLists.statuses?.includes(strVal)) newLists.statuses?.push(strVal);
          if (cleanCol.includes('وضعیت ۱') && !newLists.statuses1?.includes(strVal)) newLists.statuses1?.push(strVal);
        }
      }

      // Merge non-empty lists
      (Object.keys(newLists) as (keyof ListsData)[]).forEach((key) => {
        if (newLists[key] && newLists[key]!.length > 0) {
          // Combine existing and new unique values
          const set = new Set([...updatedDb.lists[key], ...(newLists[key] || [])]);
          updatedDb.lists[key] = Array.from(set);
          summary.listsCount += newLists[key]!.length;
        }
      });
    }

    // Check for Organizations sheet
    else if (sheetName.includes('سازمان') || lowerSheet.includes('org')) {
      const importedOrgs: Organization[] = [];
      rawData.forEach((row, idx) => {
        const item: Partial<Organization> = { id: idx + 1 };
        for (const [col, val] of Object.entries(row)) {
          const matchKey = Object.keys(ORG_HEADERS_MAP).find((k) =>
            normalizeKey(col).toLowerCase().includes(k.toLowerCase())
          );
          if (matchKey) {
            const field = ORG_HEADERS_MAP[matchKey];
            if (field === 'id') item.id = Number(val) || idx + 1;
            else if (field === 'employeeCount') item.employeeCount = Number(val) || 0;
            else (item as Record<string, unknown>)[field] = String(val || '').trim();
          }
        }
        if (item.name || item.nationalId) {
          importedOrgs.push(item as Organization);
        }
      });

      if (importedOrgs.length > 0) {
        updatedDb.organizations = importedOrgs;
        summary.orgsCount = importedOrgs.length;
      }
    }

    // Check for Employees sheet
    else if (sheetName.includes('کارکنان') || sheetName.includes('پرسنل') || lowerSheet.includes('emp')) {
      const importedEmps: Employee[] = [];
      rawData.forEach((row, idx) => {
        const item: Partial<Employee> = { id: idx + 1 };
        for (const [col, val] of Object.entries(row)) {
          const matchKey = Object.keys(EMP_HEADERS_MAP).find((k) =>
            normalizeKey(col).toLowerCase().includes(k.toLowerCase())
          );
          if (matchKey) {
            const field = EMP_HEADERS_MAP[matchKey];
            if (field === 'id') item.id = Number(val) || idx + 1;
            else (item as Record<string, unknown>)[field] = String(val || '').trim();
          }
        }
        if (item.fullName || item.nationalCode) {
          importedEmps.push(item as Employee);
        }
      });

      if (importedEmps.length > 0) {
        updatedDb.employees = importedEmps;
        summary.employeesCount = importedEmps.length;
      }
    }

    // Check for Assets sheet
    else if (sheetName.includes('تجهیزات') || sheetName.includes('دارایی') || lowerSheet.includes('asset')) {
      const importedAssets: Asset[] = [];
      rawData.forEach((row, idx) => {
        const item: Partial<Asset> = { id: idx + 1 };
        for (const [col, val] of Object.entries(row)) {
          const matchKey = Object.keys(ASSET_HEADERS_MAP).find((k) =>
            normalizeKey(col).toLowerCase().includes(k.toLowerCase())
          );
          if (matchKey) {
            const field = ASSET_HEADERS_MAP[matchKey];
            if (field === 'id') item.id = Number(val) || idx + 1;
            else (item as Record<string, unknown>)[field] = String(val || '').trim();
          }
        }
        if (item.assetType || item.brandModel || item.propertyCode) {
          if (!item.assetType) item.assetType = 'سایر';
          if (!item.healthStatus) item.healthStatus = 'خوب';
          importedAssets.push(item as Asset);
        }
      });

      if (importedAssets.length > 0) {
        updatedDb.assets = importedAssets;
        summary.assetsCount = importedAssets.length;
      }
    }

    // Check for Systems sheet
    else if (sheetName.includes('سامانه') || sheetName.includes('سرویس') || lowerSheet.includes('sys')) {
      const importedSystems: SystemItem[] = [];
      rawData.forEach((row, idx) => {
        const item: Partial<SystemItem> = { id: idx + 1 };
        for (const [col, val] of Object.entries(row)) {
          const matchKey = Object.keys(SYSTEM_HEADERS_MAP).find((k) =>
            normalizeKey(col).toLowerCase().includes(k.toLowerCase())
          );
          if (matchKey) {
            const field = SYSTEM_HEADERS_MAP[matchKey];
            if (field === 'id') item.id = Number(val) || idx + 1;
            else (item as Record<string, unknown>)[field] = String(val || '').trim();
          }
        }
        if (item.systemName) {
          if (!item.systemType) item.systemType = 'سایر';
          if (!item.securityStatus) item.securityStatus = 'متوسط';
          if (!item.isInternetFacing) item.isInternetFacing = 'خیر';
          importedSystems.push(item as SystemItem);
        }
      });

      if (importedSystems.length > 0) {
        updatedDb.systems = importedSystems;
        summary.systemsCount = importedSystems.length;
      }
    }
  }

  return { updatedDb, summary };
};
