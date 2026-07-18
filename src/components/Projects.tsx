
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import portfolioData from '@/data/portfolio.json';

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

  const projects: Project[] = portfolioData.projects as Project[];

  const filteredProjects = activeTab === 'all'
    ? projects
    : projects.filter(project => project.category === activeTab);

  const hasFrontend = projects.some(p => p.category === 'frontend');
  const hasFullstack = projects.some(p => p.category === 'fullstack');
  const hasBackend = projects.some(p => p.category === 'backend');
  const hasDesign = projects.some(p => p.category === 'design');

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
                {hasFrontend && <TabsTrigger value="frontend">Frontend</TabsTrigger>}
                {hasFullstack && <TabsTrigger value="fullstack">Fullstack</TabsTrigger>}
                {hasBackend && <TabsTrigger value="backend">Backend</TabsTrigger>}
                {hasDesign && <TabsTrigger value="design">Design</TabsTrigger>}
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
                      {project.demoUrl && project.demoUrl !== "#" && project.demoUrl !== "" && (
                        <Button variant="default" size="sm" onClick={() => window.open(project.demoUrl, '_blank')}>
                          Live Demo
                        </Button>
                      )}
                      {project.codeUrl && project.codeUrl !== "#" && project.codeUrl !== "" && (
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
