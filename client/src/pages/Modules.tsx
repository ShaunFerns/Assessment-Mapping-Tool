import { useAppStore } from "@/lib/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, ArrowRight, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const formSchema = z.object({
  code: z.string().min(2, "Code required"),
  title: z.string().min(2, "Title required"),
  stage: z.coerce.number().min(1).max(4),
  semester: z.string().min(1, "Semester required"),
});

export default function Modules() {
  const { modules, addModule, removeModule } = useAppStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      title: "",
      stage: 1,
      semester: "1",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addModule(values);
    form.reset({
      code: "",
      title: "",
      stage: values.stage, // Keep last used stage
      semester: values.semester, // Keep last used semester
    });
    toast({ title: "Module Added" });
  }

  return (
    <div className="grid gap-8 md:grid-cols-[350px_1fr]">
      {/* Left: Add Form */}
      <div className="space-y-6">
         <Card className="shadow-sm border-t-4 border-t-secondary sticky top-8">
          <CardHeader>
            <CardTitle className="text-xl font-heading text-primary">Add Module</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stage</FormLabel>
                        <Select onValueChange={(val) => field.onChange(parseInt(val))} defaultValue={field.value.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[1, 2, 3, 4].map((s) => (
                              <SelectItem key={s} value={s.toString()}>Stage {s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sem" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["1", "2"].map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. MGMT101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Intro to Management" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" /> Add Module
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Right: List */}
      <div className="flex flex-col gap-4">
        <Card className="shadow-sm min-h-[500px]">
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-primary">Existing Modules</CardTitle>
          </CardHeader>
          <CardContent>
            {modules.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
                No modules added yet. Add one to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Stage</TableHead>
                    <TableHead className="w-[80px]">Sem</TableHead>
                    <TableHead className="w-[100px]">Code</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.sort((a, b) => a.stage - b.stage || a.semester.localeCompare(b.semester)).map((module) => (
                    <TableRow key={module.id}>
                      <TableCell className="text-muted-foreground">S{module.stage}</TableCell>
                      <TableCell className="text-muted-foreground">{module.semester}</TableCell>
                      <TableCell className="font-bold text-primary">{module.code}</TableCell>
                      <TableCell>
                        <div>{module.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {module.mlos.length} MLOs defined
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/modules/${module.id}/mlos`}>
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                              <Edit className="w-3 h-3" /> MLOs
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" onClick={() => removeModule(module.id)} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Link href="/assessments">
            <Button size="lg" className="gap-2 bg-secondary hover:bg-secondary/90 text-white">
              Continue to Assessments <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
