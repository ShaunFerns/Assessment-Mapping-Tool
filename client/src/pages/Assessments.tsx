import { useAppStore, AssessmentType, AssessmentMode } from "@/lib/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  moduleId: z.coerce.number().min(1, "Select a module"),
  week: z.coerce.number().min(1),
  weight: z.coerce.number().min(0).max(100),
  atype: z.string(), // Allow any string to support new types easily without enum strictness in Zod for now
  mode: z.enum(['Group', 'Individual']),
  plo: z.string().optional(),
  mlo: z.string().optional(),
  ga: z.string().optional(),
});

export default function Assessments() {
  const { modules, programme, assessments, addAssessment, removeAssessment } = useAppStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      week: 1,
      weight: 20,
      atype: 'Written report',
      mode: 'Individual',
      plo: '',
      mlo: '',
      ga: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addAssessment({
        ...values, 
        plo: values.plo || "",
        mlo: values.mlo || "",
        ga: values.ga || ""
    });
    // Keep some values for easier subsequent entry
    form.reset({
        moduleId: values.moduleId,
        week: values.week,
        weight: 20,
        atype: 'Written report',
        mode: 'Individual',
        plo: '', 
        mlo: '', 
        ga: ''
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
        <Card className="shadow-sm border-t-4 border-t-accent-purple sticky top-8 max-h-[calc(100vh-100px)] overflow-y-auto">
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
                      <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
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
                          {[
                            'Artifact',
                            'Case analysis',
                            'Code submission',
                            'Essay',
                            'Lab notebook',
                            'Portfolio',
                            'Poster',
                            'Presentation slides',
                            'Product demonstration',
                            'Prototype',
                            'Reflective journal',
                            'Studio output',
                            'Thesis / dissertation document',
                            'Video recording',
                            'Written report'
                          ].map(t => (
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

                <div className="space-y-2 pt-2 border-t border-border">
                  <FormField control={form.control} name="plo" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Prog. Learning Outcome (PLO)</FormLabel>
                      <FormControl><Input placeholder="Short code/text..." {...field} className="h-8 text-sm" /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="mlo" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Module Learning Outcome (MLO)</FormLabel>
                      <FormControl><Input placeholder="Short code/text..." {...field} className="h-8 text-sm" /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="ga" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground">Graduate Attribute (GA)</FormLabel>
                      <FormControl><Input placeholder="e.g. People/Planet..." {...field} className="h-8 text-sm" /></FormControl>
                    </FormItem>
                  )} />
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead>Wk</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.sort((a,b) => a.week - b.week).map((assessment) => {
                  const module = modules.find(m => m.id === assessment.moduleId);
                  return (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium text-primary">{module?.code}</TableCell>
                      <TableCell>{assessment.week}</TableCell>
                      <TableCell>{assessment.atype}</TableCell>
                      <TableCell><span className="text-xs bg-muted px-2 py-1 rounded">{assessment.mode}</span></TableCell>
                      <TableCell>{assessment.weight}%</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => removeAssessment(assessment.id)} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
