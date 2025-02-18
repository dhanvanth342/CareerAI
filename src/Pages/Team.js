import React from 'react';
import '../components/Styles/Team.css';

import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaEnvelope } from 'react-icons/fa';
import { Card, CardMedia, Typography, Box, Link } from '@mui/material';
import expert1 from '../assets/1.png';  
import expert2 from '../assets/2.png';  
import expert3 from '../assets/3.png';  
import expert4 from '../assets/4.png';  
import expert5 from '../assets/5.png'; 
import NavBar from '../components/Navbar'; 

const experts = [
    {
        id: 1,
        image: expert1,
        name: 'Sarah Johnson',
        role: 'AI Researcher',
        email: 'sarah@careerai.com',
        github: 'sahithi-reddy14',        
        linkedin: 'sahithi-reddy-etikala' 
    },
    {
        id: 2,
        image: expert2,
        name: 'Michael Chen',
        role: 'Software Engineer',
        email: 'michael@careerai.com',
        github: 'mchendev',
        linkedin: 'michael-chen-tech'
    },
    {
        id: 3,
        image: expert3,
        name: 'Aisha Williams',
        role: 'Data Scientist',
        email: 'aisha@careerai.com',
        github: 'aishawilliams',
        linkedin: 'aisha-williams'
    },
    {
        id: 4,
        image: expert4,
        name: 'David Miller',
        role: 'AI Developer',
        email: 'david@careerai.com',
        github: 'davidmiller-dev',
        linkedin: 'david-miller-ai'
    },
    {
        id: 5,
        image: expert5,
        name: 'James Wilson',
        role: 'UX Designer',
        email: 'james@careerai.com',
        github: 'jwilson-tech',
        linkedin: 'james-wilson-dev'
    }
];

const Team = () => {
    return (
        <div className="prompt-container">
            <NavBar/>
            <div className="teams-header">
                <h1>Meet our team..</h1>
                <p>Partner with our team of scientists, thinkers and industry experts to take your talent strategy to the next level. We have consulted with the world's top minds and created innovative solutions that transform talent.</p>
            </div>
            <div className="experts-grid">
                {experts.map(expert => (
                    <div key={expert.id} className="expert-card">
                        <Card sx={{ 
    width: 200, 
    height: 280, 
    borderRadius: 5, 
    overflow: 'hidden', 
    position: 'relative', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
    transition: 'transform 0.3s ease',
    backgroundColor: 'transparent'
}} className="card-inner">
    <Box sx={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        transformStyle: 'preserve-3d', 
        transition: 'transform 0.6s' 
    }} className="card-inner-box">
        <Box sx={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            backfaceVisibility: 'hidden' 
        }} className="card-front">
            <CardMedia
                component="img"
                height="80%"
                image={expert.image}
                alt={expert.name}
                sx={{ borderRadius: '5px 5px 0 0' }}
            />
            <Box sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white', 
                padding: '8px 8px 12px', // Increase bottom padding
                textAlign: 'center', 
                width: '100%', 
                height: '20%', 
                position: 'absolute', 
                bottom: 0, 
                borderRadius: '0 0 5px 5px' 
            }}>
                <Typography variant="h7" sx={{ marginBottom: '6px' }}>{expert.name}</Typography>
                <Typography variant="body2">{expert.role}</Typography>
            </Box>
        </Box>
        <Box sx={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)', 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Change background color to darker
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textAlign: 'center', 
            padding: '20px' 
        }} className="card-back">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Box sx={{ display: 'flex', gap: '15px', marginTop: '15px', justifyContent: 'center' }}>
                    <Link href={`https://github.com/${expert.github}`} target="_blank" rel="noopener noreferrer" sx={{ color: 'white', fontSize: '24px', transition: 'color 0.3s ease', '&:hover': { color: '#ffd700' } }}>
                        <FaGithub />
                    </Link>
                    <Link href={`mailto:${expert.email}?subject=Hello&body=I would like to connect with you`} sx={{ color: 'white', fontSize: '24px', transition: 'color 0.3s ease', '&:hover': { color: '#ffd700' } }}>
                        <FaEnvelope />
                    </Link>
                    <Link href={`https://linkedin.com/in/${expert.linkedin}`} target="_blank" rel="noopener noreferrer" sx={{ color: 'white', fontSize: '24px', transition: 'color 0.3s ease', '&:hover': { color: '#ffd700' } }}>
                        <FaLinkedin />
                    </Link>
                </Box>
            </Box>
        </Box>
    </Box>
</Card>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default Team;
