import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  EmojiEvents as EmojiEventsIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  Favorite as FavoriteIcon,
  LocalLibrary as LocalLibraryIcon,
  Psychology as PsychologyIcon,
  Groups as GroupsIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(12, 0),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    animation: `${float} 6s ease-in-out infinite`,
  }
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(123, 31, 162, 0.1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(123, 31, 162, 0.2)',
    animation: `${pulse} 1s ease-in-out`,
  }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(123, 31, 162, 0.1)',
  animation: `${fadeInUp} 0.6s ease-out`,
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(123, 31, 162, 0.2)',
  }
}));

const GlowingDot = styled('div')(({ theme, color }) => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: color,
  boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
  margin: '0 auto 10px',
}));

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const stats = [
    { number: '10,000+', label: 'සාර්ථක සිසුන්', icon: <PeopleIcon />, color: '#667eea' },
    { number: '25+', label: 'අවුරුදු අත්දැකීම', icon: <TimelineIcon />, color: '#764ba2' },
    { number: '98%', label: 'සාර්ථකත්ව අනුපාතය', icon: <EmojiEventsIcon />, color: '#f093fb' },
    { number: '24/7', label: 'සහාය සේවාව', icon: <FavoriteIcon />, color: '#a8edea' }
  ];

  const features = [
    {
      title: 'අපගේ දැක්ම',
      description: '“අයන්න කියන්න” ශ්‍රී ලංකාවේ හොඳම සිංහල වෙබ් පිටුව බවට පත්වීම අපගේ දැක්මයි.',
      icon: <LocalLibraryIcon />,
      color: '#667eea'
    },
    {
      title: 'අපගේ මෙහෙවර',
      description: 'සිංහල විෂයෙහි සෑම අංශයකට ම අයත් දැනුම නිවැරදි ව ඇසිල්ලකින් ලබා දීම අපගේ මෙහෙවරයි.',
      icon: <PsychologyIcon />,
      color: '#764ba2'
    },
    {
      title: 'අපගේ වටිනාකම්',
      description: 'ගුණාත්මකභාවය, නවෝත්පාදනය, සංස්කෘතික සුරැකීම සහ සිසු කේන්ද්‍රීය ඉගැන්වීම.',
      icon: <StarIcon />,
      color: '#f093fb'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f8f9ff, #ffffff)' }}>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                mb: 3,
                background: 'linear-gradient(45deg, #ffffff, #e1bee7)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: `${fadeInUp} 1s ease-out`,
                textShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              අයන්න කියන්න ආයතනය
            </Typography>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: '800px',
                mx: 'auto',
                animation: `${fadeInUp} 1s ease-out 0.2s both`,
                lineHeight: 1.6
              }}
            >
              සිංහල භාෂාවේ අනාගතය ගොඩනගන්න අප සමඟ එක්වන්න
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 2, 
              flexWrap: 'wrap', 
              mt: 4,
              animation: `${fadeInUp} 1s ease-out 0.4s both`
            }}>
              <Chip
                label="ප්‍රමුඛතම ආයතනය"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  px: 2,
                  py: 1,
                  backdropFilter: 'blur(5px)'
                }}
              />
              <Chip
                label="නවීන ඉගැන්වීම"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  px: 2,
                  py: 1,
                  backdropFilter: 'blur(5px)'
                }}
              />
              <Chip
                label="සම්පූර්ණ සහාය"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  px: 2,
                  py: 1,
                  backdropFilter: 'blur(5px)'
                }}
              />
            </Box>
          </Box>
        </Container>
      </HeroSection>

      {/* Statistics Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                borderRadius: '2px'
              }
            }}
          >
            අපගේ ජයග්‍රහණ
          </Typography>
          <Typography 
            variant={isMobile ? 'body1' : 'h6'} 
            color="text.secondary" 
            sx={{ 
              maxWidth: '600px', 
              mx: 'auto',
              mt: 3
            }}
          >
            වසර ගණනාවක අත්දැකීම් සහ සාර්ථකත්වයන්
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center" sx={{ mb: 8 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex' }}>
              <StatsCard sx={{ 
                textAlign: 'center', 
                p: 4,
                width: '100%',
                minWidth: '300px',
              }}>
                <GlowingDot color={stat.color} />
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: stat.color,
                    mx: 'auto',
                    mb: 2,
                    fontSize: '2rem',
                    boxShadow: `0 5px 15px ${stat.color}80`
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography 
                  variant={isMobile ? 'h4' : 'h3'} 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: stat.color, 
                    mb: 1,
                    textShadow: `0 2px 5px ${stat.color}30`
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography 
                  variant={isMobile ? 'body2' : 'body1'} 
                  color="text.secondary" 
                  sx={{ 
                    fontWeight: 'medium',
                    fontSize: isMobile ? '1rem' : '1.1rem'
                  }}
                >
                  {stat.label}
                </Typography>
              </StatsCard>
            </Grid>
          ))}
        </Grid>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={index} 
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'stretch' // This makes sure all cards stretch to same height
              }}
            >
              <FeatureCard 
                sx={{
                  width: '100%',
                  maxWidth: '400px',
                  animationDelay: `${index * 0.1}s`,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardContent 
                  sx={{ 
                    p: 4,
                    flex: 1, // This makes the card content take up all available space
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <GlowingDot color={feature.color} />
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: feature.color,
                      mb: 3,
                      fontSize: '2rem',
                      boxShadow: `0 5px 15px ${feature.color}80`
                    }}
                  >
                    {feature.icon}
                  </Avatar>

                  <Typography 
                    variant={isMobile ? 'h6' : 'h5'} 
                    component="h3" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: '#2d3436',
                      mb: 2
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                      lineHeight: 1.6,
                      flexGrow: 1, // This makes the description take up remaining space
                      fontSize: isMobile ? '0.95rem' : '1rem'
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Box>

        {/* About Content */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
            borderRadius: '25px',
            border: '1px solid rgba(123, 31, 162, 0.1)',
            mb: 6,
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              clipPath: 'circle(40% at 80% 20%)',
              opacity: 0.1
            }
          }}
        >
          <Typography 
            variant={isMobile ? 'h5' : 'h4'} 
            component="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: '#2d3436', 
              mb: 3,
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: 0,
                width: '60px',
                height: '3px',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                borderRadius: '2px'
              }
            }}
          >
            අපගේ කතාව
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: 1.8, 
              mb: 3, 
              fontSize: isMobile ? '1rem' : '1.1rem',
              textAlign: 'justify'
            }}
          >
            "අයන්න කියන්න" ආයතනය ශ්‍රී ලංකාවේ සිංහල භාෂා අධ්‍යාපනයේ ප්‍රමුඛතම ආයතනයක් ලෙස
            වසර දහයකට වැඩි කාලයක් තිස්සේ සේවය කරමින් සිටී. අපගේ මූලික අරමුණ වන්නේ සිංහල භාෂාවේ
            සුන්දරත්වය සහ ගැඹුර සියලු සිසුන්ට ලබා දීමයි.
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: 1.8, 
              mb: 3, 
              fontSize: isMobile ? '1rem' : '1.1rem',
              textAlign: 'justify'
            }}
          >
            නවීන තාක්ෂණය සහ සම්ප්‍රදායික ඉගැන්වීම් ක්‍රම එකට ගෙන එමින්, අපි සිසුන්ට අද්විතීය
            අධ්‍යාපන අත්දැකීමක් ලබා දෙමු. අපගේ පළපුරුදු ගුරු මණ්ඩලය සහ නවීන පහසුකම් මගින්
            සිසුන්ගේ සාර්ථකත්වය සහතික කරමු.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {[
                "පළපුරුදු ගුරු මණ්ඩලය",
                "නවීන ඉගැන්වීම් ක්‍රම",
                "පුද්ගලික අවධානය"
              ].map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon sx={{ color: '#4caf50', mr: 2, minWidth: '24px' }} />
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {item}
                  </Typography>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} md={6}>
              {[
                "අන්තර්ජාලීය පන්ති",
                "24/7 සහාය සේවාව",
                "සම්පූර්ණ සම්පත් පුස්තකාලය"
              ].map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon sx={{ color: '#4caf50', mr: 2, minWidth: '24px' }} />
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {item}
                  </Typography>
                </Box>
              ))}
            </Grid>
          </Grid>
        </Paper>

        {/* Call to Action */}
        <Box
          sx={{
            p: { xs: 4, md: 6 },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '25px',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              transform: 'rotate(30deg)',
              animation: `${float} 10s linear infinite`
            }
          }}
        >
          <Typography 
            variant={isMobile ? 'h5' : 'h4'} 
            component="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              position: 'relative',
              zIndex: 1
            }}
          >
            අප සමඟ එක්වන්න!
          </Typography>
          <Typography 
            variant={isMobile ? 'body1' : 'h6'} 
            sx={{ 
              mb: 4, 
              opacity: 0.9,
              position: 'relative',
              zIndex: 1
            }}
          >
            සිංහල භාෂාවේ අනාගතය ගොඩනගන්න අප සමඟ එක්වන්න
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2, 
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 1
          }}>
            <Button
              variant="contained"
              size={isMobile ? 'medium' : 'large'}
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: '25px',
                fontSize: isMobile ? '0.9rem' : '1.1rem',
                '&:hover': {
                  bgcolor: '#f8f9ff',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                },
              }}
              href="/register"
            >
              ලියාපදිංචි වන්න
            </Button>
            <Button
              variant="outlined"
              size={isMobile ? 'medium' : 'large'}
              sx={{
                borderColor: 'white',
                color: 'white',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: '25px',
                fontSize: isMobile ? '0.9rem' : '1.1rem',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderColor: 'white',
                  transform: 'translateY(-2px)',
                },
              }}
              href="/contact-support"
            >
              අප හමුවන්න
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default About;