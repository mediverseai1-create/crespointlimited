'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/LoadingSpinner'
import { timeAgo } from '@/lib/utils'
import { FileText, Plus, Download, Eye, Loader2 } from 'lucide-react'
import type { Report } from '@/types'

const REPORT_TYPES = [
  { value: 'executive_summary', label: 'Executive Summary' },
  { value: 'performance_report', label: 'Performance Report' },
  { value: 'operations_report', label: 'Operations Report' },
  { value: 'trend_analysis', label: 'Trend Analysis' },
  { value: 'opportunity_report', label: 'Opportunity Report' },
]

const typeBadge: Record<string, 'default' | 'info' | 'success' | 'warning' | 'navy'> = {
  executive_summary: 'navy',
  performance_report: 'info',
  operations_report: 'warning',
  trend_analysis: 'success',
  opportunity_report: 'amber' as 'default',
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [showGen, setShowGen] = useState(false)
  const [genType, setGenType] = useState('executive_summary')
  const [viewReport, setViewReport] = useState<Report | null>(null)
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user.id).single()
    if (!profile?.organization_id) { setLoading(false); return }
    const { data } = await supabase.from('reports').select('*').eq('organization_id', profile.organization_id).order('created_at', { ascending: false })
    setReports(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const generate = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: genType }),
      })
      if (res.ok) {
        setShowGen(false)
        load()
      }
    } finally {
      setGenerating(false)
    }
  }

  const handlePrint = (report: Report) => {
    const content = typeof report.content === 'object'
      ? JSON.stringify(report.content, null, 2)
      : String(report.content)
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<html><head><title>${report.title}</title></head><body><pre style="font-family:sans-serif;white-space:pre-wrap">${content}</pre></body></html>`)
    win.print()
  }

  if (loading) return <TableSkeleton />

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={() => setShowGen(true)}><Plus className="h-4 w-4" />Generate Report</Button>
      </div>

      {reports.length === 0 ? (
        <EmptyState icon={FileText} title="No reports yet" description="Generate your first AI-powered business report." actionLabel="Generate Report" onAction={() => setShowGen(true)} />
      ) : (
        <div className="space-y-3">
          {reports.map(report => (
            <Card key={report.id} padding="sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#0F1E3C]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-[#0F1E3C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0F1E3C] text-sm">{report.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={typeBadge[report.type] ?? 'default'}>
                      {REPORT_TYPES.find(t => t.value === report.type)?.label ?? report.type}
                    </Badge>
                    <span className="text-xs text-[#64748B]">{timeAgo(report.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setViewReport(report)}>
                    <Eye className="h-4 w-4" /> View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handlePrint(report)}>
                    <Download className="h-4 w-4" /> Export
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Generate Modal */}
      <Modal isOpen={showGen} onClose={() => setShowGen(false)} title="Generate New Report">
        <div className="space-y-4">
          <Select
            label="Report Type"
            options={REPORT_TYPES}
            value={genType}
            onChange={e => setGenType(e.target.value)}
          />
          <p className="text-sm text-[#64748B]">The AI will analyze your organization data and generate a comprehensive report.</p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowGen(false)} className="flex-1">Cancel</Button>
            <Button onClick={generate} loading={generating} className="flex-1">
              {generating ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewReport} onClose={() => setViewReport(null)} title={viewReport?.title ?? ''} size="xl">
        {viewReport && (
          <div>
            <pre className="text-sm text-[#0F1E3C] whitespace-pre-wrap font-sans leading-relaxed">
              {typeof viewReport.content === 'object' && viewReport.content !== null && 'summary' in viewReport.content
                ? String((viewReport.content as Record<string, unknown>).summary ?? JSON.stringify(viewReport.content, null, 2))
                : JSON.stringify(viewReport.content, null, 2)}
            </pre>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="outline" size="sm" onClick={() => handlePrint(viewReport)}>
                <Download className="h-4 w-4" /> Export / Print
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
