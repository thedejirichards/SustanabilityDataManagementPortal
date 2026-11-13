import { useEffect, useMemo } from 'react'
import { Download, FileText, Image, Video } from 'lucide-react'
import type { EvidenceAttachment } from '../data/sustainability'

export default function EvidenceFiles({ attachments = [] }: { attachments?: EvidenceAttachment[] }) {
  const fileUrls = useMemo(() => attachments.map(({ file }) => URL.createObjectURL(file)), [attachments])

  useEffect(() => () => fileUrls.forEach((url) => URL.revokeObjectURL(url)), [fileUrls])

  return (
    <section className="mt-4 rounded-xl border border-slate-200 p-4" aria-label="Supporting evidence">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Supporting evidence</h3>
          <p className="mt-1 text-xs text-slate-500">Source files attached to this metric.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{attachments.length} {attachments.length === 1 ? 'file' : 'files'}</span>
      </div>
      {attachments.length === 0 ? (
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-3 text-xs text-slate-500">No supporting files attached.</p>
      ) : (
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {attachments.map((attachment, index) => {
            const url = fileUrls[index]
            const isImage = attachment.type.startsWith('image/')
            const isVideo = attachment.type.startsWith('video/')
            const isPdf = attachment.type === 'application/pdf' || attachment.name.toLowerCase().endsWith('.pdf')
            const Icon = isImage ? Image : isVideo ? Video : FileText
            return (
              <li key={attachment.id} className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                {isImage && <a href={url} target="_blank" rel="noreferrer" aria-label={`Open ${attachment.name}`}><img src={url} alt={attachment.name} className="h-40 w-full object-cover" /></a>}
                {isVideo && <video controls preload="metadata" className="h-40 w-full bg-slate-950" aria-label={attachment.name}><source src={url} type={attachment.type} />Video preview is not supported by this browser.</video>}
                {isPdf && <iframe src={url} title={`Preview ${attachment.name}`} className="h-48 w-full bg-slate-100" />}
                <div className="flex items-center gap-3 p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><Icon className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800" title={attachment.name}>{attachment.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{attachment.type || 'File'} · {(attachment.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <a href={url} download={attachment.name} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-700" aria-label={`Download ${attachment.name}`}><Download className="h-4 w-4" /></a>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      <p className="mt-3 text-xs leading-5 text-slate-500">Files remain in this demonstration session. Configure protected server storage for durable access and retention.</p>
    </section>
  )
}
