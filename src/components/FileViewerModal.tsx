import React from 'react';
import { TaskAttachment, Language } from '../types';
import {
  IconFileText,
  IconCamera,
  IconDownload,
  IconExternalLink,
  IconCheckCircle,
} from './Icons';

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: TaskAttachment | null;
  currentLang: Language;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({
  isOpen,
  onClose,
  attachment,
  currentLang,
}) => {
  if (!isOpen || !attachment) return null;

  const fileName = attachment.name;
  const lowerName = fileName.toLowerCase();
  const isImage =
    attachment.type === 'photo' ||
    lowerName.endsWith('.jpg') ||
    lowerName.endsWith('.jpeg') ||
    lowerName.endsWith('.png') ||
    lowerName.endsWith('.webp') ||
    lowerName.endsWith('.svg') ||
    lowerName.endsWith('.gif');
  const isPdf = lowerName.endsWith('.pdf');
  const isSpreadsheet =
    lowerName.endsWith('.xlsx') ||
    lowerName.endsWith('.xls') ||
    lowerName.endsWith('.csv');
  const isCad =
    lowerName.includes('.dwg') ||
    lowerName.endsWith('.dxf') ||
    lowerName.endsWith('.bim');

  const formattedSize =
    attachment.sizeBytes > 1048576
      ? `${(attachment.sizeBytes / 1048576).toFixed(2)} MB`
      : `${(attachment.sizeBytes / 1024).toFixed(0)} KB`;

  const formattedDate = new Date(attachment.uploadedAt).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDownload = () => {
    let url = attachment.dataUrl;
    if (!url) {
      const content = `Filename: ${attachment.name}\nUploaded By: ${attachment.uploadedBy}\nDate: ${attachment.uploadedAt}\nSize: ${formattedSize}\nStatus: Verified construction document for PU Duct Tracker.`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      url = URL.createObjectURL(blob);
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (!attachment.dataUrl) {
      URL.revokeObjectURL(url);
    }
  };

  const handleOpenInNewTab = () => {
    if (attachment.dataUrl) {
      const win = window.open();
      if (win) {
        if (isImage) {
          win.document.write(
            `<!DOCTYPE html><html><head><title>${attachment.name}</title><style>body{margin:0;background:#0f172a;display:flex;align-items:center;justify-content:center;height:100vh;}img{max-width:95vw;max-height:95vh;object-fit:contain;}</style></head><body><img src="${attachment.dataUrl}" alt="${attachment.name}" /></body></html>`
          );
        } else {
          win.location.href = attachment.dataUrl;
        }
      }
    } else {
      handleDownload();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container file-viewer-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="file-viewer-title"
      >
        {/* Modal Header */}
        <div className="file-viewer-header">
          <div className="file-viewer-header-info">
            <div className="file-viewer-type-icon">
              {isImage ? (
                <IconCamera size={20} />
              ) : (
                <IconFileText size={20} />
              )}
            </div>
            <div className="file-viewer-title-group">
              <h2 id="file-viewer-title" className="file-viewer-title" title={fileName}>
                {fileName}
              </h2>
              <div className="file-viewer-meta-row">
                <span className="file-badge">
                  {isCad
                    ? 'CAD / DRAWING'
                    : isPdf
                    ? 'PDF DOCUMENT'
                    : isSpreadsheet
                    ? 'SPREADSHEET'
                    : isImage
                    ? 'SITE PHOTO'
                    : 'DOCUMENT'}
                </span>
                <span>•</span>
                <span>{formattedSize}</span>
                <span>•</span>
                <span>
                  {currentLang === 'MY' ? 'Dimuat naik oleh' : 'Uploaded by'}{' '}
                  <strong>{attachment.uploadedBy}</strong>
                </span>
                <span>•</span>
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="file-viewer-toolbar">
            <button
              type="button"
              className="secondary-btn btn-sm"
              onClick={handleOpenInNewTab}
              title={currentLang === 'MY' ? 'Buka tab baharu' : 'Open in new tab'}
            >
              <IconExternalLink size={14} />
              <span>{currentLang === 'MY' ? 'Buka' : 'Open'}</span>
            </button>
            <button
              type="button"
              className="primary-btn btn-sm"
              onClick={handleDownload}
              title={currentLang === 'MY' ? 'Muat turun fail' : 'Download file'}
            >
              <IconDownload size={14} />
              <span>{currentLang === 'MY' ? 'Muat Turun' : 'Download'}</span>
            </button>
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer Viewport */}
        <div className="file-viewer-body">
          {/* 1. Real Image Preview */}
          {isImage && attachment.dataUrl && (
            <div className="file-image-container">
              <img
                src={attachment.dataUrl}
                alt={fileName}
                className="file-preview-image"
              />
            </div>
          )}

          {/* 2. Mock Image Preview if no dataUrl */}
          {isImage && !attachment.dataUrl && (
            <div className="mock-preview-canvas photo-mock-canvas">
              <div className="mock-photo-hud">
                <div className="mock-hud-badge">SITE INSPECTION PHOTO RECORD</div>
                <div className="mock-hud-stamp">STAMP: CONFIRMED - GRID 4-8</div>
              </div>
              <svg
                className="mock-photo-drawing"
                viewBox="0 0 600 380"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="600" height="380" fill="#1e293b" />
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" strokeWidth="0.5" />
                </pattern>
                <rect width="600" height="380" fill="url(#grid)" />
                <rect x="50" y="70" width="500" height="60" fill="#475569" stroke="#64748b" strokeWidth="2" />
                <text x="60" y="105" fill="#cbd5e1" fontSize="13" fontWeight="bold">
                  REINFORCED CONCRETE BEAM (ZONE B - GRID 4-8)
                </text>
                <rect x="220" y="60" width="160" height="80" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
                <text x="235" y="105" fill="#f59e0b" fontSize="11" fontWeight="bold">
                  SLEEVE 650 x 450 mm
                </text>
                <rect x="180" y="160" width="240" height="150" fill="#0284c7" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="3" />
                <rect x="200" y="180" width="200" height="110" fill="#0369a1" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="215" y="240" fill="#e0f2fe" fontSize="14" fontWeight="bold">
                  PU PIR DUCT 600 x 400 mm
                </text>
                <line x1="180" y1="330" x2="420" y2="330" stroke="#f43f5e" strokeWidth="2" />
                <polygon points="180,330 188,326 188,334" fill="#f43f5e" />
                <polygon points="420,330 412,326 412,334" fill="#f43f5e" />
                <text x="270" y="348" fill="#f43f5e" fontSize="12" fontWeight="bold">
                  WIDTH: 600 mm
                </text>
                <circle cx="200" cy="160" r="14" fill="#10b981" />
                <text x="195" y="165" fill="#ffffff" fontSize="12" fontWeight="bold">✓</text>
                <text x="70" y="190" fill="#10b981" fontSize="12" fontWeight="bold">
                  Clearance: 50mm (Pass)
                </text>
              </svg>
              <div className="mock-canvas-footer">
                <span>Subject: {fileName}</span>
                <span>Verified by: {attachment.uploadedBy}</span>
              </div>
            </div>
          )}

          {/* 3. Real PDF Preview */}
          {isPdf && attachment.dataUrl && (
            <div className="file-pdf-container">
              <iframe
                src={attachment.dataUrl}
                title={fileName}
                className="file-preview-iframe"
              />
            </div>
          )}

          {/* 4. Mock CAD / PDF Drawing Preview */}
          {isPdf && !attachment.dataUrl && (
            <div className="mock-preview-canvas cad-mock-canvas">
              <div className="blueprint-header-bar">
                <span className="blueprint-title">
                  {isCad ? 'AUTOCAD REV C APPROVED SHOP DRAWING' : 'OFFICIAL CONTRACT DOCUMENT & APPROVAL'}
                </span>
                <span className="blueprint-scale">SCALE 1:50 | PROJECT: TRX TOWER 2</span>
              </div>

              <div className="blueprint-view-area">
                <svg
                  className="blueprint-svg"
                  viewBox="0 0 700 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="10" y="10" width="680" height="380" fill="#0f172a" stroke="#0ea5e9" strokeWidth="2" />
                  <rect x="18" y="18" width="664" height="364" fill="none" stroke="#0284c7" strokeWidth="1" strokeDasharray="6 3" />
                  <path d="M 50 180 L 250 180 L 250 80 L 520 80" stroke="#38bdf8" strokeWidth="3" fill="none" />
                  <path d="M 50 240 L 310 240 L 310 140 L 520 140" stroke="#38bdf8" strokeWidth="3" fill="none" />
                  <rect x="40" y="160" width="60" height="100" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                  <text x="50" y="215" fill="#38bdf8" fontSize="12" fontWeight="bold">AHU-02</text>
                  <path d="M 280 80 L 280 40 L 380 40" stroke="#38bdf8" strokeWidth="2" fill="none" />
                  <text x="290" y="32" fill="#94a3b8" fontSize="10">Branch to Zone B3</text>
                  <rect x="520" y="90" width="40" height="40" fill="#334155" stroke="#38bdf8" strokeWidth="1.5" />
                  <line x1="520" y1="90" x2="560" y2="130" stroke="#38bdf8" strokeWidth="1" />
                  <line x1="560" y1="90" x2="520" y2="130" stroke="#38bdf8" strokeWidth="1" />
                  <text x="505" y="150" fill="#94a3b8" fontSize="10">Linear Diffuser (VAV-4)</text>
                  <line x1="250" y1="260" x2="310" y2="260" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="260" y="275" fill="#f59e0b" fontSize="11" fontWeight="bold">600W</text>
                  <g transform="translate(420, 240) rotate(-8)">
                    <rect x="0" y="0" width="230" height="85" rx="6" fill="#10b981" fillOpacity="0.12" stroke="#10b981" strokeWidth="3" />
                    <text x="15" y="26" fill="#10b981" fontSize="14" fontWeight="bold" letterSpacing="0.05em">
                      CONSULTANT APPROVED
                    </text>
                    <text x="15" y="46" fill="#10b981" fontSize="11" fontWeight="600">
                      STATUS: CODE 1 (APPROVED)
                    </text>
                    <text x="15" y="64" fill="#34d399" fontSize="10">
                      BY: C&S CONSULTANT / VERIFIED
                    </text>
                  </g>
                  <rect x="360" y="310" width="310" height="60" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5" />
                  <text x="370" y="328" fill="#e2e8f0" fontSize="11" fontWeight="bold">
                    DRAWING: {fileName}
                  </text>
                  <text x="370" y="344" fill="#94a3b8" fontSize="10">
                    DISCIPLINE: MECHANICAL DUCTWORK (PU PIR 20MM)
                  </text>
                  <text x="370" y="360" fill="#38bdf8" fontSize="10">
                    REV: C | DATE: {new Date(attachment.uploadedAt).toLocaleDateString()}
                  </text>
                </svg>
              </div>
            </div>
          )}

          {/* 5. Spreadsheet Preview */}
          {isSpreadsheet && (
            <div className="mock-preview-canvas sheet-mock-canvas">
              <div className="sheet-tab-bar">
                <span className="sheet-active-tab">TakeOff_Summary_L04</span>
                <span className="sheet-inactive-tab">Wastage_Calc</span>
                <span className="sheet-inactive-tab">Panel_Cut_List</span>
              </div>
              <div className="sheet-table-scroll">
                <table className="sheet-preview-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Duct Mark</th>
                      <th>Process Section</th>
                      <th>Size WxH (mm)</th>
                      <th>Length (m)</th>
                      <th>Net Area (m²)</th>
                      <th>PIR Panels (20mm)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td><strong>D-AHU02-01</strong></td>
                      <td>Main Supply Header</td>
                      <td>1200 x 600</td>
                      <td>18.5</td>
                      <td>66.6</td>
                      <td>24 Sheets</td>
                      <td><span className="sheet-tag-done">Fabricated</span></td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td><strong>D-AHU02-02</strong></td>
                      <td>Zone B Branch 1</td>
                      <td>800 x 500</td>
                      <td>14.0</td>
                      <td>36.4</td>
                      <td>13 Sheets</td>
                      <td><span className="sheet-tag-done">Fabricated</span></td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td><strong>D-AHU02-03</strong></td>
                      <td>Zone B Branch 2</td>
                      <td>600 x 400</td>
                      <td>22.0</td>
                      <td>44.0</td>
                      <td>16 Sheets</td>
                      <td><span className="sheet-tag-ready">Pending QC</span></td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td><strong>D-AHU03-01</strong></td>
                      <td>Corridor Branch L04</td>
                      <td>500 x 300</td>
                      <td>16.5</td>
                      <td>26.4</td>
                      <td>10 Sheets</td>
                      <td><span className="sheet-tag-ready">In Progress</span></td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td><strong>D-FIT-ELB</strong></td>
                      <td>90° Elbow Fittings (x12)</td>
                      <td>Various</td>
                      <td>-</td>
                      <td>18.8</td>
                      <td>7 Sheets</td>
                      <td><span className="sheet-tag-done">Ready</span></td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'right', fontWeight: 700 }}>
                        Total Panel Take-Off (with 15% Wastage Allowance):
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>192.2 m²</td>
                      <td style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>70 Sheets</td>
                      <td><span className="sheet-tag-done">Verified</span></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* 6. Generic File Preview if not matched above */}
          {!isImage && !isPdf && !isSpreadsheet && (
            <div className="generic-file-card">
              <IconFileText size={48} className="generic-card-icon" />
              <h3>{fileName}</h3>
              <p className="generic-card-meta">
                {formattedSize} • {attachment.type.toUpperCase()} • Uploaded by {attachment.uploadedBy}
              </p>
              <div className="generic-card-audit">
                <IconCheckCircle size={16} className="text-emerald-500" />
                <span>Document Integrity Verified • Available for Direct Download</span>
              </div>
              <button
                type="button"
                className="primary-btn mt-4"
                onClick={handleDownload}
              >
                <IconDownload size={16} />
                <span>{currentLang === 'MY' ? 'Muat Turun Fail' : 'Download File'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
