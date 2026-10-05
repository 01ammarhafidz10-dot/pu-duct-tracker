import React, { useState, useEffect } from 'react';
import { UserProfile, Language } from '../types';
import { getTranslation } from '../i18n';
import { IconUser, IconShield, IconCheck } from './Icons';

interface ProfileConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
  onSaveProfileName: (id: string, newName: string) => void;
  onResetProfiles: () => void;
  currentLang: Language;
}

export const ProfileConfigModal: React.FC<ProfileConfigModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onSaveProfileName,
  onResetProfiles,
  currentLang,
}) => {
  const t = getTranslation(currentLang);
  const [namesMap, setNamesMap] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    const initialMap: Record<string, string> = {};
    profiles.forEach((p) => {
      initialMap[p.id] = p.name;
    });
    setNamesMap(initialMap);
    setSuccessMessage(false);
  }, [profiles, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (id: string, value: string) => {
    setNamesMap((prev) => ({ ...prev, [id]: value }));
    setSuccessMessage(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(namesMap).forEach(([id, name]) => {
      if (name.trim()) {
        onSaveProfileName(id, name.trim());
      }
    });
    setSuccessMessage(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleReset = () => {
    if (window.confirm('Reset all profile names to default?')) {
      onResetProfiles();
      onClose();
    }
  };

  const managerProfile = profiles.find((p) => p.role === 'manager');
  const workerProfiles = profiles.filter((p) => p.role === 'worker');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container profile-config-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex-row items-center gap-2">
            <IconUser size={20} className="text-amber-500" />
            <h2 className="modal-title">{t.profileConfig}</h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="modal-subtitle">{t.profileConfigSubtitle}</p>

        <form onSubmit={handleSave} className="profile-config-form">
          {/* Manager Section */}
          <div className="profile-config-section">
            <label className="form-label flex-row items-center gap-2">
              <IconShield size={16} className="text-purple-400" />
              <span>{t.managerNameLabel}</span>
            </label>
            {managerProfile && (
              <input
                type="text"
                className="form-input"
                value={namesMap[managerProfile.id] || ''}
                onChange={(e) => handleNameChange(managerProfile.id, e.target.value)}
                placeholder="Site Manager"
                required
              />
            )}
          </div>

          {/* Workers Section */}
          <div className="profile-config-section mt-3">
            <label className="form-label flex-row items-center gap-2">
              <IconUser size={16} className="text-sky-400" />
              <span>{t.workerNamesLabel}</span>
            </label>
            <div className="worker-inputs-stack">
              {workerProfiles.map((worker) => (
                <div key={worker.id} className="worker-name-input-row">
                  <span
                    className="user-avatar-circle user-avatar-small"
                    style={{ backgroundColor: worker.avatarColor }}
                  >
                    <IconUser size={14} />
                  </span>
                  <input
                    type="text"
                    className="form-input flex-1"
                    value={namesMap[worker.id] || ''}
                    onChange={(e) => handleNameChange(worker.id, e.target.value)}
                    placeholder={worker.id}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {successMessage && (
            <div className="form-success-banner mt-3">
              <IconCheck size={16} />
              <span>Profile names updated successfully!</span>
            </div>
          )}

          {/* Actions */}
          <div className="modal-actions-bar justify-between">
            <button
              type="button"
              className="btn-icon-subtle text-muted text-xs hover:text-red-400"
              onClick={handleReset}
            >
              {t.resetProfiles}
            </button>

            <div className="flex-row gap-2">
              <button
                type="button"
                className="secondary-btn"
                onClick={onClose}
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="primary-btn"
              >
                {t.saveChanges}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
