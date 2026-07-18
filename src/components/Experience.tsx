
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TimelineItem {
  id: number;
  title: string;
  organization: string;
  period: string;
  description: string;
  highlights?: string[];
  technologies?: string[];
  type: 'work' | 'education';
}

const Experience: React.FC = () => {
  const timelineItems: TimelineItem[] = [
    // Work experiences
    {
      id: 1,
      title: "Senior Software Engineer",
      organization: "Tech Innovations Inc.",
      period: "2021 - Present",
      description: "Lead fullstack developer for enterprise applications, focusing on scalable architecture and team mentoring.",
      highlights: [
        "Developed a microservices-based architecture that improved system reliability by 35%",
        "Led a team of 5 developers in implementing new features and maintaining existing codebase",
        "Implemented CI/CD pipelines that reduced deployment time by 60%"
      ],
      technologies: ["React", "TypeScript", ".NET Core", "Azure", "Docker", "Kubernetes"],
      type: "work"
    },
    {
      id: 2,
      title: "Fullstack Developer",
      organization: "Digital Solutions Co.",
      period: "2018 - 2021",
      description: "Designed and developed web applications for clients across various industries.",
      highlights: [
        "Built and maintained 12+ client projects from concept to deployment",
        "Implemented responsive designs that improved mobile conversion rates by 25%",
        "Created reusable component libraries that accelerated development time by 40%"
      ],
      technologies: ["Angular", "JavaScript", "C#", "SQL Server", "Entity Framework", "AWS"],
      type: "work"
    },
    {
      id: 3,
      title: "Frontend Developer",
      organization: "Web Creators Studio",
      period: "2016 - 2018",
      description: "Created interactive and responsive user interfaces for web applications.",
      highlights: [
        "Developed modern UI components using React and Redux",
        "Optimized application performance, reducing load time by 45%",
        "Collaborated with designers to implement pixel-perfect user interfaces"
      ],
      technologies: ["React", "Redux", "JavaScript", "HTML5", "CSS3", "SASS"],
      type: "work"
    },
    
    // Education
    {
      id: 4,
      title: "Master's in Computer Science",
      organization: "Tech University",
      period: "2014 - 2016",
      description: "Specialized in Software Engineering with a focus on web technologies and distributed systems.",
      highlights: [
        "GPA: 3.9/4.0",
        "Thesis: 'Performance Optimization in Distributed Web Applications'",
        "Teaching Assistant for Advanced Web Development course"
      ],
      type: "education"
    },
    {
      id: 5,
      title: "Bachelor's in Software Engineering",
      organization: "State University",
      period: "2010 - 2014",
      description: "Comprehensive program covering software development fundamentals and practices.",
      highlights: [
        "GPA: 3.8/4.0",
        "Senior Project: E-commerce platform with recommendation engine",
        "Awarded 'Outstanding Student in Computer Science' scholarship"
      ],
      type: "education"
    }
  ];

  return (
    <section id="experience" className="py-20 bg-muted/50 dark:bg-dark-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Experience & Education</h2>
          <div className="h-1 w-20 bg-primary mx-auto"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="work">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="work">Work Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="work" className="mt-0">
              <div className="relative pl-8 border-l-2 border-muted">
                {timelineItems
                  .filter(item => item.type === 'work')
                  .map((item) => (
                    <div key={item.id} className="mb-12 relative animate-fade-in" style={{ animationDelay: `${item.id * 0.1}s` }}>
                      <div className="absolute -left-10 p-2 bg-background dark:bg-dark-background rounded-full border-2 border-primary -mt-1">
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                      </div>
                      
                      <div className="-mt-6">
                        <Badge variant="outline" className="mb-2">{item.period}</Badge>
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <h4 className="text-lg font-medium text-muted-foreground mb-2">{item.organization}</h4>
                        
                        <Card className="mt-4">
                          <CardContent className="p-4">
                            <p className="mb-4">{item.description}</p>
                            
                            {item.highlights && (
                              <div className="mb-4">
                                <h5 className="font-semibold mb-2">Key Achievements:</h5>
                                <ul className="list-disc list-inside space-y-1">
                                  {item.highlights.map((highlight, idx) => (
                                    <li key={idx} className="text-sm">{highlight}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {item.technologies && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {item.technologies.map(tech => (
                                  <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="education" className="mt-0">
              <div className="relative pl-8 border-l-2 border-muted">
                {timelineItems
                  .filter(item => item.type === 'education')
                  .map((item) => (
                    <div key={item.id} className="mb-12 relative animate-fade-in" style={{ animationDelay: `${item.id * 0.1}s` }}>
                      <div className="absolute -left-10 p-2 bg-background dark:bg-dark-background rounded-full border-2 border-primary -mt-1">
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                      </div>
                      
                      <div className="-mt-6">
                        <Badge variant="outline" className="mb-2">{item.period}</Badge>
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <h4 className="text-lg font-medium text-muted-foreground mb-2">{item.organization}</h4>
                        
                        <Card className="mt-4">
                          <CardContent className="p-4">
                            <p className="mb-4">{item.description}</p>
                            
                            {item.highlights && (
                              <div>
                                <ul className="space-y-1">
                                  {item.highlights.map((highlight, idx) => (
                                    <li key={idx} className="text-sm">{highlight}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Experience;
