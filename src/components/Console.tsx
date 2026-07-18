import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import portfolioData from '@/data/portfolio.json';

interface TerminalLine {
  type: 'command' | 'output';
  text: string;
}

const Console: React.FC = () => {
  const [text, setText] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [currentLine, setCurrentLine] = useState(0);
  const [visibleText, setVisibleText] = useState<string[]>([]);
  
  // Interactive console states
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isInteractive, setIsInteractive] = useState(false);
  const consoleContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Console content - JSON structure with personal information
  const consoleLines = [
    `> ${portfolioData.personalInfo.firstName}.getAbout()`,
    `{`,
    `  "name": "${portfolioData.personalInfo.name}",`,
    `  "title": "${portfolioData.personalInfo.title}",`,
    `  "passions": ${JSON.stringify(portfolioData.personalInfo.passions)},`,
    `  "background": {`,
    `    "summary": "${portfolioData.personalInfo.summary}"`,
    `  },`,
    `  "philosophy": "${portfolioData.personalInfo.philosophy}"`,
    `}`,
    `> ${portfolioData.personalInfo.firstName}.contact()`,
    `{`,
    `  "email": "${portfolioData.personalInfo.email}",`,
    `  "github": "${portfolioData.personalInfo.socials.github.replace('https://', '')}",`,
    `  "linkedin": "${portfolioData.personalInfo.socials.linkedin.replace('https://', '')}"`,
    `}`,
  ];

  useEffect(() => {
    // Reset states when component mounts
    setText([]);
    setVisibleText([]);
    setCurrentLine(0);
    setIsTyping(true);
    setIsInteractive(false);
    
    // Add a delay before typing starts
    const startTimeout = setTimeout(() => {
      const timer = setInterval(() => {
        if (currentLine < consoleLines.length) {
          setText(prev => [...prev, consoleLines[currentLine]]);
          setCurrentLine(prev => prev + 1);
        } else {
          setIsTyping(false);
          clearInterval(timer);
          
          // Transition to interactive CLI terminal
          const initialHistory: TerminalLine[] = consoleLines.map(line => {
            const isCmd = line.startsWith('>');
            return {
              type: isCmd ? 'command' : 'output',
              text: isCmd ? line.substring(2) : line
            };
          });
          
          setTerminalHistory([
            ...initialHistory,
            { type: 'output', text: '\nTerminal active. Type "help" to see available commands.' }
          ]);
          setIsInteractive(true);
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
          timeoutId = setTimeout(typeChar, 15);
        }
      };
      
      typeChar();
    }
    
    return () => clearTimeout(timeoutId);
  }, [text, isTyping]);

  // Handle Easter Egg Event Listeners
  useEffect(() => {
    const handleEasterEgg = (e: CustomEvent<{ type: string }>) => {
      const eggType = e.detail?.type || 'microsoft';
      triggerEasterEgg(eggType);
    };
    
    window.addEventListener('trigger-easter-egg' as any, handleEasterEgg);
    return () => window.removeEventListener('trigger-easter-egg' as any, handleEasterEgg);
  }, [isInteractive]);

  // Scroll to bottom on updates
  useEffect(() => {
    if (consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
    }
  }, [terminalHistory, visibleText, isTyping]);

  const triggerEasterEgg = (type: string) => {
    let art: string[] = [];
    if (type === 'google') {
      art = [
        ' ',
        '   ____   ___    ___    ____  _      _____ ',
        '  / ___| / _ \\  / _ \\  / ___|| |    | ____|',
        ' | |  _ | | | || | | || |  _ | |    |  _|  ',
        ' | |_| || |_| || |_| || |_| || |___ | |___ ',
        '  \\____| \\___/  \\___/  \\____||_____||_____|',
        ' ',
        '[System Surprise: Google Advanced Agent Mode Active!]',
        'Antigravity AI is paired with your session.',
        ' '
      ];
    } else {
      art = [
        ' ',
        '  _  _   __  __  ___   ___    ___   ___    ___   _____ ',
        ' |  \\/  | |  \\/  | | _ \\ | _ \\  / _ \\ | __|  / _ \\ |__  / ',
        ' | |\\/| | | |\\/| | |  _/ |   / | (_) ||__ \\ | (_) |  / /  ',
        ' |_|  |_| |_|  |_| |_|   |_|_\\  \\___/ |___/  \\___/  /_/   ',
        ' ',
        '[System Surprise: Microsoft Tech Stack Active!]',
        'C# .NET Core compilation status: 100% stable.',
        ' '
      ];
    }
    
    setTerminalHistory(prev => [
      ...prev,
      { type: 'command', text: type === 'google' ? 'google-easteregg' : 'microsoft-easteregg' },
      ...art.map(text => ({ type: 'output' as const, text }))
    ]);
  };

  const processCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    let response: string[] = [];

    switch (cleanCmd) {
      case 'help':
        response = [
          'Available commands:',
          '  about       - Professional bio and summary',
          '  skills      - Key technical capabilities',
          '  experience  - Work history and education',
          '  services    - Services offered',
          '  projects    - Selected software projects',
          '  contact     - Contact and social links',
          '  clear       - Clear the screen',
          '  easteregg   - Trigger a secret surprise!'
        ];
        break;
      case 'about':
        response = [
          JSON.stringify({
            name: portfolioData.personalInfo.name,
            title: portfolioData.personalInfo.title,
            experience: 'Over 4 years',
            philosophies: [portfolioData.personalInfo.philosophy, portfolioData.personalInfo.ctaPhilosophy],
            summary: portfolioData.personalInfo.summary
          }, null, 2)
        ];
        break;
      case 'skills':
        const categories: Record<string, string[]> = {};
        portfolioData.skills.forEach(s => {
          if (!categories[s.category]) categories[s.category] = [];
          categories[s.category].push(s.name);
        });
        response = Object.entries(categories).map(([cat, list]) => 
          `[${cat.toUpperCase()}]: ${list.join(', ')}`
        );
        break;
      case 'experience':
        response = portfolioData.experience.map(item => {
          if (item.type === 'work') {
            return `- ${item.jobTitle} - ${item.role} @ ${item.organization} (${item.period}) [Location: ${item.place || 'Remote'}] [Mode: ${item.workMode || 'remote'}, ${item.employmentMode || 'full-time'}]`;
          }
          return `- ${item.title} @ ${item.organization} (${item.period}) [Location: ${item.place || 'N/A'}]`;
        });
        break;
      case 'services':
        response = portfolioData.services.map(s => `* ${s.title}: ${s.description}`);
        break;
      case 'projects':
        response = portfolioData.projects.map(p => `* ${p.title} (${p.category}): ${p.description}`);
        break;
      case 'contact':
        response = [
          `Email: ${portfolioData.personalInfo.email}`,
          `Phone: ${portfolioData.personalInfo.phone}`,
          `Location: ${portfolioData.personalInfo.location}`,
          `LinkedIn: ${portfolioData.personalInfo.socials.linkedin}`,
          `GitHub: ${portfolioData.personalInfo.socials.github}`
        ];
        break;
      case 'clear':
        setTerminalHistory([]);
        return;
      case 'easteregg':
        triggerEasterEgg('microsoft');
        return;
      case 'matrix':
      case 'google':
        triggerEasterEgg('google');
        return;
      default:
        response = [`Command not found: "${cmd}". Type "help" to see available commands.`];
    }

    setTerminalHistory(prev => [
      ...prev,
      { type: 'command', text: cmd },
      ...response.map(text => ({ type: 'output' as const, text }))
    ]);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    processCommand(inputValue);
    setInputValue('');
  };

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
              <div className="bg-black/40 flex items-center justify-between px-4 py-2 border-b border-border">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-red"></div>
                  <div className="w-3 h-3 rounded-full bg-brand-yellow"></div>
                  <div className="w-3 h-3 rounded-full bg-brand-green"></div>
                </div>
                <div className="text-xs opacity-70 font-mono">nikhil@portfolio ~ terminal</div>
                <div className="w-12"></div> {/* Spacer */}
              </div>
              
              <div 
                ref={consoleContainerRef}
                onClick={handleTerminalClick}
                className="font-mono text-sm p-6 min-h-[380px] max-h-[500px] overflow-y-auto cursor-text" 
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {isTyping ? (
                  visibleText.map((line, index) => (
                    <div key={index} className="mb-1">
                      <span className={(line && line.startsWith('>')) ? 'text-brand-blue' : ''}>
                        {line}
                      </span>
                      {index === visibleText.length - 1 && (
                        <span className="console-cursor"></span>
                      )}
                    </div>
                  ))
                ) : (
                  <>
                    {terminalHistory.map((item, index) => (
                      <div key={index} className="mb-1">
                        {item.type === 'command' ? (
                          <div>
                            <span className="text-brand-green">nikhil@portfolio ~ % </span>
                            <span className="text-brand-blue font-bold">{item.text}</span>
                          </div>
                        ) : (
                          <div className={item.text.startsWith('[System') ? 'text-brand-yellow font-bold' : ''}>
                            {item.text}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isInteractive && (
                      <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 mt-2">
                        <span className="text-brand-green">nikhil@portfolio ~ %</span>
                        <input 
                          ref={inputRef}
                          type="text" 
                          value={inputValue} 
                          onChange={(e) => setInputValue(e.target.value)}
                          className="bg-transparent border-none outline-none flex-grow text-console-text font-mono text-sm focus:ring-0 p-0 focus:outline-none"
                          placeholder="type 'help'..."
                        />
                      </form>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-12 text-center">
            {portfolioData.personalInfo.aboutParagraphs.map((paragraph, index) => (
              <p key={index} className="text-lg leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Console;
