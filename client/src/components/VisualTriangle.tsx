import { useAppStore, Assessment } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface VisualTriangleProps {
  stageFilter?: number | 'all';
  semesterFilter?: string | 'all';
}

export default function VisualTriangle({ stageFilter = 1, semesterFilter = '1' }: VisualTriangleProps) {
  const { programme, modules, assessments } = useAppStore();

  // Filter modules based on props
  const filteredModules = useMemo(() => {
    return modules.filter(m => {
      const stageMatch = stageFilter === 'all' || m.stage === stageFilter;
      const semesterMatch = semesterFilter === 'all' || m.semester === semesterFilter;
      return stageMatch && semesterMatch;
    });
  }, [modules, stageFilter, semesterFilter]);

  if (!programme) return <div>Please set programme details first.</div>;

  const weeks = Array.from({ length: programme.weeks }, (_, i) => i + 1);

  const getAssessmentsForModuleAndWeek = (moduleId: number, week: number) => {
    return assessments.filter(a => a.moduleId === moduleId && a.week === week);
  };

  if (filteredModules.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No modules found for the selected Stage/Semester.</div>;
  }

  // Helper to get color hex
  const getTypeColorHex = (type: string) => {
    switch (type) {
      case 'Delivery': return '#003B5C'; // Navy
      case 'Presentation': return '#e74c3c'; // Red
      case 'Exam': return '#27ae60'; // Green
      case 'Report': return '#f1c40f'; // Yellow
      case 'Case Study': return '#6c5ce7'; // Purple
      default: return '#6b7280'; // Gray
    }
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
        {filteredModules.map(module => (
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
                             className="fill-white stroke-2"
                             style={{ 
                               fill: 'white',
                               stroke: getTypeColorHex(assessment.atype)
                             }}
                           />
                           
                           {/* Inner Circle for Type Color */}
                           <circle 
                             cx="20" cy="25" r="4" 
                             style={{ fill: getTypeColorHex(assessment.atype) }}
                           />
                           
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
                           {(assessment.plos && assessment.plos.length > 0) && <span className="text-[9px] leading-tight text-center text-muted-foreground bg-white/80 px-1 rounded border border-border/50 truncate max-w-full">P: {assessment.plos.join(', ')}</span>}
                           {/* Legacy support for plo string */}
                           {(!assessment.plos && assessment.plo) && <span className="text-[9px] leading-tight text-center text-muted-foreground bg-white/80 px-1 rounded border border-border/50 truncate max-w-full">P: {assessment.plo}</span>}
                           
                           {(assessment.mlos && assessment.mlos.length > 0) && <span className="text-[9px] leading-tight text-center text-muted-foreground bg-white/80 px-1 rounded border border-border/50 truncate max-w-full">M: {assessment.mlos.join(', ')}</span>}
                           {/* Legacy support for mlo string */}
                           {(!assessment.mlos && assessment.mlo) && <span className="text-[9px] leading-tight text-center text-muted-foreground bg-white/80 px-1 rounded border border-border/50 truncate max-w-full">M: {assessment.mlo}</span>}

                           {(assessment.ga && assessment.ga.length > 0) && <span className="text-[9px] leading-tight text-center text-muted-foreground bg-white/80 px-1 rounded border border-border/50 truncate max-w-full">G: {Array.isArray(assessment.ga) ? assessment.ga.join(', ') : assessment.ga}</span>}
                        </div>
                        
                        {/* Tooltip for full details */}
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover/item:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs p-2 rounded shadow-lg border border-border w-48 z-50 pointer-events-none">
                          <div className="font-bold mb-1">{assessment.atype} ({assessment.mode})</div>
                          <div className="mb-1">Weight: {assessment.weight}%</div>
                          <div className="text-[10px] text-muted-foreground">
                            <p><strong>PLO:</strong> {assessment.plos ? assessment.plos.join(', ') : assessment.plo}</p>
                            <p><strong>MLO:</strong> {assessment.mlos ? assessment.mlos.join(', ') : assessment.mlo}</p>
                            <p><strong>GA:</strong> {Array.isArray(assessment.ga) ? assessment.ga.join(', ') : assessment.ga}</p>
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
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">Assessment Types:</span>
          {['Delivery', 'Presentation', 'Exam', 'Report', 'Case Study'].map(type => (
             <div key={type} className="flex items-center gap-1.5">
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getTypeColorHex(type) }} />
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
