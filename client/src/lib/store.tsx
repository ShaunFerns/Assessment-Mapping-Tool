import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Programme = {
  name: string;
  weeks: number;
  ploCount: number;
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
  mloCount: number;
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
  ga: string[];
};

interface AppState {
  programme: Programme | null;
  programmePlos: PLO[]; // Derived
  modules: Module[];
  assessments: Assessment[];
  setProgramme: (p: Programme) => void;
  addModule: (m: Omit<Module, 'id' | 'mlos'>) => void;
  updateModuleMLOCount: (moduleId: number, count: number) => void;
  removeModule: (id: number) => void;
  addAssessment: (a: Omit<Assessment, 'id'>) => void;
  removeAssessment: (id: number) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

// Initial Dummy Data for testing if user skips setup
const INITIAL_MODULES: Module[] = [
  { id: 1, code: 'MGMT101', title: 'Principles of Management', stage: 1, semester: '1', mloCount: 6, mlos: Array.from({length: 6}, (_, i) => ({code: `MLO${i+1}`, description: `Module Learning Outcome ${i+1}`})) },
  { id: 2, code: 'MKTG202', title: 'Marketing Strategy', stage: 1, semester: '2', mloCount: 6, mlos: Array.from({length: 6}, (_, i) => ({code: `MLO${i+1}`, description: `Module Learning Outcome ${i+1}`})) },
  { id: 3, code: 'FIN303', title: 'Financial Accounting', stage: 2, semester: '1', mloCount: 6, mlos: Array.from({length: 6}, (_, i) => ({code: `MLO${i+1}`, description: `Module Learning Outcome ${i+1}`})) },
];

const INITIAL_ASSESSMENTS: Assessment[] = [
  // MGMT101 Assessments
  { 
    id: 1, 
    moduleId: 1, 
    week: 6, 
    weight: 40, 
    atype: 'Report', 
    mode: 'Individual', 
    plos: ['PLO1', 'PLO2'], 
    mlos: ['MLO1', 'MLO2'],
    ga: ['People']
  },
  { 
    id: 2, 
    moduleId: 1, 
    week: 14, 
    weight: 60, 
    atype: 'Exam', 
    mode: 'Individual', 
    plos: ['PLO1', 'PLO3'], 
    mlos: ['MLO3', 'MLO4'],
    ga: ['Partnership']
  },
  // MKTG202 Assessments
  { 
    id: 3, 
    moduleId: 2, 
    week: 8, 
    weight: 30, 
    atype: 'Presentation', 
    mode: 'Group', 
    plos: ['PLO2', 'PLO4'], 
    mlos: ['MLO1', 'MLO3'],
    ga: ['People', 'Partnership']
  },
  { 
    id: 4, 
    moduleId: 2, 
    week: 12, 
    weight: 70, 
    atype: 'Case Study', 
    mode: 'Individual', 
    plos: ['PLO4', 'PLO5'], 
    mlos: ['MLO2', 'MLO4'],
    ga: ['Planet']
  },
  // FIN303 Assessments
  { 
    id: 5, 
    moduleId: 3, 
    week: 14, 
    weight: 100, 
    atype: 'Exam', 
    mode: 'Individual', 
    plos: ['PLO3', 'PLO6'], 
    mlos: ['MLO1', 'MLO2', 'MLO3', 'MLO4', 'MLO5'],
    ga: []
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [programme, setProgramme] = useState<Programme | null>({ name: 'MSc Management S1', weeks: 14, ploCount: 6 });
  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES);
  const [assessments, setAssessments] = useState<Assessment[]>(INITIAL_ASSESSMENTS);
  const [nextModuleId, setNextModuleId] = useState(4);
  const [nextAssessmentId, setNextAssessmentId] = useState(6);

  // Derived PLOs based on count
  const programmePlos: PLO[] = React.useMemo(() => {
    if (!programme) return [];
    return Array.from({ length: programme.ploCount }, (_, i) => ({
      code: `PLO${i + 1}`,
      description: `Programme Learning Outcome ${i + 1}`
    }));
  }, [programme]);

  const addModule = (m: Omit<Module, 'id' | 'mlos'>) => {
    const mloCount = 6; // Enforce 6 MLOs
    const newMLOs = Array.from({ length: mloCount }, (_, i) => ({
      code: `MLO${i + 1}`,
      description: `Module Learning Outcome ${i + 1}`
    }));
    setModules([...modules, { ...m, mloCount, id: nextModuleId, mlos: newMLOs }]);
    setNextModuleId(prev => prev + 1);
  };
  
  const updateModuleMLOCount = (moduleId: number, count: number) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        const newMLOs = Array.from({ length: count }, (_, i) => ({
          code: `MLO${i + 1}`,
          description: `Module Learning Outcome ${i + 1}`
        }));
        return { ...m, mloCount: count, mlos: newMLOs };
      }
      return m;
    }));
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
      addModule, 
      updateModuleMLOCount,
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
