import React from 'react';
import {
  ProcessStageDefinition,
  Language,
  TaskItem,
  ALL_PROFILES,
} from '../types';
import { getTranslation } from '../i18n';
import { trackerStore } from '../store';
import {
  IconCheckCircle,
  IconClock,
  IconPaperclip,
} from './Icons';

interface ProcessPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: ProcessStageDefinition | null;
  tasks: TaskItem[];
  onOpenDetailPage: (stageId: string) => void;
  currentLang: Language;
}

export const ProcessPreviewModal: React.FC<ProcessPreviewModalProps> = ({
  isOpen,
  onClose,
  stage,
  tasks,
  onOpenDetailPage,
  currentLang,
}) => {
  if (!isOpen || !stage) return null;

  const t = getTranslation(currentLang);
  const stageName = currentLang === 'MY' ? stage.nameMy : stage.nameEn;
  const stageDesc = currentLang === 'MY' ? stage.descMy : stage.descEn;

  const completedCount = tasks.filter((tk) => tk.signedOff).length;
  const hasTasks = tasks.length > 0;
  const stagePercent = hasTasks ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container process-preview-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="flex-row items-center gap-2">
              <span className="stage-seq-badge">#{stage.sequence}</span>
              <h2 className="modal-title">{stageName}</h2>
            </div>
            <span className="role-hint-tag">{stage.defaultRoleHint}</span>
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

        <p className="stage-description-text">{stageDesc}</p>

        {/* Progress Summary Card */}
        <div className="preview-progress-summary">
          <div className="flex-row justify-between items-center mb-1">
            <span className="font-semibold text-sm">{t.overallProgress}</span>
            <span className="font-bold text-sm">
              {hasTasks ? `${stagePercent}% (${completedCount}/${tasks.length} ${t.progressDone})` : t.noTasksDefined}
            </span>
          </div>
          <div className="progress-bar-track">
            <div
              className={`progress-bar-fill ${!hasTasks ? 'progress-bar-empty' : ''}`}
              style={{ width: hasTasks ? `${stagePercent}%` : '0%' }}
            />
          </div>
        </div>

        {/* Tasks Overview List */}
        <div className="preview-tasks-section">
          <h3 className="section-subheading">
            {t.tasksHeader} ({tasks.length})
          </h3>

          {!hasTasks ? (
            <div className="empty-preview-state">
              <span className="empty-stage-n-large">N</span>
              <p>{t.noTasksDefined}</p>
            </div>
          ) : (
            <div className="preview-tasks-list">
              {tasks.map((task) => {
                const docStatus = trackerStore.checkRequiredDocsSatisfied(task);
                const taskPercent = trackerStore.getTaskProgress(task);

                return (
                  <div key={task.id} className="preview-task-item">
                    <div className="flex-row justify-between items-start gap-2">
                      <span className="preview-task-title">{task.title}</span>
                      {task.signedOff ? (
                        <span className="badge-status-pill badge-signed">
                          <IconCheckCircle size={13} />
                          <span>{t.taskStatusSigned}</span>
                        </span>
                      ) : taskPercent === 100 ? (
                        <span className="badge-status-pill badge-ready">
                          <IconClock size={13} />
                          <span>{t.taskStatusReady}</span>
                        </span>
                      ) : (
                        <span className="badge-status-pill badge-pending">
                          <span>{t.taskStatusPending}</span>
                        </span>
                      )}
                    </div>

                    {/* Task Progress Bar */}
                    <div className="task-progress-row">
                      <div className="progress-bar-track progress-bar-slim">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${taskPercent}%`,
                            backgroundColor: task.signedOff ? '#10b981' : '#0284c7',
                          }}
                        />
                      </div>
                      <span className="task-percent-text">{taskPercent}%</span>
                    </div>

                    {/* Meta Row: Assigned Members and n of m documents (if defined) */}
                    <div className="preview-task-meta-row">
                      {/* Assigned Members */}
                      <div className="assigned-avatars-group">
                        {task.assignedMemberIds.map((memberId) => {
                          const profile = ALL_PROFILES.find((p) => p.id === memberId);
                          return (
                            <span
                              key={memberId}
                              className="member-tag-pill"
                              style={{ borderLeftColor: profile?.avatarColor || '#64748b' }}
                            >
                              {profile?.name || memberId}
                            </span>
                          );
                        })}
                      </div>

                      {/* Document Count: ONLY show if required document tasks are defined */}
                      {docStatus.requiredCount > 0 && (
                        <div className="doc-count-indicator">
                          <IconPaperclip size={13} />
                          <span>
                            {docStatus.completedCount} / {docStatus.requiredCount} {t.docsCompletedCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-actions-bar">
          <button
            type="button"
            className="secondary-btn"
            onClick={onClose}
          >
            {t.cancel}
          </button>
          <button
            type="button"
            className="primary-btn btn-open-full"
            onClick={() => {
              onClose();
              onOpenDetailPage(stage.id);
            }}
          >
            <span>{t.openFullDetails}</span>
            <span className="ml-1">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
