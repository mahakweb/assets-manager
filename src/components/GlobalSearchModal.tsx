import React, { useState, useMemo } from 'react';
import {
  Search,
  Building2,
  HardDrive,
  Layers,
  Users,
  X,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { FullDatabase, Organization, Asset, SystemItem, Employee } from '../types';
import { NavTab } from './Header';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  db: FullDatabase;
  onNavigate: (tab: NavTab, orgId?: number) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  db,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const results = useMemo(() => {
    if (!searchTerm.trim()) {
      return { orgs: [], assets: [], systems: [], employees: [] };
    }
    const q = searchTerm.toLowerCase().trim();

    const orgs = db.organizations.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.activityField.toLowerCase().includes(q) ||
        (o.nationalId && o.nationalId.includes(q)) ||
        (o.mainDomain && o.mainDomain.toLowerCase().includes(q)) ||
        (o.publicIp && o.publicIp.includes(q)) ||
        (o.city && o.city.toLowerCase().includes(q))
    ).slice(0, 5);

    const assets = db.assets.filter(
      (a) =>
        a.brandModel.toLowerCase().includes(q) ||
        a.assetType.toLowerCase().includes(q) ||
        (a.propertyCode && a.propertyCode.toLowerCase().includes(q)) ||
        (a.ipAddress && a.ipAddress.includes(q)) ||
        (a.macAddress && a.macAddress.toLowerCase().includes(q)) ||
        (a.organizationName && a.organizationName.toLowerCase().includes(q))
    ).slice(0, 6);

    const systems = db.systems.filter(
      (s) =>
        s.systemName.toLowerCase().includes(q) ||
        s.systemType.toLowerCase().includes(q) ||
        (s.domainOrIp && s.domainOrIp.toLowerCase().includes(q)) ||
        (s.internalIp && s.internalIp.includes(q)) ||
        (s.contractor && s.contractor.toLowerCase().includes(q)) ||
        (s.organizationName && s.organizationName.toLowerCase().includes(q))
    ).slice(0, 6);

    const employees = db.employees.filter(
      (e) =>
        e.fullName.toLowerCase().includes(q) ||
        (e.nationalCode && e.nationalCode.includes(q)) ||
        (e.mobile && e.mobile.includes(q)) ||
        (e.jobTitle && e.jobTitle.toLowerCase().includes(q)) ||
        (e.unit && e.unit.toLowerCase().includes(q)) ||
        (e.organizationName && e.organizationName.toLowerCase().includes(q))
    ).slice(0, 5);

    return { orgs, assets, systems, employees };
  }, [searchTerm, db]);

  if (!isOpen) return null;

  const totalResults =
    results.orgs.length + results.assets.length + results.systems.length + results.employees.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="جستجوی سراسری در نام سازمان، IP، دامنه، کد اموال، نام سامانه، پرسنل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded border border-slate-200 dark:border-slate-700"
          >
            Esc
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!searchTerm.trim() ? (
            <div className="py-10 text-center text-slate-400 dark:text-slate-500 text-xs">
              عبارت مورد نظر خود را تایپ کنید (مثلاً: «فاوا»، «فایروال»، «192.168»، «اتوماسیون» یا نام کارمند)
            </div>
          ) : totalResults === 0 ? (
            <div className="py-10 text-center text-slate-400 dark:text-slate-500 text-xs">
              هیچ نتیجه‌ای برای عبارت «{searchTerm}» یافت نشد.
            </div>
          ) : (
            <>
              {/* Organizations Matches */}
              {results.orgs.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>سازمان‌ها ({results.orgs.length})</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                    {results.orgs.map((org) => (
                      <div
                        key={org.id}
                        onClick={() => {
                          onNavigate('organizations', org.id);
                          onClose();
                        }}
                        className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 block">
                            {org.name}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            حوزه: {org.activityField} · رده: {org.orgLevel} · دامنه: {org.mainDomain || '---'}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 rotate-180" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assets Matches */}
              {results.assets.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>تجهیزات و دارایی‌ها ({results.assets.length})</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                    {results.assets.map((ast) => (
                      <div
                        key={ast.id}
                        onClick={() => {
                          onNavigate('assets', ast.organizationId);
                          onClose();
                        }}
                        className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors text-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                            {ast.brandModel} ({ast.assetType})
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            سازمان: {ast.organizationName || 'سازمان مرکزی'} · کد اموال: {ast.propertyCode || '---'} · IP: {ast.ipAddress || '---'}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 rotate-180" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Systems Matches */}
              {results.systems.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>سامانه‌ها و سرویس‌ها ({results.systems.length})</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                    {results.systems.map((sys) => (
                      <div
                        key={sys.id}
                        onClick={() => {
                          onNavigate('systems', sys.organizationId);
                          onClose();
                        }}
                        className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors text-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                            {sys.systemName}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            سازمان: {sys.organizationName || 'سازمان مرکزی'} · آدرس: {sys.domainOrIp || sys.internalIp || '---'} · امنیت: {sys.securityStatus}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 rotate-180" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Employees Matches */}
              {results.employees.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>کارکنان و راهبران ({results.employees.length})</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                    {results.employees.map((emp) => (
                      <div
                        key={emp.id}
                        onClick={() => {
                          onNavigate('employees', emp.organizationId);
                          onClose();
                        }}
                        className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors text-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                            {emp.fullName}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            سازمان: {emp.organizationName || 'سازمان مرکزی'} · سمت: {emp.jobTitle} · واحد: {emp.unit} · تماس: {emp.mobile || emp.landline || '---'}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 rotate-180" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
