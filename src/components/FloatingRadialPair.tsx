import React, { useEffect, useRef, useState } from 'react';
import { Aperture, PanelTop } from 'lucide-react';
import {
  DeleteActionType,
  EdgeSelectionTool,
} from '../core/mesh/advancedOperations';
import { EditSelectionMode } from '../core/mesh/operations';
import { PrimitiveOptions, PrimitiveType } from '../core/mesh/primitives';
import {
  AxisConstraint,
  CameraProjection,
  LightType,
  ObjectShadingMode,
  SaveStatus,
  TouchControlSettings,
  TransformTool,
  ViewportDisplayMode,
  WorkMode,
} from '../core/project/types';
import {
  RadialActionId,
  RadialLayoutScope,
} from '../core/radial/radialActions';
import type { CameraPreset } from '../engine/ViewportEngine';
import type { EditOperatorType } from '../state/useModelerStore';
import { FloatingRadialMenu } from './FloatingRadialMenu';
import type { WorkspaceId } from './TopBar';
import type { UVQuickAccessState, UVWorkspaceHandle } from './UVWorkspace';

interface FloatingRadialPairProps {
  activeWorkspace: WorkspaceId;
  boundsClassName?: string;
  touchSettings: TouchControlSettings;
  onUpdateTouchSettings: (patch: Partial<TouchControlSettings>) => void;
  onUpdateRadialSlot: (
    scope: RadialLayoutScope,
    slotIndex: number,
    actionId: RadialActionId | null,
  ) => void;
  onResetRadialSlot: (scope: RadialLayoutScope, slotIndex: number) => void;
  onResetRadialLayout: (scope: RadialLayoutScope) => void;

  // Layout / Modeling State & Handlers
  workMode: WorkMode;
  editSelectionMode: EditSelectionMode;
  edgeSelectionTool?: EdgeSelectionTool;
  activeTool: TransformTool;
  activeOperatorType?: EditOperatorType | null;
  axisConstraint: AxisConstraint;
  projection: CameraProjection;
  displayMode: ViewportDisplayMode;
  xrayTransparency: number;
  showFaceOrientation: boolean;
  showGrid: boolean;
  showAxes: boolean;
  showLiner: boolean;
  barhomeVisible: boolean;
  multiSelectTouch: boolean;
  screenShiftActive: boolean;
  hasSelectedObject: boolean;
  canEditSelected: boolean;
  hasSelectedComponents: boolean;
  canUndo: boolean;
  canRedo: boolean;
  hasUnsavedChanges: boolean;
  saveStatus: SaveStatus;
  timelapseRecordingActive?: boolean;
  timelapseStepCount?: number;
  proportionalEnabled: boolean;
  proportionalConnectedOnly: boolean;
  selectedObjectShading?: ObjectShadingMode | null;

  onAddPrimitive: (type: PrimitiveType, options?: PrimitiveOptions) => void;
  onAddLight?: (type: LightType) => void;
  onSelectTool: (tool: TransformTool) => void;
  onGQuickTapMove: () => void;
  onChangeAxisConstraint: (axis: AxisConstraint) => void;
  onDuplicateObject: () => void;
  onApplyObjectTransform: () => void;
  onCenterObjectOrigin: () => void;
  onSeparateSelectedGeometry: () => void;
  onDeleteObject: () => void;
  onSetCameraPreset: (preset: CameraPreset) => void;
  onFocusSelected: () => void;
  onToggleProjection: () => void;
  onToggleWorkMode: (mode: WorkMode) => void;
  onChangeEditSelectionMode: (mode: EditSelectionMode) => void;
  onChangeEdgeSelectionTool: (tool: EdgeSelectionTool) => void;
  onSelectEdgeTopology: (kind: 'loop' | 'ring') => void;
  onToggleXray: () => void;
  onSelectDisplayMode: (mode: ViewportDisplayMode) => void;
  onChangeXrayTransparency: (value: number) => void;
  onToggleFaceOrientation: () => void;
  onToggleGrid: () => void;
  onToggleAxes: () => void;
  onToggleLiner: () => void;
  onToggleBarhome: () => void;
  onToggleMultiSelectTouch: () => void;
  onToggleScreenShift: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onStartOperator: (type: EditOperatorType) => void;
  onFillSelection: () => void;
  onConnectVertexPath: () => void;
  onRecalculateOutside: () => void;
  onFlipNormals: () => void;
  onQuickDissolve: () => void;
  onExecuteContextualDelete: (action: DeleteActionType) => void;
  onMarkSeams: (isSeam: boolean) => void;
  onSelectSeams: () => void;
  onDeselectSeams: () => void;
  onToggleProportional: () => void;
  onToggleProportionalConnected: () => void;
  onCycleProportionalFalloff: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSelectAllObjects: () => void;
  onDeselectAllObjects: () => void;
  onSelectConnected: () => void;
  onSetSelectedObjectShading: (shading: ObjectShadingMode) => void;

