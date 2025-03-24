import React from 'react';
import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import PricingSection from '../components/home/PricingSection';
import CtaSection from '../components/home/CtaSection';

export default function Home() {
  return (
    <>
      <Head>
        <title>InViewAI - Preparação para Entrevistas com IA</title>
        <meta
          name="description"
          content="Melhore seu desempenho em entrevistas com feedback em tempo real baseado em IA. Análise de linguagem corporal, tom de voz e conteúdo para ajudá-lo a se destacar em suas próximas entrevistas."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box as="main">
        <Header />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <CtaSection />
        <Footer />
      </Box>
    </>
  );
} 