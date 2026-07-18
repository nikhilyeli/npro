
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Achievement {
  id: number;
  title: string;
  issuer?: string;
  date: string;
  description?: string;
  link?: string;
  type: 'certification' | 'award' | 'publication';
}

const Achievements: React.FC = () => {
  const items: Achievement[] = [
    // Certifications
    {
      id: 1,
      title: "Microsoft Certified: Azure Developer Associate",
      issuer: "Microsoft",
      date: "2023",
      description: "Validates expertise in designing, building, testing, and maintaining cloud applications and services on Microsoft Azure.",
      link: "#",
      type: "certification"
    },
    {
      id: 2,
      title: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      date: "2022",
      description: "Demonstrates knowledge in developing, deploying, and debugging cloud-based applications using AWS.",
      link: "#",
      type: "certification"
    },
    {
      id: 3,
      title: "Professional Scrum Master I",
      issuer: "Scrum.org",
      date: "2021",
      description: "Validates understanding of Scrum framework and ability to apply it effectively.",
      link: "#",
      type: "certification"
    },
    
    // Awards
    {
      id: 4,
      title: "Innovation Award",
      issuer: "Tech Innovations Inc.",
      date: "2022",
      description: "Awarded for developing an AI-powered recommendation system that increased customer engagement by 40%.",
      type: "award"
    },
    {
      id: 5,
      title: "Hackathon Winner",
      issuer: "Global Developer Conference",
      date: "2021",
      description: "First place in the annual hackathon for creating an accessibility tool for visually impaired users.",
      type: "award"
    },
    
    // Publications
    {
      id: 6,
      title: "Modern Frontend Architecture Patterns",
      issuer: "Tech Journal",
      date: "2023",
      description: "Research paper discussing emerging patterns in frontend architecture and their impact on application performance.",
      link: "#",
      type: "publication"
    },
    {
      id: 7,
      title: "Optimizing .NET Core Microservices",
      issuer: "Software Engineering Quarterly",
      date: "2022",
      description: "Case study on performance optimization techniques for .NET Core microservices in high-load environments.",
      link: "#",
      type: "publication"
    }
  ];

  const certifications = items.filter(item => item.type === 'certification');
  const awards = items.filter(item => item.type === 'award');
  const publications = items.filter(item => item.type === 'publication');

  return (
    <section id="achievements" className="py-20 bg-background dark:bg-dark-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Achievements & Publications</h2>
          <div className="h-1 w-20 bg-primary mx-auto"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="certifications">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
                <TabsTrigger value="awards">Awards</TabsTrigger>
                <TabsTrigger value="publications">Publications</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="certifications" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certifications.map(item => (
                  <Card key={item.id} className="h-full border-border animate-fade-in" style={{ animationDelay: `${item.id * 0.1}s` }}>
                    <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.issuer} • {item.date}</p>
                      </div>
                      <Badge variant="outline">Certificate</Badge>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {item.description && <p className="text-sm">{item.description}</p>}
                      {item.link && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline mt-2 inline-block"
                        >
                          View Certificate →
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="awards" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {awards.map(item => (
                  <Card key={item.id} className="h-full border-border animate-fade-in" style={{ animationDelay: `${item.id * 0.1}s` }}>
                    <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.issuer} • {item.date}</p>
                      </div>
                      <Badge variant="secondary">Award</Badge>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {item.description && <p className="text-sm">{item.description}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="publications" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {publications.map(item => (
                  <Card key={item.id} className="h-full border-border animate-fade-in" style={{ animationDelay: `${item.id * 0.1}s` }}>
                    <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.issuer} • {item.date}</p>
                      </div>
                      <Badge variant="outline" className="bg-brand-blue/10 text-brand-blue border-brand-blue/20">Publication</Badge>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {item.description && <p className="text-sm">{item.description}</p>}
                      {item.link && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline mt-2 inline-block"
                        >
                          Read Article →
                        </a>
                      )}
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

export default Achievements;
