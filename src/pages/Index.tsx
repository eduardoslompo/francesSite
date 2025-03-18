
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import Situations from '@/components/Situations';
import QuizSection from '@/components/QuizSection';
import Progress from '@/components/Progress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Situations />
      <QuizSection />
      <Progress />
      <Footer />
    </div>
  );
};

export default Index;
