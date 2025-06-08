import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { styled, useTheme, keyframes } from '@mui/material/styles';
import {
  Box,
  CssBaseline,
  Divider,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useMediaQuery,
  Typography,
  Avatar,
  Button,
  Container,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Book as BookIcon,
  Quiz as QuizIcon,
  Star as StarIcon,
  MoreHoriz as MoreHorizIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  ShoppingCart as ShoppingCartIcon,
  Announcement as AnnouncementIcon,
  ContactSupport as ContactSupportIcon,
  VideoLibrary as VideoLibraryIcon,
  Description as DescriptionIcon,
  Collections as CollectionsIcon,
  MenuBook as MenuBookIcon,
  RateReview as RateReviewIcon,
  LibraryBooks as LibraryBooksIcon,
  AutoStories as AutoStoriesIcon,
  Assignment as AssignmentIcon,
  Timer as TimerIcon,
  Article as ArticleIcon,
  RateReviewOutlined as RateReviewOutlinedIcon,
  ImportContacts as ImportContactsIcon,
  PlayLesson as PlayLessonIcon,
  NoteAlt as NoteAltIcon,
  PhotoLibrary as PhotoLibraryIcon,
  Groups as GroupsIcon,
  EmojiEvents as EmojiEventsIcon,
  CastForEducation as CastForEducationIcon,
  Science as ScienceIcon,
  Translate as TranslateIcon,
  LocalLibrary as LocalLibraryIcon,
  AccountTree as AccountTreeIcon,
  ContactMail as ContactMailIcon,
  NotificationsActive as NotificationsActiveIcon,
  Brightness4 as Brightness4Icon,
  ExitToApp as ExitToAppIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon
} from '@mui/icons-material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { FaTiktok } from "react-icons/fa";

// Components
import Header from './components/Header';
import LoadingScreen from './components/LoadingScreen';
import TestPage from './pages/TestPage';
import Home from './pages/Home';
import About from './pages/About';
import AkContact from './pages/Contact';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ClassManagement from './pages/ClassManagement';
import StudentRegistration from './pages/StudentRegistration';
import StudentManagement from './pages/StudentManagement';
import NotificationsPage from './pages/NotificationsPage';
import ClassRequestManagement from './pages/ClassRequestManagement';
import SpecificClass from './pages/SpecificClass';
import AttendanceManagement from './pages/AttendanceManagement';
import AttendanceView from './pages/AttendanceView';
import AttendanceEdit from './pages/AttendanceEdit';
import AttendanceAnalytics from './pages/AttendanceAnalytics';
import StudentClassPayments from './pages/StudentClassPayments';
import ClassFeePayment from './pages/ClassFeePayment';
import AdminClassPayments from './pages/AdminClassPayments';
import AllClassPaymentRequests from './pages/AllClassPaymentRequests';
import MyPaymentRequests from './pages/MyPaymentRequests';
import AksharaMalawa from './components/Aksharamalawa/NewSinhalaHodiya';
import PaperBankPage from './pages/PaperBankPage';
import PaperStructuresPage from './pages/PaperStructuresPage';
import AdminAssignmentManagement from './pages/AdminAssignmentManagement';
import CreateAssignment from './pages/CreateAssignment';
import EditAssignment from './pages/EditAssignment';
import StudentAssignments from './pages/StudentAssignments';
import AssignmentSubmission from './pages/AssignmentSubmission';
import AssignmentSubmissions from './pages/AssignmentSubmissions';
import AssignmentDetails from './pages/AssignmentDetails';
import ViewSubmission from './pages/ViewSubmission';
import AdminExamManagement from './pages/AdminExamManagement';
import ExamMarksManagement from './pages/ExamMarksManagement';
import StudentExamView from './pages/StudentExamView';
import AdminResourceManagement from './pages/AdminResourceManagement';
import StudentResourceView from './pages/StudentResourceView';
import AdminAnnouncementManagement from './pages/AdminAnnouncementManagement';
import StudentAnnouncementView from './pages/StudentAnnouncementView';
import AnnouncementDetails from './pages/AnnouncementDetails';
import ResourceDetails from './pages/ResourceDetails';
import AdminTimeScheduleManagement from './pages/AdminTimeScheduleManagement';
import StudentTimeScheduleView from './pages/StudentTimeScheduleView';
import AdminOnlineSessions from './pages/AdminOnlineSessions';
import StudentOnlineSessions from './pages/StudentOnlineSessions';
import GrammarPage from './pages/GrammarPage';
import FolderView from './pages/FolderView';
import LiteraturePage from './pages/LiteraturePage';
import LiteratureFolderView from './pages/LiteratureFolderView';
import GradePage from './pages/GradePage';
import GradeFolderView from './pages/GradeFolderView';
import SubjectGuidelinesPage from './pages/SubjectGuidelinesPage';
import SubjectGuidelinesFolderView from './pages/SubjectGuidelinesFolderView';
import TeacherHandbookPage from './pages/TeacherHandbookPage';
import TeacherHandbookFolderView from './pages/TeacherHandbookFolderView';
import VideoLessonsPage from './pages/VideoLessonsPage';
import VideoLessonsFolderView from './pages/VideoLessonsFolderView';
import OthersPage from './pages/OthersPage';
import OthersFolderView from './pages/OthersFolderView';
import AcademicInfoPage from './pages/AcademicInfoPage';
import AcademicInfoFolderView from './pages/AcademicInfoFolderView';
import ClassesInfoPage from './pages/ClassesInfoPage';
import ExtracurricularPage from './pages/ExtracurricularPage';
import ExtracurricularFolderView from './pages/ExtracurricularFolderView';
import SwaraPage from './pages/SwaraPage';
import SwaraFolderView from './pages/SwaraFolderView';
import ViyanjanaPage from './pages/ViyanjanaPage';
import ViyanjanaFolderView from './pages/ViyanjanaFolderView';
import AkaradiyaPage from './pages/AkaradiyaPage';
import AkaradiyaFolderView from './pages/AkaradiyaFolderView';
import AksharavinyasayaPage from './pages/AksharavinyasayaPage';
import AksharavinyasayaFolderView from './pages/AksharavinyasayaFolderView';
import ReviewsPage from './pages/ReviewsPage';
import ReviewsFolderView from './pages/ReviewsFolderView';
import ReviewsFileDetail from './pages/ReviewsFileDetail';
import AppreciationPage from './pages/AppreciationPage';
import AppreciationFolderView from './pages/AppreciationFolderView';
import AppreciationFileDetail from './pages/AppreciationFileDetail';
import OtherEntPage from './pages/OtherEntPage';
import OtherEntFolderView from './pages/OtherEntFolderView';
import OtherEntFileDetail from './pages/OtherEntFileDetail';

