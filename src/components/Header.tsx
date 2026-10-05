import React, { useState, useRef, useEffect } from 'react';
import { Language, UserProfile, ThemeMode } from '../types';
import { getTranslation } from '../i18n';
import {
  IconGear,
  IconBuilding,
  IconChevronDown,
  IconLogOut,
  IconUser,
  IconSun,
  IconMoon,
} from './Icons';

interface HeaderProps {
  onToggleProjectsDrawer: () => void;
  onOpenProjectConfig: () => void;
  onOpenProfileConfig: () => void;
  onLogout: () => void;
  activeProjectName: string;
  currentUser: UserProfile | null;
  currentLang: Language;
  onSwitchLang: (lang: Language) => void;
  currentTheme: ThemeMode;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleProjectsDrawer,
  onOpenProjectConfig,
  onOpenProfileConfig,
  onLogout,
  activeProjectName,
  currentUser,
  currentLang,
  onSwitchLang,
  currentTheme,
  onToggleTheme,
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(currentLang);

  // Close settings dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      {/* Left: Collapsible Projects Selector & Config Button */}
      <div className="header-left">
        <button
          type="button"
          className="project-selector-btn"
          onClick={onToggleProjectsDrawer}
          title={t.projectList}
        >
          <IconBuilding size={18} className="text-amber-500" />
          <span className="project-name-truncate">{activeProjectName || t.projectList}</span>
          <IconChevronDown size={14} />
        </button>

        <button
          type="button"
          className="header-icon-btn"
          onClick={onOpenProjectConfig}
          title={t.projectConfigTitle}
        >
          <IconGear size={17} />
        </button>
      </div>

      {/* Middle: App Title */}
      <div className="header-middle">
        <h1 className="header-app-title">{t.appTitle}</h1>
        <span className="header-app-subtitle">{t.appSubtitle}</span>
      </div>

      {/* Right: Language Changer (MY|EN) & Settings (Gear) with Logout */}
      <div className="header-right">
        {/* Active User Badge */}
        {currentUser && (
          <div className="current-user-badge">
            <span
              className="user-avatar-dot"
              style={{ backgroundColor: currentUser.avatarColor }}
            />
            <span className="user-name-text">
              {currentUser.name}
            </span>
          </div>
        )}

        {/* Language Changer (MY|EN) */}
        <div className="lang-switcher-container" role="group" aria-label="Language selection">
          <button
            type="button"
            className={`lang-btn ${currentLang === 'MY' ? 'lang-btn-active' : ''}`}
            onClick={() => onSwitchLang('MY')}
            title="Bahasa Melayu"
          >
            MY
          </button>
          <span className="lang-divider">|</span>
          <button
            type="button"
            className={`lang-btn ${currentLang === 'EN' ? 'lang-btn-active' : ''}`}
            onClick={() => onSwitchLang('EN')}
            title="English"
          >
            EN
          </button>
        </div>

        {/* Theme Mode Toggle (Light / Dark) */}
        <button
          type="button"
          className="header-icon-btn theme-toggle-btn"
          onClick={onToggleTheme}
          title={currentTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          aria-label="Toggle Theme"
        >
          {currentTheme === 'light' ? <IconMoon size={17} /> : <IconSun size={17} />}
        </button>

        {/* Settings Menu with Gear Icon */}
        <div className="settings-dropdown-wrapper" ref={settingsRef}>
          <button
            type="button"
            className="settings-trigger-btn"
            onClick={() => setSettingsOpen((prev) => !prev)}
            title={t.settings}
            aria-expanded={settingsOpen}
          >
            <IconGear size={19} />
          </button>

          {settingsOpen && (
            <div className="settings-menu-popover">
              <div className="settings-menu-header">
                <div className="flex-row items-center gap-2">
                  <IconUser size={16} />
                  <strong>{currentUser?.name || 'User'}</strong>
                </div>
                <span className="badge-role">
                  {currentUser?.role === 'manager' ? t.managerRole : t.workerRole}
                </span>
              </div>

              <div className="settings-menu-divider" />

              {/* Profile Name Configuration Option */}
              <button
                type="button"
                className="settings-action-btn"
                onClick={() => {
                  setSettingsOpen(false);
                  onOpenProfileConfig();
                }}
              >
                <IconUser size={16} />
                <span>{t.profileConfig}</span>
              </button>

              <div className="settings-menu-divider" />

              <button
                type="button"
                className="logout-action-btn"
                onClick={() => {
                  setSettingsOpen(false);
                  onLogout();
                }}
              >
                <IconLogOut size={16} />
                <span>{t.logout}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
