import { useAppStore } from "@/lib/store";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface PLOCoverageProps {
  stageFilter?: number | 'all';
  semesterFilter?: string | 'all';
}

export default function PLOCoverage({ stageFilter = 1, semesterFilter = '1' }: PLOCoverageProps) {
  const { modules, assessments, programmePlos } = useAppStore();

  // Filter modules based on props
  const filteredModules = useMemo(() => {
    return modules.filter(m => {
      const stageMatch = stageFilter === 'all' || m.stage === stageFilter;
      const semesterMatch = semesterFilter === 'all' || m.semester === semesterFilter;
      return stageMatch && semesterMatch;
    });
  }, [modules, stageFilter, semesterFilter]);

  // Use programme PLOs instead of deriving from assessments to ensure complete list
  const allPLOs = useMemo(() => {
    // If no programme PLOs defined yet, fallback to deriving from assessments for legacy support
    if (programmePlos.length === 0) {
      const plos = new Set<string>();
      assessments.forEach(a => {
        if (a.plos) {
          a.plos.forEach(p => plos.add(p));
        }
      });
      return Array.from(plos).sort();
    }
    return programmePlos.map(p => p.code).sort();
  }, [assessments, programmePlos]);

  if (allPLOs.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
        No PLO data found. Define Programme Learning Outcomes in the Programme page.
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

  // Helper to get total weight of assessments for a module that hit a specific PLO
  const getWeight = (moduleId: number, plo: string) => {
    return assessments
      .filter(a => a.moduleId === moduleId)
      .reduce((sum, a) => {
        const hasPlo = a.plos?.includes(plo);
        return hasPlo ? sum + a.weight : sum;
      }, 0);
  };

  // Helper for heat intensity color based on weight
  const getIntensityColor = (weight: number) => {
    if (weight === 0) return 'bg-white';
    if (weight <= 20) return 'bg-[#e6f7f7] text-teal-900'; // Very Light Teal
    if (weight <= 40) return 'bg-[#b3e6e6] text-teal-900'; // Light Teal
    if (weight <= 60) return 'bg-[#80d4d4] text-teal-900'; // Medium Teal
    if (weight <= 80) return 'bg-[#4dc3c3] text-white'; // Strong Teal
    return 'bg-[#00A6A6] text-white'; // TU Dublin Teal
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-border overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="mb-4 text-sm text-muted-foreground">
          <span className="font-bold">X</span> = module assesses this PLO (≥1 assessment). Colour intensity reflects total assessment weighting mapped to that PLO.
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          {/* Header Row: Modules */}
          <div className="flex border-b border-border bg-muted/30">
            <div className="w-32 flex-shrink-0 p-3 font-bold text-primary text-sm border-r border-border flex items-end">
              PLO Code
            </div>
            {filteredModules.map(m => (
              <div key={m.id} className="flex-1 min-w-[40px] p-2 text-center text-xs font-bold text-primary border-r border-border last:border-r-0 h-32 flex items-end justify-center pb-2">
                <div className="truncate -rotate-90 w-32 origin-bottom-left translate-x-4 mb-1 text-left" title={m.title}>
                  {m.code}
                </div>
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
                const weight = getWeight(m.id, plo);
                return (
                  <div 
                    key={`${m.id}-${plo}`} 
                    className={cn(
                      "flex-1 min-w-[100px] p-2 text-center text-sm flex items-center justify-center border-r border-border last:border-r-0 transition-colors",
                      getIntensityColor(weight)
                    )}
                    title={`Weight: ${weight}%`}
                  >
                    {weight > 0 ? 'X' : ''}
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
