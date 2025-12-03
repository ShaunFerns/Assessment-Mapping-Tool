import { useAppStore } from "@/lib/store";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface PLOCoverageProps {
  stageFilter?: number | 'all';
  semesterFilter?: string | 'all';
}

export default function PLOCoverage({ stageFilter = 1, semesterFilter = '1' }: PLOCoverageProps) {
  const { modules, assessments } = useAppStore();

  // Filter modules based on props
  const filteredModules = useMemo(() => {
    return modules.filter(m => {
      const stageMatch = stageFilter === 'all' || m.stage === stageFilter;
      const semesterMatch = semesterFilter === 'all' || m.semester === semesterFilter;
      return stageMatch && semesterMatch;
    });
  }, [modules, stageFilter, semesterFilter]);

  // Get all unique PLOs from ALL assessments (to keep matrix consistent regardless of filter, or maybe filtered? Brief says "Derive A sorted unique list of PLO codes used in the programme")
  // Let's derive it from the filtered view to keep it relevant to what's being looked at, or maybe globally? 
  // Usually for mapping you want to see the whole set, but if filtering by stage, maybe just stage PLOs?
  // Let's stick to global PLOs found in assessments to ensure the "rows" are consistent if they toggle filters, 
  // or maybe better: only show PLOs that actually exist in the data.
  // Let's use all PLOs found in any assessment to be safe.
  
  const allPLOs = useMemo(() => {
    const plos = new Set<string>();
    assessments.forEach(a => {
      if (a.plo) {
        // Split by comma if multiple
        a.plo.split(',').forEach(p => plos.add(p.trim()));
      }
    });
    return Array.from(plos).sort();
  }, [assessments]);

  if (allPLOs.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
        No PLO data found in assessments. Add PLO codes to assessments to see this map.
      </div>
    );
  }

  if (filteredModules.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
        No modules match the selected filters.
      </div>
    );
  }

  // Helper to get count of assessments for a module that hit a specific PLO
  const getCount = (moduleId: number, plo: string) => {
    return assessments.filter(a => {
      if (a.moduleId !== moduleId) return false;
      if (!a.plo) return false;
      const aPlos = a.plo.split(',').map(p => p.trim());
      return aPlos.includes(plo);
    }).length;
  };

  // Helper for heat intensity color
  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-white';
    if (count === 1) return 'bg-teal-100 text-teal-900';
    if (count === 2) return 'bg-teal-300 text-teal-900';
    if (count >= 3) return 'bg-teal-500 text-white';
    return 'bg-teal-100';
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-border overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="mb-4 text-sm text-muted-foreground">
          Each cell shows how many assessments in that module are mapped to the specific Programme Learning Outcome (PLO).
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          {/* Header Row: Modules */}
          <div className="flex border-b border-border bg-muted/30">
            <div className="w-32 flex-shrink-0 p-3 font-bold text-primary text-sm border-r border-border">
              PLO Code
            </div>
            {filteredModules.map(m => (
              <div key={m.id} className="flex-1 min-w-[100px] p-3 text-center text-xs font-bold text-primary border-r border-border last:border-r-0">
                <div className="truncate" title={m.title}>{m.code}</div>
              </div>
            ))}
          </div>

          {/* Data Rows: PLOs */}
          {allPLOs.map(plo => (
            <div key={plo} className="flex border-b border-border last:border-b-0 hover:bg-muted/5">
              <div className="w-32 flex-shrink-0 p-3 font-medium text-sm border-r border-border bg-white">
                {plo}
              </div>
              {filteredModules.map(m => {
                const count = getCount(m.id, plo);
                return (
                  <div 
                    key={`${m.id}-${plo}`} 
                    className={cn(
                      "flex-1 min-w-[100px] p-2 text-center text-sm flex items-center justify-center border-r border-border last:border-r-0 transition-colors",
                      getIntensityColor(count)
                    )}
                  >
                    {count > 0 ? count : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
