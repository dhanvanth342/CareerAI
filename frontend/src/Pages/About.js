import React, { useEffect, useState } from 'react';
import '../components/Styles/About.css';
import NavBar from '../components/Navbar';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'framer-motion';
import page1 from '../assets/mainpage.png';
import page2 from '../assets/promptpage.png';
import page3 from '../assets/questionspage.png';
import page4 from '../assets/recommendationspage.png';
import page5 from '../assets/flowchart.png';


const StepContainer = ({ number, title, description, image, isEven }) => {
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
          {image && <img className="step-image" src={image} alt={title} />}
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

  const navigate = useNavigate();
  const goToMainPage = () => {
    navigate('/mainpage'); // Adjust the path to match your routing setup
  };
  
  
  const steps = [
    {
      number: 1,
      description:"Pick a way to craft your career!",
      image: page1,
    },
    {
      number: 2,
      description: "Don't hold back! Share your interests and key details for top career picks.",
      image: page2
    },
    {
      number: 3,
      description: "Your answers shape your career advice, be precise for the best results! ",
      image: page3
    },
    {
      number: 4,
      description: "Discover top career matches with AI, ranked by your fit score! Plus, we match you with a role in fields that need talent, driving your country's growth.",
      image: page4
    },
    {
      number: 5,
      description: "Explore your career roadmap, with specific steps to reach your goals, alongside a quick summary of the role, including its main responsibilities and skills needed.",
      image: page5
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
        <div className="navigation-top">
  <button className="navi-button" onClick={goToMainPage}>
   Skip to homepage →
  </button>
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
              description={step.description}
              image={step.image}
              isEven={step.number % 2 === 0}
            />
          ))}
        </div>
        <div className="back-to-top">
        <button className="navi-button" onClick={goToMainPage}>
   Continue to homepage  →
  </button>
</div>

      </div>
    </>
  );
};

export default About;