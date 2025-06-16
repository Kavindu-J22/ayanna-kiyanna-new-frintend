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
  Copyright as CopyrightIcon,
  Shield as ShieldIcon,
  Book as BookIcon,
  Image as ImageIcon,
  VideoLibrary as VideoLibraryIcon,
  Warning as WarningIcon,
  Update as UpdateIcon,
  ContactMail as ContactMailIcon,
  CheckCircle as CheckCircleIcon,
  Gavel as GavelIcon
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

const CopyrightPolicy = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const sections = [
    {
      title: 'අපගේ අන්තර්ගතය',
      icon: <BookIcon />,
      content: [
        'සියලු පාඩම් සහ අධ්‍යාපන ද්‍රව්‍ය අපගේ ප්‍රකාශන හිමිකම් යටතේ ආරක්ෂිතයි',
        'වීඩියෝ පාඩම්, ශ්‍රව්‍ය ගොනු සහ ලිඛිත ද්‍රව්‍ය පිටපත් කිරීම තහනම්',
        'අපගේ අවසරයකින් තොරව වාණිජ භාවිතය සම්පූර්ණයෙන්ම තහනම්',
        'පුද්ගලික අධ්‍යයනය සඳහා පමණක් භාවිතා කළ හැක'
      ]
    },
    {
      title: 'රූප සහ වීඩියෝ',
      icon: <ImageIcon />,
      content: [
        'අපගේ වෙබ් අඩවියේ සියලු රූප සහ වීඩියෝ ආරක්ෂිතයි',
        'සමාජ මාධ්‍ය වල බෙදාගැනීම අපගේ අවසරයෙන් පමණක්',
        'වෙනත් වෙබ් අඩවි වල භාවිතය සඳහා අවසර ගත යුතුය',
        'වාණිජ අරමුණු සඳහා භාවිතය තහනම්'
      ]
    },
    {
      title: 'තෙවන පාර්ශව අන්තර්ගතය',
      icon: <ShieldIcon />,
      content: [
        'අපි භාවිතා කරන තෙවන පාර්ශව අන්තර්ගතය සඳහා නිසි ගෞරවය දක්වනු ලැබේ',
        'සියලු බාහිර සම්පත් සඳහා අවසර ලබා ගෙන ඇත',
        'ප්‍රකාශන හිමිකම් උල්ලංඝනයක් සිදු වුවහොත් අපට දැනුම් දෙන්න',
        'අපි වහාම සිදුකරන ක්‍රියාමාර්ග ගනිමු'
      ]
    },
    {
      title: 'උල්ලංඝන වාර්තා කිරීම',
      icon: <WarningIcon />,
      content: [
        'ප්‍රකාශන හිමිකම් උල්ලංඝනයක් දුටුවහොත් වහාම අපට දැනුම් දෙන්න',
        'අපි 24 පැය ඇතුළත ප්‍රතිචාර දක්වනු ලැබේ',
        'සාධාරණ භාවිතය සහ අධ්‍යාපන අරමුණු සලකා බලනු ලැබේ',
        'අවශ්‍ය නම් නීතිමය ක්‍රියාමාර්ග ගනු ලැබේ'
      ]
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f8f9ff, #ffffff)' }}>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Box textAlign="center">
            <CopyrightIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              ප්‍රකාශන හිමිකම් ප්‍රතිපත්තිය
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              අපගේ අන්තර්ගතය සහ බුද්ධිමය දේපල ආරක්ෂා කිරීම
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
            "අයන්න කියන්න" ආයතනය විසින් නිර්මාණය කරන ලද සියලු අන්තර්ගතය, ඇතුළුව පාඩම්, 
            වීඩියෝ, රූප, ශ්‍රව්‍ය ගොනු සහ ලිඛිත ද්‍රව්‍ය, ප්‍රකාශන හිමිකම් නීතිය යටතේ ආරක්ෂිතයි.
          </Typography>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} අයන්න කියන්න ආයතනය. සියලු හිමිකම් ආරක්ෂිතයි.
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

        {/* Fair Use Policy */}
        <ContentSection>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                bgcolor: '#4caf50',
                color: 'white',
                borderRadius: '50%',
                p: 1.5,
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GavelIcon />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2d3436' }}>
              සාධාරණ භාවිත ප්‍රතිපත්තිය
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem', mb: 2 }}>
            අධ්‍යාපන අරමුණු සඳහා සීමිත භාවිතයක් සාධාරණ භාවිතය ලෙස සලකනු ලැබේ:
          </Typography>
          
          <Box sx={{ bgcolor: '#e8f5e8', p: 3, borderRadius: 2, border: '1px solid #4caf50' }}>
            <List>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="පුද්ගලික අධ්‍යයනය සඳහා කෙටි උපුටා ගැනීම්" />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="අධ්‍යාපන ආයතනවල විචාරණ අරමුණු" />
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary="පර්යේෂණ සහ විද්‍යාත්මක අධ්‍යයන" />
              </ListItem>
            </List>
          </Box>
        </ContentSection>

        {/* DMCA Notice */}
        <ContentSection>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              DMCA දැනුම්දීම
            </Typography>
            <Typography variant="body2">
              ඔබගේ ප්‍රකාශන හිමිකම් උල්ලංඝනය වී ඇතැයි ඔබ විශ්වාස කරන්නේ නම්, 
              කරුණාකර අපගේ DMCA නියෝජිතයා සම්බන්ධ කරන්න.
            </Typography>
          </Alert>
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
            ප්‍රකාශන හිමිකම් පිළිබඳව ඔබට ප්‍රශ්න තිබේ නම්, කරුණාකර අප සමඟ සම්බන්ධ වන්න:
          </Typography>
          
          <Box sx={{ bgcolor: '#f8f9ff', p: 3, borderRadius: 2, border: '1px solid rgba(123, 31, 162, 0.1)' }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
              📧 ඊමේල්: ayannakiyanna@gmail.com
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
              📧 DMCA: ayannakiyannanotify@gmail.com
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
              📞 දුරකථන: +94 777 047 391
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              📍 ලිපිනය: 98/8, මල්වත්ත, යටන්වල, රුවන්වැල්ල
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

export default CopyrightPolicy;
