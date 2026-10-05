import React from 'react';
import {
  UserProfile,
  Language,
  MANAGER_PROFILE,
} from '../types';
import { getTranslation } from '../i18n';
import { IconUser, IconShield, IconUsers } from './Icons';

interface RoleSelectionModalProps {
  currentLang: Language;
  profiles: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onSwitchLang: (lang: Language) => void;
}

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  currentLang,
  profiles,
  onSelectUser,
  onSwitchLang,
}) => {
  const t = getTranslation(currentLang);
  const managerProfile = profiles.find((p) => p.role === 'manager') || MANAGER_PROFILE;
  const workerProfiles = profiles.filter((p) => p.role === 'worker');

  return (
    <div className="modal-backdrop">
      <div className="role-modal-container">
        {/* Top bar with language switcher */}
        <div className="role-modal-topbar">
          <div className="lang-switcher-container">
            <button
              type="button"
              className={`lang-btn ${currentLang === 'MY' ? 'lang-btn-active' : ''}`}
              onClick={() => onSwitchLang('MY')}
            >
              MY
            </button>
            <span className="lang-divider">|</span>
            <button
              type="button"
              className={`lang-btn ${currentLang === 'EN' ? 'lang-btn-active' : ''}`}
              onClick={() => onSwitchLang('EN')}
            >
              EN
            </button>
          </div>
        </div>

        {/* Modal Header */}
        <div className="role-modal-header">
          <h2 className="modal-title">{t.roleSelectorTitle}</h2>
          <p className="modal-subtitle">{t.roleSelectorSubtitle}</p>
        </div>

        <div className="role-sections-grid">
          {/* Manager Role Card */}
          <div className="role-card manager-card">
            <div className="role-card-header">
              <div className="role-icon-circle manager-icon-bg">
                <IconShield size={24} />
              </div>
              <div>
                <h3 className="role-name">{managerProfile.name}</h3>
                <span className="role-pill manager-pill">{t.managerRole}</span>
              </div>
            </div>

            <p className="role-explanation">{t.managerDesc}</p>

            <button
              type="button"
              className="primary-btn manager-select-btn"
              onClick={() => onSelectUser(managerProfile)}
            >
              <span>{t.selectProfile} {managerProfile.name}</span>
            </button>
          </div>

          {/* Workers Role Card */}
          <div className="role-card worker-card">
            <div className="role-card-header">
              <div className="role-icon-circle worker-icon-bg">
                <IconUsers size={24} />
              </div>
              <div>
                <h3 className="role-name">{t.workerRole}</h3>
                <span className="role-pill worker-pill">{t.workerRole}</span>
              </div>
            </div>

            <p className="role-explanation">{t.workerDesc}</p>

            <div className="worker-profiles-list">
              {workerProfiles.map((worker) => (
                <button
                  key={worker.id}
                  type="button"
                  className="worker-choice-btn"
                  onClick={() => onSelectUser(worker)}
                >
                  <div className="flex-row items-center gap-2">
                    <span
                      className="user-avatar-circle"
                      style={{ backgroundColor: worker.avatarColor }}
                    >
                      <IconUser size={16} />
                    </span>
                    <span className="worker-name-label">{worker.name}</span>
                  </div>
                  <span className="worker-action-tag">{t.selectProfile}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
