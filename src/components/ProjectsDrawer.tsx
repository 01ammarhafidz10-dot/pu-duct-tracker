import React from 'react';
import { Project, Language, UserProfile } from '../types';
import { getTranslation } from '../i18n';
import { IconBuilding, IconGear, IconPlus } from './Icons';

interface ProjectsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onOpenProjectConfig: () => void;
  currentUser: UserProfile | null;
  currentLang: Language;
}

export const ProjectsDrawer: React.FC<ProjectsDrawerProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onOpenProjectConfig,
  currentUser,
  currentLang,
}) => {
  if (!isOpen) return null;

  const t = getTranslation(currentLang);
  const isManager = currentUser?.role === 'manager';

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="projects-collapsible-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Projects Menu"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="flex-row items-center gap-2">
            <IconBuilding size={20} className="text-amber-500" />
            <h2 className="drawer-title">{t.projectList}</h2>
          </div>

          <div className="flex-row items-center gap-1">
            {/* Gear icon on the side of collapsible list */}
            <button
              type="button"
              className="drawer-gear-btn"
              onClick={() => {
                onClose();
                onOpenProjectConfig();
              }}
              title={t.projectConfigTitle}
            >
              <IconGear size={18} />
            </button>

            <button
              type="button"
              className="drawer-close-btn"
              onClick={onClose}
              aria-label="Close drawer"
            >
              ×
            </button>
          </div>
        </div>

        <p className="drawer-subtitle">{t.projectListSubtitle}</p>

        {/* Projects List */}
        <div className="drawer-projects-list">
          {projects.map((proj) => {
            const isActive = proj.id === activeProjectId;
            const completed = proj.tasks.filter((tk) => tk.signedOff).length;

            return (
              <div
                key={proj.id}
                className={`drawer-project-item ${isActive ? 'drawer-item-active' : ''}`}
                onClick={() => {
                  onSelectProject(proj.id);
                  onClose();
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex-row items-center justify-between">
                  <span className="drawer-project-name">{proj.name}</span>
                  {isActive && (
                    <span className="badge-active-tag">{t.activeProject}</span>
                  )}
                </div>

                <div className="drawer-project-meta">
                  <span>{proj.tasks.length} {t.totalTasks}</span>
                  <span>•</span>
                  <span>{completed} {t.progressDone}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with Manage / Add button for manager */}
        {isManager && (
          <div className="drawer-footer">
            <button
              type="button"
              className="secondary-btn w-full flex-row justify-center items-center gap-2"
              onClick={() => {
                onClose();
                onOpenProjectConfig();
              }}
            >
              <IconPlus size={16} />
              <span>{t.projectConfigTitle}</span>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
