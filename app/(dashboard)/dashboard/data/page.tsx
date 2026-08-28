'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Papa from 'papaparse'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/LoadingSpinner'
import { timeAgo, formatNumber } from '@/lib/utils'
import { Database, Upload, CheckCircle, XCircle, Clock } from 'lucide-react'
import type { DataUpload } from '@/types'

interface ParsedRow { [key: string]: string }

export default function DataPage() {
  const [uploads, setUploads] = useState<DataUpload[]>([])
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState<{ rows: ParsedRow[]; columns: string[]; filename: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const loadUploads = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    if (!profile?.organization_id) { setLoading(false); return }
    const { data } = await supabase.from('data_uploads').select('*').eq('organization_id', profile.organization_id).order('created_at', { ascending: false })
    setUploads(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadUploads() }, [loadUploads])

  const parseFile = (file: File) => {
    Papa.parse<ParsedRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setPreview({
          rows: result.data.slice(0, 5),
          columns: result.meta.fields ?? [],
          filename: file.name,
        })
      },
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) parseFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) parseFile(file)
  }

  const confirmUpload = async () => {
    if (!preview) return
    setUploading(true)
    try {
      const res = await fetch('/api/data/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: preview.filename, columns: preview.columns, rowCount: preview.rows.length }),
      })
      if (res.ok) { setPreview(null); loadUploads() }
    } finally {
      setUploading(false)
    }
  }

  const statusBadge = (status: string) => {
    if (status === 'completed') return <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
    if (status === 'failed') return <Badge variant="danger"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>
    return <Badge variant="warning"><Clock className="h-3 w-3 mr-1" />{status}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card>
        <CardHeader><CardTitle>Upload Data</CardTitle></CardHeader>
        <CardContent>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${dragging ? 'border-[#D4A843] bg-[#D4A843]/5' : 'border-gray-300 hover:border-[#D4A843] hover:bg-gray-50'}`}
            onClick={() => fileRef.current?.click()}
          >
            <Upload className={`h-10 w-10 mx-auto mb-3 ${dragging ? 'text-[#D4A843]' : 'text-gray-400'}`} />
            <p className="font-medium text-[#0F1E3C]">Drop CSV file here or click to browse</p>
            <p className="text-sm text-[#64748B] mt-1">Supports .csv and .xlsx files</p>
          </div>
          <input ref={fileRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFileChange} />
        </CardContent>
      </Card>

      {/* Preview */}
      {preview && (
        <Card>
          <CardHeader>
            <CardTitle>Preview: {preview.filename}</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPreview(null)}>Cancel</Button>
              <Button size="sm" onClick={confirmUpload} loading={uploading}>Confirm Upload</Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#64748B] mb-3">{preview.columns.length} columns · {preview.rows.length} preview rows</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    {preview.columns.map(col => (
                      <th key={col} className="px-3 py-2 text-left font-semibold text-[#0F1E3C] border-b border-gray-200">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {preview.rows.map((row, i) => (
                    <tr key={i}>
                      {preview.columns.map(col => (
                        <td key={col} className="px-3 py-2 text-[#64748B] max-w-[150px] truncate">{row[col]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload History */}
      <div>
        <h2 className="text-base font-semibold text-[#0F1E3C] mb-4">Upload History</h2>
        {loading ? <TableSkeleton /> : uploads.length === 0 ? (
          <EmptyState icon={Database} title="No uploads yet" description="Upload your first CSV to start populating your analytics." />
        ) : (
          <Card padding="none">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Filename', 'Rows', 'Columns', 'Status', 'Uploaded'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {uploads.map(u => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 text-sm font-medium text-[#0F1E3C]">{u.filename}</td>
                    <td className="px-4 py-3 text-sm text-[#64748B]">{u.row_count != null ? formatNumber(u.row_count) : '—'}</td>
                    <td className="px-4 py-3 text-sm text-[#64748B]">{Array.isArray(u.columns) ? u.columns.length : '—'}</td>
                    <td className="px-4 py-3">{statusBadge(u.status)}</td>
                    <td className="px-4 py-3 text-xs text-[#64748B]">{timeAgo(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  )
}
