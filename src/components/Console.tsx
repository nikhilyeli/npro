import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SectionHeading from '@/components/SectionHeading';
import portfolioData from '@/data/portfolio.json';
import { EGG_EVENT, EggDetail, EggType, eggsForBrand, triggerEgg } from '@/lib/easterEggs';
import { isMuted, playSound, setMuted } from '@/lib/sound';
import { useNavigate } from 'react-router-dom';
import { BRANDS, type BrandId, getBrand, isBrandId, routeFor, useBrand, useThemeSwitcherEnabled } from '@/lib/brand';
import TerminalPet, { type PetKind, isPetEnabled, setPetEnabled, usePetEnabled } from '@/components/TerminalPet';

// How the terminal looks in each theme
interface TerminalSkin {
  prompt: string;
  title: string;
  chrome: 'mac' | 'windows';
  pet?: PetKind;
}

const SKINS: Record<BrandId, TerminalSkin> = {
  signal: { prompt: 'nikhil@portfolio ~ %', title: 'nikhil@portfolio ~ terminal', chrome: 'mac', pet: 'ping' },
  microsoft: { prompt: 'PS C:\\nikhil>', title: 'Windows PowerShell', chrome: 'windows', pet: 'duck' },
  anthropic: { prompt: '>', title: 'nikhil ✻ terminal', chrome: 'mac', pet: 'critter' },
  google: { prompt: 'nikhil@cloudshell:~$', title: 'Cloud Shell', chrome: 'mac', pet: 'dino' },
  apple: { prompt: 'nikhil@mac ~ %', title: 'nikhil — zsh — 80×24', chrome: 'mac', pet: 'siri' },
  meta: { prompt: 'nikhil@dev ~ $', title: 'nikhil · dev', chrome: 'mac', pet: 'metaai' },
  netflix: { prompt: 'nikhil@stream ~ $', title: 'nikhil · now playing', chrome: 'mac', pet: 'reel' },
  amazon: { prompt: 'nikhil@ops ~ $', title: 'nikhil · ops console', chrome: 'mac', pet: 'box' },
  openai: { prompt: 'nikhil@openai ~ %', title: 'nikhil · console', chrome: 'mac', pet: 'bot' },
  syntax: { prompt: 'nikhil@dev:~$', title: 'nikhil — syntax', chrome: 'mac', pet: 'cursor' },
  atelier: { prompt: 'nikhil@atelier ~ %', title: 'nikhil · atelier', chrome: 'mac', pet: 'sprout' },
};

// Typed command -> easter egg. An egg only fires if the current theme has it (see eggsForBrand).
const COMMAND_EGGS: Record<string, EggType> = {
  google: 'google', matrix: 'google',
  microsoft: 'microsoft',
  confetti: 'confetti',
  fidget: 'fidget', spinner: 'fidget',
  bugs: 'bugs', game: 'bugs',
  deploy: 'deploy', 'az deploy': 'deploy', 'azd up': 'deploy', 'gcloud deploy': 'deploy', 'ship --carefully': 'deploy',
  coffee: 'coffee',
  motivate: 'motivate',
  hire: 'hire', 'hire nikhil': 'hire', 'sudo hire nikhil': 'hire', 'runas hire nikhil': 'hire',
  pet: 'pet',
  winver: 'winver', bsod: 'bsod', clippy: 'clippy', dotnet: 'dotnet', 'dotnet run': 'dotnet',
  think: 'think', claude: 'think', haiku: 'haiku',
  dino: 'dino', run: 'dino', offline: 'dino',
  recursion: 'recursion',
  lighthouse: 'lighthouse',
  doodle: 'doodle',
  kubectl: 'kubectl',
  neofetch: 'neofetch',
  swiftrun: 'swiftrun', 'swift run': 'swiftrun',
  reactions: 'reactions', like: 'reactions',
  reacttree: 'reacttree', react: 'reacttree',
  movefast: 'movefast', 'move-fast': 'movefast',
  play: 'play', resume: 'play',
  top10: 'top10',
  day1: 'day1',
  metrics: 'metrics',
  tokens: 'tokens',
  align: 'align',
  format: 'format',
  lint: 'lint',
  develop: 'develop',
  note: 'note',
};

