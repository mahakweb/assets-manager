import React, { useState, useEffect } from 'react';
import { FullDatabase, Asset, SystemItem, Employee, Organization, ListsData } from './types';
import {
  getStoredDatabase,
  saveDatabase,
  resetDatabaseToDefaults
} from './services/storage';
import { exportFullWorkbookToExcel } from './services/excelService';
import { Header, NavTab, FontOption } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AssetsView } from './components/AssetsView';
import { SystemsView } from './components/SystemsView';
import { EmployeesView } from './components/EmployeesView';
import { OrganizationView } from './components/OrganizationView';
import { ListsManagerView } from './components/ListsManagerView';
import { ReportingView } from './components/ReportingView';
import { ExcelImportModal } from './components/ExcelImportModal';
import { PortableGuideModal } from './components/PortableGuideModal';

export default function App() {
  const [db, setDb] = useState<FullDatabase>(() => getStoredDatabase());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [fontChoice, setFontChoice] = useState<FontOption>(() => {
    return (localStorage.getItem('APP_FONT_PREFERENCE') as FontOption) || 'yekan';
  });

  // Modals
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isPortableGuideOpen, setIsPortableGuideOpen] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync font preference to body class and localStorage
  useEffect(() => {
    try {
      localStorage.setItem('APP_FONT_PREFERENCE', fontChoice);
      document.body.classList.remove('font-yekan', 'font-vazir', 'font-shabnam');
      document.body.classList.add(`font-${fontChoice}`);
    } catch (e) {
      console.error(e);
    }
  }, [fontChoice]);

  // Keep storage updated whenever db changes
  useEffect(() => {
    saveDatabase(db);
  }, [db]);

  // Asset Handlers
  const handleSaveAsset = (asset: Asset) => {
    setDb((prev) => {
      const exists = prev.assets.some((a) => a.id === asset.id);
      const newAssets = exists
        ? prev.assets.map((a) => (a.id === asset.id ? asset : a))
        : [asset, ...prev.assets];
      return { ...prev, assets: newAssets };
    });
    showToast('تجهیز با موفقیت ذخیره شد.');
  };

  const handleDeleteAsset = (id: number) => {
    setDb((prev) => ({
      ...prev,
      assets: prev.assets.filter((a) => a.id !== id)
    }));
    showToast('تجهیز با موفقیت حذف گردید.');
  };

  // System Handlers
  const handleSaveSystem = (system: SystemItem) => {
    setDb((prev) => {
      const exists = prev.systems.some((s) => s.id === system.id);
      const newSystems = exists
        ? prev.systems.map((s) => (s.id === system.id ? system : s))
        : [system, ...prev.systems];
      return { ...prev, systems: newSystems };
    });
    showToast('سامانه با موفقیت ذخیره شد.');
  };

  const handleDeleteSystem = (id: number) => {
    setDb((prev) => ({
      ...prev,
      systems: prev.systems.filter((s) => s.id !== id)
    }));
    showToast('سامانه با موفقیت حذف گردید.');
  };

  // Employee Handlers
  const handleSaveEmployee = (emp: Employee) => {
    setDb((prev) => {
      const exists = prev.employees.some((e) => e.id === emp.id);
      const newEmployees = exists
        ? prev.employees.map((e) => (e.id === emp.id ? emp : e))
        : [emp, ...prev.employees];
      return { ...prev, employees: newEmployees };
    });
    showToast('اطلاعات کارمند با موفقیت ثبت شد.');
  };

  const handleDeleteEmployee = (id: number) => {
    setDb((prev) => ({
      ...prev,
      employees: prev.employees.filter((e) => e.id !== id)
    }));
    showToast('اطلاعات کارمند حذف گردید.');
  };

  // Organization Handlers
  const handleSaveOrganization = (org: Organization) => {
    setDb((prev) => ({
      ...prev,
      organizations: [org]
    }));
    showToast('مشخصات سازمان به‌روزرسانی شد.');
  };

  // Lists Handler
  const handleUpdateLists = (newLists: ListsData) => {
    setDb((prev) => ({
      ...prev,
      lists: newLists
    }));
    showToast('لیست‌های پایه با موفقیت به‌روزرسانی شدند.');
  };

  // Full Export
  const handleExportAll = () => {
    exportFullWorkbookToExcel(db, 'اطلاعات پایه سازمان.xlsx');
    showToast('فایل اکسل جامع ۵ شیت با موفقیت ایجاد و دانلود شد.');
  };

  // Import Success
  const handleImportSuccess = (newDb: FullDatabase) => {
    setDb(newDb);
    showToast('داده‌های فایل اکسل با موفقیت در پایگاه داده اعمال شدند.');
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    const defaults = resetDatabaseToDefaults();
    setDb(defaults);
    showToast('داده‌ها به حالت اولیه بازگردانی شدند.');
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col font-${fontChoice}`}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenImport={() => setIsImportModalOpen(true)}
        onExportAll={handleExportAll}
        onOpenPortableGuide={() => setIsPortableGuideOpen(true)}
        totalAssets={db.assets.length}
        totalSystems={db.systems.length}
        fontChoice={fontChoice}
        onFontChange={setFontChoice}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 no-print">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView db={db} onNavigate={setActiveTab} />
        )}

        {activeTab === 'assets' && (
          <AssetsView
            assets={db.assets}
            lists={db.lists}
            onSaveAsset={handleSaveAsset}
            onDeleteAsset={handleDeleteAsset}
          />
        )}

        {activeTab === 'systems' && (
          <SystemsView
            systems={db.systems}
            lists={db.lists}
            onSaveSystem={handleSaveSystem}
            onDeleteSystem={handleDeleteSystem}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeesView
            employees={db.employees}
            lists={db.lists}
            onSaveEmployee={handleSaveEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
        )}

        {activeTab === 'organization' && (
          <OrganizationView
            organizations={db.organizations}
            lists={db.lists}
            onSaveOrganization={handleSaveOrganization}
            totalAssets={db.assets.length}
            totalSystems={db.systems.length}
          />
        )}

        {activeTab === 'lists' && (
          <ListsManagerView
            lists={db.lists}
            onUpdateLists={handleUpdateLists}
          />
        )}

        {activeTab === 'reporting' && (
          <ReportingView db={db} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            سامانه پرتابل مدیریت دارایی‌ها و سامانه‌های سازمان · نگارش استاندارد بر پایه اکسل
          </span>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>بدون نیاز به Office یا Access</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsPortableGuideOpen(true)}
              className="text-indigo-600 hover:underline"
            >
              راهنمای پکیج به EXE
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        currentDb={db}
        onImportSuccess={handleImportSuccess}
      />

      <PortableGuideModal
        isOpen={isPortableGuideOpen}
        onClose={() => setIsPortableGuideOpen(false)}
        currentDb={db}
        onRestoreDb={(restored) => setDb(restored)}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
