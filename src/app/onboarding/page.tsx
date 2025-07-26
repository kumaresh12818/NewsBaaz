
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Newspaper } from 'lucide-react';
import Link from 'next/link';

const allCategories: string[] = [
    'Top Stories',
    'Recent Stories',
    'India',
    'World',
    'Business',
    'Sports',
    'Cricket',
    'Science',
    'Technology',
    'Education',
    'Entertainment',
    'Astrology',
];

export default function OnboardingPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const router = useRouter();

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleFinish = () => {
    // In a real app, you would save these preferences to a database.
    console.log('Selected Categories:', selectedCategories);
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
                        Let's personalize your news feed. Select your favorite categories.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <Label className="text-lg font-semibold">Select your favorite categories</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {allCategories.map((category) => (
                                <div key={category} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={category}
                                        checked={selectedCategories.includes(category)}
                                        onCheckedChange={() => handleCategoryChange(category)}
                                    />
                                    <Label
                                        htmlFor={category}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {category}
                                    </Label>
                                </div>
                            ))}
                        </div>
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
