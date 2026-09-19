import { useState } from "react";

type Props = {
  status: "pending" | "approved" | "rejected";
  onApprove: () => void;
  onReject: () => void;
};

export default function ApprovalCard({ status, onApprove, onReject }: Props) {
  const [rejecting, setRejecting] = useState(false);

  if (status === "approved") {
    return (
      <div className="mt-3 flex items-center justify-between w-full border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span className="text-xs font-semibold text-emerald-700">Approved</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span>Reviewer: <span className="font-semibold text-slate-600">Anita Rao</span></span>
          <span>{new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="mt-3 flex items-center justify-between w-full border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </div>
          <span className="text-xs font-semibold text-red-700">Rejected</span>
        </div>
        <span className="text-[10px] text-slate-400">
          {new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center justify-between w-full border-t border-slate-100 pt-3">
      <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">Approval Required</span>
      <div className="flex items-center gap-2">
        <button
          onClick={onApprove}
          className="text-xs px-5 py-1.5 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 transition-colors shadow-sm"
        >
          Approve
        </button>
        <button
          onClick={() => { setRejecting(true); onReject(); }}
          className="text-xs px-5 py-1.5 bg-white border border-slate-200 text-slate-600 font-semibold rounded-md hover:bg-slate-50 transition-colors shadow-sm"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
