import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Security as SecurityIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  Storage as StorageIcon,
  Share as ShareIcon,
  Update as UpdateIcon,
  ContactMail as ContactMailIcon
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

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(6, 0),
  position: 'relative',
  overflow: 'hidden',
}));

const ContentSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
  borderRadius: '20px',
  border: '1px solid rgba(123, 31, 162, 0.1)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  animation: `${fadeInUp} 0.6s ease-out`,
}));

const PrivacyPolicy = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const sections = [
    {
      title: 'තොරතුරු එකතු කිරීම',
      icon: <StorageIcon />,
      content: [
        'ලියාපදිංචි වීමේදී ඔබ විසින් ලබා දෙන පුද්ගලික තොරතුරු',
        'ඔබගේ අධ්‍යාපන ප්‍රගතිය සහ කාර්ය සාධනය',
        'වෙබ් අඩවිය භාවිතා කිරීමේ දත්ත සහ ලොග් ගොනු',
        'කුකීස් සහ සමාන තාක්ෂණයන් හරහා ලබා ගන්නා තොරතුරු'
      ]
    },
    {
      title: 'තොරතුරු භාවිතය',
      icon: <VisibilityIcon />,
      content: [
        'අධ්‍යාපන සේවාවන් ලබා දීම සහ වැඩිදියුණු කිරීම',
        'ඔබගේ ගිණුම් කළමනාකරණය සහ සහාය සේවාව',
        'නව සේවාවන් සහ විශේෂාංග පිළිබඳ දැනුම් දීම',
        'නීතිමය අවශ්‍යතා සහ ආරක්ෂක අරමුණු'
      ]
    },
    {
      title: 'තොරතුරු ආරක්ෂාව',
      icon: <ShieldIcon />,
      content: [
        'SSL සහතික සහ දත්ත සංකේතනය',
        'ආරක්ෂිත සේවාදායක සහ දත්ත ගබඩා කිරීම',
        'නිතිපතා ආරක්ෂක පරීක්ෂණ සහ යාවත්කාලීන කිරීම',
        'සීමිත ප්‍රවේශය සහ අවසර පාලනය'
      ]
    },
    {
      title: 'තොරතුරු බෙදාගැනීම',
      icon: <ShareIcon />,
      content: [
        'ඔබගේ අවසරයකින් තොරව තෙවන පාර්ශවයන් සමඟ බෙදා නොගනිමු',
        'නීතිමය අවශ්‍යතා සඳහා පමණක් අවශ්‍ය විට බෙදාගනිමු',
        'විශ්වාසනීය සේවා සපයන්නන් සමඟ සීමිත බෙදාගැනීම',
        'සියලු බෙදාගැනීම් ගැන ඔබට දැනුම් දෙනු ලැබේ'
      ]
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f8f9ff, #ffffff)' }}>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Box textAlign="center">
            <SecurityIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              පෞද්ගලිකත්ව ප්‍රතිපත්තිය
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              ඔබගේ පෞද්ගලික තොරතුරු ආරක්ෂා කිරීම අපගේ ප්‍රමුඛතම වගකීමයි
            </Typography>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                label="ආරක්ෂිත" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white', 
                  fontWeight: 'bold' 
                }} 
              />
              <Chip 
                label="විනිවිද පෙනෙන" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white', 
                  fontWeight: 'bold' 
                }} 
              />
              <Chip 
                label="විශ්වාසනීය" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white', 
                  fontWeight: 'bold' 
                }} 
              />
            </Box>
          </Box>
        </Container>
      </HeroSection>

      {/* Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Introduction */}
        <ContentSection>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2d3436', mb: 3 }}>
            හැදින්වීම
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem', mb: 3 }}>
            "අයන්න කියන්න" ආයතනය ලෙස, ඔබගේ පෞද්ගලිකත්වය සහ පුද්ගලික තොරතුරු ආරක්ෂා කිරීම 
            අපගේ ප්‍රමුඛතම වගකීමයි. මෙම ප්‍රතිපත්තිය ඔබගේ තොරතුරු අප එකතු කරන ආකාරය, 
            භාවිතා කරන ආකාරය සහ ආරක්ෂා කරන ආකාරය පිළිබඳව විස්තර කරයි.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
            අපගේ සේවාවන් භාවිතා කිරීමෙන්, ඔබ මෙම ප්‍රතිපත්තියට එකඟ වන බව අපි අවබෝධ කර ගනිමු.
          </Typography>
        </ContentSection>

        {/* Main Sections */}
        {sections.map((section, index) => (
          <ContentSection key={index} sx={{ animationDelay: `${index * 0.1}s` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  bgcolor: '#667eea',
                  color: 'white',
                  borderRadius: '50%',
                  p: 1.5,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {section.icon}
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2d3436' }}>
                {section.title}
              </Typography>
            </Box>
            
            <List>
              {section.content.map((item, itemIndex) => (
                <ListItem key={itemIndex} sx={{ py: 0.5 }}>
                  <ListItemIcon>
                    <LockIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item}
                    primaryTypographyProps={{
                      fontSize: '1rem',
                      lineHeight: 1.6
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </ContentSection>
        ))}

        {/* Contact Information */}
        <ContentSection>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                bgcolor: '#764ba2',
                color: 'white',
                borderRadius: '50%',
                p: 1.5,
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ContactMailIcon />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2d3436' }}>
              අප හමුවන්න
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem', mb: 2 }}>
            මෙම ප්‍රතිපත්තිය පිළිබඳව ඔබට ප්‍රශ්න තිබේ නම් හෝ ඔබගේ පුද්ගලික තොරතුරු පිළිබඳව 
            විමසීම් තිබේ නම්, කරුණාකර අප සමඟ සම්බන්ධ වන්න:
          </Typography>
          
          <Box sx={{ bgcolor: '#f8f9ff', p: 3, borderRadius: 2, border: '1px solid rgba(123, 31, 162, 0.1)' }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
              📧 ඊමේල්: privacy@ayannakiyanna.lk
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
              📞 දුරකථන: +94 11 234 5678
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              📍 ලිපිනය: අයන්න කියන්න ආයතනය, කොළඹ, ශ්‍රී ලංකාව
            </Typography>
          </Box>
        </ContentSection>

        {/* Last Updated */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Chip 
            icon={<UpdateIcon />}
            label={`අවසන් වරට යාවත්කාලීන කළේ: ${new Date().toLocaleDateString('si-LK')}`}
            sx={{ 
              bgcolor: '#e3f2fd', 
              color: '#1976d2',
              fontWeight: 'medium',
              px: 2,
              py: 1
            }} 
          />
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