interface TerminalLine {
  type: 'command' | 'output';
  text: string;
  pre?: boolean; // ASCII art: keep spacing, never wrap
}

// Builds a word out of 5-row ASCII letters by joining them row by row.
const asciiWord = (letters: string[][]) => [0, 1, 2, 3, 4].map(row => letters.map(l => l[row]).join(''));

const ART_LETTERS = {
  M: [' __  __ ', '|  \\/  |', '| |\\/| |', '| |  | |', '|_|  |_|'],
  I: [' ___ ', '|_ _|', ' | | ', ' | | ', '|___|'],
  C: ['  ____ ', ' / ___|', '| |    ', '| |___ ', ' \\____|'],
  R: [' ____  ', '|  _ \\ ', '| |_) |', '|  _ < ', '|_| \\_\\'],
  O: ['  ___  ', ' / _ \\ ', '| | | |', '| |_| |', ' \\___/ '],
  S: [' ____  ', '/ ___| ', '\\___ \\ ', ' ___) |', '|____/ '],
  F: [' _____ ', '|  ___|', '| |_   ', '|  _|  ', '|_|    '],
  T: [' _____ ', '|_   _|', '  | |  ', '  | |  ', '  |_|  '],
};

const { M, I, C, R, O, S, F, T } = ART_LETTERS;
const MICRO_ART = asciiWord([M, I, C, R, O]);
const SOFT_ART = asciiWord([S, O, F, T]);

