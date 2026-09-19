import { useState } from "react";
import type { EvidenceSource, RetrievalStrategy } from "../../demo";
import DocumentViewer from "./DocumentViewer";

type Props = {
  sources: EvidenceSource[];
  retrievalStrategy: RetrievalStrategy;
};

export default function EvidencePanel({ sources, retrievalStrategy }: Props) {
  const [viewingDoc, setViewingDoc] = useState<EvidenceSource | null>(null);

  const strategyItems = [
    { key: "keywordSearch", label: "Keyword Search (BM25)", active: retrievalStrategy.keywordSearch },
    { key: "semanticSearch", label: "Semantic Search (Vector)", active: retrievalStrategy.semanticSearch },
    { key: "postgresql", label: "PostgreSQL Query", active: retrievalStrategy.postgresql },
    { key: "reranking", label: "Reranking (BGE-Reranker)", active: retrievalStrategy.reranking },
    { key: "permissionFiltering", label: "Permission Filtering", active: retrievalStrategy.permissionFiltering },
  ];

  return (
    <>
      {/* Retrieval Strategy */}
      <div className="mb-5">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Retrieval Strategy</div>
        <div className="space-y-1.5">
          {strategyItems.map((item) => (
            <div key={item.key} className="flex items-center gap-2">
              {item.active ? (
                <div className="w-4 h-4 rounded flex items-center justify-center bg-emerald-100">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              ) : (
                <div className="w-4 h-4 rounded border border-slate-200 bg-slate-50"></div>
              )}
              <span className={`text-xs ${item.active ? "text-slate-700 font-medium" : "text-slate-400"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Sources */}
      {sources.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evidence Sources</div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
              {sources.length} USED
            </span>
          </div>
          <div className="space-y-3">
            {sources.map((source, i) => {
              const getPdfUrl = (docId: string) => {
                switch (docId) {
                  case "doc-inspection-aug2026": return "/documents/p102-inspection-report.pdf";
                  case "doc-sop-p102": return "/documents/p102-inspection-sop.pdf";
                  case "doc-vibration-limits": return "/documents/mrpl-vibration-limits.pdf";
                  default: return null;
                }
              };
              const pdfUrl = getPdfUrl(source.documentId);
              
              return (
              <div
                key={i}
                className="w-full text-left p-3 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-slate-200 transition-all group"
              >
                <div className="font-semibold text-sm text-slate-800 line-clamp-1 mb-1.5 group-hover:text-teal-700 transition-colors cursor-pointer" onClick={() => setViewingDoc(source)}>
                  {source.filename}
                </div>
                <div className="text-xs text-slate-500 line-clamp-2 mb-2 italic leading-relaxed">
                  &ldquo;{source.snippet}&rdquo;
                </div>
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                    {source.fileType}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                    p.{source.page}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                    v{source.version}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    source.classification === "RESTRICTED" ? "bg-red-50 text-red-600" :
                    source.classification === "CONFIDENTIAL" ? "bg-amber-50 text-amber-600" :
                    "bg-blue-50 text-blue-600"
                  }`}>
                    🔒 {source.classification}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider">
                    {source.retrievalMethod}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {(source.relevance * 100).toFixed(0)}% Match
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  {pdfUrl && (
                    <button
                      onClick={(e) => { e.stopPropagation(); window.open(pdfUrl, "_blank", "noopener,noreferrer"); }}
                      className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 bg-slate-800 text-white rounded font-medium hover:bg-slate-900 transition-colors shadow-sm"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                      Open PDF
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setViewingDoc(source); }}
                    className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 bg-white border border-slate-200 rounded text-slate-600 font-medium hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Preview
                  </button>
                </div>
              </div>
            )})}
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <DocumentViewer
          documentId={viewingDoc.documentId}
          highlightPage={viewingDoc.page}
          onClose={() => setViewingDoc(null)}
        />
      )}
    </>
  );
}
