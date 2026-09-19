import { useState } from "react";
import { getDocumentById, getArtifactAsDocument, artifactTemplates } from "../../demo";

type Props = {
  documentId: string;
  highlightPage?: number;
  onClose: () => void;
};

export default function DocumentViewer({ documentId, highlightPage, onClose }: Props) {
  let doc = getDocumentById(documentId);
  if (!doc && artifactTemplates[documentId]) {
    doc = getArtifactAsDocument(documentId, artifactTemplates[documentId]);
  }
  
  const [currentPage, setCurrentPage] = useState(highlightPage || 1);

  if (!doc) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <p className="text-slate-600">Document not found.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium">Close</button>
        </div>
      </div>
    );
  }

  const currentSection = doc.sections.find(s => s.page === currentPage) || doc.sections[0];
  const allPages = doc.sections.map(s => s.page);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100 flex-shrink-0">
              {doc.type === "PDF" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line></svg>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-slate-900 truncate">{doc.name}</h2>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{doc.type}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">v{doc.version}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{doc.pages} pages</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  doc.classification === "RESTRICTED" ? "bg-red-100 text-red-700" :
                  doc.classification === "CONFIDENTIAL" ? "bg-amber-100 text-amber-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  🔒 {doc.classification}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex-shrink-0 ml-4">
            Close
          </button>
        </div>

        {/* Document metadata */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex items-center gap-6 text-xs flex-shrink-0">
          <div>
            <span className="text-slate-400 font-medium">Owner:</span>{" "}
            <span className="text-slate-700 font-semibold">{doc.owner}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Department:</span>{" "}
            <span className="text-slate-700 font-semibold">{doc.department}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Modified:</span>{" "}
            <span className="text-slate-700 font-semibold">{doc.lastModified}</span>
          </div>
        </div>

        {/* Content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Page navigation */}
          <div className="w-48 bg-slate-50 border-r border-slate-200 flex-shrink-0 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sections</div>
            {doc.sections.map((section) => (
              <button
                key={section.page}
                onClick={() => setCurrentPage(section.page)}
                className={`w-full text-left px-3 py-2.5 text-xs transition-colors border-l-2 ${
                  currentPage === section.page
                    ? "bg-white text-teal-700 font-medium border-teal-500"
                    : "text-slate-600 hover:bg-white border-transparent"
                }`}
              >
                <div className="text-[10px] text-slate-400 mb-0.5">Page {section.page}</div>
                <div className="line-clamp-2 leading-tight">{section.title}</div>
              </button>
            ))}
          </div>

          {/* Document content */}
          <div className="flex-1 overflow-y-auto p-6">
            {currentSection && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                    Page {currentSection.page}
                  </span>
                  {currentSection.page === highlightPage && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      ★ Referenced by AI
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{currentSection.title}</h3>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl p-5 border border-slate-100">
                  {currentSection.content}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with page navigation */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => {
              const idx = allPages.indexOf(currentPage);
              if (idx > 0) setCurrentPage(allPages[idx - 1]);
            }}
            disabled={allPages.indexOf(currentPage) === 0}
            className="text-xs px-3 py-1.5 rounded-lg font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
          >
            ← Previous
          </button>
          <span className="text-xs text-slate-500 font-medium">
            Section {allPages.indexOf(currentPage) + 1} of {allPages.length}
          </span>
          <button
            onClick={() => {
              const idx = allPages.indexOf(currentPage);
              if (idx < allPages.length - 1) setCurrentPage(allPages[idx + 1]);
            }}
            disabled={allPages.indexOf(currentPage) === allPages.length - 1}
            className="text-xs px-3 py-1.5 rounded-lg font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
