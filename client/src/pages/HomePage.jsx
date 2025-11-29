import React, { Suspense, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid, Paper, Box, Avatar, Card, CardContent } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import Tilt from 'react-parallax-tilt';
import Slider from 'react-slick';

// Slick carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#121212',
            paper: 'rgba(255, 255, 255, 0.05)',
        },
    },
    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
        },
        h3: {
            fontWeight: 700,
        },
    },
});

const GlassmorphicPaper = styled(Paper)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: theme.spacing(4),
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateY(-5px)',
    }
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '50px',
    padding: theme.spacing(1.5, 4),
    fontWeight: 'bold',
    boxShadow: `0 0 20px ${theme.palette.secondary.main}`,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: `0 0 30px ${theme.palette.secondary.main}`,
    }
}));


const Section = ({ children }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    React.useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            animate={controls}
            initial="hidden"
            variants={{
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                hidden: { opacity: 0, y: 50 },
            }}
        >
            {children}
        </motion.div>
    );
};

const HomePage = () => {
    const navigate = useNavigate();

    const particlesInit = async (engine) => {
        await loadSlim(engine);
    };

    const particleOptions = useMemo(() => ({
        background: {
            color: {
                value: '#121212',
            },
        },
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: 'repulse',
                },
                resize: true,
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: '#ffffff',
            },
            links: {
                color: '#ffffff',
                distance: 150,
                enable: true,
                opacity: 0.1,
                width: 1,
            },
            collisions: {
                enable: true,
            },
            move: {
                direction: 'none',
                enable: true,
                outModes: {
                    default: 'bounce',
                },
                random: false,
                speed: 1,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 80,
            },
            opacity: {
                value: 0.1,
            },
            shape: {
                type: 'circle',
            },
            size: {
                value: { min: 1, max: 5 },
            },
        },
        detectRetina: true,
    }), []);


    const FeatureCard = ({ icon, title, description }) => (
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
            <GlassmorphicPaper>
                <Avatar sx={{ bgcolor: 'secondary.main', mb: 2, width: 64, height: 64, margin: 'auto' }}>
                    {icon}
                </Avatar>
                <Typography variant="h5" gutterBottom align="center" fontWeight="bold">{title}</Typography>
                <Typography color="text.secondary" align="center">{description}</Typography>
            </GlassmorphicPaper>
        </Tilt>
    );

    const TimelineStep = ({ week, title, description, isCollaboration = false }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Box sx={{ mr: 3, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: isCollaboration ? 'secondary.main' : 'primary.main', color: 'white', width: 56, height: 56 }}>
                    {isCollaboration ? <GroupIcon /> : <CodeIcon />}
                </Avatar>
            </Box>
            <div>
                <Typography variant="overline" color="text.secondary">Week {week}</Typography>
                <Typography variant="h6" fontWeight="bold">{title}</Typography>
                <Typography color="text.secondary">{description}</Typography>
            </div>
        </Box>
    );
    
    const testimonials = [
        {
            name: "Alex Johnson",
            role: "Student",
            quote: "Shyoski's internship was a game-changer. I went from knowing basic concepts to building a full-stack application with a team. The mentorship was incredible.",
            avatar: "/avatars/alex.jpg"
        },
        {
            name: "Maria Garcia",
            role: "Student",
            quote: "I loved the collaborative projects. It felt like working in a real tech company. I learned so much about teamwork and communication.",
            avatar: "/avatars/maria.jpg"
        },
        {
            name: "David Chen",
            role: "Evaluator",
            quote: "As an evaluator, it's inspiring to see the students' growth. They come in with passion and leave with skills and confidence. Shyoski is building the next generation of developers.",
            avatar: "/avatars/david.jpg"
        }
    ];
    
    const testimonialSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
                <Particles id="tsparticles" init={particlesInit} options={particleOptions} />
                {/* Hero Section */}
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 1,
                        p: 3
                    }}
                >
                    <Container maxWidth="md">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <Typography component="h1" variant="h1" fontWeight="bold" gutterBottom>
                                Launch Your Tech Career with <span style={{ color: darkTheme.palette.primary.main }}>Shyoski</span>
                            </Typography>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                            <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4, mt: 2 }}>
                                Gain real-world experience, build in-demand skills, and collaborate on challenging projects with our intensive internship program.
                            </Typography>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
                            <StyledButton variant="contained" size="large" color="secondary" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/login')}>
                                Get Started
                            </StyledButton>
                        </motion.div>
                    </Container>
                </Box>
                
                <Container sx={{ py: 12 }} maxWidth="lg">
                    <Suspense fallback={<div>Loading...</div>}>
                        <Section>
                            <Typography variant="h2" align="center" gutterBottom sx={{ mb: 8 }}>
                                The 4-Week Internship Journey
                            </Typography>
                            <Grid container spacing={4} alignItems="stretch">
                                <Grid item xs={12} md={6}>
                                    <TimelineStep week="1" title="Foundational Project" description="Build a project with basic concepts to solidify your understanding." />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TimelineStep week="2" title="Intermediate Challenge" description="Tackle a more complex individual project to hone your skills." />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TimelineStep week="3" title="Collaborative Phase 1" description="Begin working in a team on a large-scale project, focusing on planning and architecture." isCollaboration />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TimelineStep week="4" title="Collaborative Phase 2" description="Complete and present your team project, simulating a real-world development cycle." isCollaboration />
                                </Grid>
                            </Grid>
                        </Section>
                    </Suspense>

                    <Suspense fallback={<div>Loading...</div>}>
                        <Section>
                            <Box sx={{ mt: 12 }}>
                                <Typography variant="h2" align="center" gutterBottom sx={{ mb: 8 }}>
                                    Why Shyoski?
                                </Typography>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={4}>
                                        <FeatureCard icon={<SchoolIcon fontSize="large"/>} title="Real-World Projects" description="Work on projects that mirror the challenges you'll face in the industry." />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FeatureCard icon={<GroupIcon fontSize="large"/>} title="Expert Mentorship" description="Receive guidance and feedback from our experienced evaluators throughout the program." />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FeatureCard icon={<WorkspacePremiumIcon fontSize="large"/>} title="Verified Certificate" description="Earn a valuable certificate upon successful completion to showcase your skills." />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Section>
                    </Suspense>

                    <Suspense fallback={<div>Loading...</div>}>
                        <Section>
                            <Box sx={{ mt: 12 }}>
                                <Typography variant="h2" align="center" gutterBottom sx={{ mb: 8 }}>
                                    What Our Interns Say
                                </Typography>
                                <Slider {...testimonialSettings}>
                                    {testimonials.map((testimonial, index) => (
                                        <Box key={index} sx={{ p: 2 }}>
                                            <Card sx={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
                                                <CardContent sx={{ p:4 }}>
                                                    <Avatar src={testimonial.avatar} alt={testimonial.name} sx={{ width: 80, height: 80, margin: 'auto', mb: 2 }} />
                                                    <Typography variant="h6" align="center">{testimonial.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>{testimonial.role}</Typography>
                                                    <Typography variant="body1" align="center">"{testimonial.quote}"</Typography>
                                                </CardContent>
                                            </Card>
                                        </Box>
                                    ))}
                                </Slider>
                            </Box>
                        </Section>
                    </Suspense>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default HomePage;