// New page imports
import PhotoBucketPage from './pages/PhotoBucketPage';
import SpecialNoticePage from './pages/SpecialNoticePage';
import ContactSupportPage from './pages/ContactSupportPage';
import AdminSpecialNoticeManagement from './pages/AdminSpecialNoticeManagement';
import AdminFeedbackManagement from './pages/AdminFeedbackManagement';

// E-commerce page imports
import BooksProductsPage from './pages/BooksProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import OrdersPage from './pages/OrdersPage';
import AdminProductManagement from './pages/AdminProductManagement';
import AdminOrderManagement from './pages/AdminOrderManagement';
import AdminDeliveryChargeManagement from './pages/AdminDeliveryChargeManagement';

const mobileDrawerWidth = 280;
const desktopDrawerWidth = 320; // Increased width for desktop

// Animation for mobile menu button
const pulseGlow = keyframes`
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 rgba(123, 31, 162, 0.5);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 10px rgba(123, 31, 162, 0.8);
  }
`;

// Sidebar items with icons organized into categories
const navItems = [
  { name: "Dashboard", path: "/", icon: <DashboardIcon /> },

  // විෂය සමගාමි Category
  {
    name: "ව්‍යාකරණ හා සාහිත්‍ය",
    icon: <AutoStoriesIcon />,
    subcategories: [
      { name: "ව්‍යාකරණ", path: "/grammar", icon: <TranslateIcon /> },
      { name: "සාහිත්‍ය", path: "/literature", icon: <LocalLibraryIcon /> },
    ],
  },

  {
    name: "අක්ෂර මාලාව",
    icon: <AutoStoriesIcon />,
    subcategories: [
      {
        name: "සුහුරු අක්ෂර මාලාව",
        path: "/aksharamalawa",
        icon: <AccountTreeIcon />,
        external: true // Add this flag to indicate it's an external link
      },
      { name: "ස්වර", path: "/swara", icon: <TranslateIcon /> },
      { name: "ව්‍යංජන", path: "/viyanjana", icon: <LocalLibraryIcon /> },
      { name: "අකාරාදී පිළිවෙල", path: "/akaradiya", icon: <TranslateIcon /> },
      { name: "අක්ෂර වින්‍යාසය", path: "/aksharavinyasaya", icon: <LocalLibraryIcon /> },
    ],
  },



    {
      name: "ශ්‍රේණිය අනුව අධ්‍යයනය කරන්න",
      icon: <ClassIcon />,
      subcategories: [
        { name: "9 ශ්‍රේණිය", path: "/grade/grade-9", icon: <GroupsIcon /> },
        { name: "10 ශ්‍රේණිය", path: "/grade/grade-10", icon: <GroupsIcon /> },
        { name: "11 ශ්‍රේණිය", path: "/grade/grade-11", icon: <GroupsIcon /> },
        { name: "A/L", path: "/grade/a-level", icon: <ScienceIcon /> },
        { name: "සිංහල සාහිත්‍යය (කාණ්ඩ විෂය)", path: "/grade/sinhala-literature", icon: <LibraryBooksIcon /> },
      ],
    },

    {
      name: "Papers & Paper Structures",
      icon: <ArticleIcon />,
      subcategories: [
        { name: "Paper Bank", path: "/paperbank", icon: <ImportContactsIcon /> },
        { name: "Paper Structures සහ අනුමාන", path: "/paper-structures", icon: <NoteAltIcon /> },
      ],
    },

      // විචාර හා රසවින්දන Category
  {
    name: "විචාර හා රසවින්දන",
    icon: <MenuBookIcon />,
    subcategories: [
      { name: "විචාර", path: "/reviews", icon: <MenuBookIcon /> },
      { name: "රසවින්දන", path: "/appreciation", icon: <MenuBookIcon /> },
      { name: "වෙනත් අමතර", path: "/otherEnt", icon: <MenuBookIcon /> },
    ],
  },


  // වැදගත් විශේෂාංග Category
  {
    name: "විෂය අධ්‍යනය",
    icon: <MenuBookIcon />,
    subcategories: [
      { name: "විෂය නිර්දේශ", path: "/subject-guidelines", icon: <MenuBookIcon /> },
      { name: "ගුරු අත් පොත්", path: "/teacher-handbook", icon: <MenuBookIcon /> },
    ],
  },

  // වෙනත් විශේෂාංග Category
  {
    name: "වෙනත් විශේෂාංග",
    icon: <MoreHorizIcon />,
    subcategories: [
      { name: "වීඩියෝ පාඩම්", path: "/video-lessons", icon: <PlayLessonIcon /> },
      { name: "Other", path: "/others", icon: <MoreHorizIcon /> },
    ],
  },

  // Institute Related information Category
  {
    name: "Institute Related information",
    icon: <SchoolIcon />,
    subcategories: [
      { name: "Academic Information", path: "/academic-info", icon: <CastForEducationIcon /> },
      { name: "Classes & Time Tables", path: "/classes-info", icon: <CastForEducationIcon /> },
      { name: "Extracurricular Information", path: "/extracurricular", icon: <EmojiEventsIcon /> },
      { name: "Photo Bucket", path: "/photo-bucket", icon: <PhotoLibraryIcon /> },
    ],
  },

  // Other direct links
  { name: "අයන්න කියන්න E-Magazine", path: "https://drive.google.com/file/d/13wMOoZSV4b9_lxX0QfOC7ma3AgevBnFL/view?usp=sharing", icon: <ImportContactsIcon /> },
  { name: "අයන්න කියන්න : Books & Products", path: "/books-products", icon: <ShoppingCartIcon /> },
  { name: "අයන්න කියන්න : Specal Notices", path: "/special-notice", icon: <NotificationsActiveIcon /> },
  { name: "අයන්න කියන්න : 2025 Calender", path: "https://ayannakiyanna-calender.vercel.app/", icon: <ContactMailIcon /> },
  { name: "අයන්න කියන්න : Contact Suport", path: "/contact-support", icon: <ContactMailIcon /> },
];

