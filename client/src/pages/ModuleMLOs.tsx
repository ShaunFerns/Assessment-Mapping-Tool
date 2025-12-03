import { useAppStore, MLO } from "@/lib/store";
import { useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mloSchema = z.object({
  code: z.string().min(2, "Code required"),
  description: z.string().min(5, "Description required"),
});

export default function ModuleMLOs() {
  const [, params] = useRoute("/modules/:id/mlos");
  const moduleId = params ? parseInt(params.id) : 0;
  const [, setLocation] = useLocation();
  const { modules, updateModuleMLOs } = useAppStore();
  const { toast } = useToast();

  const module = modules.find(m => m.id === moduleId);

  const form = useForm<z.infer<typeof mloSchema>>({
    resolver: zodResolver(mloSchema),
    defaultValues: { code: "", description: "" },
  });

  if (!module) {
    return <div className="p-8 text-center">Module not found</div>;
  }

  function onSubmit(values: z.infer<typeof mloSchema>) {
    if (module!.mlos.some(m => m.code === values.code)) {
      toast({ title: "Error", description: "MLO Code already exists", variant: "destructive" });
      return;
    }
    const newMLOs = [...module!.mlos, values];
    updateModuleMLOs(module!.id, newMLOs);
    form.reset();
    toast({ title: "MLO Added" });
  }

  function removeMLO(code: string) {
    const newMLOs = module!.mlos.filter(m => m.code !== code);
    updateModuleMLOs(module!.id, newMLOs);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => setLocation("/modules")} className="gap-2 pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to Modules
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold text-primary">{module.code} Learning Outcomes</h2>
          <p className="text-muted-foreground">{module.title}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Add Form */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Add MLO</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl><Input placeholder="e.g. MLO1" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea placeholder="Description..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Add MLO
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Existing MLOs</CardTitle>
            <CardDescription>Manage learning outcomes specific to this module.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {module.mlos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No MLOs defined yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  module.mlos.map((mlo) => (
                    <TableRow key={mlo.code}>
                      <TableCell className="font-bold">{mlo.code}</TableCell>
                      <TableCell>{mlo.description}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => removeMLO(mlo.code)} className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
