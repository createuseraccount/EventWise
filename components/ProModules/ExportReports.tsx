import React, { useState } from 'react';
import { Plan } from '../../types';
import { FileText, Download, FileSpreadsheet, Printer, Loader2, CheckCircle2, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportReportsProps {
  plan: Plan;
}

const ExportReports: React.FC<ExportReportsProps> = ({ plan }) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const exportTimelinePDF = () => {
    setIsExporting('timeline');
    setTimeout(() => {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text(`${plan.name} - Timeline`, 14, 22);
      
      const tableData = (plan.timeline || []).map(t => [
        t.time,
        t.activity,
        t.notes || ''
      ]);

      autoTable(doc, {
        startY: 30,
        head: [['Time', 'Activity', 'Notes']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] } // Indigo 600
      });

      doc.save(`${plan.name.replace(/\s+/g, '_')}_Timeline.pdf`);
      setIsExporting(null);
      showSuccess('Timeline PDF exported successfully!');
    }, 500);
  };

  const exportRunSheetPDF = () => {
    setIsExporting('runsheet');
    setTimeout(() => {
      const doc = new jsPDF('landscape');
      doc.setFontSize(20);
      doc.text(`${plan.name} - Run Sheet`, 14, 22);
      
      const tableData = (plan.timeline || []).map(t => [
        t.time,
        t.activity,
        t.notes || '',
        'Pending'
      ]);

      autoTable(doc, {
        startY: 30,
        head: [['Time', 'Activity', 'Details/Notes', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [225, 29, 72] } // Rose 600
      });

      doc.save(`${plan.name.replace(/\s+/g, '_')}_RunSheet.pdf`);
      setIsExporting(null);
      showSuccess('Run Sheet PDF exported successfully!');
    }, 500);
  };

  const exportVendorDossierPDF = () => {
    setIsExporting('vendors');
    setTimeout(() => {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text(`${plan.name} - Vendor Dossier`, 14, 22);
      
      const tableData = (plan.vendors || []).map(v => [
        v.category,
        v.name || 'Unassigned',
        v.contact || 'N/A',
        `${v.actualPaid} / ${v.budgetedAmount}`,
        v.notes || ''
      ]);

      autoTable(doc, {
        startY: 30,
        head: [['Category', 'Vendor Name', 'Contact', 'Paid / Budget', 'Notes']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [15, 118, 110] } // Teal 700
      });

      doc.save(`${plan.name.replace(/\s+/g, '_')}_VendorDossier.pdf`);
      setIsExporting(null);
      showSuccess('Vendor Dossier PDF exported successfully!');
    }, 500);
  };

  const exportGuestsCSV = () => {
    setIsExporting('guests');
    setTimeout(() => {
      const headers = ['Name', 'Status', 'Dietary Restrictions'];
      const rows = (plan.rsvps || []).map(r => [
        `"${r.name.replace(/"/g, '""')}"`,
        `"${r.status}"`,
        `"${(r.dietaryRestrictions || '').replace(/"/g, '""')}"`
      ]);
      
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${plan.name.replace(/\s+/g, '_')}_Guests.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(null);
      showSuccess('Guest List CSV exported successfully!');
    }, 500);
  };

  const exportSeatingChartPDF = () => {
    setIsExporting('seating');
    setTimeout(() => {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text(`${plan.name} - Seating Chart`, 14, 22);
      
      const tableData = (plan.tables || []).map(t => [
        t.name,
        t.capacity.toString(),
        t.assignedGuestIds.join(', ') || 'Empty'
      ]);

      autoTable(doc, {
        startY: 30,
        head: [['Table Name', 'Capacity', 'Assigned Guests']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [245, 158, 11] } // Amber 500
      });

      doc.save(`${plan.name.replace(/\s+/g, '_')}_SeatingChart.pdf`);
      setIsExporting(null);
      showSuccess('Seating Chart PDF exported successfully!');
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <FileDown className="text-indigo-600" size={28} />
            Export & Reports
          </h2>
          <p className="text-slate-500 mt-2">Generate physical or easily shareable digital documents for your team, vendors, and venues.</p>
        </div>

        {successMsg && (
          <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={20} />
            <p className="font-medium">{successMsg}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* PDF Exports */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4">PDF Documents</h3>
            
            <ExportCard 
              title="Event Timeline" 
              description="A clean, chronological schedule of all activities."
              icon={<FileText size={24} className="text-indigo-500" />}
              onClick={exportTimelinePDF}
              isLoading={isExporting === 'timeline'}
              buttonText="Download PDF"
            />
            
            <ExportCard 
              title="Run Sheet" 
              description="Detailed operational schedule for coordinators and staff."
              icon={<Printer size={24} className="text-rose-500" />}
              onClick={exportRunSheetPDF}
              isLoading={isExporting === 'runsheet'}
              buttonText="Download PDF"
            />
            
            <ExportCard 
              title="Seating Chart" 
              description="Table arrangements and guest placements."
              icon={<FileText size={24} className="text-amber-500" />}
              onClick={exportSeatingChartPDF}
              isLoading={isExporting === 'seating'}
              buttonText="Download PDF"
            />
            
            <ExportCard 
              title="Vendor Dossier" 
              description="Compiled list of all vendor contacts, contracts, and payments."
              icon={<FileText size={24} className="text-teal-500" />}
              onClick={exportVendorDossierPDF}
              isLoading={isExporting === 'vendors'}
              buttonText="Download PDF"
            />
          </div>

          {/* Spreadsheet Exports */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Spreadsheets & Data</h3>
            
            <ExportCard 
              title="Guest List & RSVPs" 
              description="Export to CSV for printing mailing labels or sharing with caterers."
              icon={<FileSpreadsheet size={24} className="text-emerald-500" />}
              onClick={exportGuestsCSV}
              isLoading={isExporting === 'guests'}
              buttonText="Export CSV"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

const ExportCard = ({ title, description, icon, onClick, isLoading, buttonText }: any) => (
  <div className="p-5 border border-slate-100 rounded-2xl hover:border-indigo-100 hover:shadow-md transition-all bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
    </div>
    <button 
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm disabled:opacity-70 whitespace-nowrap"
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      {buttonText}
    </button>
  </div>
);

export default ExportReports;
