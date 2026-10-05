import React, { useState, useRef } from 'react';
import {
  Project,
  ProcessStageDefinition,
  TaskItem,
  TaskAttachment,
  Language,
  UserProfile,
  ALL_PROFILES,
} from '../types';
import { getTranslation } from '../i18n';
import { trackerStore } from '../store';
import { FileViewerModal } from './FileViewerModal';
import {
  IconArrowLeft,
  IconExternalLink,
  IconPlus,
  IconCheck,
  IconCheckCircle,
  IconAlertCircle,
  IconFileText,
  IconCamera,
  IconTrash,
  IconClock,
  IconEdit,
  IconLock,
} from './Icons';

interface ProcessDetailPageProps {
  project: Project;
  stage: ProcessStageDefinition;
  currentUser: UserProfile | null;
  currentLang: Language;
  onBack: () => void;
  onOpenCreateTask: () => void;
  onOpenEditTask: (task: TaskItem) => void;
}

export const ProcessDetailPage: React.FC<ProcessDetailPageProps> = ({
  project,
  stage,
  currentUser,
  currentLang,
  onBack,
  onOpenCreateTask,
  onOpenEditTask,
}) => {
  const t = getTranslation(currentLang);
  const isManager = currentUser?.role === 'manager';

  // Local state for adding logs per task
  const [logInputMap, setLogInputMap] = useState<Record<string, string>>({});
  const [selectedAttachment, setSelectedAttachment] = useState<TaskAttachment | null>(null);

  // File input refs map
  const fileInputRefMap = useRef<Record<string, HTMLInputElement | null>>({});
  const photoInputRefMap = useRef<Record<string, HTMLInputElement | null>>({});

  const stageName = currentLang === 'MY' ? stage.nameMy : stage.nameEn;
  const stageDesc = currentLang === 'MY' ? stage.descMy : stage.descEn;

  // Filter tasks for this process
  const stageTasks = project.tasks.filter((t) => t.processId === stage.id);
  const completedTasks = stageTasks.filter((t) => t.signedOff).length;
  const hasTasks = stageTasks.length > 0;
  const processPercent = hasTasks ? Math.round((completedTasks / stageTasks.length) * 100) : 0;

  // Filter scoped activity logs for this stage
  const activityLogs = trackerStore.getScopedActivityLogs(project.id, stage.id);

  // File upload handler
  const handleFileUpload = (
    taskId: string,
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'file' | 'photo'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      trackerStore.uploadAttachment(project.id, taskId, {
        id: `att-${Date.now()}`,
        name: file.name,
        type,
        sizeBytes: file.size,
        dataUrl,
        uploadedBy: currentUser?.name || 'Worker',
        uploadedAt: new Date().toISOString(),
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Log submit handler
  const handleAddLog = (taskId: string) => {
    const text = logInputMap[taskId]?.trim();
    if (!text) return;
    trackerStore.addLogEntry(project.id, taskId, text);
    setLogInputMap((prev) => ({ ...prev, [taskId]: '' }));
  };

  // Task delete handler
  const handleDeleteTask = (taskId: string, title: string) => {
    if (window.confirm(`${t.deleteTaskConfirm}\n\n"${title}"`)) {
      trackerStore.deleteTask(project.id, taskId);
    }
  };

  // Sign off toggle handler
  const handleToggleSignOff = (task: TaskItem) => {
    if (!isManager) return;
    if (!task.signedOff) {
      const reqStatus = trackerStore.checkRequiredDocsSatisfied(task);
      if (!reqStatus.satisfied) {
        alert(t.signOffBlockedTooltip);
        return;
      }
      trackerStore.signOffTask(project.id, task.id, true);
    } else {
      trackerStore.signOffTask(project.id, task.id, false);
    }
  };

  return (
    <div className="process-detail-page">
      {/* Top Navigation & Context Bar */}
      <div className="detail-top-nav">
        <button
          type="button"
          className="back-btn"
          onClick={onBack}
          title={t.backToFlowchart}
        >
          <IconArrowLeft size={18} />
          <span>{t.backToFlowchart}</span>
        </button>

        <div className="detail-project-tag">
          <span className="text-muted">{t.activeProject}:</span>
          <strong>{project.name}</strong>
        </div>
      </div>

      {/* Process Header Banner */}
      <div className="detail-header-card">
        <div className="detail-header-top">
          <div className="flex-row items-center gap-3">
            <span className="stage-seq-badge stage-seq-large">#{stage.sequence}</span>
            <div>
              <h1 className="detail-stage-title">{stageName}</h1>
              <p className="detail-stage-desc">{stageDesc}</p>
            </div>
          </div>

          <div className="detail-header-meta">
            <span className="role-hint-pill">{stage.defaultRoleHint}</span>
          </div>
        </div>

        {/* Overall Process Progress Track */}
        <div className="detail-progress-container">
          <div className="flex-row justify-between items-center mb-1">
            <span className="font-semibold text-sm">{t.overallProgress}</span>
            <span className="font-bold text-sm">
              {hasTasks
                ? `${processPercent}% (${completedTasks}/${stageTasks.length} ${t.processDoneRatio})`
                : t.noTasksDefined}
            </span>
          </div>
          <div className="progress-bar-track progress-bar-large">
            <div
              className={`progress-bar-fill ${!hasTasks ? 'progress-bar-empty' : ''}`}
              style={{
                width: hasTasks ? `${processPercent}%` : '0%',
                backgroundColor: processPercent === 100 ? '#10b981' : '#0284c7',
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content: Tasks List & Activity Logs */}
      <div className="detail-layout-grid">
        {/* Left / Main Column: Tasks List */}
        <section className="detail-tasks-section">
          <div className="tasks-section-header">
            <div className="flex-row items-center gap-2">
              {/* Small icon on top left above tasks list for Manager to add/configure tasks */}
              {isManager && (
                <button
                  type="button"
                  className="manager-add-task-icon-btn"
                  onClick={onOpenCreateTask}
                  title={t.createNewTask}
                  aria-label={t.createNewTask}
                >
                  <IconPlus size={16} />
                </button>
              )}
              <h2 className="tasks-list-heading">
                {t.tasksHeader} ({stageTasks.length})
              </h2>
            </div>

            {isManager && (
              <button
                type="button"
                className="secondary-btn btn-sm"
                onClick={onOpenCreateTask}
              >
                <IconPlus size={14} />
                <span>{t.createNewTask}</span>
              </button>
            )}
          </div>

          {!hasTasks ? (
            <div className="empty-tasks-card">
              <span className="empty-stage-n-large">N</span>
              <h3>{t.noTasksDefined}</h3>
              <p>
                {isManager
                  ? 'Click the "+" icon above to define requirements and assign members for this stage.'
                  : 'No tasks have been scheduled for this process stage yet.'}
              </p>
              {isManager && (
                <button
                  type="button"
                  className="primary-btn mt-3"
                  onClick={onOpenCreateTask}
                >
                  <IconPlus size={16} />
                  <span>{t.createNewTask}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="tasks-cards-stack">
              {stageTasks.map((task) => {
                const reqStatus = trackerStore.checkRequiredDocsSatisfied(task);
                const taskProgress = trackerStore.getTaskProgress(task);
                const canInteract = trackerStore.canUserInteractWithTask(currentUser, task);

                return (
                  <div
                    key={task.id}
                    className={`task-detail-card ${task.signedOff ? 'task-card-signed' : ''}`}
                  >
                    {/* Task Card Header */}
                    <div className="task-card-header">
                      <div className="flex-1">
                        <div className="flex-row items-center gap-2 flex-wrap">
                          <h3 className="task-title-text">{task.title}</h3>

                          {/* Status Badge */}
                          {task.signedOff ? (
                            <span className="badge-status-pill badge-signed">
                              <IconCheckCircle size={14} />
                              <span>{t.taskStatusSigned}</span>
                            </span>
                          ) : taskProgress === 100 ? (
                            <span className="badge-status-pill badge-ready">
                              <IconClock size={14} />
                              <span>{t.taskStatusReady}</span>
                            </span>
                          ) : (
                            <span className="badge-status-pill badge-pending">
                              <span>{t.taskStatusPending}</span>
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="task-desc-text">{task.description}</p>
                        )}
                      </div>

                      {/* Manager Controls: Edit / Delete */}
                      {isManager && (
                        <div className="task-manager-actions">
                          <button
                            type="button"
                            className="btn-icon-subtle"
                            onClick={() => onOpenEditTask(task)}
                            title={t.editTask}
                          >
                            <IconEdit size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon-subtle text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteTask(task.id, task.title)}
                            title={t.delete}
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar & Required Documents Checklist */}
                    <div className="task-progress-box">
                      <div className="flex-row justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-muted">
                          Task Completion: {taskProgress}%
                        </span>
                        {reqStatus.requiredCount > 0 && (
                          <span className="text-xs font-semibold">
                            {reqStatus.completedCount} / {reqStatus.requiredCount} {t.docsCompletedCount}
                          </span>
                        )}
                      </div>
                      <div className="progress-bar-track progress-bar-slim">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${taskProgress}%`,
                            backgroundColor: task.signedOff ? '#10b981' : '#0284c7',
                          }}
                        />
                      </div>
                    </div>

                    {/* Assigned Members & Requirements Pills */}
                    <div className="task-requirements-row">
                      <div className="flex-row items-center gap-1 flex-wrap">
                        <span className="text-xs font-bold text-muted">{t.assignedTeam}:</span>
                        {task.assignedMemberIds.map((mId) => {
                          const profile = ALL_PROFILES.find((p) => p.id === mId);
                          return (
                            <span
                              key={mId}
                              className="member-tag-pill"
                              style={{ borderLeftColor: profile?.avatarColor || '#64748b' }}
                            >
                              {profile?.name || mId}
                            </span>
                          );
                        })}
                      </div>

                      {/* Required Documents Badges */}
                      <div className="flex-row items-center gap-1 flex-wrap">
                        <span className="text-xs font-bold text-muted">{t.requiredDocsStatus}:</span>
                        {task.requiredDocs.length === 0 ? (
                          <span className="text-xs text-muted italic">{t.noDocsRequired}</span>
                        ) : (
                          task.requiredDocs.map((docType) => {
                            const isDone =
                              docType === 'files'
                                ? reqStatus.hasFiles
                                : docType === 'photos'
                                ? reqStatus.hasPhotos
                                : reqStatus.hasLogs;

                            return (
                              <span
                                key={docType}
                                className={`req-doc-chip ${isDone ? 'req-doc-done' : 'req-doc-pending'}`}
                              >
                                {isDone ? <IconCheck size={12} /> : <IconClock size={12} />}
                                <span className="capitalize">{docType}</span>
                              </span>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Manager Sign-Off Section */}
                    <div className="task-signoff-bar">
                      {isManager ? (
                        <div className="flex-row items-center justify-between w-full">
                          <label
                            className={`signoff-checkbox-label ${
                              !reqStatus.satisfied && !task.signedOff ? 'signoff-disabled' : ''
                            }`}
                            title={
                              !reqStatus.satisfied && !task.signedOff
                                ? t.signOffBlockedTooltip
                                : t.signOffAction
                            }
                          >
                            <input
                              type="checkbox"
                              className="form-checkbox"
                              checked={task.signedOff}
                              disabled={!reqStatus.satisfied && !task.signedOff}
                              onChange={() => handleToggleSignOff(task)}
                            />
                            <span className="font-bold text-sm">
                              {task.signedOff ? t.taskStatusSigned : t.signOffAction}
                            </span>
                          </label>

                          {task.signedOff && task.signedOffBy && (
                            <span className="text-xs text-emerald-700 font-medium">
                              {t.signedOffByPrefix} {task.signedOffBy} (
                              {task.signedOffAt
                                ? new Date(task.signedOffAt).toLocaleDateString()
                                : ''}
                              )
                            </span>
                          )}

                          {!reqStatus.satisfied && !task.signedOff && (
                            <span className="text-xs text-amber-700 flex-row items-center gap-1">
                              <IconAlertCircle size={14} />
                              <span>{t.signOffBlockedTooltip}</span>
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex-row items-center justify-between w-full">
                          <span className="text-xs font-semibold">
                            {task.signedOff ? (
                              <span className="text-emerald-700 flex-row items-center gap-1">
                                <IconCheckCircle size={14} />
                                <span>{t.signedOffByPrefix} {task.signedOffBy}</span>
                              </span>
                            ) : (
                              <span className="text-muted flex-row items-center gap-1">
                                <IconLock size={14} />
                                <span>Awaiting Manager Sign-Off</span>
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Uploaded Attachments (Files & Photos) */}
                    <div className="task-attachments-section">
                      <div className="flex-row justify-between items-center mb-2">
                        <span className="font-semibold text-xs text-muted uppercase tracking-wider">
                          Attachments & Evidence ({task.attachments.length})
                        </span>

                        {/* Upload Controls */}
                        {canInteract ? (
                          <div className="flex-row items-center gap-2">
                            {/* Hidden file input */}
                            <input
                              type="file"
                              className="hidden-file-input"
                              ref={(el) => (fileInputRefMap.current[task.id] = el)}
                              onChange={(e) => handleFileUpload(task.id, e, 'file')}
                            />
                            <button
                              type="button"
                              className="btn-upload-action"
                              onClick={() => fileInputRefMap.current[task.id]?.click()}
                            >
                              <IconFileText size={14} />
                              <span>{t.uploadFileBtn}</span>
                            </button>

                            {/* Hidden photo input */}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden-file-input"
                              ref={(el) => (photoInputRefMap.current[task.id] = el)}
                              onChange={(e) => handleFileUpload(task.id, e, 'photo')}
                            />
                            <button
                              type="button"
                              className="btn-upload-action"
                              onClick={() => photoInputRefMap.current[task.id]?.click()}
                            >
                              <IconCamera size={14} />
                              <span>{t.uploadPhotoBtn}</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted italic flex-row items-center gap-1">
                            <IconLock size={12} />
                            <span>Read-only (Not Assigned)</span>
                          </span>
                        )}
                      </div>

                      {/* Attachments List */}
                      {task.attachments.length === 0 ? (
                        <p className="no-items-text">No files or photos uploaded yet.</p>
                      ) : (
                        <div className="attachments-grid">
                          {task.attachments.map((att) => (
                            <div
                              key={att.id}
                              className="attachment-chip"
                              onClick={() => setSelectedAttachment(att)}
                              title={att.name}
                            >
                              {att.type === 'photo' && att.dataUrl ? (
                                <img
                                  src={att.dataUrl}
                                  alt={att.name}
                                  className="attachment-thumb"
                                />
                              ) : (
                                <div className="attachment-file-icon">
                                  <IconFileText size={16} />
                                </div>
                              )}

                              <div className="attachment-info">
                                <span className="attachment-name" title={att.name}>
                                  {att.name}
                                </span>
                                <span className="attachment-meta">
                                  {att.uploadedBy} • {(att.sizeBytes / 1024).toFixed(0)} KB
                                </span>
                              </div>

                              <div className="attachment-actions" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  className="attachment-open-btn"
                                  onClick={() => setSelectedAttachment(att)}
                                  title={currentLang === 'MY' ? 'Buka fail' : 'Open file'}
                                >
                                  <IconExternalLink size={13} />
                                </button>
                                {(isManager || att.uploadedBy === currentUser?.name) && (
                                  <button
                                    type="button"
                                    className="attachment-delete-btn"
                                    onClick={() => trackerStore.deleteAttachment(project.id, task.id, att.id)}
                                    title="Delete attachment"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Task Logs & Daily Notes */}
                    <div className="task-logs-section">
                      <span className="font-semibold text-xs text-muted uppercase tracking-wider mb-2 block">
                        Inspection & Fabrication Logs ({task.logs.length})
                      </span>

                      {/* Log Input */}
                      {canInteract && (
                        <div className="log-input-row">
                          <input
                            type="text"
                            className="form-input text-sm"
                            placeholder={t.logPlaceholder}
                            value={logInputMap[task.id] || ''}
                            onChange={(e) =>
                              setLogInputMap((prev) => ({
                                ...prev,
                                [task.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddLog(task.id);
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="primary-btn btn-sm"
                            onClick={() => handleAddLog(task.id)}
                          >
                            {t.submitLog}
                          </button>
                        </div>
                      )}

                      {/* Log History Stack */}
                      {task.logs.length > 0 && (
                        <div className="logs-history-stack">
                          {task.logs.map((log) => (
                            <div key={log.id} className="log-entry-row">
                              <span className="log-dot" />
                              <div className="log-content">
                                <p className="log-text">{log.text}</p>
                                <span className="log-meta">
                                  {log.authorName} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(log.timestamp).toLocaleDateString()})
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right Column: Scoped Activity Log Audit Trail */}
        <aside className="detail-activity-aside">
          <div className="activity-aside-header">
            <h3 className="section-subheading flex-row items-center gap-2">
              <IconClock size={16} />
              <span>{t.activityLogTitle}</span>
            </h3>
            <p className="activity-aside-sub">{t.activityLogSubtitle}</p>
          </div>

          <div className="activity-timeline">
            {activityLogs.length === 0 ? (
              <p className="empty-notice">{t.noActivityLogs}</p>
            ) : (
              activityLogs.map((log) => (
                <div key={log.id} className="activity-item">
                  <div className="activity-node" />
                  <div className="activity-details">
                    <p className="activity-desc">
                      {currentLang === 'MY' ? log.descriptionMy : log.descriptionEn}
                    </p>
                    <div className="activity-meta">
                      <span className="activity-author">{log.authorName}</span>
                      <span>•</span>
                      <span>
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        ({new Date(log.timestamp).toLocaleDateString()})
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      {/* File Viewer Modal */}
      <FileViewerModal
        isOpen={Boolean(selectedAttachment)}
        onClose={() => setSelectedAttachment(null)}
        attachment={selectedAttachment}
        currentLang={currentLang}
      />
    </div>
  );
};