  // UV context
  uvQuickState?: UVQuickAccessState | null;
  uvActionsRef?: React.RefObject<UVWorkspaceHandle | null>;

  // BARHOME handlers
  demoMode?: boolean;
  onCreateProjectModal: () => void;
  onOpenProjectModal: () => void;
  onSaveProject: () => void;
  onSaveAsProjectModal: () => void;
  onImportNativeProject: () => void;
  onExportNativeProject: () => void;
  onImportExternal: () => void;
  onExportExternal: () => void;
  onImportObj: () => void;
  onImportStl: () => void;
  onImportJpg: () => void;
  onImportPng: () => void;
  onExportSelected: () => void;
  onExportScene: () => void;
  onExportObj: () => void;
  onExportStl: () => void;
  onReturnToGallery: () => void;
  onChangeWorkspace: (workspace: WorkspaceId) => void;
  onOpenSettings: () => void;
}

export const FloatingRadialPair: React.FC<FloatingRadialPairProps> = ({
  activeWorkspace,
  demoMode = false,
  boundsClassName = 'left-0 right-0',
  touchSettings,
  onUpdateTouchSettings,
  onUpdateRadialSlot,
  onResetRadialSlot,
  onResetRadialLayout,
  workMode,
  editSelectionMode,
  edgeSelectionTool = 'single',
  activeTool,
  activeOperatorType = null,
  axisConstraint,
  projection,
  displayMode,
  xrayTransparency,
  showFaceOrientation,
  showGrid,
  showAxes,
  showLiner,
  barhomeVisible,
  multiSelectTouch,
  screenShiftActive,
  hasSelectedObject,
  canEditSelected,
  hasSelectedComponents,
  canUndo,
  canRedo,
  hasUnsavedChanges,
  saveStatus,
  timelapseRecordingActive = false,
  timelapseStepCount = 0,
  proportionalEnabled,
  proportionalConnectedOnly,
  selectedObjectShading = null,
  onAddPrimitive,
  onAddLight,
  onSelectTool,
  onGQuickTapMove,
  onChangeAxisConstraint,
  onDuplicateObject,
  onApplyObjectTransform,
  onCenterObjectOrigin,
  onSeparateSelectedGeometry,
  onDeleteObject,
  onSetCameraPreset,
  onFocusSelected,
  onToggleProjection,
  onToggleWorkMode,
  onChangeEditSelectionMode,
  onChangeEdgeSelectionTool,
  onSelectEdgeTopology,
  onToggleXray,
  onSelectDisplayMode,
  onChangeXrayTransparency,
  onToggleFaceOrientation,
  onToggleGrid,
  onToggleAxes,
  onToggleLiner,
  onToggleBarhome,
  onToggleMultiSelectTouch,
  onToggleScreenShift,
  onUndo,
  onRedo,
  onStartOperator,
  onFillSelection,
  onConnectVertexPath,
  onRecalculateOutside,
  onFlipNormals,
  onQuickDissolve,
  onExecuteContextualDelete,
  onMarkSeams,
  onSelectSeams,
  onDeselectSeams,
  onToggleProportional,
  onToggleProportionalConnected,
  onCycleProportionalFalloff,
  onSelectAll,
  onDeselectAll,
  onSelectAllObjects,
  onDeselectAllObjects,
  onSelectConnected,
  onSetSelectedObjectShading,
  uvQuickState = null,
  uvActionsRef,
  onCreateProjectModal,
  onOpenProjectModal,
  onSaveProject,
  onSaveAsProjectModal,
  onImportNativeProject,
  onExportNativeProject,
  onImportExternal,
  onExportExternal,
  onImportObj,
  onImportStl,
  onImportJpg,
  onImportPng,
  onExportSelected,
  onExportScene,
  onExportObj,
  onExportStl,
  onReturnToGallery,
  onChangeWorkspace,
  onOpenSettings,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeMenu, setActiveMenu] = useState<'barhome' | 'tools' | null>(
    null,
  );

  useEffect(() => {
    if (!activeMenu) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeMenu]);

  const toolsScope: RadialLayoutScope =
    activeWorkspace === 'uv_editing'
      ? 'uv_editing'
      : activeWorkspace === 'materials'
        ? 'materials'
        : workMode;

  const toolsSlots =
    toolsScope === 'uv_editing'
      ? touchSettings.workspaceToolRadialLayouts.uv_editing
      : toolsScope === 'materials'
        ? touchSettings.workspaceToolRadialLayouts.materials
        : touchSettings.radialLayouts[workMode];

  const sharedProps = {
    containerRef,
    demoMode,
    activeWorkspace,
    workMode,
    editSelectionMode,
    edgeSelectionTool,
    activeTool,
    activeOperatorType,
    axisConstraint,
    projection,
    displayMode,
    xrayTransparency,
    xrayEditMode: displayMode === 'xray',
    showFaceOrientation,
    showGrid,
    showAxes,
    showLiner,
    barhomeVisible,
    multiSelectTouch,
    screenShiftActive,
    hasSelectedObject,
    canEditSelected,
    hasSelectedComponents,
    canUndo,
    canRedo,
    hasUnsavedChanges,
    saveStatus,
    timelapseRecordingActive,
    timelapseStepCount,
    selectedObjectShading,
    corner: touchSettings.floatingMenuCorner,
    size: touchSettings.floatingMenuSize,
    onUpdateRadialSlot,
    onResetRadialSlot,
    onResetRadialLayout,
    onAddPrimitive,
    onAddLight,
    onSelectTool,
    onGQuickTapMove,
    onChangeAxisConstraint,
    onDuplicateObject,
    onApplyObjectTransform,
    onCenterObjectOrigin,
    onSeparateSelectedGeometry,
    onDeleteObject,
    onSetCameraPreset,
    onFocusSelected,
    onToggleProjection,
    onToggleWorkMode,
    onChangeEditSelectionMode,
    onChangeEdgeSelectionTool,
    onSelectEdgeTopology,
    onToggleXray,
    onSelectDisplayMode,
    onChangeXrayTransparency,
    onToggleFaceOrientation,
    onToggleGrid,
    onToggleAxes,
    onToggleLiner,
    onToggleBarhome,
    onToggleMultiSelectTouch,
    onToggleScreenShift,
    onUndo,
    onRedo,
    onStartOperator,
    onFillSelection,
    onConnectVertexPath,
    onRecalculateOutside,
    onFlipNormals,
    onQuickDissolve,
    onExecuteContextualDelete,
    onMarkSeams,
    onSelectSeams,
    onDeselectSeams,
    proportionalEnabled,
    proportionalConnectedOnly,
    onToggleProportional,
    onToggleProportionalConnected,
    onCycleProportionalFalloff,
    onSelectAll,
    onDeselectAll,
    onSelectAllObjects,
    onDeselectAllObjects,
    onSelectConnected,
    onSetSelectedObjectShading,
    uvQuickState,
    uvActionsRef,
    onCreateProjectModal,
    onOpenProjectModal,
    onSaveProject,
    onSaveAsProjectModal,
    onImportNativeProject,
    onExportNativeProject,
    onImportExternal,
    onExportExternal,
    onImportObj,
    onImportStl,
    onImportJpg,
    onImportPng,
    onExportSelected,
    onExportScene,
    onExportObj,
    onExportStl,
    onReturnToGallery,
    onChangeWorkspace,
    onOpenSettings,
  };

  return (
    <div
      ref={containerRef}
      data-testid="floating-radial-pair-overlay"
      className={`pointer-events-none absolute top-0 bottom-0 z-30 transition-[left,right] duration-200 ease-out ${boundsClassName}`}
    >
      {/* Botón 1: Menú Radial BARHOME */}
      <FloatingRadialMenu
        {...sharedProps}
        menuKind="barhome"
        layoutScope="barhome"
        slots={touchSettings.barhomeRadialLayout}
        controlledIsOpen={activeMenu === 'barhome'}
        onOpenChange={(open) =>
          setActiveMenu((prev) =>
            open ? 'barhome' : prev === 'barhome' ? null : prev,
          )
        }
        stackIndex={1}
        triggerIcon={<PanelTop className="w-6 h-6" />}
        triggerTitle="Abrir menú radial BARHOME (arrastrar para reubicar)"
        triggerAriaLabel="Abrir menú radial BARHOME"
        triggerTestId="floating-radial-barhome-btn"
        wheelTestId="floating-radial-barhome-wheel"
        customizeTestId="floating-radial-barhome-customize"
        customPos={touchSettings.barhomeFloatingMenuCustomPos}
        onUpdateCustomPos={(pos) =>
          onUpdateTouchSettings({ barhomeFloatingMenuCustomPos: pos })
        }
      />

      {/* Botón 2: Menú Radial HERRAMIENTAS */}
      <FloatingRadialMenu
        {...sharedProps}
        menuKind="tools"
        layoutScope={toolsScope}
        slots={toolsSlots}
        controlledIsOpen={activeMenu === 'tools'}
        onOpenChange={(open) =>
          setActiveMenu((prev) =>
            open ? 'tools' : prev === 'tools' ? null : prev,
          )
        }
        stackIndex={0}
        triggerIcon={<Aperture className="w-6 h-6" />}
        triggerTitle="Abrir menú radial de herramientas (arrastrar para reubicar)"
        triggerAriaLabel="Abrir menú radial de herramientas"
        triggerTestId="floating-radial-tools-btn"
        wheelTestId="floating-radial-tools-wheel"
        customizeTestId="floating-radial-tools-customize"
        customPos={touchSettings.floatingMenuCustomPos}
        onUpdateCustomPos={(pos) =>
          onUpdateTouchSettings({ floatingMenuCustomPos: pos })
        }
      />
    </div>
  );
};
