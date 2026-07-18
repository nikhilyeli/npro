
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import portfolioData from '@/data/portfolio.json';

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
  const certifications: Achievement[] = portfolioData.achievements.certifications.map(item => ({
    ...item,
    type: 'certification' as const
  }));
  const awards: Achievement[] = portfolioData.achievements.awards.map(item => ({
    ...item,
    type: 'award' as const
  }));
  const publications: Achievement[] = portfolioData.achievements.publications.map(item => ({
    ...item,
    type: 'publication' as const
  }));

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
                      {item.link && item.link !== "#" && item.link !== "" && (
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
                      {item.link && item.link !== "#" && item.link !== "" && (
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
