
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl?: string;
  codeUrl?: string;
  category: 'frontend' | 'fullstack' | 'backend' | 'design';
}

const Projects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const projects: Project[] = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "A full-featured e-commerce platform with product management, cart functionality, and payment processing.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      tags: ["React", "TypeScript", ".NET", "SQL Server", "Azure"],
      demoUrl: "#",
      codeUrl: "#",
      category: "fullstack"
    },
    {
      id: 2,
      title: "Task Management Dashboard",
      description: "An intuitive task management system with real-time updates and team collaboration features.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      tags: ["Angular", "C#", "Entity Framework", "SignalR"],
      demoUrl: "#",
      codeUrl: "#",
      category: "fullstack"
    },
    {
      id: 3,
      title: "Fitness Tracking App",
      description: "Mobile-responsive fitness tracking application with progress visualization and goal setting.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      tags: ["React", "Chart.js", "Tailwind CSS", "Firebase"],
      demoUrl: "#",
      codeUrl: "#",
      category: "frontend"
    },
    {
      id: 4,
      title: "Content Management System",
      description: "Custom CMS with role-based access control and rich content editing capabilities.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      tags: [".NET", "C#", "SQL", "Azure"],
      demoUrl: "#",
      codeUrl: "#",
      category: "backend"
    },
    {
      id: 5,
      title: "Travel Planning Platform",
      description: "UI/UX design for a travel planning platform featuring itinerary management and location discovery.",
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
      tags: ["Figma", "Photoshop", "UI/UX", "Prototype"],
      category: "design"
    },
    {
      id: 6,
      title: "Real Estate Listing Portal",
      description: "Property listing platform with advanced search, filtering, and user account management.",
      image: "https://images.unsplash.com/photo-1527576539890-dfa815648363",
      tags: ["React", "Node.js", "MongoDB", "Google Maps API"],
      demoUrl: "#",
      codeUrl: "#",
      category: "fullstack"
    },
  ];

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeTab);

  return (
    <section id="projects" className="py-20 bg-background dark:bg-dark-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
          <div className="h-1 w-20 bg-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            A selection of my recent work across various domains
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="frontend">Frontend</TabsTrigger>
                <TabsTrigger value="fullstack">Fullstack</TabsTrigger>
                <TabsTrigger value="backend">Backend</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="project-card overflow-hidden border-border h-full flex flex-col">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <h3 className="text-white font-bold text-xl">{project.title}</h3>
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge variant="outline">+{project.tags.length - 3}</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 flex-grow">
                      <p className="text-muted-foreground text-sm">{project.description}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex gap-3">
                      {project.demoUrl && (
                        <Button variant="default" size="sm" onClick={() => window.open(project.demoUrl, '_blank')}>
                          Live Demo
                        </Button>
                      )}
                      {project.codeUrl && (
                        <Button variant="outline" size="sm" onClick={() => window.open(project.codeUrl, '_blank')}>
                          View Code
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Projects;
