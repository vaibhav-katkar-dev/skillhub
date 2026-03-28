import React from 'react';
import { ShieldCheck, Award, QrCode } from 'lucide-react';

/**
 * Premium Job Simulation Certificate Component
 * Re-designed with Coursera/Google style aesthetics.
 * Follows the 8px spacing system and precision layout rules.
 */
const JobSimulationCertificate = ({ 
  data = {
    studentName: "VAIBHAV KATKAR",
    eventTitle: "Frontend Engineering Job Simulation",
    certificateId: "EVC-1A2B3C4D",
    issueDate: "October 24, 2025",
    role: "Lead Developer Intern"
  }
}) => {
  return (
    <div className="relative w-full max-w-[1000px] aspect-[1.414/1] bg-slate-50 border-[16px] border-white shadow-2xl mx-auto overflow-hidden font-sans text-slate-900 group">
      {/* Decorative Gold Border */}
      <div className="absolute inset-4 border border-amber-200/60 pointer-events-none" />
      
      {/* Subtle Premium Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      {/* STEP 6: QR Code Section (Top-Right) */}
      <div className="absolute top-10 right-10 flex flex-col items-center gap-[6px]">
        <div className="bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
          <QrCode className="w-16 h-16 text-slate-800" />
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter text-center leading-tight">
          Scan to verify<br />authenticity
        </p>
      </div>

      {/* Main Layout Container */}
      <div className="flex flex-col items-center h-full pt-16 px-16 pb-12">
        
        {/* STEP 1 & 2: Center Alignment & Vertical Spacing */}
        
        {/* Header Section */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em]">
            SkillValix Professional Achievement
          </span>
        </div>

        {/* STEP 8: Typography Hierarchy */}
        <h1 className="text-3xl font-black text-slate-900 tracking-[0.1em] uppercase mb-3">
          Certificate of Achievement
        </h1>

        <p className="text-sm font-medium text-slate-500 mb-[10px]">
          This certifies that
        </p>

        {/* Candidate Name Section */}
        <div className="flex flex-col items-center mb-[6px]">
          <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight">
            {data.studentName.toUpperCase()}
          </h2>
          {/* Name Underline */}
          <div className="w-[85%] h-[2px] bg-amber-400 mt-[6px]" />
        </div>

        <p className="text-sm font-semibold text-slate-500 mb-4">
          has successfully completed a professional job simulation
        </p>

        {/* STEP 4: Course Box Alignment */}
        <div className="w-full max-w-2xl bg-white border border-amber-100 rounded-2xl p-5 shadow-sm flex items-center justify-center mb-3.5">
          <h3 className="text-2xl font-black text-indigo-900 text-center leading-tight">
            {data.eventTitle}
          </h3>
        </div>

        {/* STEP 3: Text Width & Wrapping */}
        <div className="max-w-[70%] mb-5">
          <p className="text-[13px] text-slate-600 text-center leading-relaxed">
            This certification is awarded for successfully completing a real-world job simulation, 
            demonstrating practical expertise, problem-solving ability, and job-ready skills in a 
            high-performance environment.
          </p>
        </div>

        {/* STEP 5: Bottom Cards Alignment (Single Row) */}
        <div className="grid grid-cols-3 gap-6 w-full mb-4">
          {/* Card 1 */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col justify-center">
            <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">
              Certificate ID
            </p>
            <p className="text-[13px] font-black text-slate-800 font-mono">
              {data.certificateId}
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col justify-center">
            <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">
              Issued On
            </p>
            <p className="text-[13px] font-black text-slate-800">
              {data.issueDate}
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col justify-center">
            <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">
              Role
            </p>
            <p className="text-[13px] font-black text-slate-800">
              {data.role || 'Participant'}
            </p>
          </div>
        </div>

        {/* Spacer to push footer to bottom */}
        <div className="flex-grow" />

        {/* STEP 7: Footer Alignment */}
        <div className="w-full pt-4 border-t border-slate-200 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-emerald-500" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Issued by SkillValix • MSME Registered • Industry Verified
            </p>
          </div>
          <p className="text-[9px] text-slate-400">
            Digitally verifiable credential • Scan QR to validate authenticity • skillvalix.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobSimulationCertificate;
