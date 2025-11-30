import { useState, useRef } from "react";
import VisualTriangle from "@/components/VisualTriangle";
import VisualHeatmap from "@/components/VisualHeatmap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { toPng } from "html-to-image";

export default function Visualisations() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    if (printRef.current) {
      try {
        // Calculate the full width required
        const scrollableContent = printRef.current.querySelector('.overflow-x-auto');
        const fullWidth = scrollableContent ? scrollableContent.scrollWidth : printRef.current.scrollWidth;
        // Add some padding
        const printWidth = fullWidth + 60;

        // Clone the node to modify it for printing without affecting the UI
        const clone = printRef.current.cloneNode(true) as HTMLElement;
        
        // Style the clone to sit off-screen but be fully expanded
        clone.style.position = 'fixed'; // fixed to viewport to avoid scroll issues
        clone.style.top = '-10000px';
        clone.style.left = '0';
        clone.style.width = `${printWidth}px`;
        clone.style.height = 'auto';
        clone.style.zIndex = '-1000';
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

        // Capture the clone
        const dataUrl = await toPng(clone, { 
            cacheBust: true,
            width: printWidth,
            height: clone.offsetHeight,
            backgroundColor: 'hsl(210, 20%, 97%)'
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold text-primary">Programme Visualisations</h2>
          <p className="text-muted-foreground">Analyse assessment distribution and student workload.</p>
        </div>
        <Button variant="outline" onClick={handlePrint} className="gap-2 hidden md:flex">
          <Printer className="w-4 h-4" /> Print Map
        </Button>
      </div>

      <div ref={printRef} className="bg-[hsl(210,20%,97%)] p-4 -m-4 rounded-xl">
        <Tabs defaultValue="triangle" className="w-full space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-primary/5 p-1 rounded-full">
            <TabsTrigger 
              value="triangle" 
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Triangle Timeline
            </TabsTrigger>
            <TabsTrigger 
              value="heatmap" 
              className="rounded-full data-[state=active]:bg-secondary data-[state=active]:text-white"
            >
              Assessment Heatmap
            </TabsTrigger>
          </TabsList>

          <TabsContent value="triangle" className="animate-in fade-in duration-500">
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="px-0">
                <CardTitle className="text-xl font-heading text-primary">Timeline Analysis</CardTitle>
                <CardDescription>Visualising assessment points, weights, and learning outcomes over time.</CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <VisualTriangle />
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
                <VisualHeatmap />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
