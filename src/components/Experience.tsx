import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionHeading from '@/components/SectionHeading';
import portfolioData from '@/data/portfolio.json';

interface TimelineItem {
  id: number;
  title: string;
  organization: string;
  period: string;
  description: string;
  highlights?: string[];
  technologies?: string[];
  type: 'work' | 'education';

  // New properties
  jobTitle?: string;
  role?: string;
  workMode?: string;
  employmentMode?: string;
  place?: string;
}

type RoadmapState = 'completed' | 'current';

const getRoadmapState = (period: string): RoadmapState =>
  period.toLowerCase().includes('present') ? 'current' : 'completed';

const RoadmapIcon: React.FC<{ state: RoadmapState }> = ({ state }) =>
  state === 'completed' ? (
    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terminal-green">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </div>
  ) : (
    /* Growth arrow + revolving dotted progress circle — "currently in progress" */
    <div
      className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
      style={{
        background: 'radial-gradient(circle at 40% 35%, #fffbeb 0%, #fef3c7 55%, #fde68a 100%)',
        boxShadow: '0 0 0 2.5px #f59e0b66, 0 2px 8px #f59e0b33',
      }}
      aria-label="In progress"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <style>{`
          @keyframes npro-arc-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
        {/* Faint full circle track */}
        <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="1.2" opacity="0.18" />
        {/* Revolving solid progress arc — download/spinner style ~75% filled */}
        <circle
          cx="12" cy="12" r="10"
          stroke="#d97706"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="47 16"
          style={{ transformOrigin: '12px 12px', animation: 'npro-arc-spin 1.6s linear infinite' }}
        />
        {/* Centred tick / checkmark */}
        <path
          d="M8 12.5 l3 3 5-6"
          stroke="#92400e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );

// Dotted line fading IN from the top — sits above the first (present) item.
const RoadmapFadeHead: React.FC = () => (
  <div
    className="mb-1 w-0 border-l-2 border-dashed border-muted-foreground/50"
    style={{
      height: '2.5rem',
      maskImage: 'linear-gradient(to bottom, transparent, black)',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)',
    }}
  />
);

// Dashed line fading OUT downward — sits below the last (oldest) item.
const RoadmapFadeTail: React.FC = () => (
  <div
    className="mt-1 w-0 border-l-2 border-dashed border-muted-foreground/50"
    style={{
      height: '4rem',
      maskImage: 'linear-gradient(to bottom, black, transparent)',
      WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
    }}
  />
);

const Experience: React.FC = () => {
  const timelineItems: TimelineItem[] = portfolioData.experience as TimelineItem[];
  // Present → Past order (newest first, no reverse).
  const workItems = timelineItems.filter(item => item.type === 'work');
  const educationItems = timelineItems.filter(item => item.type === 'education');

  return (
    <section id="experience" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <SectionHeading title="Experience & Education" />

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="work">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="work">Work Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="work" className="mt-0">
              <div className="flex flex-col">
                {workItems.map((item, index) => {
                  const state = getRoadmapState(item.period);
                  const isFirst = index === 0;
                  const isLast = index === workItems.length - 1;
                  return (
                    <div key={item.id} className="flex animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex flex-col items-center mr-6">
                        {isFirst && <RoadmapFadeHead />}
                        <RoadmapIcon state={state} />
                        {isLast ? <RoadmapFadeTail /> : <div className="w-0.5 flex-1 bg-terminal-green" />}
                      </div>

                      <div className="flex-1 pb-12">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline">{item.period}</Badge>
                          {item.place && <Badge variant="secondary">{item.place}</Badge>}
                          {item.workMode && (
                            <Badge variant="accent" className="capitalize">
                              {item.workMode}
                            </Badge>
                          )}
                          {item.employmentMode && (
                            <Badge variant="success" className="capitalize">
                              {item.employmentMode.replace('-', ' ')}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-bold">
                          {item.jobTitle && item.role ? `${item.jobTitle} - ${item.role}` : item.title}
                        </h3>
                        <h4 className="text-lg font-medium text-muted-foreground mb-2">{item.organization}</h4>

                        <Card className="mt-4">
                          <CardContent className="p-4">
                            {item.description && <p className="mb-4 text-foreground/90">{item.description}</p>}

                            {item.highlights && (
                              <div className="mb-4">
                                <h5 className="font-semibold mb-2 text-primary">Key Achievements:</h5>
                                <ul className="list-disc list-inside space-y-1.5 text-foreground/80">
                                  {item.highlights.map((highlight, idx) => (
                                    <li key={idx} className="text-sm leading-relaxed">{highlight}</li>
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

                        {isLast && (
                          <p className="mt-4 text-sm italic text-muted-foreground/70">Where it all started…</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="education" className="mt-0">
              <div className="flex flex-col">
                {educationItems.map((item, index) => {
                  const state = getRoadmapState(item.period);
                  const isFirst = index === 0;
                  const isLast = index === educationItems.length - 1;
                  return (
                    <div key={item.id} className="flex animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex flex-col items-center mr-6">
                        {isFirst && <RoadmapFadeHead />}
                        <RoadmapIcon state={state} />
                        {isLast ? <RoadmapFadeTail /> : <div className="w-0.5 flex-1 bg-terminal-green" />}
                      </div>

                      <div className="flex-1 pb-12">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline">{item.period}</Badge>
                          {item.place && <Badge variant="secondary">{item.place}</Badge>}
                        </div>
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <h4 className="text-lg font-medium text-muted-foreground mb-2">{item.organization}</h4>

                        <Card className="mt-4">
                          <CardContent className="p-4">
                            {item.description && <p className="mb-4 text-foreground/90">{item.description}</p>}

                            {item.highlights && (
                              <div>
                                <ul className="space-y-1.5 text-foreground/80 list-disc list-inside">
                                  {item.highlights.map((highlight, idx) => (
                                    <li key={idx} className="text-sm leading-relaxed">{highlight}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {isLast && (
                          <p className="mt-4 text-sm italic text-muted-foreground/70">Where it all started…</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Experience;
