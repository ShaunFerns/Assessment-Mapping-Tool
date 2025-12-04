import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Search } from "lucide-react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ProgrammeList() {
  const { programmes, selectProgramme, addProgramme } = useAppStore();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreate = () => {
    const newProg = {
      name: "New Programme",
      weeks: 14,
      ploCount: 6
    };
    addProgramme(newProg);
    setLocation("/programme/edit");
  };

  const handleSelect = (id: number) => {
    selectProgramme(id);
    setLocation("/visualisations");
  };

  const filteredProgrammes = programmes.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.code && p.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold text-primary">Select Programme</h2>
          <p className="text-muted-foreground mt-1">Choose an existing programme to map or create a new one.</p>
        </div>
        <Button onClick={handleCreate} className="bg-secondary hover:bg-secondary/90 text-white font-bold rounded-full px-6">
          <Plus className="w-4 h-4 mr-2" /> New Programme
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          placeholder="Search programmes..." 
          className="pl-10 h-12 bg-white border-border shadow-sm rounded-lg text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Programme List */}
      <div className="space-y-4">
        {filteredProgrammes.map((prog) => (
          <div 
            key={prog.id} 
            className="group bg-white rounded-xl p-4 border border-border shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-6"
            onClick={() => handleSelect(prog.id)}
          >
            {/* Badge */}
            <div className="w-14 h-14 rounded-lg bg-muted/30 flex items-center justify-center flex-shrink-0 border border-border/50">
              <span className="font-bold text-primary text-lg">L8</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-primary truncate">{prog.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                {prog.code && (
                  <>
                    <span className="bg-muted px-2 py-0.5 rounded text-xs font-medium text-primary/70">{prog.code}</span>
                    <span>•</span>
                  </>
                )}
                <span className="truncate">{prog.department || "General"}</span>
              </div>
            </div>

            {/* Arrow Button */}
            <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}

        {filteredProgrammes.length === 0 && (
          <div className="text-center py-12 bg-muted/10 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground">No programmes found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
