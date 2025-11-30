import { useState } from "react";
import VisualTriangle from "@/components/VisualTriangle";
import VisualHeatmap from "@/components/VisualHeatmap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function Visualisations() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold text-primary">Programme Visualisations</h2>
          <p className="text-muted-foreground">Analyze assessment distribution and student workload.</p>
        </div>
        <Button variant="outline" onClick={handlePrint} className="gap-2 hidden md:flex">
          <Printer className="w-4 h-4" /> Print Report
        </Button>
      </div>

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
              <CardDescription>Visualizing assessment points, weights, and learning outcomes over time.</CardDescription>
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
  );
}
