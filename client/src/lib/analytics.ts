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
  // Internal order as requested
  const typeLabels = [
    "Artifact",
    "Written report",
    "Presentation slides",
    "Prototype",
    "Portfolio",
    "Code submission",
    "Video recording",
    "Poster",
    "Reflective journal",
    "Lab notebook",
    "Case analysis",
    "Product demonstration",
    "Essay",
    "Studio output",
    "Thesis / dissertation document",
  ];
  const typeMap: Record<string, number> = {};
  
  typeLabels.forEach(t => typeMap[t.toLowerCase()] = 0);

  assessments.forEach(a => {
    const key = (a.atype || "").toLowerCase();
    // Handle legacy types mapping if necessary, or just let them fall through if not in list?
    // The prompt implies we are switching to this list.
    // Let's map old types to new ones if possible, or just add them to the map dynamically?
    // The prompt says "Updated compute_type_distribution in app.py to use this internal order"
    // So we strictly use this list.
    
    // Simple mapping for legacy data (optional but helpful)
    let normalizedKey = key;
    if (key === 'delivery') normalizedKey = 'artifact'; // guess
    if (key === 'presentation') normalizedKey = 'presentation slides';
    if (key === 'exam') normalizedKey = 'written report'; // guess
    if (key === 'report') normalizedKey = 'written report';
    if (key === 'case study') normalizedKey = 'case analysis';

    if (normalizedKey in typeMap) {
      typeMap[normalizedKey] += a.weight;
    } else if (key in typeMap) {
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
