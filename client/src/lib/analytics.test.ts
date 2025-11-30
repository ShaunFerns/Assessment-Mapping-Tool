import { describe, it, expect, beforeEach } from 'vitest';
import { 
  computeWeeklyLoad, 
  computeTypeDistribution, 
  computeModuleProfiles, 
  computeGACoverage, 
  computeStressValues 
} from './analytics';
import { Programme, Module, Assessment } from './store';

describe('Analytics Core Logic', () => {
  let programme: Programme;
  let modules: Module[];
  let assessments: Assessment[];

  beforeEach(() => {
    programme = { name: "Test Programme", weeks: 6 };
    modules = [
      { id: 1, code: "MOD101", title: "Module 101" },
      { id: 2, code: "MOD102", title: "Module 102" },
    ];
    assessments = [
      {
        id: 1, moduleId: 1, week: 1, weight: 20, atype: "Artifact", mode: "Individual",
        plo: "PLO1", mlo: "MLO1", ga: "People"
      },
      {
        id: 2, moduleId: 1, week: 3, weight: 30, atype: "Written report", mode: "Group",
        plo: "PLO2", mlo: "MLO2", ga: "Planet"
      },
      {
        id: 3, moduleId: 2, week: 3, weight: 50, atype: "Written report", mode: "Individual",
        plo: "PLO1", mlo: "MLO3", ga: "Partnership"
      },
    ];
  });

  it('computes weekly load correctly', () => {
    const { weeks, weeklyLoad } = computeWeeklyLoad(programme, assessments);
    expect(weeks).toEqual([1, 2, 3, 4, 5, 6]);
    // Week 1: 20, Week 3: 30 + 50 = 80
    expect(weeklyLoad).toEqual([20, 0, 80, 0, 0, 0]);
  });

  it('computes type distribution correctly', () => {
    const { typeLabels, typeValues } = computeTypeDistribution(assessments);
    const typeMap: Record<string, number> = {};
    typeLabels.forEach((label, i) => typeMap[label] = typeValues[i]);

    expect(typeMap["Artifact"]).toBe(20);
    expect(typeMap["Written report"]).toBe(80); // 30 + 50
    expect(typeMap["Presentation slides"]).toBe(0);
    expect(typeMap["Case analysis"]).toBe(0);
  });

  it('computes module profiles correctly', () => {
    const { moduleLabels, totalWeights, counts } = computeModuleProfiles(modules, assessments);
    
    expect(moduleLabels).toEqual(["MOD101", "MOD102"]);
    
    // MOD101: 20 + 30 = 50 weight, 2 count
    expect(totalWeights[0]).toBe(50);
    expect(counts[0]).toBe(2);

    // MOD102: 50 weight, 1 count
    expect(totalWeights[1]).toBe(50);
    expect(counts[1]).toBe(1);
  });

  it('computes GA coverage correctly', () => {
    const { gaLabels, gaTotals } = computeGACoverage(assessments);
    const gaMap: Record<string, number> = {};
    gaLabels.forEach((label, i) => gaMap[label] = gaTotals[i]);

    expect(gaMap["People"]).toBe(20);
    expect(gaMap["Planet"]).toBe(30);
    expect(gaMap["Partnership"]).toBe(50);
  });

  it('ignores out of range weeks', () => {
    assessments.push({
        id: 4, moduleId: 1, week: 99, weight: 100, atype: "Written report", mode: "Individual",
        plo: "PLO3", mlo: "MLO4", ga: "People"
    });

    const { weeks, weeklyLoad } = computeWeeklyLoad(programme, assessments);
    expect(weeks).not.toContain(99);
    expect(weeklyLoad).toEqual([20, 0, 80, 0, 0, 0]);
  });

  it('computes stress values as a copy', () => {
    const { weeklyLoad } = computeWeeklyLoad(programme, assessments);
    const stress = computeStressValues(weeklyLoad);
    
    expect(stress).toEqual(weeklyLoad);
    expect(stress).not.toBe(weeklyLoad);
  });
});
