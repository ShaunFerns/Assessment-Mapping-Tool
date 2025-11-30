import { useAppStore } from "@/lib/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Programme name must be at least 2 characters."),
  weeks: z.coerce.number().min(1).max(52),
});

export default function ProgrammeForm() {
  const { programme, setProgramme } = useAppStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: programme?.name || "",
      weeks: programme?.weeks || 14,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setProgramme(values);
    toast({
      title: "Programme Details Saved",
      description: "Redirecting to module management...",
    });
    setTimeout(() => setLocation("/modules"), 1000);
  }

  return (
    <div className="max-w-2xl mx-auto">
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
    </div>
  );
}
