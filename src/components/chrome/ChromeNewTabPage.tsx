
'use client';

import React from 'react';
import Image from 'next/image';
import WebSearch from '@/components/shared/WebSearch';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, PlusCircle, Youtube, Twitter, Github, Linkedin, Figma, Code } from 'lucide-react';

const shortcuts = [
  { name: 'Google', icon: Globe, url: 'https://google.com' },
  { name: 'YouTube', icon: Youtube, url: 'https://youtube.com' },
  { name: 'Twitter', icon: Twitter, url: 'https://twitter.com' },
  { name: 'GitHub', icon: Github, url: 'https://github.com' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com' },
  { name: 'Figma', icon: Figma, url: 'https://figma.com' },
  { name: 'Dev.to', icon: Code, url: 'https://dev.to' },
  { name: 'Add Shortcut', icon: PlusCircle, url: '#' }, // Placeholder action
];

const ChromeNewTabPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8 selection:bg-primary/20 selection:text-primary-foreground">
      <Image 
        src="https://placehold.co/272x92.png" 
        alt="Site Logo" 
        width={272} 
        height={92} 
        className="mb-10" 
        data-ai-hint="google logo" 
        priority
      />

      <div className="w-full max-w-xl mb-16">
        <WebSearch />
      </div>

      <div className="grid grid-cols-4 gap-x-6 gap-y-6 w-full max-w-2xl">
        {shortcuts.map((shortcut) => (
          <a
            key={shortcut.name}
            href={shortcut.url}
            target={shortcut.url === '#' ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
            aria-label={`Open ${shortcut.name}`}
          >
            <Card className="hover:shadow-md transition-shadow duration-200 ease-in-out bg-card border-border/80 group-hover:border-primary/50">
              <CardContent className="flex flex-col items-center justify-center p-4 aspect-[4/3]">
                <div className="p-3 mb-2 bg-muted/70 rounded-full group-hover:bg-accent/20 transition-colors duration-200 ease-in-out">
                  <shortcut.icon size={28} className="text-foreground/60 group-hover:text-accent-foreground transition-colors duration-200 ease-in-out" />
                </div>
                <p className="text-xs text-center text-foreground/90 truncate w-full group-hover:text-foreground transition-colors duration-200 ease-in-out">{shortcut.name}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ChromeNewTabPage;
