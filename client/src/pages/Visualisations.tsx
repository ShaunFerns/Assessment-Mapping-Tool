import { useState, useRef } from "react";
import VisualTriangle from "@/components/VisualTriangle";
import VisualHeatmap from "@/components/VisualHeatmap";
import PLOCoverage from "@/components/PLOCoverage";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toPng } from "html-to-image";

export default function Visualisations() {
  const printRef = useRef<HTMLDivElement>(null);
  const [stageFilter, setStageFilter] = useState<string>("1");
  const [semesterFilter, setSemesterFilter] = useState<string>("1");

  const getFilterValues = () => {
    const s = stageFilter === "all" ? "all" : parseInt(stageFilter);
    const sem = semesterFilter; // 'all', '1', '2', 'A', 'B'
    return { stage: s, semester: sem } as const;
  };

  const { stage, semester } = getFilterValues();

  const handlePrint = async () => {
    if (printRef.current) {
      try {
        // Calculate the full width required
        const scrollableContent = printRef.current.querySelector('.overflow-x-auto > div');
        const fullWidth = scrollableContent ? scrollableContent.scrollWidth : printRef.current.scrollWidth;
        // Add some padding
        const printWidth = fullWidth + 60;

        // Clone the node to modify it for printing without affecting the UI
        const clone = printRef.current.cloneNode(true) as HTMLElement;
        
        // Style the clone to sit off-screen but be fully expanded
        // IMPORTANT: We cannot use top: -10000px because some browsers treat it as off-screen and don't render content
        // Instead, we position it absolute at 0,0 with a very low z-index
        clone.style.position = 'absolute'; 
        clone.style.top = '0';
        clone.style.left = '0';
        clone.style.width = `${printWidth}px`;
        clone.style.height = 'auto';
        clone.style.zIndex = '-9999'; // Behind everything
        clone.style.overflow = 'visible';
        clone.style.backgroundColor = 'hsl(210, 20%, 97%)'; // Ensure background color is preserved

        // Find internal scrollable containers and force them to show all content
        const scrollables = clone.querySelectorAll('.overflow-x-auto');
        scrollables.forEach((el) => {
          (el as HTMLElement).style.overflow = 'visible';
          (el as HTMLElement).style.width = '100%'; // Fill the expanded parent
          (el as HTMLElement).style.maxWidth = 'none';
        });

        // Append to body so it renders layout
        document.body.appendChild(clone);

        // Wait a moment for layout to settle and fonts/images to be ready
        await new Promise(resolve => setTimeout(resolve, 500));

        // Capture the clone
        const dataUrl = await toPng(clone, { 
            cacheBust: true,
            width: printWidth,
            height: clone.offsetHeight,
            backgroundColor: 'hsl(210, 20%, 97%)',
            pixelRatio: 2 // High resolution
        });

        // Clean up
        document.body.removeChild(clone);

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "assessment-map.png";
        link.click();
      } catch (err) {
        console.error("Failed to print map:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-primary">Programme Visualisations</h2>
          <p className="text-muted-foreground">Analyse assessment distribution and student workload.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Filters */}
          <div className="flex gap-2 bg-white p-1 rounded-md border shadow-sm">
             <div className="flex items-center px-2 text-xs text-muted-foreground font-medium">
               <Filter className="w-3 h-3 mr-1" /> Filter:
             </div>
             <Select value={stageFilter} onValueChange={setStageFilter}>
               <SelectTrigger className="h-8 w-[100px] text-xs border-none bg-transparent focus:ring-0">
                 <SelectValue placeholder="Stage" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Stages</SelectItem>
                 <SelectItem value="1">Stage 1</SelectItem>
                 <SelectItem value="2">Stage 2</SelectItem>
                 <SelectItem value="3">Stage 3</SelectItem>
                 <SelectItem value="4">Stage 4</SelectItem>
               </SelectContent>
             </Select>
             <div className="w-px bg-border my-1"></div>
             <Select value={semesterFilter} onValueChange={setSemesterFilter}>
               <SelectTrigger className="h-8 w-[100px] text-xs border-none bg-transparent focus:ring-0">
                 <SelectValue placeholder="Semester" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Sems</SelectItem>
                 <SelectItem value="1">Sem 1</SelectItem>
                 <SelectItem value="2">Sem 2</SelectItem>
               </SelectContent>
             </Select>
          </div>

          <Button variant="outline" onClick={handlePrint} className="gap-2 hidden md:flex bg-white">
            <Printer className="w-4 h-4" /> Print Map
          </Button>
        </div>
      </div>

      <div ref={printRef} className="bg-[hsl(210,20%,97%)] p-4 -m-4 rounded-xl">
        <Tabs defaultValue="triangle" className="w-full space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-2 md:grid-cols-4 h-auto bg-primary/5 p-1 rounded-xl">
            <TabsTrigger 
              value="triangle" 
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white py-2"
            >
              Triangle Timeline
            </TabsTrigger>
            <TabsTrigger 
              value="heatmap" 
              className="rounded-lg data-[state=active]:bg-secondary data-[state=active]:text-white py-2"
            >
              Assessment Heatmap
            </TabsTrigger>
            <TabsTrigger 
              value="plo" 
              className="rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white py-2"
            >
              PLO Coverage
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="rounded-lg data-[state=active]:bg-accent-purple data-[state=active]:text-white py-2"
            >
              Analytics Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="triangle" className="animate-in fade-in duration-500">
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="px-0">
                <CardTitle className="text-xl font-heading text-primary">Timeline Analysis</CardTitle>
                <CardDescription>Visualising assessment points, weights, and learning outcomes over time.</CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <VisualTriangle stageFilter={stage} semesterFilter={semester} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heatmap" className="animate-in fade-in duration-500">
             <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="px-0">
                <CardTitle className="text-xl font-heading text-primary">Workload Heatmap</CardTitle>
                <CardDescription>Block view of assessment density and types.</CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <VisualHeatmap stageFilter={stage} semesterFilter={semester} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plo" className="animate-in fade-in duration-500">
             <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="px-0">
                <CardTitle className="text-xl font-heading text-primary">PLO Coverage Map</CardTitle>
                <CardDescription>Matrix of modules vs Programme Learning Outcomes covered by assessments.</CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <PLOCoverage stageFilter={stage} semesterFilter={semester} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="animate-in fade-in duration-500">
            <Card className="border-none shadow-none bg-transparent">
               <CardHeader className="px-0">
                <CardTitle className="text-xl font-heading text-primary">Programme Analytics</CardTitle>
                <CardDescription>Data-driven insights into assessment balance and coverage.</CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <AnalyticsDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
