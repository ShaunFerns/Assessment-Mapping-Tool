import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, BarChart2, BookOpen, Settings } from "lucide-react";
// import generatedImage from '@assets/generated_images/abstract_geometric_background_in_navy_and_teal.png';

export default function Home() {
  const { programme } = useAppStore();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-primary text-white min-h-[400px] flex items-center shadow-xl">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center mix-blend-overlay"
          style={{ 
            // backgroundImage: `url(${generatedImage})` 
            background: 'linear-gradient(135deg, #003B5C 0%, #00A6A6 100%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent" />
        
        <div className="relative z-10 container px-12 py-12 max-w-3xl">
          <h1 className="text-5xl font-heading font-bold leading-tight mb-6">
            Assessment Mapping & Visualisation
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl leading-relaxed">
            A robust tool for programme teams to map assessments, balance student workload, and visualise learning outcomes across the semester.
          </p>
          
          <div className="flex flex-wrap gap-4">
            {!programme ? (
              <Link href="/programme">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-bold rounded-full px-8 h-12 shadow-lg shadow-secondary/20 transition-transform hover:-translate-y-0.5">
                  Start Mapping <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/visualisations">
                 <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-bold rounded-full px-8 h-12 shadow-lg shadow-secondary/20 transition-transform hover:-translate-y-0.5">
                  View Visualisations <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            )}
            <Link href="/programme">
              <Button variant="outline" size="lg" className="border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-full px-8 h-12 backdrop-blur-sm">
                Manage Programme
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
            <Settings className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-heading font-bold text-primary mb-3">1. Define Programme</h3>
          <p className="text-muted-foreground">Set up your semester structure and programme details to establish the mapping framework.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-heading font-bold text-primary mb-3">2. Map Modules</h3>
          <p className="text-muted-foreground">Input modules and their associated assessments, weights, and learning outcomes.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 bg-accent-purple/10 rounded-xl flex items-center justify-center text-accent-purple mb-6 group-hover:bg-accent-purple group-hover:text-white transition-colors">
            <BarChart2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-heading font-bold text-primary mb-3">3. Visualize</h3>
          <p className="text-muted-foreground">Generate heatmaps and timeline triangles to identify bunching and gap analysis.</p>
        </div>
      </section>
    </div>
  );
}
