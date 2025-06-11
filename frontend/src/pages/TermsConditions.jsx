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
  useMediaQuery,
  Alert
} from '@mui/material';
import {
  Gavel as GavelIcon,
  AccountBalance as AccountBalanceIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  Block as BlockIcon,
  Warning as WarningIcon,
  Update as UpdateIcon,
  ContactMail as ContactMailIcon,
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

const TermsConditions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const sections = [
    {
      title: 'සේවා භාවිතය',
      icon: <AssignmentIcon />,
      content: [
        'අපගේ සේවාවන් නීතිමය අරමුණු සඳහා පමණක් භාවිතා කළ යුතුය',
        'ඔබගේ ගිණුම් තොරතුරු ආරක්ෂිතව තබා ගත යුතුය',
        'වෙනත් පුද්ගලයන්ගේ ගිණුම් භාවිතා කිරීම තහනම්',
        'අපගේ අන්තර්ගතය අනවසරයෙන් පිටපත් කිරීම තහනම්'
      ]
    },
    {
      title: 'ගෙවීම් සහ ප්‍රතිපූරණ',
      icon: <PaymentIcon />,
      content: [
        'සියලු ගෙවීම් කාලයට කළ යුතුය',
        'ප්‍රතිපූරණ ප්‍රතිපත්තිය අනුව ප්‍රතිපූරණ ලබා ගත හැක',
        'පන්ති අවලංගු කිරීම් 24 පැය කලින් දැනුම් දිය යුතුය',
        'ගෙවීම් ගැටළු සඳහා කාර්යාලය සම්බන්ධ කරන්න'
      ]
    },
    {
      title: 'පරිශීලක වගකීම්',
      icon: <AccountBalanceIcon />,
      content: [
        'පන්තිවලට නියමිත වේලාවට සහභාගී වීම',
        'අනෙකුත් සිසුන්ට සහ ගුරුවරුන්ට ගරු කිරීම',
        'පන්ති කාමරයේ නිශ්ශබ්දතාව පවත්වා ගැනීම',
        'අධ්‍යයන ද්‍රව්‍ය නිසි ලෙස භාවිතා කිරීම'
      ]
    },
    {
      title: 'තහනම් ක්‍රියාකාරකම්',
      icon: <BlockIcon />,
      content: [
        'අනෙකුත් සිසුන්ට හිරිහැර කිරීම හෝ බාධා කිරීම',
        'අනුචිත හෝ අසභ්‍ය භාෂාව භාවිතා කිරීම',
        'පන්ති කාමරයේ අනවසර ක්‍රියාකාරකම්',
        'අපගේ සේවාවන් වෙනත් අරමුණු සඳහා භාවිතා කිරීම'
      ]
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f8f9ff, #ffffff)' }}>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Box textAlign="center">
            <GavelIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              නියම සහ කොන්දේසි
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              අපගේ සේවාවන් භාවිතා කිරීම සඳහා අවශ්‍ය නියම සහ කොන්දේසි
            </Typography>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                label="නීතිමය" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white', 
                  fontWeight: 'bold' 
                }} 
              />
              <Chip 
                label="සාධාරණ" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white', 
                  fontWeight: 'bold' 
                }} 
              />
              <Chip 
                label="පැහැදිලි" 
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
            "අයන්න කියන්න" ආයතනයේ සේවාවන් භාවිතා කිරීමට පෙර, කරුණාකර මෙම නියම සහ කොන්දේසි 
            ප්‍රවේශමෙන් කියවන්න. අපගේ සේවාවන් භාවිතා කිරීමෙන්, ඔබ මෙම නියම සහ කොන්දේසිවලට 
            එකඟ වන බව අපි අවබෝධ කර ගනිමු.
          </Typography>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              මෙම නියම සහ කොන්දේසි කාලයෙන් කාලයට යාවත්කාලීන කළ හැක. 
              වෙනස්කම් පිළිබඳව ඔබට දැනුම් දෙනු ලැබේ.
            </Typography>
          </Alert>
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
                    <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
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

        {/* Important Notice */}
        <ContentSection>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                bgcolor: '#ff9800',
                color: 'white',
                borderRadius: '50%',
                p: 1.5,
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WarningIcon />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2d3436' }}>
              වැදගත් දැනුම්දීම
            </Typography>
          </Box>
          
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              මෙම නියම සහ කොන්දේසි උල්ලංඝනය කිරීම ඔබගේ ගිණුම අවලංගු කිරීමට හේතු විය හැක.
            </Typography>
          </Alert>
          
          <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem', mb: 2 }}>
            අපගේ සේවාවන් භාවිතා කිරීමේදී කිසියම් ගැටළුවක් ඇති වුවහොත්, කරුණාකර පළමුව අපගේ 
            සහාය කණ්ඩායම සම්බන්ධ කරන්න. අපි සියලු ගැටළු සාධාරණ ලෙස විසඳීමට උත්සාහ කරමු.
          </Typography>
        </ContentSection>

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
            මෙම නියම සහ කොන්දේසි පිළිබඳව ඔබට ප්‍රශ්න තිබේ නම්, කරුණාකර අප සමඟ සම්බන්ධ වන්න:
          </Typography>
          
          <Box sx={{ bgcolor: '#f8f9ff', p: 3, borderRadius: 2, border: '1px solid rgba(123, 31, 162, 0.1)' }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
              📧 ඊමේල්: legal@ayannakiyanna.lk
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

export default TermsConditions;
