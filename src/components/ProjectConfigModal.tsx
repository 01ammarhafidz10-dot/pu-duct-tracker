import React, { useState } from 'react';
import { Project, Language, UserProfile } from '../types';
import { getTranslation } from '../i18n';
import { IconBuilding, IconTrash, IconPlus, IconAlertCircle } from './Icons';

interface ProjectConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onAddProject: (name: string) => void;
  onDeleteProject: (id: string) => void;
  currentUser: UserProfile | null;
  currentLang: Language;
}

export const ProjectConfigModal: React.FC<ProjectConfigModalProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onAddProject,
  onDeleteProject,
  currentUser,
  currentLang,
}) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const t = getTranslation(currentLang);
  const isManager = currentUser?.role === 'manager';

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newProjectName.trim();
    if (!trimmed) {
      setErrorMsg(t.newProjectPlaceholder);
      return;
    }
    onAddProject(trimmed);
    setNewProjectName('');
    setErrorMsg('');
    onClose();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`${t.deleteProjectConfirm}\n\n"${name}"`)) {
      onDeleteProject(id);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container project-config-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="flex-row items-center gap-2">
            <IconBuilding size={20} className="text-amber-500" />
            <h2 className="modal-title">{t.projectConfigTitle}</h2>
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

        <p className="modal-subtitle">{t.projectListSubtitle}</p>

        {/* Add Project Form (Manager Only) */}
        {isManager ? (
          <form onSubmit={handleCreate} className="project-create-form">
            <div className="input-group">
              <label htmlFor="new-proj-input" className="form-label">
                {t.projectList} - {t.createNewTask.replace('Task', 'Project')}
              </label>
              <div className="flex-row gap-2">
                <input
                  id="new-proj-input"
                  type="text"
                  className="form-input"
                  placeholder={t.newProjectPlaceholder}
                  value={newProjectName}
                  onChange={(e) => {
                    setNewProjectName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  autoFocus
                />
                <button type="submit" className="primary-btn btn-confirm-add">
                  <IconPlus size={16} />
                  <span>{t.confirm}</span>
                </button>
              </div>
              {errorMsg && (
                <div className="form-error-msg">
                  <IconAlertCircle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          </form>
        ) : (
          <div className="info-banner warning-tone">
            <IconAlertCircle size={16} />
            <span>Only managers can create or delete projects.</span>
          </div>
        )}

        {/* Existing Projects List */}
        <div className="projects-table-section">
          <h3 className="section-subheading">{t.projectList} ({projects.length})</h3>

          {projects.length === 0 ? (
            <p className="empty-notice">{t.noTasksDefined}</p>
          ) : (
            <div className="projects-scrollable-list">
              {projects.map((proj) => {
                const isActive = proj.id === activeProjectId;
                const completedTasks = proj.tasks.filter((tk) => tk.signedOff).length;
                return (
                  <div
                    key={proj.id}
                    className={`project-list-row ${isActive ? 'project-row-active' : ''}`}
                  >
                    <div
                      className="project-row-info"
                      onClick={() => {
                        onSelectProject(proj.id);
                        onClose();
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex-row items-center gap-2">
                        <span className="project-item-title">{proj.name}</span>
                        {isActive && (
                          <span className="badge-active-tag">{t.activeProject}</span>
                        )}
                      </div>
                      <div className="project-item-meta">
                        <span>{proj.tasks.length} {t.totalTasks}</span>
                        <span>•</span>
                        <span>{completedTasks} {t.progressDone}</span>
                        <span>•</span>
                        <span>{new Date(proj.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="project-row-actions">
                      <button
                        type="button"
                        className="btn-select-proj"
                        onClick={() => {
                          onSelectProject(proj.id);
                          onClose();
                        }}
                      >
                        {isActive ? t.activeProject : t.switchProject}
                      </button>

                      {isManager && projects.length > 1 && (
                        <button
                          type="button"
                          className="btn-delete-proj"
                          onClick={() => handleDelete(proj.id, proj.name)}
                          title={`${t.delete} ${proj.name}`}
                        >
                          <IconTrash size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
