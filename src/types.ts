export type Role = 'manager' | 'worker';

export type Language = 'EN' | 'MY';

export type RequiredDocType = 'files' | 'logs' | 'photos';

export interface UserProfile {
  id: string;
  name: string;
  role: Role;
  avatarColor: string;
}

export const WORKER_PROFILES: UserProfile[] = [
  { id: 'ahmed', name: 'Ahmed', role: 'worker', avatarColor: '#0284c7' },
  { id: 'batrisha', name: 'Batrisha', role: 'worker', avatarColor: '#d97706' },
  { id: 'chen', name: 'Chen', role: 'worker', avatarColor: '#059669' },
];

export const MANAGER_PROFILE: UserProfile = {
  id: 'manager',
  name: 'Site Manager',
  role: 'manager',
  avatarColor: '#7c3aed',
};

export const ALL_PROFILES: UserProfile[] = [
  MANAGER_PROFILE,
  ...WORKER_PROFILES,
];

export type ProcessStageId =
  | 'received_la'
  | 'shop_drawing'
  | 'site_inspection_drawing'
  | 'confirm_drawing_changes'
  | 'pickup_quantity'
  | 'order_material'
  | 'cut_panel'
  | 'start_fabrication'
  | 'delivery_to_site'
  | 'installation'
  | 'site_inspection_install'
  | 'defect_repair'
  | 'end';

export interface ProcessStageDefinition {
  id: ProcessStageId;
  sequence: number;
  row: 1 | 2 | 3;
  defaultRoleHint: string;
  nameEn: string;
  nameMy: string;
  descEn: string;
  descMy: string;
}

export const PROCESS_STAGES: ProcessStageDefinition[] = [
  // Row 1: Left to right (1 to 5)
  {
    id: 'received_la',
    sequence: 1,
    row: 1,
    defaultRoleHint: 'PIC / Management',
    nameEn: 'Received LA',
    nameMy: 'Penerimaan Surat Anugerah (LA)',
    descEn: 'Formal reception of Letter of Award for PU ducting package',
    descMy: 'Penerimaan rasmi Surat Anugerah pakej salur udara PU',
  },
  {
    id: 'shop_drawing',
    sequence: 2,
    row: 1,
    defaultRoleHint: 'PIC / Draftsman',
    nameEn: 'Get Shop Drawing from PIC',
    nameMy: 'Dapatkan Lukisan Kerja daripada PIC',
    descEn: 'Obtain approved mechanical ventilation and air conditioning (MVAC) layout drawings',
    descMy: 'Dapatkan lukisan reka bentuk salur udara daripada Pegawai Bertanggungjawab',
  },
  {
    id: 'site_inspection_drawing',
    sequence: 3,
    row: 1,
    defaultRoleHint: 'Site Engineer / PIC',
    nameEn: 'Site Inspection According to Drawing',
    nameMy: 'Pemeriksaan Tapak Mengikut Lukisan',
    descEn: 'Cross-check actual slab, beam, and wall penetrations against drawing',
    descMy: 'Periksa laluan rasuk, lantai, dan dinding tapak binaan mengikut lukisan',
  },
  {
    id: 'confirm_drawing_changes',
    sequence: 4,
    row: 1,
    defaultRoleHint: 'PIC / Consultant',
    nameEn: 'Confirmation of Changes in Shop Drawing',
    nameMy: 'Pengesahan Perubahan Lukisan Kerja',
    descEn: 'Validate and sign off rerouted duct paths and dimension changes',
    descMy: 'Sahkan pindaan dimensi dan laluan baharu lukisan pembinaan',
  },
  {
    id: 'pickup_quantity',
    sequence: 5,
    row: 1,
    defaultRoleHint: 'Quantity Surveyor / Engineer',
    nameEn: 'Pick up Quantity',
    nameMy: 'Pengambilan Kuantiti (Take-Off)',
    descEn: 'Extract square meterage of panels, flange profiles, and accessories',
    descMy: 'Kira keluasan panel, profil bebibir, dan bahan sokongan (Take-Off)',
  },

  // Row 2: Right to left (6 to 10)
  {
    id: 'order_material',
    sequence: 6,
    row: 2,
    defaultRoleHint: 'Worker / Procurement',
    nameEn: 'Order Material (PU Panel)',
    nameMy: 'Pesanan Bahan (Panel PU) (Pekerja)',
    descEn: 'Issue material requisition for PIR/PU foam panels and adhesive sealant',
    descMy: 'Keluarkan pesanan bekalan panel busa PIR/PU dan bahan pelekat',
  },
  {
    id: 'cut_panel',
    sequence: 7,
    row: 2,
    defaultRoleHint: 'Worker',
    nameEn: 'Start Cutting PU Panel',
    nameMy: 'Mula Memotong Panel PU (Data Kuantiti)',
    descEn: 'Execute precision 45-degree V-groove cuts using pickup quantity data',
    descMy: 'Lakukan potongan alur V 45 darjah menggunakan data kiraan kuantiti',
  },
  {
    id: 'start_fabrication',
    sequence: 8,
    row: 2,
    defaultRoleHint: 'Worker',
    nameEn: 'Start Fabrication',
    nameMy: 'Mula Fabrikasi (Pekerja)',
    descEn: 'Fold, glue, attach invisible flange profiles, and apply sealant',
    descMy: 'Lipat panel, lekat profil bebibir, dan sapu bahan kedap udara silikon',
  },
  {
    id: 'delivery_to_site',
    sequence: 9,
    row: 2,
    defaultRoleHint: 'Engineer / Logistics',
    nameEn: 'Delivery to Site',
    nameMy: 'Penghantaran ke Tapak (Jurutera)',
    descEn: 'Tag fabricated sections and transport to construction site floor zone',
    descMy: 'Label seksyen fabrikasi dan hantar ke zon tingkat tapak pembinaan',
  },
  {
    id: 'installation',
    sequence: 10,
    row: 2,
    defaultRoleHint: 'Worker',
    nameEn: 'Installation',
    nameMy: 'Pemasangan (Pekerja)',
    descEn: 'Mount threaded rod hangers, hoist ducting sections, and connect joints',
    descMy: 'Pasang rod penggantung, naikkan salur udara, dan sambung klip bebibir',
  },

  // Row 3: Left to right (11 to 13)
  {
    id: 'site_inspection_install',
    sequence: 11,
    row: 3,
    defaultRoleHint: 'Engineer / PIC / Main Contractor',
    nameEn: 'Site Inspection (Install)',
    nameMy: 'Pemeriksaan Tapak (Jurutera/PIC/Kontraktor)',
    descEn: 'Inspect hanger spacing, joint sealing, and pressure tightness',
    descMy: 'Periksa jarak penggantung, kedap udara sambungan, dan integriti struktur',
  },
  {
    id: 'defect_repair',
    sequence: 12,
    row: 3,
    defaultRoleHint: 'Checking / Client / Repair / Worker',
    nameEn: 'Defect Checking & Repair',
    nameMy: 'Kecacatan & Pembaikan (Klien/Pekerja)',
    descEn: 'Identify foil tears, leakage points, conduct remedial repairs',
    descMy: 'Kenal pasti kebocoran udara atau koyakan kerajang dan lakukan baikan',
  },
  {
    id: 'end',
    sequence: 13,
    row: 3,
    defaultRoleHint: 'Manager / Client',
    nameEn: 'End (Handover)',
    nameMy: 'Tamat (Penyerahan)',
    descEn: 'Final approval, formal commissioning documentation, and zone sign-off',
    descMy: 'Kelulusan akhir, dokumentasi pentauliahan rasmi, dan penyerahan zon',
  },
];

