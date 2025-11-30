import { Programme, Module, Assessment } from "./store";

export function computeWeeklyLoad(programme: Programme, assessments: Assessment[]) {
  const weeksCount = programme.weeks || 0;
  const weeks = Array.from({ length: weeksCount }, (_, i) => i + 1);
  const weeklyLoad = new Array(weeksCount).fill(0);

  assessments.forEach(a => {
    if (a.week >= 1 && a.week <= weeksCount) {
      weeklyLoad[a.week - 1] += a.weight;
    }
  });

  return { weeks, weeklyLoad };
}

export function computeTypeDistribution(assessments: Assessment[]) {
  const typeLabels = ["Delivery", "Presentation", "Exam", "Report", "Case Study"];
  const typeMap: Record<string, number> = {};
  
  typeLabels.forEach(t => typeMap[t.toLowerCase()] = 0);

  assessments.forEach(a => {
    const key = (a.atype || "").toLowerCase();
    if (key in typeMap) {
      typeMap[key] += a.weight;
    }
  });

  const typeValues = typeLabels.map(t => typeMap[t.toLowerCase()]);
  return { typeLabels, typeValues };
}

export function computeModuleProfiles(modules: Module[], assessments: Assessment[]) {
  const moduleLabels = modules.map(m => m.code);
  const totalWeights = new Array(modules.length).fill(0);
  const counts = new Array(modules.length).fill(0);

  const moduleIndex: Record<number, number> = {};
  modules.forEach((m, idx) => {
    moduleIndex[m.id] = idx;
  });

  assessments.forEach(a => {
    const idx = moduleIndex[a.moduleId];
    if (idx !== undefined) {
      totalWeights[idx] += a.weight;
      counts[idx] += 1;
    }
  });

  return { moduleLabels, totalWeights, counts };
}

export function computeGACoverage(assessments: Assessment[]) {
  const gaLabels = ["People", "Planet", "Partnership"];
  const gaTotals = [0, 0, 0];

  assessments.forEach(a => {
    const ga = (a.ga || "").trim().toLowerCase();
    gaLabels.forEach((label, i) => {
      if (ga.includes(label.toLowerCase())) {
        gaTotals[i] += a.weight;
      }
    });
  });

  return { gaLabels, gaTotals };
}

export function computeStressValues(weeklyLoad: number[]) {
  return [...weeklyLoad];
}
