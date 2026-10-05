import {
  Project,
  TaskItem,
  ActivityLogEntry,
  TaskAttachment,
  TaskLogEntry,
  ProcessStageId,
  UserProfile,
  Language,
  RequiredDocType,
  ALL_PROFILES,
  ThemeMode,
} from './types';

const STORAGE_KEY = 'pu_ducting_tracker_data_v1';
const USER_KEY = 'pu_ducting_current_user_v1';
const LANG_KEY = 'pu_ducting_lang_v1';
const PROFILES_KEY = 'pu_ducting_profiles_v1';
const THEME_KEY = 'pu_ducting_theme_v1';

// Seed initial construction projects
const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-trx-tower-2',
    name: 'TRX Lifestyle Quarter - Tower 2 AHU Ductwork',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    tasks: [
      {
        id: 'task-101',
        processId: 'received_la',
        title: 'Review and acknowledge Letter of Award for MVAC PU Package',
        description: 'Formal contract signed with main contractor for 4,500 m² pre-insulated ducting.',
        requiredDocs: ['files'],
        assignedMemberIds: ['manager'],
        signedOff: true,
        signedOffBy: 'Site Manager',
        signedOffAt: new Date(Date.now() - 6 * 86400000).toISOString(),
        attachments: [
          {
            id: 'att-1',
            name: 'LA_TRX_Tower2_PU_Package_Signed.pdf',
            type: 'file',
            sizeBytes: 2450000,
            uploadedBy: 'Site Manager',
            uploadedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
          },
        ],
        logs: [
          {
            id: 'log-1',
            text: 'LA countersigned and officially logged into document control.',
            authorId: 'manager',
            authorName: 'Site Manager',
            timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
      },
      {
        id: 'task-102',
        processId: 'shop_drawing',
        title: 'Receive Approved AHU-02 and AHU-03 Shop Drawings',
        description: 'Verify revision C coordinates for ceiling space coordination.',
        requiredDocs: ['files'],
        assignedMemberIds: ['batrisha'],
        signedOff: true,
        signedOffBy: 'Site Manager',
        signedOffAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        attachments: [
          {
            id: 'att-2',
            name: 'MVAC_SD_REV_C_Tower2_L04.dwg.pdf',
            type: 'file',
            sizeBytes: 8120000,
            uploadedBy: 'Batrisha',
            uploadedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
          },
        ],
        logs: [
          {
            id: 'log-2',
            text: 'Consultant stamped approved with comments regarding sprinkler clearance.',
            authorId: 'batrisha',
            authorName: 'Batrisha',
            timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: 'task-103',
        processId: 'site_inspection_drawing',
        title: 'Inspect Beam Penetrations at Zone B Grid 4-8',
        description: 'Verify beam sleeve clearance against drawing Rev C.',
        requiredDocs: ['photos', 'logs'],
        assignedMemberIds: ['ahmed', 'chen'],
        signedOff: false,
        attachments: [
          {
            id: 'att-3',
            name: 'Beam_Clearance_Grid4_Inspect.jpg',
            type: 'photo',
            sizeBytes: 1540000,
            uploadedBy: 'Ahmed',
            uploadedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
          },
        ],
        logs: [
          {
            id: 'log-3',
            text: 'Sleeve dimensions confirmed at 650x450mm with adequate 50mm flange clearance.',
            authorId: 'ahmed',
            authorName: 'Ahmed',
            timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: 'task-104',
        processId: 'pickup_quantity',
        title: 'Perform M² Take-Off for 20mm PIR Panels',
        description: 'Calculate net duct panel area and 15% wastage allowance for fittings.',
        requiredDocs: ['files', 'logs'],
        assignedMemberIds: ['batrisha'],
        signedOff: false,
        attachments: [
          {
            id: 'att-4',
            name: 'TakeOff_Sheet_Tower2_L04.xlsx',
            type: 'file',
            sizeBytes: 420000,
            uploadedBy: 'Batrisha',
            uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          },
        ],
        logs: [
          {
            id: 'log-4',
            text: 'Completed take-off: Total 1,280 m² required for Level 4 primary run.',
            authorId: 'batrisha',
            authorName: 'Batrisha',
            timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: 'task-105',
        processId: 'order_material',
        title: 'Order 20mm PIR Foam Panels and Bayonet Flange Profiles',
        description: 'Requisition order sent to manufacturer for Class 0 fire-rated panels.',
        requiredDocs: ['files'],
        assignedMemberIds: ['chen'],
        signedOff: false,
        attachments: [],
        logs: [
          {
            id: 'log-5',
            text: 'Purchase requisition #PO-4091 submitted to procurement officer.',
            authorId: 'chen',
            authorName: 'Chen',
            timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: 'task-106',
        processId: 'cut_panel',
        title: 'Cut 45-degree V-Groove Panels for Main Trunk 1200x500',
        description: 'Operate CNC / manual cutter adhering strictly to pickup takeoff dimensions.',
        requiredDocs: ['photos', 'logs'],
        assignedMemberIds: ['ahmed'],
        signedOff: false,
        attachments: [],
        logs: [],
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ],
    activityLogs: [
      {
        id: 'act-1',
        projectId: 'proj-trx-tower-2',
        processId: 'received_la',
        taskId: 'task-101',
        action: 'sign_off',
        descriptionEn: 'Signed off task: Review and acknowledge Letter of Award',
        descriptionMy: 'Mengesahkan tugasan: Semak dan akui Surat Anugerah',
        authorName: 'Site Manager',
        timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
      },
      {
        id: 'act-2',
        projectId: 'proj-trx-tower-2',
        processId: 'shop_drawing',
        taskId: 'task-102',
        action: 'sign_off',
        descriptionEn: 'Signed off task: Receive Approved AHU-02 Shop Drawings',
        descriptionMy: 'Mengesahkan tugasan: Dapatkan Lukisan Kerja AHU-02 yang diluluskan',
        authorName: 'Site Manager',
        timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: 'act-3',
        projectId: 'proj-trx-tower-2',
        processId: 'site_inspection_drawing',
        taskId: 'task-103',
        action: 'upload_file',
        descriptionEn: 'Uploaded photo: Beam_Clearance_Grid4_Inspect.jpg',
        descriptionMy: 'Memuat naik foto: Beam_Clearance_Grid4_Inspect.jpg',
        authorName: 'Ahmed',
        timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
    ],
  },
  {
    id: 'proj-pavilion-dh',
    name: 'Pavilion Damansara Heights - Level 4 PU Ducting',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    tasks: [],
    activityLogs: [
      {
        id: 'act-10',
        projectId: 'proj-pavilion-dh',
        processId: 'received_la',
        action: 'create_project',
        descriptionEn: 'Created new project: Pavilion Damansara Heights - Level 4 PU Ducting',
        descriptionMy: 'Mencipta projek baharu: Pavilion Damansara Heights - Salur PU Aras 4',
        authorName: 'Site Manager',
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ],
  },
];

class TrackerStore {
  private projects: Project[] = [];
  private activeProjectId: string = '';
  private currentUser: UserProfile | null = null;
  private currentLanguage: Language = 'EN';
  private currentTheme: ThemeMode = 'light';
  private profiles: UserProfile[] = ALL_PROFILES;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.projects = JSON.parse(stored);
      } else {
        this.projects = INITIAL_PROJECTS;
        this.saveToStorage();
      }

      if (this.projects.length > 0) {
        this.activeProjectId = this.projects[0].id;
      }

      const storedUser = localStorage.getItem(USER_KEY);
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }

      const storedLang = localStorage.getItem(LANG_KEY) as Language;
      if (storedLang === 'EN' || storedLang === 'MY') {
        this.currentLanguage = storedLang;
      }

      const storedTheme = localStorage.getItem(THEME_KEY) as ThemeMode;
      if (storedTheme === 'light' || storedTheme === 'dark') {
        this.currentTheme = storedTheme;
      }

      const storedProfiles = localStorage.getItem(PROFILES_KEY);
      if (storedProfiles) {
        this.profiles = JSON.parse(storedProfiles);
      } else {
        this.profiles = ALL_PROFILES;
        localStorage.setItem(PROFILES_KEY, JSON.stringify(ALL_PROFILES));
      }
    } catch {
      this.projects = INITIAL_PROJECTS;
      this.activeProjectId = this.projects[0]?.id || '';
      this.profiles = ALL_PROFILES;
      this.currentTheme = 'light';
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.projects));
      if (this.currentUser) {
        localStorage.setItem(USER_KEY, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(USER_KEY);
      }
      localStorage.setItem(LANG_KEY, this.currentLanguage);
      localStorage.setItem(THEME_KEY, this.currentTheme);
      localStorage.setItem(PROFILES_KEY, JSON.stringify(this.profiles));
    } catch (e) {
      console.error('Storage save failed:', e);
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Getters
  public getProjects(): Project[] {
    return this.projects;
  }

  public getActiveProject(): Project | undefined {
    return this.projects.find((p) => p.id === this.activeProjectId) || this.projects[0];
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  public getCurrentTheme(): ThemeMode {
    return this.currentTheme;
  }

  public getProfiles(): UserProfile[] {
    return this.profiles;
  }

  public getWorkerProfiles(): UserProfile[] {
    return this.profiles.filter((p) => p.role === 'worker');
  }

  public getManagerProfile(): UserProfile {
    return this.profiles.find((p) => p.role === 'manager') || this.profiles[0];
  }

  // Setters
  public setCurrentUser(user: UserProfile | null) {
    this.currentUser = user;
    this.saveToStorage();
  }

  public setCurrentLanguage(lang: Language) {
    this.currentLanguage = lang;
    this.saveToStorage();
  }

  public setCurrentTheme(theme: ThemeMode) {
    this.currentTheme = theme;
    this.saveToStorage();
  }

  public toggleTheme(): ThemeMode {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.saveToStorage();
    return this.currentTheme;
  }

  public updateProfileName(id: string, newName: string) {
    const trimmed = newName.trim();
    if (!trimmed) return;
    this.profiles = this.profiles.map((p) => (p.id === id ? { ...p, name: trimmed } : p));
    if (this.currentUser && this.currentUser.id === id) {
      this.currentUser = { ...this.currentUser, name: trimmed };
    }
    this.saveToStorage();
  }

  public resetProfilesToDefault() {
    this.profiles = ALL_PROFILES;
    if (this.currentUser) {
      const resetCurrent = ALL_PROFILES.find((p) => p.id === this.currentUser?.id);
      if (resetCurrent) this.currentUser = resetCurrent;
    }
    this.saveToStorage();
  }

  public getProjectKPIs(projectId: string): {
    totalTasks: number;
    verifiedTasks: number;
    completionPct: number;
    activeStagesCount: number;
    totalEvidenceCount: number;
  } {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) {
      return {
        totalTasks: 0,
        verifiedTasks: 0,
        completionPct: 0,
        activeStagesCount: 0,
        totalEvidenceCount: 0,
      };
    }

    const totalTasks = project.tasks.length;
    const verifiedTasks = project.tasks.filter((t) => t.signedOff).length;
    const completionPct = totalTasks > 0 ? Math.round((verifiedTasks / totalTasks) * 100) : 0;

    // Distinct stages with at least 1 task
    const activeStageIds = new Set(project.tasks.map((t) => t.processId));
    const activeStagesCount = activeStageIds.size;

    // Total evidence files + photos + logs
    let totalEvidenceCount = 0;
    project.tasks.forEach((t) => {
      totalEvidenceCount += t.attachments.length + t.logs.length;
    });

    return {
      totalTasks,
      verifiedTasks,
      completionPct,
      activeStagesCount,
      totalEvidenceCount,
    };
  }

  public setActiveProjectId(id: string) {
    this.activeProjectId = id;
    this.notify();
  }

  // Project Actions
  public addProject(name: string): Project {
    const trimmed = name.trim();
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: trimmed || 'Untitled PU Ducting Project',
      createdAt: new Date().toISOString(),
      tasks: [],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          projectId: `proj-${Date.now()}`,
          processId: 'received_la',
          action: 'create_project',
          descriptionEn: `Created project: ${trimmed}`,
          descriptionMy: `Mencipta projek baharu: ${trimmed}`,
          authorName: this.currentUser?.name || 'Site Manager',
          timestamp: new Date().toISOString(),
        },
      ],
    };
    this.projects = [newProj, ...this.projects];
    this.activeProjectId = newProj.id;
    this.saveToStorage();
    return newProj;
  }

  public deleteProject(id: string) {
    this.projects = this.projects.filter((p) => p.id !== id);
    if (this.activeProjectId === id) {
      this.activeProjectId = this.projects[0]?.id || '';
    }
    this.saveToStorage();
  }

  // Task Helper Calculations
  public checkRequiredDocsSatisfied(task: TaskItem): {
    satisfied: boolean;
    hasFiles: boolean;
    hasPhotos: boolean;
    hasLogs: boolean;
    requiredCount: number;
    completedCount: number;
  } {
    let hasFiles = true;
    let hasPhotos = true;
    let hasLogs = true;

    let requiredCount = task.requiredDocs.length;
    let completedCount = 0;

    if (task.requiredDocs.includes('files')) {
      const filesCount = task.attachments.filter((a) => a.type === 'file').length;
      hasFiles = filesCount > 0;
      if (hasFiles) completedCount++;
    }

    if (task.requiredDocs.includes('photos')) {
      const photosCount = task.attachments.filter((a) => a.type === 'photo').length;
      hasPhotos = photosCount > 0;
      if (hasPhotos) completedCount++;
    }

    if (task.requiredDocs.includes('logs')) {
      const logsCount = task.logs.length;
      hasLogs = logsCount > 0;
      if (hasLogs) completedCount++;
    }

    const satisfied = hasFiles && hasPhotos && hasLogs;
    return {
      satisfied,
      hasFiles,
      hasPhotos,
      hasLogs,
      requiredCount,
      completedCount,
    };
  }

  public getTaskProgress(task: TaskItem): number {
    if (task.signedOff) return 100;
    const reqStatus = this.checkRequiredDocsSatisfied(task);
    if (reqStatus.requiredCount === 0) {
      if (task.attachments.length > 0 || task.logs.length > 0) {
        return 100;
      }
      return 0;
    }
    const ratio = reqStatus.completedCount / reqStatus.requiredCount;
    return Math.round(ratio * 100);
  }

  public getProcessSummary(projectId: string, processId: ProcessStageId): {
    totalTasks: number;
    completedTasks: number;
    percentage: number;
    hasTasks: boolean;
    tasks: TaskItem[];
  } {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) {
      return { totalTasks: 0, completedTasks: 0, percentage: 0, hasTasks: false, tasks: [] };
    }
    const tasks = project.tasks.filter((t) => t.processId === processId);
    if (tasks.length === 0) {
      return { totalTasks: 0, completedTasks: 0, percentage: 0, hasTasks: false, tasks: [] };
    }
    const completedTasks = tasks.filter((t) => t.signedOff).length;
    const percentage = Math.round((completedTasks / tasks.length) * 100);
    return {
      totalTasks: tasks.length,
      completedTasks,
      percentage,
      hasTasks: true,
      tasks,
    };
  }

  public canUserInteractWithTask(user: UserProfile | null, task: TaskItem): boolean {
    if (!user) return false;
    if (user.role === 'manager') return true;
    return task.assignedMemberIds.includes(user.id);
  }

  // Task Actions
  public addTask(
    projectId: string,
    processId: ProcessStageId,
    data: {
      title: string;
      description?: string;
      requiredDocs: RequiredDocType[];
      assignedMemberIds: string[];
    }
  ): TaskItem {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      processId,
      title: data.title.trim() || 'Untitled Task',
      description: data.description?.trim() || '',
      requiredDocs: data.requiredDocs,
      assignedMemberIds: data.assignedMemberIds.length > 0 ? data.assignedMemberIds : ['manager'],
      signedOff: false,
      attachments: [],
      logs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.projects = this.projects.map((p) => {
      if (p.id !== projectId) return p;
      const log: ActivityLogEntry = {
        id: `act-${Date.now()}`,
        projectId,
        processId,
        taskId: newTask.id,
        action: 'create_task',
        descriptionEn: `Created task: ${newTask.title}`,
        descriptionMy: `Mencipta tugasan: ${newTask.title}`,
        authorName: this.currentUser?.name || 'Site Manager',
        timestamp: new Date().toISOString(),
      };
      return {
        ...p,
        tasks: [...p.tasks, newTask],
        activityLogs: [log, ...p.activityLogs],
      };
    });

    this.saveToStorage();
    return newTask;
  }

  public updateTask(
    projectId: string,
    taskId: string,
    data: Partial<TaskItem>
  ) {
    this.projects = this.projects.map((p) => {
      if (p.id !== projectId) return p;
      let targetProcessId: ProcessStageId = 'received_la';
      const updatedTasks = p.tasks.map((t) => {
        if (t.id !== taskId) return t;
        targetProcessId = t.processId;
        return {
          ...t,
          ...data,
          updatedAt: new Date().toISOString(),
        };
      });

      const log: ActivityLogEntry = {
        id: `act-${Date.now()}`,
        projectId,
        processId: targetProcessId,
        taskId,
        action: 'update_task',
        descriptionEn: `Updated details for task: ${data.title || 'Task'}`,
        descriptionMy: `Mengemas kini butiran tugasan: ${data.title || 'Tugasan'}`,
        authorName: this.currentUser?.name || 'Site Manager',
        timestamp: new Date().toISOString(),
      };

      return {
        ...p,
        tasks: updatedTasks,
        activityLogs: [log, ...p.activityLogs],
      };
    });

    this.saveToStorage();
  }

  public deleteTask(projectId: string, taskId: string) {
    this.projects = this.projects.map((p) => {
      if (p.id !== projectId) return p;
      const targetTask = p.tasks.find((t) => t.id === taskId);
      const processId = targetTask?.processId || 'received_la';
      const log: ActivityLogEntry = {
        id: `act-${Date.now()}`,
        projectId,
        processId,
        taskId,
        action: 'delete_task',
        descriptionEn: `Deleted task: ${targetTask?.title || taskId}`,
        descriptionMy: `Memadam tugasan: ${targetTask?.title || taskId}`,
        authorName: this.currentUser?.name || 'Site Manager',
        timestamp: new Date().toISOString(),
      };
      return {
        ...p,
        tasks: p.tasks.filter((t) => t.id !== taskId),
        activityLogs: [log, ...p.activityLogs],
      };
    });

    this.saveToStorage();
  }

  public signOffTask(projectId: string, taskId: string, signOff: boolean) {
    if (this.currentUser?.role !== 'manager') return;

    this.projects = this.projects.map((p) => {
      if (p.id !== projectId) return p;
      let targetProcessId: ProcessStageId = 'received_la';
      let taskTitle = '';

      const updatedTasks = p.tasks.map((t) => {
        if (t.id !== taskId) return t;
        targetProcessId = t.processId;
        taskTitle = t.title;

        // Verify requirements before allowing sign-off
        if (signOff) {
          const reqStatus = this.checkRequiredDocsSatisfied(t);
          if (!reqStatus.satisfied) {
            return t; // Block sign-off
          }
        }

        return {
          ...t,
          signedOff: signOff,
          signedOffBy: signOff ? this.currentUser?.name : undefined,
          signedOffAt: signOff ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString(),
        };
      });

      const log: ActivityLogEntry = {
        id: `act-${Date.now()}`,
        projectId,
        processId: targetProcessId,
        taskId,
        action: signOff ? 'sign_off' : 'reopen_task',
        descriptionEn: signOff
          ? `Manager signed off task: ${taskTitle}`
          : `Manager reopened task: ${taskTitle}`,
        descriptionMy: signOff
          ? `Pengurus mengesahkan tugasan: ${taskTitle}`
          : `Pengurus membuka semula tugasan: ${taskTitle}`,
        authorName: this.currentUser?.name || 'Site Manager',
        timestamp: new Date().toISOString(),
      };

      return {
        ...p,
        tasks: updatedTasks,
        activityLogs: [log, ...p.activityLogs],
      };
    });

    this.saveToStorage();
  }

  public uploadAttachment(
    projectId: string,
    taskId: string,
    attachment: TaskAttachment
  ) {
    this.projects = this.projects.map((p) => {
      if (p.id !== projectId) return p;
      let targetProcessId: ProcessStageId = 'received_la';
      let taskTitle = '';

      const updatedTasks = p.tasks.map((t) => {
        if (t.id !== taskId) return t;
        targetProcessId = t.processId;
        taskTitle = t.title;
        return {
          ...t,
          attachments: [attachment, ...t.attachments],
          updatedAt: new Date().toISOString(),
        };
      });

      const log: ActivityLogEntry = {
        id: `act-${Date.now()}`,
        projectId,
        processId: targetProcessId,
        taskId,
        action: 'upload_file',
        descriptionEn: `Uploaded ${attachment.type}: ${attachment.name} on "${taskTitle}"`,
        descriptionMy: `Memuat naik ${attachment.type === 'photo' ? 'foto' : 'fail'}: ${attachment.name} untuk "${taskTitle}"`,
        authorName: this.currentUser?.name || attachment.uploadedBy,
        timestamp: new Date().toISOString(),
      };

      return {
        ...p,
        tasks: updatedTasks,
        activityLogs: [log, ...p.activityLogs],
      };
    });

    this.saveToStorage();
  }

  public deleteAttachment(
    projectId: string,
    taskId: string,
    attachmentId: string
  ) {
    this.projects = this.projects.map((p) => {
      if (p.id !== projectId) return p;
      let targetProcessId: ProcessStageId = 'received_la';
      let deletedName = '';

      const updatedTasks = p.tasks.map((t) => {
        if (t.id !== taskId) return t;
        targetProcessId = t.processId;
        const att = t.attachments.find((a) => a.id === attachmentId);
        deletedName = att?.name || '';
        return {
          ...t,
          attachments: t.attachments.filter((a) => a.id !== attachmentId),
          updatedAt: new Date().toISOString(),
        };
      });

      const log: ActivityLogEntry = {
        id: `act-${Date.now()}`,
        projectId,
        processId: targetProcessId,
        taskId,
        action: 'delete_file',
        descriptionEn: `Removed attachment: ${deletedName}`,
        descriptionMy: `Memadam lampiran: ${deletedName}`,
        authorName: this.currentUser?.name || 'User',
        timestamp: new Date().toISOString(),
      };

      return {
        ...p,
        tasks: updatedTasks,
        activityLogs: [log, ...p.activityLogs],
      };
    });

    this.saveToStorage();
  }

  public addLogEntry(
    projectId: string,
    taskId: string,
    text: string
  ) {
    const trimmed = text.trim();
    if (!trimmed) return;

    this.projects = this.projects.map((p) => {
      if (p.id !== projectId) return p;
      let targetProcessId: ProcessStageId = 'received_la';
      let taskTitle = '';

      const newLog: TaskLogEntry = {
        id: `log-${Date.now()}`,
        text: trimmed,
        authorId: this.currentUser?.id || 'guest',
        authorName: this.currentUser?.name || 'Worker',
        timestamp: new Date().toISOString(),
      };

      const updatedTasks = p.tasks.map((t) => {
        if (t.id !== taskId) return t;
        targetProcessId = t.processId;
        taskTitle = t.title;
        return {
          ...t,
          logs: [newLog, ...t.logs],
          updatedAt: new Date().toISOString(),
        };
      });

      const actLog: ActivityLogEntry = {
        id: `act-${Date.now()}`,
        projectId,
        processId: targetProcessId,
        taskId,
        action: 'add_log',
        descriptionEn: `Submitted log on "${taskTitle}": "${trimmed.slice(0, 45)}${trimmed.length > 45 ? '...' : ''}"`,
        descriptionMy: `Menghantar log untuk "${taskTitle}": "${trimmed.slice(0, 45)}${trimmed.length > 45 ? '...' : ''}"`,
        authorName: this.currentUser?.name || 'Worker',
        timestamp: new Date().toISOString(),
      };

      return {
        ...p,
        tasks: updatedTasks,
        activityLogs: [actLog, ...p.activityLogs],
      };
    });

    this.saveToStorage();
  }

  public getScopedActivityLogs(
    projectId: string,
    processId: ProcessStageId,
    taskId?: string
  ): ActivityLogEntry[] {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) return [];
    return project.activityLogs.filter((log) => {
      if (log.processId !== processId) return false;
      if (taskId && log.taskId && log.taskId !== taskId) return false;
      return true;
    });
  }
}

export const trackerStore = new TrackerStore();
