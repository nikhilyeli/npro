
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import portfolioData from '@/data/portfolio.json';

interface Skill {
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'tools' | 'design';
}

const Skills: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const skills: Skill[] = portfolioData.skills as Skill[];

  const filteredSkills = activeTab === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeTab);

  return (
    <section id="skills" className="py-20 bg-muted/50 dark:bg-dark-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Skills & Technologies</h2>
          <div className="h-1 w-20 bg-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Technologies and tools I work with to bring ideas to life
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="frontend">Frontend</TabsTrigger>
                <TabsTrigger value="backend">Backend</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredSkills.map((skill) => (
                  <Card key={skill.name} className="skill-card overflow-hidden border-border">
                    <CardContent className="flex flex-col items-center justify-center p-4 h-full">
                      <div className={cn(
                        "w-12 h-12 mb-3 transition-transform duration-300 group-hover:scale-110",
                        activeTab === skill.category ? "animate-fade-in" : ""
                      )}>
                        <img 
                          src={skill.icon} 
                          alt={skill.name} 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <p className="text-sm font-medium">{skill.name}</p>
                    </CardContent>
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

export default Skills;
