import { Switch, Route } from "wouter";
import { AppProvider } from "./lib/store";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/layout";
import Home from "@/pages/Home";
import ProgrammeForm from "@/pages/ProgrammeForm";
import Modules from "@/pages/Modules";
import ModuleMLOs from "@/pages/ModuleMLOs";
import Assessments from "@/pages/Assessments";
import Visualisations from "@/pages/Visualisations";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/programme" component={ProgrammeForm} />
        <Route path="/modules" component={Modules} />
        <Route path="/modules/:id/mlos" component={ModuleMLOs} />
        <Route path="/assessments" component={Assessments} />
        <Route path="/visualisations" component={Visualisations} />
        <Route path="/visual/triangle" component={Visualisations} /> {/* Alias for direct link compatibility */}
        <Route path="/visual/heatmap" component={Visualisations} />  {/* Alias for direct link compatibility */}
        <Route path="/visual/analytics" component={Visualisations} /> {/* Alias for direct link compatibility */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <Toaster />
      <Router />
    </AppProvider>
  );
}

export default App;
