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
import { GlobalSearchModal } from './components/GlobalSearchModal';

export default function App() {
  const [db, setDb] = useState<FullDatabase>(() => getStoredDatabase());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedOrgId, setSelectedOrgId] = useState<number | 'all'>('all');
  const [fontChoice, setFontChoice] = useState<FontOption>(() => {
    return (localStorage.getItem('APP_FONT_PREFERENCE') as FontOption) || 'yekan';
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('APP_THEME_DARK') === 'true';
  });

  // Modals
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isPortableGuideOpen, setIsPortableGuideOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync dark mode class and preference
  useEffect(() => {
    try {
      localStorage.setItem('APP_THEME_DARK', String(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

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

  // Global keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    setDb((prev) => {
      const exists = prev.organizations.some((o) => o.id === org.id);
      const newOrgs = exists
        ? prev.organizations.map((o) => (o.id === org.id ? org : o))
        : [...prev.organizations, org];
      return { ...prev, organizations: newOrgs };
    });
    showToast('مشخصات سازمان با موفقیت ثبت شد.');
  };

  const handleDeleteOrganization = (id: number) => {
    setDb((prev) => ({
      ...prev,
      organizations: prev.organizations.filter((o) => o.id !== id)
    }));
    if (selectedOrgId === id) {
      setSelectedOrgId('all');
    }
    showToast('سازمان مورد نظر حذف گردید.');
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
    setSelectedOrgId('all');
    showToast('داده‌ها به حالت اولیه بازگردانی شدند.');
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-${fontChoice} transition-colors duration-200`}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        organizations={db.organizations}
        selectedOrgId={selectedOrgId}
        onSelectOrg={setSelectedOrgId}
        onOpenImport={() => setIsImportModalOpen(true)}
        onExportAll={handleExportAll}
        onOpenPortableGuide={() => setIsPortableGuideOpen(true)}
        onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
        totalAssets={db.assets.length}
        totalSystems={db.systems.length}
        fontChoice={fontChoice}
        onFontChange={setFontChoice}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 no-print border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            db={db}
            onNavigate={(tab, orgId) => {
              if (orgId !== undefined) setSelectedOrgId(orgId);
              setActiveTab(tab);
            }}
            selectedOrgId={selectedOrgId}
            onSelectOrg={setSelectedOrgId}
          />
        )}

        {activeTab === 'organizations' && (
          <OrganizationView
            db={db}
            onSaveOrganization={handleSaveOrganization}
            onDeleteOrganization={handleDeleteOrganization}
            selectedOrgId={selectedOrgId}
            onSelectOrg={setSelectedOrgId}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'assets' && (
          <AssetsView
            assets={db.assets}
            lists={db.lists}
            organizations={db.organizations}
            selectedOrgId={selectedOrgId}
            onSaveAsset={handleSaveAsset}
            onDeleteAsset={handleDeleteAsset}
          />
        )}

        {activeTab === 'systems' && (
          <SystemsView
            systems={db.systems}
            lists={db.lists}
            organizations={db.organizations}
            selectedOrgId={selectedOrgId}
            onSaveSystem={handleSaveSystem}
            onDeleteSystem={handleDeleteSystem}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeesView
            employees={db.employees}
            lists={db.lists}
            organizations={db.organizations}
            selectedOrgId={selectedOrgId}
            onSaveEmployee={handleSaveEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
        )}

        {activeTab === 'lists' && (
          <ListsManagerView
            lists={db.lists}
            onUpdateLists={handleUpdateLists}
          />
        )}

        {activeTab === 'reporting' && (
          <ReportingView
            db={db}
            selectedOrgId={selectedOrgId}
            onSelectOrg={setSelectedOrgId}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500 dark:text-slate-400 no-print transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            سامانه جامع مدیریت دارایی‌ها، تجهیزات و سامانه‌های سازمان‌ها ({db.organizations.length} سازمان تحت پوشش)
          </span>
          <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
            <span>۱۰۰٪ پرتابل و بدون نیاز به Office یا Access</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsGlobalSearchOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              جستجوی سراسری (Ctrl+K)
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsPortableGuideOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              راهنمای پکیج به EXE
            </button>
          </div>
        </div>
      </footer>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        db={db}
        onNavigate={(tab, orgId) => {
          if (orgId !== undefined) {
            setSelectedOrgId(orgId);
          }
          setActiveTab(tab);
        }}
      />

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