const Console: React.FC = () => {
  const brand = useBrand();
  const skin = SKINS[brand];
  const prompt = skin.prompt;
  // The `theme` command exists only while the theme tools are on (see src/lib/brand.ts)
  const themeToolsOn = useThemeSwitcherEnabled();
  const petEnabled = usePetEnabled();
  const navigate = useNavigate();

  const [isTyping, setIsTyping] = useState(true);
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
    // Reset state, then type each line to completion, in order, exactly once on mount.
    // (Previously two effects raced — a new line could start before the last one finished
    // typing, leaving several lines frozen mid-word. Typing one line fully before starting
    // the next fixes that.)
    setVisibleText([]);
    setIsTyping(true);
    setIsInteractive(false);

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const finishBoot = () => {
      setIsTyping(false);
      const initialHistory: TerminalLine[] = consoleLines.map(l => {
        const isCmd = l.startsWith('>');
        return {
          type: isCmd ? 'command' : 'output',
          text: isCmd ? l.substring(2) : l
        };
      });
      setTerminalHistory([
        ...initialHistory,
        { type: 'output', text: '\nTerminal active. Type "help" to see available commands.' }
      ]);
      setIsInteractive(true);
    };

    const typeLine = (lineIndex: number) => {
      if (cancelled) return;
      if (lineIndex >= consoleLines.length) {
        finishBoot();
        return;
      }
      const line = consoleLines[lineIndex];
      setVisibleText(prev => {
        const next = [...prev];
        next[lineIndex] = '';
        return next;
      });
      let chars = 0;
      const typeChar = () => {
        if (cancelled) return;
        chars++;
        setVisibleText(prev => {
          const next = [...prev];
          next[lineIndex] = line.substring(0, chars);
          return next;
        });
        timeoutId = setTimeout(chars < line.length ? typeChar : () => typeLine(lineIndex + 1), chars < line.length ? 12 : 70);
      };
      typeChar();
    };

    // Add a delay before typing starts
    const startTimeout = setTimeout(() => typeLine(0), 500);

    return () => {
      cancelled = true;
      clearTimeout(startTimeout);
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Easter Egg Event Listeners
  useEffect(() => {
    const handleEasterEgg = (e: Event) => {
      const { type, message } = (e as CustomEvent<EggDetail>).detail ?? {};
      triggerEasterEgg(type || 'microsoft', message);
    };

    window.addEventListener(EGG_EVENT, handleEasterEgg);
    return () => window.removeEventListener(EGG_EVENT, handleEasterEgg);
  }, [isInteractive]);

  // Scroll to bottom on updates
  useEffect(() => {
    if (consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
    }
  }, [terminalHistory, visibleText, isTyping]);

  // Echoes an easter egg into the terminal. The on-screen reward (confetti, spinner, game)
  // is rendered by <EasterEggs />, which listens to the same event.
  const triggerEasterEgg = (type: EggType, message?: string) => {
    // `art` lines never wrap (they'd break the drawing); `lines` are normal wrapping text.
    let art: string[] = [];
    let lines: string[] = [];

    const brand = getBrand();

    // Prints a command, then its output lines one at a time (a fake pipeline "running")
    const runSteps = (command: string, steps: string[], gap = 450, firstAt = gap) => {
      setTerminalHistory(prev => [...prev, { type: 'command', text: command }]);
      steps.forEach((text, i) =>
        setTimeout(() => setTerminalHistory(prev => [...prev, { type: 'output', text }]), firstAt + i * gap)
      );
    };

    switch (type) {
      case 'pet':
        return; // the pet reacts on its own; typed `pet` is echoed by processCommand
      case 'confetti':
        lines = ['🎉 Confetti cannon fired!', ' '];
        break;
      case 'fidget':
        lines = ['🌀 Fidget spinner unlocked. Give it a flick!', ' '];
        break;
      case 'bugs':
        lines = ['🐛 Bug hunt started. Squash them before the build ships!', ' '];
        break;
      case 'coffee':
        lines = ['☕ Brewing... done. Focus +100%, bugs -50%.', ' '];
        break;
      case 'motivate':
        lines = [`💪 ${message ?? 'You got this.'}`, ' '];
        break;
      case 'winver':
        lines = ['Opening "About nPro"...', ' '];
        break;
      case 'bsod':
        lines = ['A problem has been detected and your portfolio has been shut down... just kidding. All systems normal.', ' '];
        break;
      case 'clippy':
        lines = ['📎 It looks like you are reading a portfolio. Would you like help?', ' '];
        break;
      case 'haiku':
        lines = [' ', ...(message ?? '').split('\n').map(l => `  ${l}`), ' '];
        break;
      case 'think':
        runSteps('think', ['✻ Thinking…', '  Weighing a few approaches…', '  Checking the edge cases…', `✔ ${message ?? 'Take it one step at a time.'}`], 700, 100);
        return;
      case 'dotnet':
        runSteps(
          'dotnet run',
          [
            'Determining projects to restore...',
            'Build succeeded.',
            '    0 Warning(s)',
            '    0 Error(s)',
            'info: Nikhil.Portfolio[0]',
            '[System Surprise: Hello, World! Application started.]',
          ],
          380
        );
        return;
      case 'hire':
        lines =
          brand === 'microsoft'
            ? [
                'Enter the password for RECRUITER\\hiring-manager: ********',
                'Attempting to start nikhil.exe as user "RECRUITER\\hiring-manager" ...',
                '[System Surprise: Access granted!]',
                '🎉 Great decision. Opening the contact form...',
                ' ',
              ]
            : [
                '[sudo] password for recruiter: ********',
                '[System Surprise: Permission granted!]',
                '🎉 Great decision. Opening the contact form...',
                ' ',
              ];
        break;
      case 'deploy': {
        // Timed to match the sounds played by <EasterEggs />
        const pipelines: Record<BrandId, { command: string; steps: string[] }> = {
          signal: {
            command: 'deploy',
            steps: ['✔ Restore packages', '✔ Build solution', '✔ 128/128 tests passed', '✔ Deploy to production', '[System Surprise: Shipped. Zero downtime. Nice work!]'],
          },
          microsoft: {
            command: 'azd up',
            steps: ['✔ dotnet restore', '✔ dotnet build -c Release', '✔ 128/128 tests passed', '✔ Deployed to Azure App Service (pretend)', '[System Surprise: Shipped to the cloud. Zero downtime!]'],
          },
          anthropic: {
            command: 'ship --carefully',
            steps: ['✔ Evals passed', '✔ Safety checks passed', '✔ Docs updated', '✔ Rolled out gradually', '[System Surprise: Shipped. Thoughtfully. 🌱]'],
          },
          google: {
            command: 'gcloud deploy',
            steps: ['✔ Build container', '✔ Push to registry', '✔ 128/128 tests passed', '✔ Rolled out to 100% of traffic', '[System Surprise: Shipped to the cloud. Zero downtime!]'],
          },
          apple: {
            command: 'xcodebuild archive',
            steps: ['✔ Compiling Swift sources', '✔ Running unit tests', '✔ Archiving', '✔ Upload succeeded', '[System Surprise: Ready for review. Shipped!]'],
          },
          meta: {
            command: 'deploy --canary',
            steps: ['✔ Lint passed', '✔ Jest: 128/128 passed', '✔ Build succeeded', '✔ Canary 1% → 100%', '[System Surprise: Shipped. Zero downtime!]'],
          },
          netflix: {
            command: 'deploy',
            steps: ['✔ Build encoded', '✔ 128/128 tests passed', '✔ Now streaming in 190 countries (pretend)', '[System Surprise: Shipped. Zero downtime!]'],
          },
          amazon: {
            command: 'deploy',
            steps: ['✔ Build packaged', '✔ Canary rollout', '✔ Rolled out across all fulfillment centers (pretend)', '[System Surprise: Shipped. Zero downtime!]'],
          },
          openai: {
            command: 'deploy',
            steps: ['✔ Evals passed', '✔ Safety checks passed', '✔ Rolled out gradually', '[System Surprise: Shipped. Zero downtime!]'],
          },
          syntax: {
            command: 'build && deploy',
            steps: ['✔ Restore packages', '✔ Build succeeded, 0 warnings', '✔ 128/128 tests passed', '✔ Deployed', '[System Surprise: Shipped. Zero downtime!]'],
          },
          atelier: {
            command: 'publish gallery',
            steps: ['✔ Export originals', '✔ Color grade applied', '✔ Gallery published', '[System Surprise: Shared. Zero downtime! 🌿]'],
          },
        };
        runSteps(pipelines[brand].command, pipelines[brand].steps);
        return;
      }
      case 'recursion':
        runSteps('recursion', ['Did you mean: recursion?', 'Did you mean: recursion?'], 900, 500);
        return;
      case 'lighthouse':
        runSteps(
          'lighthouse',
          ['Running audit...', 'Performance:      100', 'Accessibility:    100', 'Best Practices:   100', 'SEO:              100', '[System Surprise: Perfect score. As it should be.]'],
          420
        );
        return;
      case 'doodle':
        lines = ['🎨 Today\'s doodle: "A Portfolio, celebrating open source."', ' '];
        break;
      case 'kubectl':
        runSteps(
          'kubectl get pods',
          [
            'NAME                    READY   STATUS    RESTARTS',
            'portfolio-frontend-7f8  1/1     Running   0',
            'portfolio-api-2c9       1/1     Running   0',
            'portfolio-worker-9a1    1/1     Running   0',
            '[System Surprise: All pods healthy.]',
          ],
          380
        );
        return;
      case 'neofetch':
        lines = [
          ' ',
          'nikhil@mac',
          '----------',
          'OS: nPro',
          'Kernel: React 18.3',
          'Shell: zsh',
          'Terminal: nikhil@mac ~ zsh',
          'CPU: Coffee-fueled',
          'Memory: Always learning',
          'Uptime: 4+ years',
          ' ',
        ];
        break;
      case 'swiftrun':
        runSteps('swift run', ['Compiling nPro...', 'Build complete! (1.2s)', 'Hello, world!'], 420);
        return;
      case 'reactions':
        lines = ['👍 ❤️ 😆 😮 sent!', ' '];
        break;
      case 'reacttree':
        lines = [
          ' ',
          '<Portfolio>',
          '  <Hero />',
          '  <Console />',
          '  <Projects />',
          '  <Experience />',
          '✔ Hydrated in 42ms',
          ' ',
        ];
        break;
      case 'movefast':
        runSteps('move fast', ['Moving fast...', '(and testing the important parts)', '✔ Shipped.'], 260, 150);
        return;
      case 'dino':
        lines = ['🦖 Dino Runner opened. Jump with Space or tap. Duck with ↓.', ' '];
        break;
      case 'play':
        lines = ['▶ Continue watching Nikhil\'s Portfolio — S1E1: About Me', ' '];
        break;
      case 'top10':
        lines = [
          ' ',
          'Top 10 in Skills today:',
          ...portfolioData.skills.slice(0, 10).map((s, i) => `${i + 1}. ${s.name}`),
          ' ',
        ];
        break;
      case 'day1':
        lines = ["It's always Day 1. Stay customer-obsessed, then ship.", ' '];
        break;
      case 'metrics': {
        const uptime = '99.99%';
        const p99 = '128ms';
        lines = [
          ' ',
          'Illustrative dashboard (not a real production metric):',
          `  uptime:      ${uptime}`,
          `  p99 latency: ${p99}`,
          '  deploys/week: 12',
          ' ',
        ];
        break;
      }
      case 'tokens':
        runSteps('tokens', ['Counting tokens...', 'Thinking, one token at a time...', '[System Surprise: Context loaded. Ready to hire.]'], 380);
        return;
      case 'align':
        lines = ['🎯 Aligning incentives: hire the good engineer.', ' '];
        break;
      case 'format':
        lines = ['Formatted 1 file in 12ms. :)', ' '];
        break;
      case 'lint':
        lines = ['✓ 0 problems, 0 warnings.', ' '];
        break;
      case 'develop':
        runSteps('develop', ['Exposing...', 'Developing...', 'Fixing...', 'Ready. 🌿'], 480);
        return;
      case 'note':
        lines = ['🖊️ "made with care"', ' '];
        break;
      case 'google':
        art = [
          '   ____   ___    ___    ____  _      _____ ',
          '  / ___| / _ \\  / _ \\  / ___|| |    | ____|',
          ' | |  _ | | | || | | || |  _ | |    |  _|  ',
          ' | |_| || |_| || |_| || |_| || |___ | |___ ',
          '  \\____| \\___/  \\___/  \\____||_____||_____|'
        ];
        lines = [
          ' ',
          '[System Surprise: Google Advanced Agent Mode Active!]',
          'Antigravity AI is paired with your session.',
          ' '
        ];
        break;
      case 'microsoft':
        // "MICRO" over "SOFT", stacked so it fits a phone-width terminal
        art = [...MICRO_ART, ' ', ...SOFT_ART];
        lines = [
          ' ',
          '[System Surprise: Microsoft Stack Active!]',
          'C# · .NET · Azure · TypeScript: build succeeded, 0 errors.',
          ' '
        ];
        break;
      default:
        return;
    }

    const echo: Partial<Record<EggType, string>> = {
      hire: brand === 'microsoft' ? 'runas /user:hiring-manager nikhil' : 'sudo hire nikhil',
      bsod: 'bsod',
    };
    const command = echo[type] ?? (type === 'google' || type === 'microsoft' ? `${type}-easteregg` : type);

    setTerminalHistory(prev => [
      ...prev,
      { type: 'command', text: command },
      ...art.map(text => ({ type: 'output' as const, text, pre: true })),
      ...lines.map(text => ({ type: 'output' as const, text }))
    ]);
  };

  const handleThemeCommand = (arg: string): string[] => {
    const available = BRANDS.map(b => b.id).join(', ');
    if (!arg) return [`Current theme: ${getBrand()}`, `Available: ${available}`, 'Usage: theme <name>'];
    if (!isBrandId(arg)) return [`Unknown theme "${arg}". Available: ${available}`];
    navigate(routeFor(arg));
    return [`Theme switched to ${arg} (${routeFor(arg)}).`];
  };

  const processCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    let response: string[] = [];

    // Easter eggs: only the ones this theme has (eggsForBrand). `easteregg` is a hidden random pick.
    const available = eggsForBrand(brand);
    const randomPool = available.filter(t => t !== 'pet');
    const isRandomCmd = cleanCmd === 'easteregg' || ((cleanCmd === 'lucky' || cleanCmd === 'feeling-lucky') && brand === 'google');
    const egg = isRandomCmd ? randomPool[Math.floor(Math.random() * randomPool.length)] : COMMAND_EGGS[cleanCmd];
    if (egg && available.includes(egg)) {
      if (egg === 'pet') {
        setTerminalHistory(prev => [...prev, { type: 'command', text: cmd }, { type: 'output', text: '🐾 You gave your pet a pat.' }]);
      }
      triggerEgg(egg);
      return;
    }

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
          ...(themeToolsOn ? ['  theme       - List or switch site themes (e.g. theme microsoft)'] : []),
          '  sound       - Turn sound effects on or off',
          '  pets        - Show or hide the terminal pet (pets on / pets off)',
          '  clear       - Clear the screen',
          ' ',
          '💡 Psst... there are hidden easter eggs on this site. Try the logo, the footer, and some unusual commands.'
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
      case 'sound': {
        const nowMuted = !isMuted();
        setMuted(nowMuted);
        if (!nowMuted) playSound('pop');
        response = [nowMuted ? '🔇 Sound effects off.' : '🔊 Sound effects on.'];
        break;
      }
      case 'pets':
      case 'pets on':
      case 'pets off': {
        const nextEnabled = cleanCmd === 'pets on' ? true : cleanCmd === 'pets off' ? false : !isPetEnabled();
        setPetEnabled(nextEnabled);
        if (nextEnabled) playSound('pop');
        response = [nextEnabled ? '🐾 Pet enabled. Look for it under the terminal.' : '🐾 Pet hidden. Type "pets on" to bring it back.'];
        break;
      }
      default:
        if (themeToolsOn && (cleanCmd === 'theme' || cleanCmd.startsWith('theme '))) {
          response = handleThemeCommand(cleanCmd.slice(5).trim());
        } else {
          response = [`Command not found: "${cmd}". Type "help" to see available commands.`];
        }
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
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading title="About Me" />

        <div className="max-w-3xl mx-auto">
          <Card className="border border-border bg-terminal-bg text-terminal-fg rounded-lg overflow-hidden shadow-xl">
            <CardContent className="p-0">
              {skin.chrome === 'windows' ? (
                // Windows Terminal style: title on the left, window buttons on the right
                <div className="bg-black/40 flex items-stretch justify-between border-b border-border pl-3 text-xs">
                  <div className="flex items-center gap-2 py-2 font-mono opacity-80">
                    <span aria-hidden="true">❯_</span>
                    {skin.title}
                  </div>
                  <div className="flex" aria-hidden="true">
                    {['–', '▢', '✕'].map(glyph => (
                      <span key={glyph} className="w-11 py-2 text-center opacity-70">{glyph}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-black/40 flex items-center justify-between px-4 py-2 border-b border-border">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-terminal-red"></div>
                    <div className="w-3 h-3 rounded-full bg-terminal-yellow"></div>
                    <div className="w-3 h-3 rounded-full bg-terminal-green"></div>
                  </div>
                  <div className="text-xs opacity-70 font-mono">{skin.title}</div>
                  <div className="w-12"></div> {/* Spacer */}
                </div>
              )}
              
              <div 
                ref={consoleContainerRef}
                onClick={handleTerminalClick}
                className="font-mono text-sm p-6 min-h-[380px] max-h-[500px] overflow-y-auto cursor-text" 
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {isTyping ? (
                  visibleText.map((line, index) => (
                    <div key={index} className="mb-1">
                      <span className={(line && line.startsWith('>')) ? 'text-terminal-prompt' : ''}>
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
                            <span className="text-terminal-prompt">{prompt} </span>
                            <span className="text-terminal-command font-bold">{item.text}</span>
                          </div>
                        ) : (
                          <div
                            className={item.text.startsWith('[System') ? 'text-terminal-highlight font-bold' : ''}
                            style={item.pre ? { whiteSpace: 'pre' } : undefined}
                          >
                            {item.text}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isInteractive && (
                      <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 mt-2">
                        <span className="text-terminal-prompt">{prompt}</span>
                        <input
                          ref={inputRef}
                          type="text"
                          aria-label="Terminal command"
                          autoComplete="off"
                          autoCapitalize="off"
                          autoCorrect="off"
                          spellCheck={false}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          className="bg-transparent border-none outline-none flex-grow text-terminal-fg font-mono text-sm focus:ring-0 p-0 focus:outline-none"
                          placeholder="type 'help'..."
                        />
                      </form>
                    )}
                  </>
                )}
              </div>

              {skin.pet && petEnabled && <TerminalPet kind={skin.pet} />}
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
