import { useAppStore, Assessment } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function VisualTriangle() {
  const { programme, modules, assessments } = useAppStore();

  if (!programme) return <div>Please set programme details first.</div>;

  const weeks = Array.from({ length: programme.weeks }, (_, i) => i + 1);

  const getAssessmentsForModuleAndWeek = (moduleId: number, week: number) => {
    return assessments.filter(a => a.moduleId === moduleId && a.week === week);
  };

  // Helper to get color class
  const getTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t === 'artifact') return 'fill-[var(--color-artifact)] stroke-[var(--color-artifact)] text-[var(--color-artifact)]';
    if (t === 'case analysis') return 'fill-[var(--color-case-analysis)] stroke-[var(--color-case-analysis)] text-[var(--color-case-analysis)]';
    if (t === 'code submission') return 'fill-[var(--color-code-submission)] stroke-[var(--color-code-submission)] text-[var(--color-code-submission)]';
    if (t === 'essay') return 'fill-[var(--color-essay)] stroke-[var(--color-essay)] text-[var(--color-essay)]';
    if (t === 'lab notebook') return 'fill-[var(--color-lab-notebook)] stroke-[var(--color-lab-notebook)] text-[var(--color-lab-notebook)]';
    if (t === 'portfolio') return 'fill-[var(--color-portfolio)] stroke-[var(--color-portfolio)] text-[var(--color-portfolio)]';
    if (t === 'poster') return 'fill-[var(--color-poster)] stroke-[var(--color-poster)] text-[var(--color-poster)]';
    if (t === 'presentation slides') return 'fill-[var(--color-presentation-slides)] stroke-[var(--color-presentation-slides)] text-[var(--color-presentation-slides)]';
    if (t === 'product demonstration') return 'fill-[var(--color-product-demonstration)] stroke-[var(--color-product-demonstration)] text-[var(--color-product-demonstration)]';
    if (t === 'prototype') return 'fill-[var(--color-prototype)] stroke-[var(--color-prototype)] text-[var(--color-prototype)]';
    if (t === 'reflective journal') return 'fill-[var(--color-reflective-journal)] stroke-[var(--color-reflective-journal)] text-[var(--color-reflective-journal)]';
    if (t === 'studio output') return 'fill-[var(--color-studio-output)] stroke-[var(--color-studio-output)] text-[var(--color-studio-output)]';
    if (t === 'thesis / dissertation document') return 'fill-[var(--color-thesis-dissertation-document)] stroke-[var(--color-thesis-dissertation-document)] text-[var(--color-thesis-dissertation-document)]';
    if (t === 'video recording') return 'fill-[var(--color-video-recording)] stroke-[var(--color-video-recording)] text-[var(--color-video-recording)]';
    if (t === 'written report') return 'fill-[var(--color-written-report)] stroke-[var(--color-written-report)] text-[var(--color-written-report)]';
    
    // Legacy fallbacks
    if (t === 'delivery') return 'fill-[var(--color-delivery)] stroke-[var(--color-delivery)] text-[var(--color-delivery)]';
    if (t === 'presentation') return 'fill-[var(--color-presentation)] stroke-[var(--color-presentation)] text-[var(--color-presentation)]';
    if (t === 'exam') return 'fill-[var(--color-exam)] stroke-[var(--color-exam)] text-[var(--color-exam)]';
    if (t === 'report') return 'fill-[var(--color-report)] stroke-[var(--color-report)] text-[var(--color-report)]';
    if (t === 'case study') return 'fill-[var(--color-casestudy)] stroke-[var(--color-casestudy)] text-[var(--color-casestudy)]';
    
    return 'fill-gray-500 stroke-gray-500 text-gray-500';
  };
  
  // Helper for background circle color (solid)
  const getCircleColor = (type: string) => {
    const t = type.toLowerCase();
    if (t === 'artifact') return 'bg-[var(--color-artifact)]';
    if (t === 'case analysis') return 'bg-[var(--color-case-analysis)]';
    if (t === 'code submission') return 'bg-[var(--color-code-submission)]';
    if (t === 'essay') return 'bg-[var(--color-essay)]';
    if (t === 'lab notebook') return 'bg-[var(--color-lab-notebook)]';
    if (t === 'portfolio') return 'bg-[var(--color-portfolio)]';
    if (t === 'poster') return 'bg-[var(--color-poster)]';
    if (t === 'presentation slides') return 'bg-[var(--color-presentation-slides)]';
    if (t === 'product demonstration') return 'bg-[var(--color-product-demonstration)]';
    if (t === 'prototype') return 'bg-[var(--color-prototype)]';
    if (t === 'reflective journal') return 'bg-[var(--color-reflective-journal)]';
    if (t === 'studio output') return 'bg-[var(--color-studio-output)]';
    if (t === 'thesis / dissertation document') return 'bg-[var(--color-thesis-dissertation-document)]';
    if (t === 'video recording') return 'bg-[var(--color-video-recording)]';
    if (t === 'written report') return 'bg-[var(--color-written-report)]';

    // Legacy fallbacks
    if (t === 'delivery') return 'bg-[var(--color-delivery)]';
    if (t === 'presentation') return 'bg-[var(--color-presentation)]';
    if (t === 'exam') return 'bg-[var(--color-exam)]';
    if (t === 'report') return 'bg-[var(--color-report)]';
    if (t === 'case study') return 'bg-[var(--color-casestudy)]';
    
    return 'bg-gray-500';
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-border overflow-x-auto">
      <div className="min-w-[1000px]">
        {/* Header Row */}
        <div className="grid gap-0" style={{ gridTemplateColumns: `200px repeat(${programme.weeks}, 1fr)` }}>
          <div className="p-2 font-bold text-primary text-sm uppercase tracking-wider border-b border-border">Module</div>
          {weeks.map(week => (
            <div key={week} className="p-2 text-center text-xs font-medium text-muted-foreground border-b border-l border-border bg-muted/30">
              WK {week}
            </div>
          ))}
        </div>

        {/* Module Rows */}
        {modules.map(module => (
          <div key={module.id} className="grid gap-0 group hover:bg-muted/10 transition-colors relative" 
               style={{ gridTemplateColumns: `200px repeat(${programme.weeks}, 1fr)` }}>
            
            {/* Module Label */}
            <div className="p-4 text-sm font-medium text-primary border-b border-border flex flex-col justify-center z-10 bg-white/50 backdrop-blur-sm">
              <span className="font-bold text-secondary">{module.code}</span>
              <span className="text-xs text-muted-foreground line-clamp-2">{module.title}</span>
            </div>

            {/* Timeline Bar Background Line - Absolute positioned across the row */}
            <div className="absolute left-[200px] right-0 top-1/2 h-0.5 bg-primary/20 -translate-y-1/2 z-0 pointer-events-none" />

            {/* Week Cells */}
            {weeks.map(week => {
              const moduleAssessments = getAssessmentsForModuleAndWeek(module.id, week);
              
              return (
                <div key={week} className="relative border-b border-l border-border/50 min-h-[120px] flex flex-col items-center justify-center py-2">
                  {moduleAssessments.map((assessment, idx) => (
                    <div key={assessment.id} className="relative group/item z-10 mb-6 last:mb-0">
                      {/* The Triangle Marker */}
                      <div className="relative flex flex-col items-center">
                        {/* Triangle SVG */}
                        <svg width="40" height="40" viewBox="0 0 40 40" className="drop-shadow-sm transform transition-transform hover:scale-110">
                           {/* The Triangle Shape */}
                           <path 
                             d="M20 5 L35 35 L5 35 Z" 
                             className={cn(
                               "fill-white stroke-2", 
                               getTypeColor(assessment.atype).replace('fill-', 'dummy-').replace('text-', 'dummy-') // only keep stroke
                             )}
                             style={{ fill: 'white' }}
                           />
                           
                           {/* Inner Circle for Type Color */}
                           <circle cx="20" cy="25" r="4" className={getTypeColor(assessment.atype).replace('stroke-', 'dummy-').replace('text-', 'dummy-')} />
                           
                           {/* Mode Indicator (Line at bottom) */}
                           {assessment.mode === 'Individual' && (
                              <line x1="10" y1="38" x2="30" y2="38" stroke="currentColor" strokeWidth="2" strokeDasharray="2,2" className="text-primary" />
                           )}
                           {assessment.mode === 'Group' && (
                              <line x1="10" y1="38" x2="30" y2="38" stroke="currentColor" strokeWidth="2" className="text-primary" />
                           )}
                        </svg>
                        
                        {/* Percentage Badge */}
                        <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-white">
                          {assessment.weight}%
                        </div>

                        {/* Metadata Labels */}
                        <div className="mt-1 flex flex-col items-center gap-0.5 w-24">
                           {assessment.plo && <span className="text-[9px] leading-tight text-center text-muted-foreground bg-white/80 px-1 rounded border border-border/50 truncate max-w-full">P: {assessment.plo}</span>}
                           {assessment.mlo && <span className="text-[9px] leading-tight text-center text-muted-foreground bg-white/80 px-1 rounded border border-border/50 truncate max-w-full">M: {assessment.mlo}</span>}
                           {assessment.ga && <span className="text-[9px] leading-tight text-center text-muted-foreground bg-white/80 px-1 rounded border border-border/50 truncate max-w-full">G: {assessment.ga}</span>}
                        </div>
                        
                        {/* Tooltip for full details */}
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover/item:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs p-2 rounded shadow-lg border border-border w-48 z-50 pointer-events-none">
                          <div className="font-bold mb-1">{assessment.atype} ({assessment.mode})</div>
                          <div className="mb-1">Weight: {assessment.weight}%</div>
                          <div className="text-[10px] text-muted-foreground">
                            <p><strong>PLO:</strong> {assessment.plo}</p>
                            <p><strong>MLO:</strong> {assessment.mlo}</p>
                            <p><strong>GA:</strong> {assessment.ga}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-6 justify-center text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-4 justify-center">
          <span className="font-bold text-primary mr-2">Assessment Types:</span>
          {[
            'Artifact',
            'Case analysis',
            'Code submission',
            'Essay',
            'Lab notebook',
            'Portfolio',
            'Poster',
            'Presentation slides',
            'Product demonstration',
            'Prototype',
            'Reflective journal',
            'Studio output',
            'Thesis / dissertation document',
            'Video recording',
            'Written report'
          ].map(type => (
             <div key={type} className="flex items-center gap-1.5">
               <div className={cn("w-3 h-3 rounded-full", getCircleColor(type))} />
               <span>{type}</span>
             </div>
          ))}
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">Mode:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 bg-primary" />
            <span>Group</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 border-t-2 border-dashed border-primary" />
            <span>Individual</span>
          </div>
        </div>
      </div>
    </div>
  );
}
