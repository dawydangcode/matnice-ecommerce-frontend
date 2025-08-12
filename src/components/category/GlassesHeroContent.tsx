import React from 'react';
import HeroContent from '../HeroContent';
import GlassesHeroContentImg from '../../assets/categories-hero-content/boutique-slider-plp_brillen.jpg';

const GlassesHeroContent: React.FC = () => {

  return (
    <HeroContent
      title="Glasses"
      description="Large selection of trend eyewear - for every look and type"
      heroImage={GlassesHeroContentImg}
    />
  );
};

export default GlassesHeroContent;
