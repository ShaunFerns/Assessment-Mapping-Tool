import { useAppStore } from "@/lib/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Programme name must be at least 2 characters."),
  weeks: z.coerce.number().min(1).max(52),
});

const ploSchema = z.object({
  code: z.string().min(2, "Code required"),
  description: z.string().min(5, "Description required"),
});

export default function ProgrammeForm() {
  const { programme, setProgramme, programmePlos, addProgrammePLO, removeProgrammePLO } = useAppStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: programme?.name || "",
      weeks: programme?.weeks || 14,
    },
  });

  const ploForm = useForm<z.infer<typeof ploSchema>>({
    resolver: zodResolver(ploSchema),
    defaultValues: { code: "", description: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setProgramme(values);
    toast({
      title: "Programme Details Saved",
      description: "Redirecting to module management...",
    });
    setTimeout(() => setLocation("/modules"), 1000);
  }

  function onPloSubmit(values: z.infer<typeof ploSchema>) {
    if (programmePlos.some(p => p.code === values.code)) {
      toast({ title: "Error", description: "PLO Code already exists", variant: "destructive" });
      return;
    }
    addProgrammePLO(values);
    ploForm.reset();
    toast({ title: "PLO Added" });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="shadow-md border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="text-2xl font-heading text-primary">Programme Details</CardTitle>
          <CardDescription>Define the context for your semester assessment map.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Programme Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. MSc Management Semester 1" {...field} className="text-lg" />
                    </FormControl>
                    <FormDescription>This will appear on your reports.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weeks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Weeks</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="w-32" />
                    </FormControl>
                    <FormDescription>Standard semester is usually 12-15 weeks.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-bold">
                  Save & Continue
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-heading text-primary">Programme Learning Outcomes (PLOs)</CardTitle>
          <CardDescription>Define the learning outcomes for the entire programme.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            <div className="p-4 bg-muted/20 rounded-lg border border-border h-fit">
               <h3 className="font-bold mb-4 text-sm uppercase tracking-wide text-muted-foreground">Add New PLO</h3>
               <Form {...ploForm}>
                <form onSubmit={ploForm.handleSubmit(onPloSubmit)} className="space-y-4">
                  <FormField
                    control={ploForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code</FormLabel>
                        <FormControl><Input placeholder="e.g. PLO1" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={ploForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea placeholder="Description..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" variant="outline">
                    <Plus className="w-4 h-4 mr-2" /> Add PLO
                  </Button>
                </form>
              </Form>
            </div>

            <div className="border rounded-md">
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programmePlos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        No PLOs defined yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    programmePlos.map((plo) => (
                      <TableRow key={plo.code}>
                        <TableCell className="font-bold">{plo.code}</TableCell>
                        <TableCell>{plo.description}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeProgrammePLO(plo.code)} className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
