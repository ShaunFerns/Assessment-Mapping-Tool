import { useAppStore, AssessmentType, AssessmentMode } from "@/lib/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  moduleId: z.coerce.number().min(1, "Select a module"),
  week: z.coerce.number().min(1),
  weight: z.coerce.number().min(0).max(100),
  atype: z.enum(['Delivery', 'Presentation', 'Exam', 'Report', 'Case Study']),
  mode: z.enum(['Group', 'Individual']),
  plos: z.array(z.string()),
  mlos: z.array(z.string()),
  ga: z.array(z.string()),
});

export default function Assessments() {
  const { modules, programme, assessments, addAssessment, removeAssessment, programmePlos } = useAppStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      week: 1,
      weight: 20,
      atype: 'Report',
      mode: 'Individual',
      plos: [],
      mlos: [],
      ga: [],
    },
  });

  const selectedModuleId = form.watch("moduleId");
  const selectedModule = modules.find(m => m.id === selectedModuleId);

  function onSubmit(values: z.infer<typeof formSchema>) {
    addAssessment({
        ...values, 
        ga: values.ga || []
    });
    // Keep some values for easier subsequent entry
    form.reset({
        moduleId: values.moduleId,
        week: values.week,
        weight: 20,
        atype: 'Report',
        mode: 'Individual',
        plos: [], 
        mlos: [], 
        ga: []
    });
    toast({ title: "Assessment Added" });
  }

  if (modules.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">Please add modules first.</div>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
      {/* Left: Add Form */}
      <div className="space-y-6">
        <Card className="shadow-sm border-t-4 border-t-secondary sticky top-8 max-h-[calc(100vh-100px)] overflow-y-auto">
          <CardHeader>
            <CardTitle className="text-xl font-heading text-primary">Add Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="moduleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module</FormLabel>
                      <Select onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue("mlos", []); // Reset MLOs when module changes
                      }} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select module" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {modules.map(m => (
                            <SelectItem key={m.id} value={m.id.toString()}>{m.code} - {m.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="week"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Week</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={programme?.weeks || 52} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} max={100} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="atype"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {['Delivery', 'Presentation', 'Exam', 'Report', 'Case Study'].map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Mode</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Individual" />
                            </FormControl>
                            <FormLabel className="font-normal">Individual</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Group" />
                            </FormControl>
                            <FormLabel className="font-normal">Group</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 pt-2 border-t border-border">
                  <FormField
                    control={form.control}
                    name="plos"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>Programme LOs</FormLabel>
                        </div>
                        <ScrollArea className="h-32 border rounded-md p-2">
                          {programmePlos.length === 0 ? (
                            <div className="text-xs text-muted-foreground text-center py-4">No PLOs defined yet</div>
                          ) : (
                            <div className="grid grid-cols-3 gap-2">
                              {programmePlos.map((item) => (
                                <FormField
                                  key={item.code}
                                  control={form.control}
                                  name="plos"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item.code}
                                        className="flex flex-row items-center space-x-2 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(item.code)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, item.code])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== item.code
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal cursor-pointer">
                                          {item.code}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </ScrollArea>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mlos"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>Module LOs</FormLabel>
                        </div>
                        <ScrollArea className="h-32 border rounded-md p-2">
                          {!selectedModule ? (
                             <div className="text-xs text-muted-foreground text-center py-4">Select a module first</div>
                          ) : (
                            <div className="grid grid-cols-3 gap-2">
                              {Array.from({length: 6}, (_, i) => `MLO${i+1}`).map((code) => (
                                <FormField
                                  key={code}
                                  control={form.control}
                                  name="mlos"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={code}
                                        className="flex flex-row items-center space-x-2 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(code)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, code])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== code
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal cursor-pointer">
                                          {code}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </ScrollArea>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ga"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>Graduate Attributes (GA)</FormLabel>
                        </div>
                        <div className="flex flex-wrap gap-4 p-3 border rounded-md bg-muted/10">
                          {['People', 'Planet', 'Partnership'].map((item) => (
                            <FormField
                              key={item}
                              control={form.control}
                              name="ga"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item}
                                    className="flex flex-row items-center space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, item])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal cursor-pointer">
                                      {item}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold">
                  <Plus className="w-4 h-4 mr-2" /> Add Assessment
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Right: List */}
      <Card className="shadow-sm min-h-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl font-heading text-primary">Assessment List</CardTitle>
        </CardHeader>
        <CardContent>
          {assessments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
              No assessments added yet.
            </div>
          ) : (
            <div className="space-y-8">
              {modules.map((module) => {
                const moduleAssessments = assessments
                  .filter(a => a.moduleId === module.id)
                  .sort((a,b) => a.week - b.week);
                
                const totalWeight = moduleAssessments.reduce((sum, a) => sum + a.weight, 0);
                const isComplete = totalWeight === 100;
                const isOver = totalWeight > 100;

                return (
                  <div key={module.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/30 px-4 py-3 flex items-center justify-between border-b">
                      <div>
                        <h3 className="font-bold text-primary">{module.code} - {module.title}</h3>
                      </div>
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold",
                        isComplete ? "bg-green-100 text-green-700 border border-green-200" : 
                        isOver ? "bg-red-100 text-red-700 border border-red-200" : 
                        "bg-amber-100 text-amber-700 border border-amber-200"
                      )}>
                        {isComplete ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        Total: {totalWeight}%
                      </div>
                    </div>
                    
                    {moduleAssessments.length === 0 ? (
                      <div className="p-4 text-sm text-muted-foreground italic text-center">No assessments mapped for this module yet.</div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[80px]">Week</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Mode</TableHead>
                            <TableHead className="w-[80px]">Weight</TableHead>
                            <TableHead className="text-right w-[80px]">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {moduleAssessments.map((assessment) => (
                            <TableRow key={assessment.id}>
                              <TableCell>Week {assessment.week}</TableCell>
                              <TableCell>{assessment.atype}</TableCell>
                              <TableCell><span className="text-xs bg-muted px-2 py-1 rounded">{assessment.mode}</span></TableCell>
                              <TableCell className="font-medium">{assessment.weight}%</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => removeAssessment(assessment.id)} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8 w-8">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}