const Main = styled('main')(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(0),
    width: '100%',
    minHeight: '100vh', // Full viewport height
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 0,
    overflow: 'visible', // Allow content to scroll naturally
  }),
);

// ScrollToTop Component to handle scrolling to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}

// We're not using this component anymore, but keeping it for reference
const CustomDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: mobileDrawerWidth,
    background: 'linear-gradient(180deg, #1A032B 0%, #3A0D5D 100%)',
    borderRight: 'none',
    boxShadow: '5px 0 15px rgba(123, 31, 162, 0.1)',
    height: 'calc(100vh - 64px)', // Subtract header height
    marginTop: theme.spacing(9),
    display: 'flex',
    flexDirection: 'column',
    // Hide scrollbar but keep functionality
    scrollbarWidth: 'none', // For Firefox
    '&::-webkit-scrollbar': { // For Chrome, Safari, Opera
      display: 'none',
    },
    [theme.breakpoints.down('md')]: {
      width: '75%',
      position: 'fixed',
      zIndex: 100,
      height: '100vh',
      top: 0,
    },
  },
}));

const SidebarHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  background: 'linear-gradient(90deg, #4A148C 0%, #7B1FA2 100%)',
  color: 'white',
  minHeight: '64px',
  justifyContent: 'space-between',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
}));

