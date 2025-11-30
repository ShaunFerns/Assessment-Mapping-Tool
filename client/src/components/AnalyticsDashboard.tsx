import { useAppStore } from "@/lib/store";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  computeWeeklyLoad, 
  computeTypeDistribution, 
  computeModuleProfiles, 
  computeGACoverage, 
  computeStressValues 
} from "@/lib/analytics";

export default function AnalyticsDashboard() {
  const { programme, modules, assessments } = useAppStore();

  if (!programme || !modules.length || !assessments.length) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-blue-700">
          Please define a programme, add modules, and create at least one assessment to view analytics.
        </p>
      </div>
    );
  }

  // 1) Weekly Load Data
  const { weeklyLoad } = computeWeeklyLoad(programme, assessments);
  const weeklyLoadData = weeklyLoad.map((load, i) => ({
    week: `W${i + 1}`,
    load,
    fullWeek: i + 1
  }));

  // 2) Assessment Type Balance
  const { typeLabels, typeValues } = computeTypeDistribution(assessments);
  const typeData = typeLabels.map((name, i) => ({ name, value: typeValues[i] })).filter(d => d.value > 0);
  
  const COLORS: Record<string, string> = {
    'Artifact': 'var(--color-artifact)',
    'Case analysis': 'var(--color-case-analysis)',
    'Code submission': 'var(--color-code-submission)',
    'Essay': 'var(--color-essay)',
    'Lab notebook': 'var(--color-lab-notebook)',
    'Portfolio': 'var(--color-portfolio)',
    'Poster': 'var(--color-poster)',
    'Presentation slides': 'var(--color-presentation-slides)',
    'Product demonstration': 'var(--color-product-demonstration)',
    'Prototype': 'var(--color-prototype)',
    'Reflective journal': 'var(--color-reflective-journal)',
    'Studio output': 'var(--color-studio-output)',
    'Thesis / dissertation document': 'var(--color-thesis-dissertation-document)',
    'Video recording': 'var(--color-video-recording)',
    'Written report': 'var(--color-written-report)',
    
    // Legacy
    'Delivery': 'var(--color-delivery)',
    'Presentation': 'var(--color-presentation)',
    'Exam': 'var(--color-exam)',
    'Report': 'var(--color-report)',
    'Case Study': 'var(--color-casestudy)'
  };

  // 3) Module Assessment Profiles
  const { moduleLabels, totalWeights, counts } = computeModuleProfiles(modules, assessments);
  const moduleProfileData = moduleLabels.map((code, i) => ({
    code,
    totalWeight: totalWeights[i],
    count: counts[i]
  }));

  // 4) GA Coverage
  const { gaLabels, gaTotals } = computeGACoverage(assessments);
  const gaData = gaLabels.map((label, i) => ({
    subject: label,
    A: gaTotals[i],
    fullMark: 100
  }));

  // 5) Stress Map Data
  const stressValues = computeStressValues(weeklyLoad);
  const getStressColor = (load: number) => {
    if (load <= 30) return "#27ae60"; // Low - Green
    if (load <= 60) return "#f1c40f"; // Med - Yellow
    return "#e74c3c"; // High - Red
  };

  const stressData = stressValues.map((load, i) => ({
    week: `W${i + 1}`,
    load,
    fill: getStressColor(load)
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      
      {/* Weekly Assessment Load */}
      <Card className="col-span-1 lg:col-span-2 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-heading text-primary">Weekly Assessment Load</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyLoadData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tick={{fontSize: 12}} />
              <YAxis label={{ value: 'Weight (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="load" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Total Weight" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Assessment Type Balance */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-heading text-primary">Assessment Type Balance</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  // @ts-ignore
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Module Profiles */}
      <Card className="col-span-1 lg:col-span-2 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-heading text-primary">Module Assessment Profiles</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moduleProfileData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="code" />
              <YAxis yAxisId="left" orientation="left" stroke="var(--color-primary)" label={{ value: 'Weight (%)', angle: -90, position: 'insideLeft' }}/>
              <YAxis yAxisId="right" orientation="right" stroke="var(--color-secondary)" label={{ value: 'Count', angle: 90, position: 'insideRight' }}/>
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="totalWeight" fill="var(--color-primary)" name="Total Weighting" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="count" fill="var(--color-secondary)" name="Assessment Count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* GA Coverage */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-heading text-primary">GA Coverage</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={gaData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="GA Coverage"
                dataKey="A"
                stroke="var(--color-secondary)"
                fill="var(--color-secondary)"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Assessment Stress Map */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-heading text-primary">Assessment Stress Map</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stressData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" />
              <YAxis label={{ value: 'Stress Load', angle: -90, position: 'insideLeft' }}/>
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="load" name="Stress Level" radius={[4, 4, 0, 0]}>
                {stressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
