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

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(8, 0),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    animation: `${float} 6s ease-in-out infinite`,
  }
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(123, 31, 162, 0.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(123, 31, 162, 0.2)',
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

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const stats = [
    { number: '500+', label: 'සාර්ථක සිසුන්', icon: <PeopleIcon />, color: '#667eea' },
    { number: '10+', label: 'අවුරුදු අත්දැකීම', icon: <TimelineIcon />, color: '#764ba2' },
    { number: '95%', label: 'සාර්ථකත්ව අනුපාතය', icon: <EmojiEventsIcon />, color: '#f093fb' },
    { number: '24/7', label: 'සහාය සේවාව', icon: <FavoriteIcon />, color: '#a8edea' }
  ];

  const features = [
    {
      title: 'අපගේ දැක්ම',
      description: 'ශ්‍රී ලංකාවේ සිංහල භාෂා අධ්‍යාපනයේ ප්‍රමුඛතම ආයතනය වීම සහ ලොව පුරා සිංහල භාෂාව ප්‍රචලිත කිරීම.',
      icon: <LocalLibraryIcon />,
      color: '#667eea'
    },
    {
      title: 'අපගේ මෙහෙවර',
      description: 'ගුණාත්මක සිංහල භාෂා අධ්‍යාපනය ලබා දීම සහ ශ්‍රී ලංකීය සංස්කෘතික උරුමයන් සුරැකීම.',
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
              }}
            >
              අයන්න කියන්න ආයතනය
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: '800px',
                mx: 'auto',
                animation: `${fadeInUp} 1s ease-out 0.2s both`,
              }}
            >
              සිංහල භාෂාවේ අනාගතය ගොඩනගන්න අප සමඟ එක්වන්න
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: 4 }}>
              <Chip
                label="ප්‍රමුඛතම ආයතනය"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  px: 2,
                  py: 1
                }}
              />
              <Chip
                label="නවීන ඉගැන්වීම"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  px: 2,
                  py: 1
                }}
              />
              <Chip
                label="සම්පූර්ණ සහාය"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  px: 2,
                  py: 1
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
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            අපගේ ජයග්‍රහණ
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            වසර ගණනාවක අත්දැකීම් සහ සාර්ථකත්වයන්
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <StatsCard sx={{ textAlign: 'center', p: 4 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: stat.color,
                    mx: 'auto',
                    mb: 2,
                    fontSize: '2rem',
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>
                  {stat.number}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  {stat.label}
                </Typography>
              </StatsCard>
            </Grid>
          ))}
        </Grid>

        {/* Features Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FeatureCard sx={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: feature.color,
                      mx: 'auto',
                      mb: 3,
                      fontSize: '2rem',
                    }}
                  >
                    {feature.icon}
                  </Avatar>

                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#2d3436' }}>
                    {feature.title}
                  </Typography>

                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>

        {/* About Content */}
        <Paper
          elevation={0}
          sx={{
            p: 6,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
            borderRadius: '25px',
            border: '1px solid rgba(123, 31, 162, 0.1)',
            mb: 6,
          }}
        >
          <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#2d3436', mb: 3 }}>
            අපගේ කතාව
          </Typography>

          <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3, fontSize: '1.1rem' }}>
            "අයන්න කියන්න" ආයතනය ශ්‍රී ලංකාවේ සිංහල භාෂා අධ්‍යාපනයේ ප්‍රමුඛතම ආයතනයක් ලෙස
            වසර දහයකට වැඩි කාලයක් තිස්සේ සේවය කරමින් සිටී. අපගේ මූලික අරමුණ වන්නේ සිංහල භාෂාවේ
            සුන්දරත්වය සහ ගැඹුර සියලු සිසුන්ට ලබා දීමයි.
          </Typography>

          <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3, fontSize: '1.1rem' }}>
            නවීන තාක්ෂණය සහ සම්ප්‍රදායික ඉගැන්වීම් ක්‍රම එකට ගෙන එමින්, අපි සිසුන්ට අද්විතීය
            අධ්‍යාපන අත්දැකීමක් ලබා දෙමු. අපගේ පළපුරුදු ගුරු මණ්ඩලය සහ නවීන පහසුකම් මගින්
            සිසුන්ගේ සාර්ථකත්වය සහතික කරමු.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#4caf50', mr: 2 }} />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  පළපුරුදු ගුරු මණ්ඩලය
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#4caf50', mr: 2 }} />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  නවීන ඉගැන්වීම් ක්‍රම
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#4caf50', mr: 2 }} />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  පුද්ගලික අවධානය
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#4caf50', mr: 2 }} />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  අන්තර්ජාලීය පන්ති
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#4caf50', mr: 2 }} />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  24/7 සහාය සේවාව
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ color: '#4caf50', mr: 2 }} />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  සම්පූර්ණ සම්පත් පුස්තකාලය
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Call to Action */}
        <Box
          sx={{
            p: 6,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '25px',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            අප සමඟ එක්වන්න!
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            සිංහල භාෂාවේ අනාගතය ගොඩනගන්න අප සමඟ එක්වන්න
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: '25px',
              fontSize: '1.1rem',
              mr: 2,
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
            size="large"
            sx={{
              borderColor: 'white',
              color: 'white',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: '25px',
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
                borderColor: 'white',
                transform: 'translateY(-2px)',
              },
            }}
            href="/contact"
          >
            අප හමුවන්න
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default About;