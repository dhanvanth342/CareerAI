import React, { useEffect, useState } from 'react';
import '../components/Styles/About.css';
import NavBar from '../components/Navbar';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';

const StepContainer = ({ number, title, description, isEven }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { 
    margin: "-100px",
    amount: 0.3
  });

  const slideVariants = {
    hidden: {
      x: isEven ? -100 : 100,
      opacity: 0
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="step-wrapper">
      <motion.div 
        ref={ref}
        className={`step-container ${number % 2 === 0 ? 'even' : 'odd'}`}
        animate={isInView ? "visible" : "hidden"}
        variants={slideVariants}
        initial="hidden"
      >
        <div className="step-number">{number}</div>
        <div className="step-content">
          <h3>{title}</h3>
          <p>{description}</p>
          <img src="/path-to-your-screenshot.png" alt={title} />
        </div>
      </motion.div>
    </div>
  );
};

const About = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const steps = [
    {
      number: 1,
      title: "AI-Powered Career Guidance",
      description: "Our advanced AI system analyzes your skills, interests, and goals to provide personalized career recommendations that align with your aspirations."
    },
    {
      number: 2,
      title: "Custom Career Roadmaps",
      description: "Get detailed, step-by-step roadmaps tailored to your chosen career path, complete with specific milestones and skills to develop along the way."
    },
    {
      number: 3,
      title: "Real-Time Market Insights",
      description: "Access up-to-date information about salary ranges, job requirements, and industry trends to make informed decisions about your career path."
    },
    {
      number: 4,
      title: "Professional Development",
      description: "Receive personalized guidance on certifications, courses, and skills needed to advance in your chosen career path and stay competitive."
    },
    {
      number: 5,
      title: "Career Success Tracking",
      description: "Monitor your progress, track achievements, and adjust your career path as you grow professionally with our comprehensive tracking system."
    }
  ];

  return (
    <>
      <NavBar />
      <div className="about-container">
        <div className="about-title">
          <h1>How It Works</h1>
          <p>Discover your ideal career path with our AI-powered guidance system that adapts to your unique goals and aspirations.</p>
        </div>
        <div className="about-steps">
          <div className="thread-container">
            <div className="thread-background" />
            <motion.div 
              className="thread-progress"
              style={{
                scaleY,
                height: '100%'
              }}
            />
          </div>
          {steps.map((step) => (
            <StepContainer
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              isEven={step.number % 2 === 0}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default About;