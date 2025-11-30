import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function VisualHeatmap() {
  const { programme, modules, assessments } = useAppStore();

  if (!programme) return <div>Please set programme details first.</div>;

  const weeks = Array.from({ length: programme.weeks }, (_, i) => i + 1);

  const getAssessmentsForModuleAndWeek = (moduleId: number, week: number) => {
    return assessments.filter(a => a.moduleId === moduleId && a.week === week);
  };

  // Helper for block color
  const getBlockColor = (type: string) => {
    const t = type.toLowerCase();
    if (t === 'artifact') return 'bg-[var(--color-artifact)] text-white';
    if (t === 'case analysis') return 'bg-[var(--color-case-analysis)] text-white';
    if (t === 'code submission') return 'bg-[var(--color-code-submission)] text-white';
    if (t === 'essay') return 'bg-[var(--color-essay)] text-white';
    if (t === 'lab notebook') return 'bg-[var(--color-lab-notebook)] text-white';
    if (t === 'portfolio') return 'bg-[var(--color-portfolio)] text-white';
    if (t === 'poster') return 'bg-[var(--color-poster)] text-white';
    if (t === 'presentation slides') return 'bg-[var(--color-presentation-slides)] text-white';
    if (t === 'product demonstration') return 'bg-[var(--color-product-demonstration)] text-white';
    if (t === 'prototype') return 'bg-[var(--color-prototype)] text-white';
    if (t === 'reflective journal') return 'bg-[var(--color-reflective-journal)] text-white';
    if (t === 'studio output') return 'bg-[var(--color-studio-output)] text-white';
    if (t === 'thesis / dissertation document') return 'bg-[var(--color-thesis-dissertation-document)] text-white';
    if (t === 'video recording') return 'bg-[var(--color-video-recording)] text-white';
    if (t === 'written report') return 'bg-[var(--color-written-report)] text-black';

    // Legacy
    if (t === 'delivery') return 'bg-[var(--color-delivery)] text-white';
    if (t === 'presentation') return 'bg-[var(--color-presentation)] text-white';
    if (t === 'exam') return 'bg-[var(--color-exam)] text-white';
    if (t === 'report') return 'bg-[var(--color-report)] text-black';
    if (t === 'case study') return 'bg-[var(--color-casestudy)] text-white';
    
    return 'bg-gray-500 text-white';
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-border overflow-x-auto">
      <div className="min-w-[1000px]">
        {/* Header Row */}
        <div className="grid gap-1" style={{ gridTemplateColumns: `200px repeat(${programme.weeks}, 1fr)` }}>
          <div className="p-2 font-bold text-primary text-sm uppercase tracking-wider">Module</div>
          {weeks.map(week => (
            <div key={week} className="p-2 text-center text-xs font-bold text-muted-foreground bg-muted rounded-sm">
              WK {week}
            </div>
          ))}
        </div>

        {/* Module Rows */}
        <div className="space-y-1 mt-2">
          {modules.map(module => (
            <div key={module.id} className="grid gap-1" 
                 style={{ gridTemplateColumns: `200px repeat(${programme.weeks}, 1fr)` }}>
              
              {/* Module Label */}
              <div className="p-3 text-sm font-medium text-primary bg-muted/30 rounded-sm flex flex-col justify-center border-l-4 border-secondary">
                <span className="font-bold">{module.code}</span>
                <span className="text-xs opacity-80 truncate">{module.title}</span>
              </div>

              {/* Week Cells */}
              {weeks.map(week => {
                const moduleAssessments = getAssessmentsForModuleAndWeek(module.id, week);
                
                return (
                  <div key={week} className="relative bg-muted/10 rounded-sm min-h-[80px] flex flex-col gap-1 p-1 border border-dashed border-border/50">
                    {moduleAssessments.map(assessment => (
                      <div 
                        key={assessment.id} 
                        className={cn(
                          "w-full p-1.5 rounded text-[10px] leading-tight shadow-sm transition-transform hover:scale-105 cursor-default",
                          getBlockColor(assessment.atype)
                        )}
                      >
                        <div className="font-bold flex justify-between">
                          <span>{assessment.weight}%</span>
                          <span className="opacity-80">{assessment.mode === 'Group' ? 'GRP' : 'IND'}</span>
                        </div>
                        <div className="truncate font-medium mt-0.5">{assessment.atype}</div>
                        {assessment.ga && <div className="mt-1 pt-1 border-t border-white/20 opacity-90 truncate font-light italic">{assessment.ga}</div>}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center text-xs text-muted-foreground">
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
             <div key={type} className="flex items-center gap-2">
               <div className={cn("w-4 h-4 rounded", getBlockColor(type))} />
               <span>{type}</span>
             </div>
          ))}
      </div>
    </div>
  );
}
