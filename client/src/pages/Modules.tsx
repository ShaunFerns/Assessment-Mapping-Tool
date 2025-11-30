import { useAppStore } from "@/lib/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  code: z.string().min(2, "Code required"),
  title: z.string().min(2, "Title required"),
});

export default function Modules() {
  const { modules, addModule, removeModule } = useAppStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      title: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addModule(values);
    form.reset();
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
                  <TableHead className="w-[100px]">Code</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell className="font-bold text-primary">{module.code}</TableCell>
                    <TableCell>{module.title}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => removeModule(module.id)} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
