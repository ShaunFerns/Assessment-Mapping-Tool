import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Programme = {
  name: string;
  weeks: number;
};

export type PLO = {
  code: string;
  description: string;
};

export type MLO = {
  code: string;
  description: string;
};

export type Module = {
  id: number;
  code: string;
  title: string;
  stage: number;
  semester: string;
  mlos: MLO[];
};

export type AssessmentType = 'Delivery' | 'Presentation' | 'Exam' | 'Report' | 'Case Study';
export type AssessmentMode = 'Group' | 'Individual';

export type Assessment = {
  id: number;
  moduleId: number;
  week: number;
  weight: number;
  atype: AssessmentType;
  mode: AssessmentMode;
  plos: string[];
  mlos: string[];
  ga: string;
};

interface AppState {
  programme: Programme | null;
  programmePlos: PLO[];
  modules: Module[];
  assessments: Assessment[];
  setProgramme: (p: Programme) => void;
  addProgrammePLO: (plo: PLO) => void;
  removeProgrammePLO: (code: string) => void;
  addModule: (m: Omit<Module, 'id' | 'mlos'>) => void;
  updateModuleMLOs: (moduleId: number, mlos: MLO[]) => void;
  removeModule: (id: number) => void;
  addAssessment: (a: Omit<Assessment, 'id'>) => void;
  removeAssessment: (id: number) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

// Initial Dummy Data for testing if user skips setup
const INITIAL_MODULES: Module[] = [
  { id: 1, code: 'MGMT101', title: 'Principles of Management', stage: 1, semester: '1', mlos: [] },
  { id: 2, code: 'MKTG202', title: 'Marketing Strategy', stage: 1, semester: '2', mlos: [] },
  { id: 3, code: 'FIN303', title: 'Financial Accounting', stage: 2, semester: '1', mlos: [] },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [programme, setProgramme] = useState<Programme | null>({ name: 'MSc Management S1', weeks: 14 });
  const [programmePlos, setProgrammePlos] = useState<PLO[]>([]);
  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [nextModuleId, setNextModuleId] = useState(4);
  const [nextAssessmentId, setNextAssessmentId] = useState(1);

  const addProgrammePLO = (plo: PLO) => {
    setProgrammePlos([...programmePlos, plo]);
  };

  const removeProgrammePLO = (code: string) => {
    setProgrammePlos(programmePlos.filter(p => p.code !== code));
  };

  const addModule = (m: Omit<Module, 'id' | 'mlos'>) => {
    setModules([...modules, { ...m, id: nextModuleId, mlos: [] }]);
    setNextModuleId(prev => prev + 1);
  };
  
  const updateModuleMLOs = (moduleId: number, mlos: MLO[]) => {
    setModules(modules.map(m => m.id === moduleId ? { ...m, mlos } : m));
  };

  const removeModule = (id: number) => {
    setModules(modules.filter(m => m.id !== id));
    setAssessments(assessments.filter(a => a.moduleId !== id));
  };

  const addAssessment = (a: Omit<Assessment, 'id'>) => {
    setAssessments([...assessments, { ...a, id: nextAssessmentId }]);
    setNextAssessmentId(prev => prev + 1);
  };

  const removeAssessment = (id: number) => {
    setAssessments(assessments.filter(a => a.id !== id));
  };

  return (
    <AppContext.Provider value={{ 
      programme, 
      programmePlos,
      modules, 
      assessments, 
      setProgramme, 
      addProgrammePLO,
      removeProgrammePLO,
      addModule, 
      updateModuleMLOs,
      removeModule, 
      addAssessment, 
      removeAssessment 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
