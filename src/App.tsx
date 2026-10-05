import { useState, useEffect } from 'react';
import {
  ProcessStageId,
  ProcessStageDefinition,
  PROCESS_STAGES,
  TaskItem,
  UserProfile,
  Language,
  RequiredDocType,
} from './types';
import { trackerStore } from './store';
import { getTranslation } from './i18n';
import { Header } from './components/Header';
import { RoleSelectionModal } from './components/RoleSelectionModal';
import { ProjectsDrawer } from './components/ProjectsDrawer';
import { ProjectConfigModal } from './components/ProjectConfigModal';
import { ProcessFlowChart } from './components/ProcessFlowChart';
import { ProcessPreviewModal } from './components/ProcessPreviewModal';
import { ProcessDetailPage } from './components/ProcessDetailPage';
import { TaskConfigModal } from './components/TaskConfigModal';
import { ProfileConfigModal } from './components/ProfileConfigModal';

export default function App() {
  // Sync state from trackerStore
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = trackerStore.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  const projects = trackerStore.getProjects();
  const activeProject = trackerStore.getActiveProject();
  const currentUser = trackerStore.getCurrentUser();
  const currentLang = trackerStore.getCurrentLanguage();
  const profiles = trackerStore.getProfiles();
  const t = getTranslation(currentLang);

  // View state: detail page vs dashboard
  const [activeStageId, setActiveStageId] = useState<ProcessStageId | null>(null);

  // Modal states
  const [previewStage, setPreviewStage] = useState<ProcessStageDefinition | null>(null);
  const [projectsDrawerOpen, setProjectsDrawerOpen] = useState(false);
  const [projectConfigOpen, setProjectConfigOpen] = useState(false);
  const [profileConfigOpen, setProfileConfigOpen] = useState(false);

  // Task config modal state
  const [taskModalState, setTaskModalState] = useState<{
    isOpen: boolean;
    stageId: ProcessStageId;
    stageTitle: string;
    taskToEdit: TaskItem | null;
  }>({
    isOpen: false,
    stageId: 'received_la',
    stageTitle: '',
    taskToEdit: null,
  });

  const currentTheme = trackerStore.getCurrentTheme();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const handleToggleTheme = () => {
    trackerStore.toggleTheme();
  };

  const handleSelectUser = (user: UserProfile) => {
    trackerStore.setCurrentUser(user);
  };

  const handleLogout = () => {
    trackerStore.setCurrentUser(null);
    setActiveStageId(null);
    setPreviewStage(null);
  };

  const handleSwitchLang = (lang: Language) => {
    trackerStore.setCurrentLanguage(lang);
  };

  const handleAddProject = (name: string) => {
    trackerStore.addProject(name);
  };

  const handleDeleteProject = (id: string) => {
    trackerStore.deleteProject(id);
  };

  const handleOpenCreateTask = (stageId: ProcessStageId, stageTitle: string) => {
    setTaskModalState({
      isOpen: true,
      stageId,
      stageTitle,
      taskToEdit: null,
    });
  };

  const handleOpenEditTask = (task: TaskItem, stageTitle: string) => {
    setTaskModalState({
      isOpen: true,
      stageId: task.processId,
      stageTitle,
      taskToEdit: task,
    });
  };

  const handleSaveTask = (data: {
    title: string;
    description?: string;
    requiredDocs: RequiredDocType[];
    assignedMemberIds: string[];
  }) => {
    if (!activeProject) return;

    if (taskModalState.taskToEdit) {
      trackerStore.updateTask(activeProject.id, taskModalState.taskToEdit.id, data);
    } else {
      trackerStore.addTask(activeProject.id, taskModalState.stageId, data);
    }
  };

  // If no user is logged in, show the role selection screen
  if (!currentUser) {
    return (
      <div className="app-root-shell">
        <RoleSelectionModal
          currentLang={currentLang}
          profiles={profiles}
          onSelectUser={handleSelectUser}
          onSwitchLang={handleSwitchLang}
        />
      </div>
    );
  }

  // Active stage object if viewing detail page
  const currentActiveStage = activeStageId
    ? PROCESS_STAGES.find((s) => s.id === activeStageId)
    : null;

  // Active project calculation
  const totalProjectTasks = activeProject?.tasks.length || 0;
  const completedProjectTasks = activeProject?.tasks.filter((t) => t.signedOff).length || 0;
  const overallProjectPercent =
    totalProjectTasks > 0 ? Math.round((completedProjectTasks / totalProjectTasks) * 100) : 0;
  const projectKPIs = activeProject ? trackerStore.getProjectKPIs(activeProject.id) : null;

  return (
    <div className="app-root-shell">
      {/* Top Header */}
      <Header
        onToggleProjectsDrawer={() => setProjectsDrawerOpen((prev) => !prev)}
        onOpenProjectConfig={() => setProjectConfigOpen(true)}
        onOpenProfileConfig={() => setProfileConfigOpen(true)}
        onLogout={handleLogout}
        activeProjectName={activeProject?.name || ''}
        currentUser={currentUser}
        currentLang={currentLang}
        onSwitchLang={handleSwitchLang}
        currentTheme={currentTheme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="main-content-area">
        {activeStageId && currentActiveStage && activeProject ? (
          /* Process Detail Page */
          <ProcessDetailPage
            project={activeProject}
            stage={currentActiveStage}
            currentUser={currentUser}
            currentLang={currentLang}
            onBack={() => setActiveStageId(null)}
            onOpenCreateTask={() =>
              handleOpenCreateTask(
                currentActiveStage.id,
                currentLang === 'MY' ? currentActiveStage.nameMy : currentActiveStage.nameEn
              )
            }
            onOpenEditTask={(task) =>
              handleOpenEditTask(
                task,
                currentLang === 'MY' ? currentActiveStage.nameMy : currentActiveStage.nameEn
              )
            }
          />
        ) : (
          /* Main Dashboard: 4-Phase Swimlane & Executive Overview */
          <div className="dashboard-flow-view">
            {/* Executive KPI Bar */}
            {activeProject && (
              <div className="project-banner-card">
                <div className="banner-header-row">
                  <div>
                    <span className="banner-sub-tag">{t.activeProject}</span>
                    <h2 className="banner-project-title">{activeProject.name}</h2>
                  </div>
                  <div className="banner-project-id-badge">
                    <span>ID: {activeProject.id.toUpperCase()}</span>
                  </div>
                </div>

                {/* 4-Tile Executive KPI Grid */}
                <div className="executive-kpi-grid">
                  <div className="kpi-metric-card">
                    <span className="kpi-card-label">{currentLang === 'MY' ? 'Kemajuan Keseluruhan' : 'Overall Completion'}</span>
                    <span className="kpi-card-value text-accent-emerald">{overallProjectPercent}%</span>
                    <div className="kpi-progress-bar">
                      <div
                        className="kpi-progress-fill glow-emerald"
                        style={{ width: `${Math.max(overallProjectPercent, 4)}%` }}
                      />
                    </div>
                  </div>

                  <div className="kpi-metric-card">
                    <span className="kpi-card-label">{currentLang === 'MY' ? 'Tugasan Disahkan' : 'Verified Tasks'}</span>
                    <span className="kpi-card-value text-accent-amber">
                      {projectKPIs ? `${projectKPIs.verifiedTasks} / ${projectKPIs.totalTasks}` : `${completedProjectTasks} / ${totalProjectTasks}`}
                    </span>
                    <span className="kpi-card-sub">
                      {projectKPIs?.totalTasks ? `${Math.round((projectKPIs.verifiedTasks / projectKPIs.totalTasks) * 100)}% verified` : '0%'}
                    </span>
                  </div>

                  <div className="kpi-metric-card">
                    <span className="kpi-card-label">{currentLang === 'MY' ? 'Peringkat Aktif' : 'Active Stages'}</span>
                    <span className="kpi-card-value text-accent-blue">
                      {projectKPIs ? `${projectKPIs.activeStagesCount} / 13` : '0 / 13'}
                    </span>
                    <span className="kpi-card-sub">{currentLang === 'MY' ? 'Dalam Proses / Selesai' : 'In Flight or Done'}</span>
                  </div>

                  <div className="kpi-metric-card">
                    <span className="kpi-card-label">{currentLang === 'MY' ? 'Bukti Dimuat Naik' : 'Uploaded Evidence'}</span>
                    <span className="kpi-card-value text-accent-violet">
                      {projectKPIs?.totalEvidenceCount || 0}
                    </span>
                    <span className="kpi-card-sub">{currentLang === 'MY' ? 'Fail Audit Disimpan' : 'Audit Files Stored'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4-Phase Construction Swimlane Board */}
            {activeProject && (
              <ProcessFlowChart
                project={activeProject}
                currentLang={currentLang}
                onSelectStage={(stage) => setPreviewStage(stage)}
              />
            )}
          </div>
        )}
      </main>

      {/* Collapsible Projects Drawer */}
      <ProjectsDrawer
        isOpen={projectsDrawerOpen}
        onClose={() => setProjectsDrawerOpen(false)}
        projects={projects}
        activeProjectId={activeProject?.id || ''}
        onSelectProject={(id) => trackerStore.setActiveProjectId(id)}
        onOpenProjectConfig={() => setProjectConfigOpen(true)}
        currentUser={currentUser}
        currentLang={currentLang}
      />

      {/* Project Configuration Modal */}
      <ProjectConfigModal
        isOpen={projectConfigOpen}
        onClose={() => setProjectConfigOpen(false)}
        projects={projects}
        activeProjectId={activeProject?.id || ''}
        onSelectProject={(id) => trackerStore.setActiveProjectId(id)}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
        currentUser={currentUser}
        currentLang={currentLang}
      />

      {/* Profile Names Configuration Modal */}
      <ProfileConfigModal
        isOpen={profileConfigOpen}
        onClose={() => setProfileConfigOpen(false)}
        profiles={profiles}
        onSaveProfileName={(id, newName) => trackerStore.updateProfileName(id, newName)}
        onResetProfiles={() => trackerStore.resetProfilesToDefault()}
        currentLang={currentLang}
      />

      {/* Process Quick Preview Popup */}
      <ProcessPreviewModal
        isOpen={Boolean(previewStage)}
        onClose={() => setPreviewStage(null)}
        stage={previewStage}
        tasks={
          activeProject && previewStage
            ? activeProject.tasks.filter((t) => t.processId === previewStage.id)
            : []
        }
        onOpenDetailPage={(stageId) => {
          setActiveStageId(stageId as ProcessStageId);
        }}
        currentLang={currentLang}
      />

      {/* Task Creation / Edit Modal */}
      <TaskConfigModal
        isOpen={taskModalState.isOpen}
        onClose={() =>
          setTaskModalState((prev) => ({ ...prev, isOpen: false, taskToEdit: null }))
        }
        stageTitle={taskModalState.stageTitle}
        initialTask={taskModalState.taskToEdit}
        onSaveTask={handleSaveTask}
        currentLang={currentLang}
      />
    </div>
  );
}
