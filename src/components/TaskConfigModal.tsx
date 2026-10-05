import React, { useState, useEffect } from 'react';
import {
  TaskItem,
  Language,
  RequiredDocType,
  WORKER_PROFILES,
  MANAGER_PROFILE,
} from '../types';
import { getTranslation } from '../i18n';
import {
  IconCheck,
  IconFileText,
  IconCamera,
  IconPaperclip,
  IconUsers,
  IconAlertCircle,
} from './Icons';

interface TaskConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  stageTitle: string;
  initialTask?: TaskItem | null;
  onSaveTask: (data: {
    title: string;
    description?: string;
    requiredDocs: RequiredDocType[];
    assignedMemberIds: string[];
  }) => void;
  currentLang: Language;
}

export const TaskConfigModal: React.FC<TaskConfigModalProps> = ({
  isOpen,
  onClose,
  stageTitle,
  initialTask,
  onSaveTask,
  currentLang,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredDocs, setRequiredDocs] = useState<RequiredDocType[]>([]);
  const [assignedMembers, setAssignedMembers] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const t = getTranslation(currentLang);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setRequiredDocs(initialTask.requiredDocs || []);
      setAssignedMembers(initialTask.assignedMemberIds || []);
    } else {
      setTitle('');
      setDescription('');
      setRequiredDocs([]);
      setAssignedMembers(['ahmed']); // default worker
    }
    setErrorMessage('');
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const toggleDoc = (docType: RequiredDocType) => {
    setRequiredDocs((prev) =>
      prev.includes(docType)
        ? prev.filter((d) => d !== docType)
        : [...prev, docType]
    );
  };

  const toggleMember = (memberId: string) => {
    setAssignedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setErrorMessage(t.taskTitlePlaceholder);
      return;
    }
    if (assignedMembers.length === 0) {
      setErrorMessage('Assign at least one team member to this task.');
      return;
    }

    onSaveTask({
      title: cleanTitle,
      description: description.trim(),
      requiredDocs,
      assignedMemberIds: assignedMembers,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container task-config-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              {initialTask ? t.editTask : t.createNewTask}
            </h2>
            <span className="modal-subtitle">{stageTitle}</span>
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

        <form onSubmit={handleSubmit} className="task-config-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="task-title-input" className="form-label">
              {t.taskTitle} <span className="text-red-500">*</span>
            </label>
            <input
              id="task-title-input"
              type="text"
              className="form-input"
              placeholder={t.taskTitlePlaceholder}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="task-desc-input" className="form-label">
              {t.taskDescription}
            </label>
            <textarea
              id="task-desc-input"
              className="form-textarea"
              rows={3}
              placeholder={t.taskDescPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Delegation / Assigned Members */}
          <div className="form-group">
            <label className="form-label flex-row items-center gap-1">
              <IconUsers size={16} />
              <span>{t.assignedMembers} <span className="text-red-500">*</span></span>
            </label>
            <div className="checkbox-cards-grid">
              {[MANAGER_PROFILE, ...WORKER_PROFILES].map((profile) => {
                const checked = assignedMembers.includes(profile.id);
                return (
                  <label
                    key={profile.id}
                    className={`checkbox-card ${checked ? 'checkbox-card-active' : ''}`}
                  >
                    <input
                      type="checkbox"
                      className="hidden-checkbox"
                      checked={checked}
                      onChange={() => toggleMember(profile.id)}
                    />
                    <span
                      className="checkbox-custom-indicator"
                      style={{ backgroundColor: checked ? profile.avatarColor : undefined }}
                    >
                      {checked && <IconCheck size={14} className="text-white" />}
                    </span>
                    <div className="checkbox-card-info">
                      <span className="checkbox-card-name">{profile.name}</span>
                      <span className="checkbox-card-role">
                        {profile.role === 'manager' ? t.managerRole : t.workerRole}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Required Documents for Sign-off */}
          <div className="form-group">
            <label className="form-label flex-row items-center gap-1">
              <IconPaperclip size={16} />
              <span>{t.requiredDocsHeading}</span>
            </label>
            <p className="form-help-text">
              Tasks requiring documents cannot be signed off by the Manager until workers upload all selected items.
            </p>

            <div className="checkbox-cards-grid">
              {/* Files */}
              <label
                className={`checkbox-card ${
                  requiredDocs.includes('files') ? 'checkbox-card-active' : ''
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden-checkbox"
                  checked={requiredDocs.includes('files')}
                  onChange={() => toggleDoc('files')}
                />
                <span className="checkbox-custom-indicator">
                  {requiredDocs.includes('files') && <IconCheck size={14} className="text-white" />}
                </span>
                <div className="checkbox-card-info">
                  <div className="flex-row items-center gap-1">
                    <IconFileText size={16} className="text-sky-500" />
                    <span className="checkbox-card-name">Files</span>
                  </div>
                  <span className="checkbox-card-role">PDF, CAD, Drawings, Spec Sheets</span>
                </div>
              </label>

              {/* Photos */}
              <label
                className={`checkbox-card ${
                  requiredDocs.includes('photos') ? 'checkbox-card-active' : ''
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden-checkbox"
                  checked={requiredDocs.includes('photos')}
                  onChange={() => toggleDoc('photos')}
                />
                <span className="checkbox-custom-indicator">
                  {requiredDocs.includes('photos') && <IconCheck size={14} className="text-white" />}
                </span>
                <div className="checkbox-card-info">
                  <div className="flex-row items-center gap-1">
                    <IconCamera size={16} className="text-amber-500" />
                    <span className="checkbox-card-name">Photos</span>
                  </div>
                  <span className="checkbox-card-role">On-site visual photographic proof</span>
                </div>
              </label>

              {/* Logs */}
              <label
                className={`checkbox-card ${
                  requiredDocs.includes('logs') ? 'checkbox-card-active' : ''
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden-checkbox"
                  checked={requiredDocs.includes('logs')}
                  onChange={() => toggleDoc('logs')}
                />
                <span className="checkbox-custom-indicator">
                  {requiredDocs.includes('logs') && <IconCheck size={14} className="text-white" />}
                </span>
                <div className="checkbox-card-info">
                  <div className="flex-row items-center gap-1">
                    <IconFileText size={16} className="text-emerald-500" />
                    <span className="checkbox-card-name">Logs</span>
                  </div>
                  <span className="checkbox-card-role">Daily site / fabrication log notes</span>
                </div>
              </label>
            </div>
          </div>

          {errorMessage && (
            <div className="form-error-msg">
              <IconAlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="modal-actions-bar">
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
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
