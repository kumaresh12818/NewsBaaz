
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Newspaper, Globe } from 'lucide-react';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';

export default function OnboardingPage() {
  const [selectedLang, setSelectedLang] = useState('en');
  const router = useRouter();
  const { handleLanguageChange: setGlobalLanguage } = useLanguage();

  const handleFinish = () => {
    const preferences = {
        lang: selectedLang,
        categories: []
    };
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    setGlobalLanguage(selectedLang);
    router.push('/');
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-2xl">
            <div className="flex justify-center mb-6">
                <Link href="/" className="flex items-center gap-2 font-headline text-3xl tracking-wider text-primary">
                <Newspaper className="h-8 w-8" />
                <span>NewsBlend</span>
                </Link>
            </div>
            <Card className="glass">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline tracking-wide">Welcome to NewsBlend!</CardTitle>
                    <CardDescription>
                        Let's personalize your news feed. Select your language.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Select your language
                        </Label>
                        <RadioGroup
                            defaultValue="en"
                            onValueChange={setSelectedLang}
                            className="flex space-x-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="en" id="en" />
                                <Label htmlFor="en">English</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="bn" id="bn" />
                                <Label htmlFor="bn">Bengali</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleFinish} className="w-full md:w-auto" size="lg">
                        Finish Setup & Read News
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
