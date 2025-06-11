import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  Paper,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Assignment as AssignmentIcon,
  VideoLibrary as VideoLibraryIcon,
  Quiz as QuizIcon,
  Groups as GroupsIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  LocalLibrary as LocalLibraryIcon,
  Psychology as PsychologyIcon,
  EmojiEvents as EmojiEventsIcon,
  Support as SupportIcon
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
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
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

const ServiceCard = styled(Card)(({ theme }) => ({
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
    '& .service-icon': {
      animation: `${pulse} 1s ease-in-out infinite`,
    }
  }
}));

const ServiceIcon = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  margin: '0 auto 16px',
  fontSize: '2rem',
  boxShadow: '0 8px 25px rgba(123, 31, 162, 0.3)',
}));

const FeatureChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
  color: 'white',
  fontWeight: 'bold',
  margin: theme.spacing(0.5),
  '&:hover': {
    background: 'linear-gradient(45deg, #ff5252, #ffb74d)',
  }
}));

const Services = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const services = [
    {
      title: 'සිංහල භාෂා ඉගැන්වීම',
      description: 'ප්‍රාථමික සිට උසස් පෙළ දක්වා සම්පූර්ණ සිංහල භාෂා අධ්‍යාපනය',
      icon: <LocalLibraryIcon />,
      features: ['ව්‍යාකරණ', 'සාහිත්‍ය', 'රචනා ලේඛනය', 'කාව්‍ය විග්‍රහය'],
      color: '#667eea'
    },
    {
      title: 'අන්තර්ජාලීය පන්ති',
      description: 'නවීන තාක්ෂණය භාවිතා කරමින් ගුණාත්මක අන්තර්ජාලීය පන්ති',
      icon: <VideoLibraryIcon />,
      features: ['සජීව පන්ති', 'පටිගත පන්ති', 'අන්තර්ක්‍රියාකාරී ඉගැන්වීම', '24/7 ප්‍රවේශය'],
      color: '#764ba2'
    },
    {
      title: 'පුද්ගලික ගුරුකම්',
      description: 'එක් එක් සිසුන්ගේ අවශ්‍යතා අනුව විශේෂිත අවධානය',
      icon: <GroupsIcon />,
      features: ['පුද්ගලික අවධානය', 'ප්‍රගති නිරීක්ෂණය', 'අභිරුචි ඉගැන්වීම', 'නම්‍යශීලී කාලසටහන'],
      color: '#f093fb'
    },
    {
      title: 'පරීක්ෂණ සූදානම',
      description: 'O/L සහ A/L පරීක්ෂණ සඳහා විශේෂ සූදානම් වැඩසටහන්',
      icon: <QuizIcon />,
      features: ['ආදර්ශ ප්‍රශ්න පත්‍ර', 'කාල සීමිත පරීක්ෂණ', 'ප්‍රතිපෝෂණ', 'ප්‍රගති වාර්තා'],
      color: '#a8edea'
    },
    {
      title: 'සම්පත් පුස්තකාලය',
      description: 'පුළුල් අධ්‍යාපන සම්පත් සහ අධ්‍යයන ද්‍රව්‍ය එකතුව',
      icon: <MenuBookIcon />,
      features: ['ඩිජිටල් පොත්', 'වීඩියෝ පාඩම්', 'අභ්‍යාස ප්‍රශ්න', 'සටහන් සහ සාරාංශ'],
      color: '#ffecd2'
    },
    {
      title: 'ප්‍රගති නිරීක්ෂණය',
      description: 'සිසුන්ගේ ප්‍රගතිය නිරන්තරයෙන් නිරීක්ෂණය කිරීම',
      icon: <EmojiEventsIcon />,
      features: ['කාර්ය සාධන වාර්තා', 'දෙමාපිය සම්බන්ධතාව', 'ඉලක්ක සැකසීම', 'ප්‍රගති සටහන්'],
      color: '#ff9a9e'
    }
  ];

  const achievements = [
    { number: '500+', label: 'සාර්ථක සිසුන්' },
    { number: '10+', label: 'අවුරුදු අත්දැකීම' },
    { number: '95%', label: 'සාර්ථකත්ව අනුපාතය' },
    { number: '24/7', label: 'සහාය සේවාව' }
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
              අපගේ සේවාවන්
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
              සිංහල භාෂාව ඉගෙන ගැනීම සඳහා අවශ්‍ය සියලුම සේවාවන් එක තැනකින්
            </Typography>
            
            {/* Achievement Stats */}
            <Grid container spacing={3} sx={{ mt: 4, animation: `${fadeInUp} 1s ease-out 0.4s both` }}>
              {achievements.map((achievement, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffeaa7' }}>
                      {achievement.number}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {achievement.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </HeroSection>

      {/* Services Section */}
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
            විශේෂ සේවාවන්
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            ගුණාත්මක අධ්‍යාපනය සහ සම්පූර්ණ සහාය සේවාවන් ලබා දීම අපගේ මූලික අරමුණයි
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <ServiceCard sx={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <ServiceIcon className="service-icon" sx={{ bgcolor: service.color }}>
                    {service.icon}
                  </ServiceIcon>
                  
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#2d3436' }}>
                    {service.title}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {service.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                    {service.features.map((feature, featureIndex) => (
                      <FeatureChip
                        key={featureIndex}
                        label={feature}
                        size="small"
                        icon={<CheckCircleIcon sx={{ fontSize: '16px !important' }} />}
                      />
                    ))}
                  </Box>
                </CardContent>
              </ServiceCard>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Box
          sx={{
            mt: 8,
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
            අදම ආරම්භ කරන්න!
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            සිංහල භාෂාව ඉගෙන ගැනීමේ ගමන ආරම්භ කරන්න
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
        </Box>
      </Container>
    </Box>
  );
};

export default Services;
