
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const Console: React.FC = () => {
  const [text, setText] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  const [visibleText, setVisibleText] = useState<string[]>([]);

  // Console content - JSON structure with personal information
  const consoleLines = [
    '> Nikhil.getAbout()',
    `{`,
    `  "name": "Nikhil",`,
    `  "title": "Fullstack Software Engineer",`,
    `  "passions": ["Coding", "Design", "Problem Solving"],`,
    `  "background": {`,
    `    "summary": "Experienced software engineer with a passion for creating elegant, efficient, and user-friendly applications."`,
    `  },`,
    `  "philosophy": "Simple solutions to complex problems."`,
    `}`,
    '> Nikhil.contact()',
    `{`,
    `  "email": "hello@nikhil.dev",`,
    `  "github": "github.com/nikhildev",`,
    `  "linkedin": "linkedin.com/in/nikhildev"`,
    `}`,
  ];

  useEffect(() => {
    // Reset states when component mounts
    setText([]);
    setVisibleText([]);
    setCurrentLine(0);
    setIsTyping(true);
    
    // Add a delay before typing starts
    const startTimeout = setTimeout(() => {
      const timer = setInterval(() => {
        if (currentLine < consoleLines.length) {
          setText(prev => [...prev, consoleLines[currentLine]]);
          setCurrentLine(prev => prev + 1);
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, 200);
  
      return () => clearInterval(timer);
    }, 500);

    return () => clearTimeout(startTimeout);
  }, [currentLine]);

  // Type animation effect
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (text.length > 0 && isTyping) {
      const lastLine = text[text.length - 1];
      let visibleChars = 0;
      
      const typeChar = () => {
        if (visibleChars <= lastLine.length) {
          setVisibleText(prev => {
            const newArr = [...prev];
            newArr[text.length - 1] = lastLine.substring(0, visibleChars);
            return newArr;
          });
          visibleChars++;
          timeoutId = setTimeout(typeChar, 20);
        }
      };
      
      typeChar();
    }
    
    return () => clearTimeout(timeoutId);
  }, [text, isTyping]);

  return (
    <section id="about" className="py-20 bg-background dark:bg-dark-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">About Me</h2>
          <div className="h-1 w-20 bg-primary mx-auto"></div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card className="border border-border bg-console-bg text-console-text rounded-lg overflow-hidden shadow-xl">
            <CardContent className="p-0">
              <div className="bg-black/40 flex items-center px-4 py-2 border-b border-border">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-red"></div>
                  <div className="w-3 h-3 rounded-full bg-brand-yellow"></div>
                  <div className="w-3 h-3 rounded-full bg-brand-green"></div>
                </div>
                <div className="ml-4 text-xs opacity-70">nikhil@portfolio ~ console</div>
              </div>
              
              <div className="font-mono text-sm p-6 min-h-[350px]" style={{ whiteSpace: 'pre-wrap' }}>
                {visibleText.map((line, index) => (
                  <div key={index} className="mb-1">
                    <span className={(line && line.startsWith('>')) ? 'text-brand-blue' : ''}>
                      {line}
                    </span>
                    {index === visibleText.length - 1 && isTyping && (
                      <span className="console-cursor"></span>
                    )}
                  </div>
                ))}
                {!isTyping && <span className="console-cursor"></span>}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-12 text-center">
            <p className="text-lg leading-relaxed mb-6">
              I'm a fullstack developer with expertise in building robust web applications using modern technologies. 
              From frontend development with React and Angular to backend systems with .NET and C#, I'm passionate about
              creating efficient, elegant solutions that solve real-world problems.
            </p>
            <p className="text-lg leading-relaxed">
              Beyond coding, I have a strong interest in UI/UX design, video editing, photography, and content creation. 
              This combination of technical and creative skills allows me to approach each project with a holistic perspective,
              ensuring the end result is not only functional but also visually compelling and user-friendly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Console;
