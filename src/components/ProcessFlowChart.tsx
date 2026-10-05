import React, { useState } from 'react';
import {
  ProcessStageDefinition,
  PROCESS_STAGES,
  Project,
  Language,
  CONSTRUCTION_PHASES,
  ConstructionPhase,
} from '../types';
import { trackerStore } from '../store';
import { IconUser, IconChevronRight, IconCheck } from './Icons';

interface ProcessFlowChartProps {
  project: Project;
  currentLang: Language;
  onSelectStage: (stage: ProcessStageDefinition) => void;
}

export const ProcessFlowChart: React.FC<ProcessFlowChartProps> = ({
  project,
  currentLang,
  onSelectStage,
}) => {
  // Phase filter: 'all' to show all 4 phases sequentially, or specific phase id
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('all');

  // Compute progress for each phase
  const getPhaseStats = (phase: ConstructionPhase) => {
    const phaseStages = PROCESS_STAGES.filter((s) => phase.stageIds.includes(s.id));
    let totalTasks = 0;
    let completedTasks = 0;
    let completedStages = 0;

    phaseStages.forEach((s) => {
      const summary = trackerStore.getProcessSummary(project.id, s.id);
      totalTasks += summary.totalTasks;
      completedTasks += summary.completedTasks;
      if (summary.percentage === 100) completedStages++;
    });

    const percent =
      totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : completedStages === phaseStages.length && phaseStages.length > 0
        ? 100
        : 0;

    return {
      stages: phaseStages,
      totalTasks,
      completedTasks,
      completedStages,
      percent,
      isDone: percent === 100 && completedStages === phaseStages.length,
      isActive: percent > 0 && percent < 100,
    };
  };

  const renderStageCard = (stage: ProcessStageDefinition) => {
    const stageName = currentLang === 'MY' ? stage.nameMy : stage.nameEn;
    const summary = trackerStore.getProcessSummary(project.id, stage.id);
    const isCompleted = summary.percentage === 100;
    const hasProgress = summary.percentage > 0;

    return (
      <div
        key={stage.id}
        className={`pipeline-stage-card ${summary.hasTasks ? 'card-has-tasks' : 'card-empty'} ${
          isCompleted ? 'card-completed' : hasProgress ? 'card-in-progress' : 'card-pending'
        }`}
        onClick={() => onSelectStage(stage)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectStage(stage);
          }
        }}
      >
        <div className="pipeline-card-header">
          <span className="pipeline-card-seq">
            #{stage.sequence < 10 ? `0${stage.sequence}` : stage.sequence}
          </span>
          <span
            className={`status-pill-badge ${
              isCompleted
                ? 'status-pill-completed'
                : hasProgress
                ? 'status-pill-active'
                : 'status-pill-pending'
            }`}
          >
            {isCompleted
              ? currentLang === 'MY'
                ? 'Selesai'
                : 'Completed'
              : hasProgress
              ? currentLang === 'MY'
                ? 'Berjalan'
                : 'In Progress'
              : currentLang === 'MY'
              ? 'Menunggu'
              : 'Pending'}
          </span>
        </div>

        <h4 className="pipeline-card-title" title={stageName}>
          {stageName}
        </h4>

        {/* Role Hint Chip */}
        <div className="pipeline-card-role">
          <IconUser size={13} className="role-chip-icon" />
          <span className="pipeline-role-text">{stage.defaultRoleHint}</span>
        </div>

        {/* Progress Ratio Bar */}
        <div className="pipeline-card-progress">
          <div className="flex-row justify-between items-center text-xs mb-1">
            <span
              className={`font-bold ${
                isCompleted
                  ? 'text-accent-emerald'
                  : hasProgress
                  ? 'text-accent-blue'
                  : 'text-dim'
              }`}
            >
              {summary.percentage}%
            </span>
            <span className="text-muted">
              {summary.completedTasks}/{summary.totalTasks}{' '}
              {currentLang === 'MY' ? 'Siap' : 'Done'}
            </span>
          </div>
          <div className="progress-bar-track progress-bar-slim">
            <div
              className={`progress-bar-fill ${
                isCompleted
                  ? 'progress-glow-emerald'
                  : hasProgress
                  ? 'progress-glow-cyan'
                  : ''
              }`}
              style={{
                width: `${summary.percentage > 0 ? Math.max(summary.percentage, 6) : 0}%`,
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const displayedPhases =
    selectedPhaseId === 'all'
      ? CONSTRUCTION_PHASES
      : CONSTRUCTION_PHASES.filter((p) => p.id === selectedPhaseId);

  return (
    <div className="horizontal-pipeline-wrapper">
      {/* 1. Horizontal Phase Milestone Stepper */}
      <div className="pipeline-milestones-stepper" role="tablist" aria-label="Construction Phases">
        <button
          type="button"
          role="tab"
          aria-selected={selectedPhaseId === 'all'}
          className={`milestone-stepper-item ${selectedPhaseId === 'all' ? 'milestone-active' : ''}`}
          onClick={() => setSelectedPhaseId('all')}
        >
          <div className="milestone-badge-circle">ALL</div>
          <div className="milestone-content">
            <span className="milestone-label">{currentLang === 'MY' ? 'Semua Fasa' : 'All Phases'}</span>
            <span className="milestone-sub">13 {currentLang === 'MY' ? 'Peringkat' : 'Stages'}</span>
          </div>
        </button>

        {CONSTRUCTION_PHASES.map((phase) => {
          const stats = getPhaseStats(phase);
          const isSelected = selectedPhaseId === phase.id;
          const phaseName = currentLang === 'MY' ? phase.nameMy : phase.nameEn;

          return (
            <button
              key={phase.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`milestone-stepper-item ${
                isSelected
                  ? 'milestone-active'
                  : stats.isDone
                  ? 'milestone-done'
                  : stats.isActive
                  ? 'milestone-in-flight'
                  : ''
              }`}
              onClick={() => setSelectedPhaseId(phase.id)}
            >
              <div className="milestone-badge-circle">
                {stats.isDone ? <IconCheck size={14} /> : `0${phase.sequence}`}
              </div>
              <div className="milestone-content">
                <span className="milestone-label">{phaseName}</span>
                <div className="milestone-progress-row">
                  <span className="milestone-pct">{stats.percent}%</span>
                  <span className="milestone-sub">
                    ({stats.completedStages}/{stats.stages.length} {currentLang === 'MY' ? 'siap' : 'done'})
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Horizontal Stage Tracks Grouped by Phase */}
      <div className="pipeline-sections-container">
        {displayedPhases.map((phase, pIdx) => {
          const stats = getPhaseStats(phase);
          const phaseName = currentLang === 'MY' ? phase.nameMy : phase.nameEn;
          const phaseDesc = currentLang === 'MY' ? phase.descMy : phase.descEn;

          return (
            <div key={phase.id} className="pipeline-phase-section">
              {/* Phase Section Banner */}
              <div className="pipeline-phase-banner">
                <div className="pipeline-phase-meta">
                  <span className="phase-pill-tag">Phase 0{phase.sequence}</span>
                  <h3 className="pipeline-phase-title">{phaseName}</h3>
                  <p className="pipeline-phase-desc">{phaseDesc}</p>
                </div>

                <div className="pipeline-phase-stat-box">
                  <div className="phase-stat-text">
                    <span className="phase-stat-val">{stats.percent}%</span>
                    <span className="phase-stat-lbl">
                      {stats.completedTasks}/{stats.totalTasks} {currentLang === 'MY' ? 'Tugasan' : 'Tasks'}
                    </span>
                  </div>
                  <div className="phase-bar-track">
                    <div
                      className="phase-bar-fill"
                      style={{ width: `${stats.percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Horizontal Stages Row */}
              <div className="pipeline-stages-row">
                {stats.stages.map((stage, sIdx) => (
                  <React.Fragment key={stage.id}>
                    {renderStageCard(stage)}
                    {sIdx < stats.stages.length - 1 && (
                      <div className="pipeline-step-arrow" aria-hidden="true">
                        <IconChevronRight size={20} className="step-arrow-svg" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Handover checkpoint indicator to next phase */}
              {selectedPhaseId === 'all' && pIdx < displayedPhases.length - 1 && (
                <div className="pipeline-handover-divider">
                  <div className="handover-line" />
                  <span className="handover-pill">
                    Phase 0{phase.sequence} Handover → Phase 0{phase.sequence + 1}
                  </span>
                  <div className="handover-line" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

