import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface VisualHeatmapProps {
  stageFilter?: number | 'all';
  semesterFilter?: string | 'all';
}

export default function VisualHeatmap({ stageFilter = 1, semesterFilter = '1' }: VisualHeatmapProps) {
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

  // Helper for block color
  const getBlockColor = (type: string) => {
     switch (type) {
      case 'Delivery': return 'bg-[var(--color-delivery)] text-white';
      case 'Presentation': return 'bg-[var(--color-presentation)] text-white';
      case 'Exam': return 'bg-[var(--color-exam)] text-white';
      case 'Report': return 'bg-[var(--color-report)] text-black';
      case 'Case Study': return 'bg-[var(--color-casestudy)] text-white';
      default: return 'bg-gray-500 text-white';
    }
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
          {filteredModules.map(module => (
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
                        {assessment.ga && assessment.ga.length > 0 && (
                          <div className="mt-1 pt-1 border-t border-white/20 opacity-90 truncate font-light italic">
                            {Array.isArray(assessment.ga) ? assessment.ga.join(", ") : assessment.ga}
                          </div>
                        )}
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
         {['Delivery', 'Presentation', 'Exam', 'Report', 'Case Study'].map(type => (
             <div key={type} className="flex items-center gap-2">
               <div className={cn("w-4 h-4 rounded", getBlockColor(type))} />
               <span>{type}</span>
             </div>
          ))}
      </div>
    </div>
  );
}