export interface TaskAttachment {
  id: string;
  name: string;
  type: 'file' | 'photo';
  sizeBytes: number;
  dataUrl?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface TaskLogEntry {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  timestamp: string;
}

export type TaskStatus = 'pending' | 'ready_for_signoff' | 'signed_off';

export interface TaskItem {
  id: string;
  processId: ProcessStageId;
  title: string;
  description?: string;
  requiredDocs: RequiredDocType[];
  assignedMemberIds: string[];
  signedOff: boolean;
  signedOffBy?: string;
  signedOffAt?: string;
  attachments: TaskAttachment[];
  logs: TaskLogEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogEntry {
  id: string;
  projectId: string;
  processId: ProcessStageId;
  taskId?: string;
  action:
    | 'create_task'
    | 'update_task'
    | 'delete_task'
    | 'upload_file'
    | 'delete_file'
    | 'add_log'
    | 'sign_off'
    | 'reopen_task'
    | 'create_project'
    | 'delete_project';
  descriptionEn: string;
  descriptionMy: string;
  authorName: string;
  timestamp: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  tasks: TaskItem[];
  activityLogs: ActivityLogEntry[];
}

export type ThemeMode = 'light' | 'dark';

export interface ConstructionPhase {
  id: string;
  sequence: number;
  nameEn: string;
  nameMy: string;
  descEn: string;
  descMy: string;
  stageIds: ProcessStageId[];
}

export const CONSTRUCTION_PHASES: ConstructionPhase[] = [
  {
    id: 'phase_1',
    sequence: 1,
    nameEn: 'Phase 1: Contract & Site Survey',
    nameMy: 'Fasa 1: Kontrak & Tinjauan Tapak',
    descEn: 'LA confirmation, shop drawing approvals, and site verification',
    descMy: 'Pengesahan LA, kelulusan lukisan kerja, dan pemeriksaan tapak',
    stageIds: ['received_la', 'shop_drawing', 'site_inspection_drawing', 'confirm_drawing_changes'],
  },
  {
    id: 'phase_2',
    sequence: 2,
    nameEn: 'Phase 2: Quantity & Procurement',
    nameMy: 'Fasa 2: Kuantiti & Perolehan Bahan',
    descEn: 'Take-off calculation, panel order, and precision cutting',
    descMy: 'Kiraan kuantiti, pesanan panel, dan pemotongan alur V',
    stageIds: ['pickup_quantity', 'order_material', 'cut_panel'],
  },
  {
    id: 'phase_3',
    sequence: 3,
    nameEn: 'Phase 3: Duct Fabrication & Logistics',
    nameMy: 'Fasa 3: Fabrikasi Salur & Logistik',
    descEn: 'Assembly gluing, site delivery, and hanger installation',
    descMy: 'Pemasangan glu, penghantaran ke tingkat tapak, dan pemasangan',
    stageIds: ['start_fabrication', 'delivery_to_site', 'installation'],
  },
  {
    id: 'phase_4',
    sequence: 4,
    nameEn: 'Phase 4: Site QA & Handover',
    nameMy: 'Fasa 4: Pemeriksaan QA & Penyerahan',
    descEn: 'Joint inspection, defect clearance, and client sign-off',
    descMy: 'Pemeriksaan bersama, pembaikan kecacatan, dan penyerahan klien',
    stageIds: ['site_inspection_install', 'defect_repair', 'end'],
  },
];
