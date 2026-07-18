import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
const Contact: React.FC = () => {
  const {
    toast
  } = useToast();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // In a real app, you would send the form data to a backend service
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. I'll get back to you soon."
    });

    // Reset form
    (e.target as HTMLFormElement).reset();
  };
  return <section id="contact" className="py-20 bg-muted/50 dark:bg-dark-background/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
          <div className="h-1 w-20 bg-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Have a project in mind or want to collaborate? Drop me a message!
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6">Send a Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input id="name" placeholder="Your Name" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="your.email@example.com" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input id="subject" placeholder="What's this about?" required />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea id="message" placeholder="Your message here..." rows={5} required />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="space-y-8">
              <Card className="border-border h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="text-xl font-bold mb-6">Connect With Me</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Email</h4>
                        <a href="mailto:nikhilyeli@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                          nikhilyeli@gmail.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Location</h4>
                        <p className="text-muted-foreground">Vijayawada, India</p>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-medium mb-4">Follow Me</h4>
                  <div className="flex gap-4">
                    {/* GitHub */}
                    <a href="https://github.com/nikhilyeli-hcl" target="_blank" rel="noopener noreferrer" className="h-10 w-10 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-colors" aria-label="GitHub">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                    </a>
                    
                    {/* LinkedIn */}
                    <a href="https://linkedin.com/in/nikhilyeli" target="_blank" rel="noopener noreferrer" className="h-10 w-10 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-colors" aria-label="LinkedIn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                    
                    {/* Twitter */}
                    <a href="https://twitter.com/nikhilyeli" target="_blank" rel="noopener noreferrer" className="h-10 w-10 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-colors" aria-label="Twitter">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </a>
                    
                    {/* Instagram */}
                    <a href="https://instagram.com/nikki.nikhil.1811" target="_blank" rel="noopener noreferrer" className="h-10 w-10 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-colors" aria-label="Instagram">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </a>
                  </div>
                  
                  <div className="mt-auto pt-8">
                    <p className="text-sm text-muted-foreground">
                      Looking forward to working together on your next big project!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Contact;