const SidebarFooter = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: 'auto',
  background: 'rgba(26, 3, 43, 0.7)',
  borderTop: '1px solid rgba(123, 31, 162, 0.3)',
  color: '#E1BEE7',
  textAlign: 'center',
  '& .MuiButton-root': {
    margin: theme.spacing(1, 0),
    background: 'linear-gradient(90deg, #7B1FA2 0%, #9C27B0 100%)',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '20px',
    padding: '8px 16px',
    '&:hover': {
      background: 'linear-gradient(90deg, #9C27B0 0%, #AB47BC 100%)',
    }
  }
}));

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true); // Default to open for desktop
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [showTip, setShowTip] = useState(true);
  const sidebarRef = useRef(null);

  // Auto-expand category if current path is in its subcategories
  useEffect(() => {
    navItems.forEach(item => {
      if (item.subcategories) {
        const isActiveCategory = item.subcategories.some(
          subItem => subItem.path === location.pathname
        );
        if (isActiveCategory) {
          setExpandedCategory(item.name);
        }
      }
    });
  }, [location.pathname]);

  // Auto-hide welcome tip after 5 seconds
  useEffect(() => {
    if (showTip) {
      const timer = setTimeout(() => {
        setShowTip(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showTip]);

  const handleMobileDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopDrawerToggle = () => {
    setDesktopOpen(!desktopOpen);
  };

  const handleToggleExpand = (categoryName) => {
    setExpandedCategory(prev => prev === categoryName ? null : categoryName);
  };

  // Define routes where sidebar should not be visible
  const noSidebarRoutes = ["/login", "/register"];
  const isNoSidebarPage = noSidebarRoutes.includes(location.pathname);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden' // Prevent horizontal scroll on main container
    }}>
      <CssBaseline />
      <Header />

      {/* Mobile Menu Button */}
      {!isNoSidebarPage && isMobile && (
        <IconButton
          onClick={handleMobileDrawerToggle}
          sx={{
            display: { xs: 'flex', md: 'none' },
            position: 'fixed',
            top: 70,
            left: 10,
            zIndex: 1200,
            color: '#fff',
            backgroundColor: 'rgba(60, 27, 74, 0.9)',
            width: 40,
            height: 40,
            padding: 0,
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(194, 24, 91, 0.5)',
            animation: `${pulseGlow} 2s infinite ease-in-out`,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(156, 39, 176, 1)',
              transform: 'scale(1.1)',
              animation: 'none',
              boxShadow: '0 0 15px rgba(194, 24, 91, 0.8)',
            },
          }}
        >
          <DashboardIcon sx={{ fontSize: '1.5rem' }} />
        </IconButton>
      )}

      {/* Desktop Menu Button */}
      {!isNoSidebarPage && !isMobile && (
        <Tooltip
          title={desktopOpen ? "Close Side Menu" : "Open Side Menu"}
          placement="right"
          arrow
        >
          <IconButton
            onClick={handleDesktopDrawerToggle}
            sx={{
              display: { xs: 'none', md: 'flex' },
              position: 'fixed',
              top: 80,
              left: 10,
              zIndex: 1200,
              color: '#fff',
              backgroundColor: 'rgba(60, 27, 74, 0.9)',
              width: 40,
              height: 40,
              padding: 0,
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(194, 24, 91, 0.5)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(156, 39, 176, 1)',
                transform: 'scale(1.1)',
                boxShadow: '0 0 15px rgba(194, 24, 91, 0.8)',
              },
            }}
          >
            {desktopOpen ? <ChevronLeftIcon sx={{ fontSize: '1.5rem' }} /> : <DashboardIcon sx={{ fontSize: '1.5rem' }} />}
          </IconButton>
        </Tooltip>
      )}

      {/* Welcome Tip */}
      {!isNoSidebarPage && !isMobile && (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={showTip}
          onClose={() => setShowTip(false)}
          sx={{ mt: 8 }}
        >
          <Alert
            severity="info"
            variant="filled"
            onClose={() => setShowTip(false)}
            sx={{
              width: '100%',
              backgroundColor: 'rgba(123, 31, 162, 0.9)',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => setShowTip(false)}
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                Got it!
              </Button>
            }
          >
            Use this Side Menu For Explore More

          </Alert>
        </Snackbar>
      )}

      <Box sx={{
        display: 'flex',
        flexGrow: 1,
        width: '100%',
        overflow: 'hidden', // Prevent horizontal scroll
        minHeight: 'calc(100vh - 64px)' // Account for header height
      }}>
        {!isNoSidebarPage && (
          <>
            {/* Mobile Sidebar */}
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleMobileDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': {
                  width: mobileDrawerWidth,
                  boxSizing: 'border-box',
                  background: 'linear-gradient(180deg, #1A032B 0%, #3A0D5D 100%)',
                  top: 0,
                  height: '100vh',
                  position: 'fixed',
                  // Improve mobile scrolling
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  WebkitOverflowScrolling: 'touch',
                  // Hide scrollbar but keep functionality
                  scrollbarWidth: 'none', // For Firefox
                  '&::-webkit-scrollbar': { // For Chrome, Safari, Opera
                    display: 'none',
                  },
                },
              }}
            >
              <SidebarHeader>
                <Typography variant="h6" noWrap component="div">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{
                      bgcolor: 'white',
                      color: '#7B1FA2',
                      mr: 1,
                      background: 'linear-gradient(45deg, #E1BEE7 0%, #BA68C8 100%)'
                    }}>
                      <DashboardIcon />
                    </Avatar>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>මෙනුව</span>
                  </Box>
                </Typography>
                <IconButton onClick={handleMobileDrawerToggle} sx={{ color: 'white' }}>
                  <ChevronLeftIcon />
                </IconButton>
              </SidebarHeader>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <NavigationList
                expandedCategory={expandedCategory}
                handleToggleExpand={handleToggleExpand}
                onItemClick={handleMobileDrawerToggle}
              />
            <SidebarFooter>
            <Box sx={{ mb: 1, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#E1BEE7' }}>
                "අ"යන්න කියන්න
              </Typography>
              <Typography variant="body2" sx={{ color: '#E1BEE7', fontSize: '0.8rem' }}>
                - ජගත් කුමාර ජයසිංහ -
              </Typography>
            </Box>

              {/* Social Links */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                <IconButton sx={{ color: '#BA68C8', '&:hover': { color: '#E1BEE7' } }}>
                  <FacebookIcon fontSize="small" />
                </IconButton>
                <IconButton sx={{ color: '#BA68C8', '&:hover': { color: '#E1BEE7' } }}>
                  <InstagramIcon fontSize="small" />
                </IconButton>
                <IconButton sx={{ color: '#BA68C8', '&:hover': { color: '#E1BEE7' } }}>
                  <FaTiktok fontSize="small" />
                </IconButton>
                <IconButton sx={{ color: '#BA68C8', '&:hover': { color: '#E1BEE7' } }}>
                  <YouTubeIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Policy Links */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                mb: 1.5,
                '& a': {
                  color: '#B39DDB',
                  textDecoration: 'none',
                  fontSize: '0.5rem',
                  '&:hover': {
                    color: '#E1BEE7',
                    textDecoration: 'underline'
                  }
                }
              }}>
                <Link href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</Link>
                <Link href="#" onClick={(e) => e.preventDefault()}>Terms & Conditions</Link>
                <Link href="#" onClick={(e) => e.preventDefault()}>Copyright Policy</Link>
              </Box>
              <Typography variant="caption" sx={{
                display: 'block',
                textAlign: 'center',
                color: '#B39DDB',
                fontSize: '0.5rem',
                lineHeight: 1.5,
                px: 2,
                mb: 1
              }}>
                Developer @ kavindu Jayasinghe (SE)
              </Typography>

              {/* Copyright Section */}
              <Typography variant="caption" sx={{
                display: 'block',
                textAlign: 'center',
                color: '#B39DDB',
                fontSize: '0.65rem',
                lineHeight: 1.5,
                px: 2,
                mb: 1
              }}>
                © {new Date().getFullYear()} Ayanna Kiyanna Learning System<br />
                All Rights Reserved • Version 2.0.1
              </Typography>
            </SidebarFooter>
            </Drawer>

            {/* Desktop Sidebar */}
            <Drawer
              variant="temporary"
              open={desktopOpen}
              onClose={handleDesktopDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: 'none', md: 'block' },
                '& .MuiDrawer-paper': {
                  width: desktopDrawerWidth,
                  boxSizing: 'border-box',
                  background: 'linear-gradient(180deg, #1A032B 0%, #3A0D5D 100%)',
                  top: 0,
                  height: '100vh',
                  position: 'fixed',
                  // Improve desktop scrolling
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  // Hide scrollbar but keep functionality
                  scrollbarWidth: 'none', // For Firefox
                  '&::-webkit-scrollbar': { // For Chrome, Safari, Opera
                    display: 'none',
                  },
                },
              }}
              ref={sidebarRef}
            >
              <SidebarHeader>
                <Typography variant="h6" noWrap component="div">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{
                      bgcolor: 'white',
                      color: '#7B1FA2',
                      mr: 1,
                      background: 'linear-gradient(45deg, #E1BEE7 0%, #BA68C8 100%)'
                    }}>
                      <DashboardIcon />
                    </Avatar>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>මෙනුව</span>
                  </Box>
                </Typography>
                <IconButton onClick={handleDesktopDrawerToggle} sx={{ color: 'white' }}>
                  <ChevronLeftIcon />
                </IconButton>
              </SidebarHeader>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              <NavigationList
                expandedCategory={expandedCategory}
                handleToggleExpand={handleToggleExpand}
                onItemClick={handleDesktopDrawerToggle}
              />
            <SidebarFooter sx={{mb: 1}}>
            <Box sx={{ mb: 1, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#E1BEE7' }}>
            "අ"යන්න කියන්න
          </Typography>
          <Typography variant="body2" sx={{ color: '#E1BEE7', fontSize: '0.8rem' }}>
            - ජගත් කුමාර ජයසිංහ -
          </Typography>
        </Box>

              {/* Social Links */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                <IconButton sx={{ color: '#BA68C8', '&:hover': { color: '#E1BEE7' } }}>
                  <FacebookIcon fontSize="small" />
                </IconButton>
                <IconButton sx={{ color: '#BA68C8', '&:hover': { color: '#E1BEE7' } }}>
                  <InstagramIcon fontSize="small" />
                </IconButton>
                <IconButton sx={{ color: '#BA68C8', '&:hover': { color: '#E1BEE7' } }}>
                  <FaTiktok fontSize="small" />
                </IconButton>

                <IconButton sx={{ color: '#BA68C8', '&:hover': { color: '#E1BEE7' } }}>
                  <YouTubeIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Policy Links */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                mb: 1.5,
                '& a': {
                  color: '#B39DDB',
                  textDecoration: 'none',
                  fontSize: '0.5rem',
                  '&:hover': {
                    color: '#E1BEE7',
                    textDecoration: 'underline'
                  }
                }
              }}>
                <Link href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</Link>
                <Link href="#" onClick={(e) => e.preventDefault()}>Terms & Conditions</Link>
                <Link href="#" onClick={(e) => e.preventDefault()}>Copyright Policy</Link>
              </Box>
              <Typography variant="caption" sx={{
                display: 'block',
                textAlign: 'center',
                color: '#B39DDB',
                fontSize: '0.5rem',
                lineHeight: 1.5,
                px: 2,
                mb: 1
              }}>
                Developer @ kavindu Jayasinghe (SE)
              </Typography>

              {/* Copyright Section */}
              <Typography variant="caption" sx={{
                display: 'block',
                textAlign: 'center',
                color: '#B39DDB',
                fontSize: '0.65rem',
                lineHeight: 1.5,
                px: 2,
                mb: 1
              }}>
                © {new Date().getFullYear()} Ayanna Kiyanna Learning System<br />
                All Rights Reserved • Version 2.0.1
              </Typography>
            </SidebarFooter>
            </Drawer>
          </>
        )}

              {/* Customer Support Button */}
      <a href="/CustomerSupport" style={{ textDecoration: 'none' }}>
        <div
          style={{
            position: "fixed",
            bottom: "15px",
            right: "10px",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: "rgba(65, 23, 62, 0.6)",
            boxShadow: "0 6px 10px rgba(54, 53, 53, 0.9)",
            transition: "width 0.3s ease-in-out, background-color 0.3s ease",
            overflow: "hidden",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.6)",
              boxShadow: "0 6px 12px rgba(64, 64, 64, 0.9)",
            },
          }}
        >
          <HelpOutlineIcon sx={{ color: "#fff", fontSize: "17px" }} />
        </div>
      </a>

        <Main sx={{
          background: 'linear-gradient(rgba(228, 154, 255, 0.86), rgba(244, 126, 195, 0.93))',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start', // Changed from center to flex-start
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
          overflowY: 'auto', // Allow vertical scrolling
          minHeight: '100vh' // Ensure full height
        }}>
          <Container maxWidth={false} disableGutters sx={{
            width: '100%',
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'visible' // Allow content to flow naturally
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<AkContact />} />
              <Route path="/grammar" element={<GrammarPage />} />
              <Route path="/grammar/folder/:folderId" element={<FolderView />} />
              <Route path="/literature" element={<LiteraturePage />} />
              <Route path="/literature/folder/:folderId" element={<LiteratureFolderView />} />
              <Route path="/grade/:gradeCategory" element={<GradePage />} />
              <Route path="/grade/:gradeCategory/folder/:folderId" element={<GradeFolderView />} />
              <Route path="/literature" element={<LiteraturePage />} />
              <Route path="/swara" element={<SwaraPage />} />
              <Route path="/swara/folder/:folderId" element={<SwaraFolderView />} />
              <Route path="/viyanjana" element={<ViyanjanaPage />} />
              <Route path="/viyanjana/folder/:folderId" element={<ViyanjanaFolderView />} />
              <Route path="/akaradiya" element={<AkaradiyaPage />} />
              <Route path="/akaradiya/folder/:folderId" element={<AkaradiyaFolderView />} />
              <Route path="/aksharavinyasaya" element={<AksharavinyasayaPage />} />
              <Route path="/aksharavinyasaya/folder/:folderId" element={<AksharavinyasayaFolderView />} />
              <Route path="/paperbank" element={<PaperBankPage />} />
              <Route path="/paper-structures" element={<PaperStructuresPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/reviews/folder/:folderId" element={<ReviewsFolderView />} />
              <Route path="/reviews/file/:fileId" element={<ReviewsFileDetail />} />
              <Route path="/appreciation" element={<AppreciationPage />} />
              <Route path="/appreciation/folder/:folderId" element={<AppreciationFolderView />} />
              <Route path="/appreciation/file/:fileId" element={<AppreciationFileDetail />} />
              <Route path="/otherEnt" element={<OtherEntPage />} />
              <Route path="/otherEnt/folder/:folderId" element={<OtherEntFolderView />} />
              <Route path="/otherEnt/file/:fileId" element={<OtherEntFileDetail />} />
              <Route path="/subject-guidelines" element={<SubjectGuidelinesPage />} />
              <Route path="/subject-guidelines/folder/:folderId" element={<SubjectGuidelinesFolderView />} />
              <Route path="/teacher-handbook" element={<TeacherHandbookPage />} />
              <Route path="/teacher-handbook/folder/:folderId" element={<TeacherHandbookFolderView />} />
              <Route path="/video-lessons" element={<VideoLessonsPage />} />
              <Route path="/video-lessons/folder/:folderId" element={<VideoLessonsFolderView />} />
              <Route path="/others" element={<OthersPage />} />
              <Route path="/others/folder/:folderId" element={<OthersFolderView />} />
              <Route path="/academic-info" element={<AcademicInfoPage />} />
              <Route path="/academic-info/folder/:folderId" element={<AcademicInfoFolderView />} />
              <Route path="/classes-info" element={<ClassesInfoPage />} />
              <Route path="/extracurricular" element={<ExtracurricularPage />} />
              <Route path="/extracurricular/folder/:folderId" element={<ExtracurricularFolderView />} />
              

              <Route path="/login" element={<SignIn />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/student-registration" element={<StudentRegistration />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/class-management" element={<ClassManagement />} />
              <Route path="/student-management" element={<StudentManagement />} />
              <Route path="/class-requests" element={<ClassRequestManagement />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/class/:classId" element={<SpecificClass />} />
              <Route path="/specific-class/:classId" element={<SpecificClass />} />
              <Route path="/attendance-management/:classId" element={<AttendanceManagement />} />
              <Route path="/attendance-view/:classId" element={<AttendanceView />} />
              <Route path="/attendance-edit/:id" element={<AttendanceEdit />} />
              <Route path="/attendance-analytics" element={<AttendanceAnalytics />} />
              <Route path="/student-class-payments/:classId" element={<StudentClassPayments />} />
              <Route path="/class-payment/:classId/:year/:month" element={<ClassFeePayment />} />
              <Route path="/admin-class-payments/:classId" element={<AdminClassPayments />} />
              <Route path="/all-class-payment-requests" element={<AllClassPaymentRequests />} />
              <Route path="/my-payment-requests" element={<MyPaymentRequests />} />

              {/* Assignment Routes */}
              <Route path="/admin-assignments/:classId" element={<AdminAssignmentManagement />} />
              <Route path="/create-assignment/:classId" element={<CreateAssignment />} />
              <Route path="/edit-assignment/:assignmentId" element={<EditAssignment />} />
              <Route path="/student-assignments/:classId" element={<StudentAssignments />} />
              <Route path="/submit-assignment/:assignmentId" element={<AssignmentSubmission />} />
              <Route path="/edit-submission/:assignmentId" element={<AssignmentSubmission />} />
              <Route path="/assignment-submissions/:assignmentId" element={<AssignmentSubmissions />} />
              <Route path="/assignment-details/:assignmentId" element={<AssignmentDetails />} />
              <Route path="/view-submission/:submissionId" element={<ViewSubmission />} />

              {/* Exam Routes */}
              <Route path="/admin-exams/:classId" element={<AdminExamManagement />} />
              <Route path="/exam-marks/:examId" element={<ExamMarksManagement />} />
              <Route path="/student-exams/:classId" element={<StudentExamView />} />

              {/* Resource Routes */}
              <Route path="/admin-resources/:classId" element={<AdminResourceManagement />} />
              <Route path="/student-resources/:classId" element={<StudentResourceView />} />

              {/* Announcement Routes */}
              <Route path="/admin-announcements/:classId" element={<AdminAnnouncementManagement />} />
              <Route path="/student-announcements/:classId" element={<StudentAnnouncementView />} />
              <Route path="/announcement-details/:announcementId" element={<AnnouncementDetails />} />
              <Route path="/resource-details/:resourceId" element={<ResourceDetails />} />

              {/* Time Schedule Routes */}
              <Route path="/admin-time-schedule/:classId" element={<AdminTimeScheduleManagement />} />
              <Route path="/student-time-schedule/:classId" element={<StudentTimeScheduleView />} />

              {/* Online Sessions Routes */}
              <Route path="/admin-online-sessions/:classId" element={<AdminOnlineSessions />} />
              <Route path="/student-online-sessions/:classId" element={<StudentOnlineSessions />} />

              <Route path="/aksharamalawa" element={<AksharaMalawa />} />

              {/* New Routes */}
              <Route path="/photo-bucket" element={<PhotoBucketPage />} />
              <Route path="/special-notice" element={<SpecialNoticePage />} />
              <Route path="/contact-support" element={<ContactSupportPage />} />
              <Route path="/admin-special-notice-management" element={<AdminSpecialNoticeManagement />} />
              <Route path="/admin-feedback-management" element={<AdminFeedbackManagement />} />

              {/* E-commerce Routes */}
              <Route path="/books-products" element={<BooksProductsPage />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/admin-product-management" element={<AdminProductManagement />} />
              <Route path="/admin-order-management" element={<AdminOrderManagement />} />
              <Route path="/admin-delivery-charge-management" element={<AdminDeliveryChargeManagement />} />
            </Routes>
          </Container>
        </Main>
      </Box>
    </Box>
  );
}

function NavigationList({ expandedCategory, handleToggleExpand, onItemClick }) {
  const location = useLocation();

  return (
    <List sx={{ pt: 0, flexGrow: 1 }}>
      {navItems.map((item, index) => (
        <React.Fragment key={index}>
          {item.subcategories ? (
            <>
              <ListItemButton
                onClick={() => handleToggleExpand(item.name)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(123, 31, 162, 0.2)',
                    '& .MuiListItemIcon-root': {
                      color: '#E1BEE7'
                    },
                    '& .MuiListItemText-primary': {
                      color: '#E1BEE7'
                    }
                  },
                  backgroundColor: expandedCategory === item.name ? 'rgba(123, 31, 162, 0.3)' : 'inherit',
                  borderLeft: expandedCategory === item.name ? '4px solid #BA68C8' : 'none',
                  py: 1.5,
                }}
              >
                <ListItemIcon sx={{
                  color: expandedCategory === item.name ? '#BA68C8' : '#CE93D8',
                  minWidth: '40px'
                }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: '1.25rem' } })}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontWeight: 'medium',
                    fontSize: '0.95rem',
                    color: expandedCategory === item.name ? '#E1BEE7' : '#CE93D8'
                  }}
                />
                {expandedCategory === item.name ? (
                  <ExpandLessIcon sx={{ color: '#BA68C8' }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: '#CE93D8' }} />
                )}
              </ListItemButton>
              <Collapse in={expandedCategory === item.name} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subcategories.map((subItem, subIndex) => (
                    <ListItemButton
                      key={subIndex}
                      component={Link}
                      to={subItem.path}
                      onClick={onItemClick}
                      sx={{
                        pl: 6,
                        '&:hover': {
                          backgroundColor: 'rgba(123, 31, 162, 0.2)',
                          '& .MuiListItemIcon-root': {
                            color: '#E1BEE7'
                          },
                          '& .MuiListItemText-primary': {
                            color: '#E1BEE7'
                          }
                        },
                        backgroundColor: location.pathname === subItem.path ? 'rgba(123, 31, 162, 0.3)' : 'inherit',
                        borderLeft: location.pathname === subItem.path ? '4px solid #BA68C8' : 'none',
                        py: 1,
                      }}
                    >
                      <ListItemIcon sx={{
                        color: location.pathname === subItem.path ? '#BA68C8' : '#CE93D8',
                        minWidth: '40px'
                      }}>
                        {React.cloneElement(subItem.icon, { sx: { fontSize: '1.1rem' } })}
                      </ListItemIcon>
                      <ListItemText
                        primary={subItem.name}
                        primaryTypographyProps={{
                          fontWeight: location.pathname === subItem.path ? 'bold' : 'normal',
                          fontSize: '0.9rem',
                          color: location.pathname === subItem.path ? '#E1BEE7' : '#CE93D8'
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </>
          ) : (
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={onItemClick}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(123, 31, 162, 0.2)',
                  '& .MuiListItemIcon-root': {
                    color: '#E1BEE7'
                  },
                  '& .MuiListItemText-primary': {
                    color: '#E1BEE7'
                  }
                },
                backgroundColor: location.pathname === item.path ? 'rgba(123, 31, 162, 0.3)' : 'inherit',
                borderLeft: location.pathname === item.path ? '4px solid #BA68C8' : 'none',
                py: 1.5,
              }}
            >
              <ListItemIcon sx={{
                color: location.pathname === item.path ? '#BA68C8' : '#CE93D8',
                minWidth: '40px'
              }}>
                {React.cloneElement(item.icon, { sx: { fontSize: '1.25rem' } })}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 'bold' : 'medium',
                  fontSize: '0.95rem',
                  color: location.pathname === item.path ? '#E1BEE7' : '#CE93D8'
                }}
              />
            </ListItemButton>
          )}
          {index < navItems.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
        </React.Fragment>
      ))}
    </List>
  );
}

export default App;