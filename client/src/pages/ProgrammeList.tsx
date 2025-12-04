import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Check, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function ProgrammeList() {
  const { programmes, programme: selectedProgramme, selectProgramme, addProgramme, deleteProgramme } = useAppStore();
  const [, setLocation] = useLocation();

  const handleCreate = () => {
    const newProg = {
      name: "New Programme",
      weeks: 14,
      ploCount: 6
    };
    addProgramme(newProg);
    // The store automatically selects the new programme
    setLocation("/programme/edit");
  };

  const handleEdit = (id: number) => {
    selectProgramme(id);
    setLocation("/programme/edit");
  };

  const handleSelect = (id: number) => {
    selectProgramme(id);
    setLocation("/visualisations");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold text-primary">Programmes</h2>
          <p className="text-muted-foreground">Manage your programmes and assessment maps.</p>
        </div>
        <Button onClick={handleCreate} size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-bold shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> New Programme
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programmes.map((prog) => {
          const isSelected = selectedProgramme?.id === prog.id;
          
          return (
            <Card key={prog.id} className={`group relative transition-all hover:shadow-md ${isSelected ? 'border-secondary ring-1 ring-secondary/20 bg-secondary/5' : ''}`}>
              {isSelected && (
                <div className="absolute top-3 right-3 text-secondary">
                  <Check className="w-5 h-5 bg-white rounded-full p-0.5" />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-heading text-primary pr-6 leading-tight">{prog.name}</CardTitle>
                <CardDescription>
                  {prog.weeks} Weeks • {prog.ploCount} PLOs
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col gap-3 pt-2">
                  <Button 
                    variant={isSelected ? "default" : "outline"} 
                    className={`w-full justify-between group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors ${isSelected ? 'bg-primary text-white' : ''}`}
                    onClick={() => handleSelect(prog.id)}
                  >
                    {isSelected ? "Current Programme" : "Select Programme"}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-white" onClick={(e) => { e.stopPropagation(); handleEdit(prog.id); }}>
                      <Edit className="w-3 h-3 mr-2" /> Edit
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 bg-white text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
                          <Trash2 className="w-3 h-3 mr-2" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Programme?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{prog.name}" and all its modules and assessments. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={(e) => { e.stopPropagation(); deleteProgramme(prog.id); }} className="bg-red-600 hover:bg-red-700 text-white">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Empty State if no programmes (shouldn't happen with initial data but good fallback) */}
        {programmes.length === 0 && (
          <div className="col-span-full text-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/30">
            <p className="text-muted-foreground mb-4">No programmes found.</p>
            <Button onClick={handleCreate}>Create Your First Programme</Button>
          </div>
        )}
      </div>
    </div>
  );
}
