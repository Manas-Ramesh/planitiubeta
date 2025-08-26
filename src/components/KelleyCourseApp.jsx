import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, X, Calendar, BookOpen, GraduationCap, User, Check, Search } from 'lucide-react';

const CourseApp = () => {
  const [currentStep, setCurrentStep] = useState('onboarding');
  const [activeTab, setActiveTab] = useState('swipe');
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [swipedCourses, setSwipedCourses] = useState([]);
  const [rejectedCourses, setRejectedCourses] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: '',
    major: '',
    gpa: 3.5,
    completedCourses: []
  });
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load course data on component mount
  useEffect(() => {
    loadCourseData();
  }, []);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const courseData = await loadCoursesFromCSV();
      setAllCourses(courseData);
    } catch (error) {
      console.error('Error loading course data:', error);
      setAllCourses(getExpandedSampleCourses());
    } finally {
      setLoading(false);
    }
  };

  const loadCoursesFromCSV = async () => {
    return getExpandedSampleCourses();
  };

  const getExpandedSampleCourses = () => {
    return [
      // Kelley Business Courses (Expanded)
      {
        id: 'BUS-T175',
        title: 'Introductory Business',
        description: 'Overview of business fundamentals and career exploration.',
        credits: 1,
        avgGpa: 3.8,
        difficulty: 'Beginner',
        professor: 'Dr. Rodriguez',
        fulfills: ['Business Foundation', 'iCore Prerequisites'],
        prerequisites: [],
        level: 100,
        term: 'Fall 2025',
        priority: 100,
        subject: 'BUS',
        school: 'kelley',
        meetingTimes: {
          days: ['Monday'],
          startTime: '8:00 AM',
          endTime: '8:50 AM',
          location: 'KMC 1001'
        }
      },
      {
        id: 'BUS-C104',
        title: 'Business Presentations',
        description: 'Development of effective business presentation skills.',
        credits: 3,
        avgGpa: 3.6,
        difficulty: 'Beginner',
        professor: 'Prof. Davis',
        fulfills: ['Communication Skills', 'iCore Prerequisites'],
        prerequisites: [],
        level: 100,
        term: 'Fall 2025',
        priority: 95,
        subject: 'BUS',
        school: 'kelley',
        meetingTimes: {
          days: ['Thursday'],
          startTime: '2:00 PM',
          endTime: '3:15 PM',
          location: 'KMC 2002'
        }
      },
      {
        id: 'BUS-A100',
        title: 'Introduction to Accounting',
        description: 'Basic principles of financial and managerial accounting.',
        credits: 3,
        avgGpa: 3.2,
        difficulty: 'Intermediate',
        professor: 'Prof. Johnson',
        fulfills: ['Accounting Foundation', 'iCore Prerequisites'],
        prerequisites: [],
        level: 100,
        term: 'Fall 2025',
        priority: 90,
        subject: 'BUS',
        school: 'kelley',
        meetingTimes: {
          days: ['Monday', 'Wednesday', 'Friday'],
          startTime: '10:00 AM',
          endTime: '10:50 AM',
          location: 'KMC 3045'
        }
      },
      {
        id: 'BUS-A201',
        title: 'Financial Accounting',
        description: 'Advanced financial accounting principles and reporting.',
        credits: 3,
        avgGpa: 3.0,
        difficulty: 'Intermediate',
        professor: 'Dr. Smith',
        fulfills: ['Accounting Core', 'Major Requirement'],
        prerequisites: ['BUS-A100'],
        level: 200,
        term: 'Fall 2025',
        priority: 85,
        subject: 'BUS',
        school: 'kelley',
        meetingTimes: {
          days: ['Tuesday', 'Thursday'],
          startTime: '9:00 AM',
          endTime: '10:15 AM',
          location: 'KMC 2105'
        }
      },
      {
        id: 'BUS-F301',
        title: 'Corporate Finance',
        description: 'Corporate financial decision making and capital budgeting.',
        credits: 3,
        avgGpa: 2.8,
        difficulty: 'Advanced',
        professor: 'Prof. Williams',
        fulfills: ['Finance Core', 'Major Requirement'],
        prerequisites: ['BUS-A100', 'MATH-M119'],
        level: 300,
        term: 'Fall 2025',
        priority: 80,
        subject: 'BUS',
        school: 'kelley',
        meetingTimes: {
          days: ['Monday', 'Wednesday'],
          startTime: '1:00 PM',
          endTime: '2:15 PM',
          location: 'KMC 3050'
        }
      },
      {
        id: 'BUS-M301',
        title: 'Marketing Management',
        description: 'Strategic marketing planning and consumer behavior analysis.',
        credits: 3,
        avgGpa: 3.4,
        difficulty: 'Intermediate',
        professor: 'Dr. Brown',
        fulfills: ['Marketing Core', 'Major Requirement'],
        prerequisites: ['BUS-T175'],
        level: 300,
        term: 'Fall 2025',
        priority: 85,
        subject: 'BUS',
        school: 'kelley',
        meetingTimes: {
          days: ['Tuesday', 'Thursday'],
          startTime: '2:30 PM',
          endTime: '3:45 PM',
          location: 'KMC 1080'
        }
      },
      {
        id: 'BUS-Z302',
        title: 'Managing and Behavior in Organizations',
        description: 'Organizational behavior and management principles.',
        credits: 3,
        avgGpa: 3.3,
        difficulty: 'Intermediate',
        professor: 'Prof. Davis',
        fulfills: ['Management Core', 'Major Requirement'],
        prerequisites: ['BUS-T175'],
        level: 300,
        term: 'Fall 2025',
        priority: 82,
        subject: 'BUS',
        school: 'kelley',
        meetingTimes: {
          days: ['Monday', 'Wednesday', 'Friday'],
          startTime: '11:00 AM',
          endTime: '11:50 AM',
          location: 'KMC 2070'
        }
      },
      {
        id: 'ECON-E370',
        title: 'Microeconomic Theory',
        description: 'Analysis of consumer and producer behavior in markets.',
        credits: 3,
        avgGpa: 2.9,
        difficulty: 'Advanced',
        professor: 'Dr. Wilson',
        fulfills: ['Economics Requirement', 'iCore Prerequisites'],
        prerequisites: ['MATH-M119'],
        level: 300,
        term: 'Fall 2025',
        priority: 75,
        subject: 'ECON',
        school: 'kelley',
        meetingTimes: {
          days: ['Tuesday', 'Thursday'],
          startTime: '11:00 AM',
          endTime: '12:15 PM',
          location: 'WY 105'
        }
      },
      {
        id: 'BUS-K303',
        title: 'Information Systems',
        description: 'Business applications of information technology.',
        credits: 3,
        avgGpa: 3.1,
        difficulty: 'Intermediate',
        professor: 'Prof. Garcia',
        fulfills: ['Information Systems Core', 'Major Requirement'],
        prerequisites: ['BUS-T175'],
        level: 300,
        term: 'Fall 2025',
        priority: 78,
        subject: 'BUS',
        school: 'kelley',
        meetingTimes: {
          days: ['Monday', 'Wednesday'],
          startTime: '3:00 PM',
          endTime: '4:15 PM',
          location: 'KMC 1045'
        }
      },

      // Luddy Computer Science Courses (Expanded)
      {
        id: 'CSCI-C200',
        title: 'Introduction to Computer Science',
        description: 'Fundamental concepts of computer science and programming.',
        credits: 4,
        avgGpa: 3.1,
        difficulty: 'Intermediate',
        professor: 'Dr. Johnson',
        fulfills: ['CS Core', 'Foundation'],
        prerequisites: [],
        level: 200,
        term: 'Fall 2025',
        priority: 100,
        subject: 'CSCI',
        school: 'luddy',
        meetingTimes: {
          days: ['Monday', 'Wednesday', 'Friday'],
          startTime: '10:00 AM',
          endTime: '11:15 AM',
          location: 'LH 102'
        }
      },
      {
        id: 'CSCI-C211',
        title: 'Introduction to Computer Science',
        description: 'Programming fundamentals and problem-solving techniques.',
        credits: 4,
        avgGpa: 3.0,
        difficulty: 'Intermediate',
        professor: 'Prof. Chen',
        fulfills: ['CS Core', 'Foundation'],
        prerequisites: [],
        level: 200,
        term: 'Fall 2025',
        priority: 100,
        subject: 'CSCI',
        school: 'luddy',
        meetingTimes: {
          days: ['Tuesday', 'Thursday'],
          startTime: '1:00 PM',
          endTime: '2:15 PM',
          location: 'LH 025'
        }
      },
      {
        id: 'CSCI-C212',
        title: 'Introduction to Software Systems',
        description: 'Software development methodologies and system design.',
        credits: 4,
        avgGpa: 2.9,
        difficulty: 'Advanced',
        professor: 'Dr. Smith',
        fulfills: ['CS Core'],
        prerequisites: ['CSCI-C200', 'CSCI-C211'],
        level: 200,
        term: 'Fall 2025',
        priority: 90,
        subject: 'CSCI',
        school: 'luddy',
        meetingTimes: {
          days: ['Monday', 'Wednesday', 'Friday'],
          startTime: '1:00 PM',
          endTime: '2:15 PM',
          location: 'LH 101'
        }
      },
      {
        id: 'CSCI-C343',
        title: 'Data Structures',
        description: 'Advanced data structures and algorithm analysis.',
        credits: 4,
        avgGpa: 2.7,
        difficulty: 'Advanced',
        professor: 'Prof. Anderson',
        fulfills: ['CS Core', 'Major Requirement'],
        prerequisites: ['CSCI-C212'],
        level: 300,
        term: 'Fall 2025',
        priority: 85,
        subject: 'CSCI',
        school: 'luddy',
        meetingTimes: {
          days: ['Tuesday', 'Thursday'],
          startTime: '9:30 AM',
          endTime: '10:45 AM',
          location: 'LH 030'
        }
      },
      {
        id: 'CSCI-C435',
        title: 'Software Engineering',
        description: 'Large-scale software development and project management.',
        credits: 3,
        avgGpa: 3.2,
        difficulty: 'Advanced',
        professor: 'Dr. Taylor',
        fulfills: ['CS Elective', 'Major Requirement'],
        prerequisites: ['CSCI-C343'],
        level: 400,
        term: 'Fall 2025',
        priority: 75,
        subject: 'CSCI',
        school: 'luddy',
        meetingTimes: {
          days: ['Monday', 'Wednesday'],
          startTime: '2:30 PM',
          endTime: '3:45 PM',
          location: 'LH 120'
        }
      },

      // Luddy Informatics Courses
      {
        id: 'INFO-I101',
        title: 'Introduction to Informatics',
        description: 'Overview of informatics as a field and its applications.',
        credits: 4,
        avgGpa: 3.4,
        difficulty: 'Beginner',
        professor: 'Prof. Wilson',
        fulfills: ['Informatics Core', 'Foundation'],
        prerequisites: [],
        level: 100,
        term: 'Fall 2025',
        priority: 100,
        subject: 'INFO',
        school: 'luddy',
        meetingTimes: {
          days: ['Tuesday', 'Thursday'],
          startTime: '11:00 AM',
          endTime: '12:15 PM',
          location: 'IF 120'
        }
      },
      {
        id: 'INFO-I210',
        title: 'Information Infrastructure',
        description: 'Technical foundations of information systems.',
        credits: 4,
        avgGpa: 3.1,
        difficulty: 'Intermediate',
        professor: 'Dr. Martinez',
        fulfills: ['Informatics Core', 'Foundation'],
        prerequisites: ['INFO-I101'],
        level: 200,
        term: 'Fall 2025',
        priority: 90,
        subject: 'INFO',
        school: 'luddy',
        meetingTimes: {
          days: ['Monday', 'Wednesday', 'Friday'],
          startTime: '9:00 AM',
          endTime: '9:50 AM',
          location: 'IF 125'
        }
      },
      {
        id: 'INFO-I300',
        title: 'Human-Computer Interaction',
        description: 'Design and evaluation of user interfaces.',
        credits: 3,
        avgGpa: 3.5,
        difficulty: 'Intermediate',
        professor: 'Prof. Lee',
        fulfills: ['Informatics Core', 'Major Requirement'],
        prerequisites: ['INFO-I210'],
        level: 300,
        term: 'Fall 2025',
        priority: 85,
        subject: 'INFO',
        school: 'luddy',
        meetingTimes: {
          days: ['Tuesday', 'Thursday'],
          startTime: '1:00 PM',
          endTime: '2:15 PM',
          location: 'IF 140'
        }
      },

      // Data Science Courses
      {
        id: 'DSCI-D321',
        title: 'Data Representation',
        description: 'Methods for representing and organizing data.',
        credits: 3,
        avgGpa: 3.2,
        difficulty: 'Intermediate',
        professor: 'Dr. Taylor',
        fulfills: ['Data Science Core'],
        prerequisites: ['INFO-I101'],
        level: 300,
        term: 'Fall 2025',
        priority: 85,
        subject: 'DSCI',
        school: 'luddy',
        meetingTimes: {
          days: ['Monday', 'Wednesday'],
          startTime: '2:30 PM',
          endTime: '3:45 PM',
          location: 'LH 030'
        }
      },
      {
        id: 'DSCI-D400',
        title: 'Machine Learning',
        description: 'Introduction to machine learning algorithms and applications.',
        credits: 4,
        avgGpa: 2.8,
        difficulty: 'Advanced',
        professor: 'Prof. Zhang',
        fulfills: ['Data Science Core', 'Major Requirement'],
        prerequisites: ['DSCI-D321', 'STAT-S350'],
        level: 400,
        term: 'Fall 2025',
        priority: 80,
        subject: 'DSCI',
        school: 'luddy',
        meetingTimes: {
          days: ['Tuesday', 'Thursday'],
          startTime: '10:00 AM',
          endTime: '11:15 AM',
          location: 'LH 045'
        }
      },

      // Engineering Courses
      {
        id: 'ENGR-E101',
        title: 'Engineering Problem Solving',
        description: 'Introduction to engineering design and problem solving.',
        credits: 3,
        avgGpa: 3.3,
        difficulty: 'Intermediate',
        professor: 'Prof. Anderson',
        fulfills: ['Engineering Core', 'Foundation'],
        prerequisites: [],
        level: 100,
        term: 'Fall 2025',
        priority: 95,
        subject: 'ENGR',
        school: 'luddy',
        meetingTimes: {
          days: ['Tuesday', 'Thursday'],
          startTime: '9:30 AM',
          endTime: '10:45 AM',
          location: 'ENGR 105'
        }
      },
      {
        id: 'ENGR-E200',
        title: 'Engineering Systems Design',
        description: 'Systems thinking and design methodology.',
        credits: 3,
        avgGpa: 3.0,
        difficulty: 'Intermediate',
        professor: 'Dr. Kumar',
        fulfills: ['Engineering Core', 'Major Requirement'],
        prerequisites: ['ENGR-E101'],
        level: 200,
        term: 'Fall 2025',
        priority: 88,
        subject: 'ENGR',
        school: 'luddy',
        meetingTimes: {
          days: ['Monday', 'Wednesday'],
          startTime: '11:00 AM',
          endTime: '12:15 PM',
          location: 'ENGR 110'
        }
      },

      // General Education Courses (Expanded)
      {
        id: 'ENG-W131',
        title: 'Elementary Composition',
        description: 'Development of writing skills through practice and instruction.',
        credits: 3,
        avgGpa: 3.3,
        difficulty: 'Beginner',
        professor: 'Dr. Brown',
        fulfills: ['General Education', 'iCore Prerequisites', 'English Composition'],
        prerequisites: [],
        level: 100,
        term: 'Fall 2025',
        priority: 90,
        subject: 'ENG',
        school: 'general',
        meetingTimes: {
          days: ['Monday', 'Wednesday'],
          startTime: '11:00 AM',
          endTime: '12:15 PM',
          location: 'BH 340'
        }
      },
      {
        id: 'ENG-W132',
        title: 'Elementary Composition II',
        description: 'Advanced composition and research writing.',
        credits: 3,
        avgGpa: 3.2,
        difficulty: 'Intermediate',
        professor: 'Prof. Miller',
        fulfills: ['General Education', 'English Composition'],
        prerequisites: ['ENG-W131'],
        level: 100,
        term: 'Fall 2025',
        priority: 85,
        subject: 'ENG',
        school: 'general',
        meetingTimes: {
          days: ['Tuesday', 'Thursday'],
          startTime: '10:00 AM',
          endTime: '11:15 AM',
          location: 'BH 342'
        }
      },
      {
        id: 'MATH-M119',
        title: 'Brief Survey of Calculus',
        description: 'Introduction to calculus concepts for business students.',
        credits: 3,
        avgGpa: 2.9,
        difficulty: 'Intermediate',
        professor: 'Prof. Wilson',
        fulfills: ['Math Requirement', 'iCore Prerequisites', 'Mathematical Modeling'],
        prerequisites: [],
        level: 100,
        term: 'Fall 2025',
        priority: 75,
        subject: 'MATH',
        school: 'general',
        meetingTimes: {
          days: ['Monday', 'Wednesday', 'Friday'],
          startTime: '9:00 AM',
          endTime: '9:50 AM',
          location: 'SY 103'
        }
      },
      {
        id: 'MATH-M211',
        title: 'Calculus I',
        description: 'First course in calculus sequence.',
        credits: 4,
        avgGpa: 2.7,
        difficulty: 'Advanced',
        professor: 'Dr. Thompson',
        fulfills: ['Math Requirement', 'STEM Foundation'],
        prerequisites: [],
        level: 200,
        term: 'Fall 2025',
        priority: 80,
        subject: 'MATH',
        school: 'general',
        meetingTimes: {
          days: ['Monday', 'Wednesday', 'Friday'],
          startTime: '10:00 AM',
          endTime: '10:50 AM',
          location: 'SY 001'
        }
      },
      {
        id: 'STAT-S300',
        title: 'Statistical Techniques',
        description: 'Introduction to statistical methods and data analysis.',
        credits: 3,
        avgGpa: 3.1,
        difficulty: 'Intermediate',
        professor: 'Dr. Lee',
        fulfills: ['Statistics Requirement', 'iCore Prerequisites'],
        prerequisites: ['MATH-M119'],
        level: 300,
        term: 'Fall 2025',
        priority: 80,
        subject: 'STAT',
        school: 'general',
        meetingTimes: {
          days: ['Monday', 'Wednesday', 'Friday'],
          startTime: '1:00 PM',
          endTime: '1:50 PM',
          location: 'SY 001'
        }
      },
      {
        id: 'STAT-S350',
        title: 'Introduction to Statistics',
        description: 'Statistical inference and hypothesis testing.',
        credits: 3,
        avgGpa: 2.9,
        difficulty: 'Advanced',
        professor: 'Prof. Garcia',
        fulfills: ['Statistics Requirement', 'STEM Foundation'],
        prerequisites: ['MATH-M211'],
        level: 300,
        term: 'Fall 2025',
        priority: 75,
        subject: 'STAT',
        school: 'general',
        meetingTimes: {
          days: ['Tuesday', 'Thursday'],
          startTime: '2:00 PM',
          endTime: '3:15 PM',
          location: 'SY 105'
        }
      },
      {
        id: 'PHYS-P201',
        title: 'General Physics I',
        description: 'Mechanics and thermodynamics for science majors.',
        credits: 5,
        avgGpa: 2.6,
        difficulty: 'Advanced',
        professor: 'Dr. Johnson',
        fulfills: ['Science Requirement', 'STEM Foundation'],
        prerequisites: ['MATH-M211'],
        level: 200,
        term: 'Fall 2025',
        priority: 70,
        subject: 'PHYS',
        school: 'general',
        meetingTimes: {
          days: ['Monday', 'Wednesday', 'Friday'],
          startTime: '8:00 AM',
          endTime: '8:50 AM',
          location: 'PH 112'
        }
      }
    ];
  };

  // Determine if user is Luddy student
  const isLuddyStudent = () => {
    const luddyMajors = [
      'computer science', 'computer science (b.s.)', 'computer science (b.a.)',
      'data science', 'data science (b.s.)',
      'informatics', 'informatics (b.s.)',
      'intelligent systems engineering', 'intelligent systems engineering (b.s.e.)'
    ];
    return luddyMajors.some(major => 
      userProfile.major.toLowerCase().includes(major)
    );
  };

  // Filter courses for search
  const getFilteredCourses = () => {
    if (!courseSearchTerm) return [];
    
    const searchLower = courseSearchTerm.toLowerCase();
    return allCourses.filter(course =>
      course.id.toLowerCase().includes(searchLower) ||
      course.title.toLowerCase().includes(searchLower) ||
      course.subject.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower)
    ).slice(0, 10);
  };

  // Calculate recommendation score for each course
  const calculateCourseScore = (course) => {
    let score = 50; // Base score
    
    // School alignment - completely block cross-school courses
    const studentIsLuddy = isLuddyStudent();
    const courseIsLuddy = course.school === 'luddy';
    const courseIsKelley = course.school === 'kelley';
    const isGeneralCourse = course.school === 'general';
    
    // Complete disqualification for cross-school courses
    if (studentIsLuddy && courseIsKelley) {
      return 0; // Luddy students cannot take Kelley courses
    } else if (!studentIsLuddy && courseIsLuddy) {
      return 0; // Kelley students cannot take Luddy courses
    }
    
    // School alignment bonuses
    if (studentIsLuddy && courseIsLuddy) {
      score += 30; // Strong preference for Luddy courses for Luddy students
    } else if (!studentIsLuddy && courseIsKelley) {
      score += 30; // Strong preference for Kelley courses for Kelley students
    } else if (isGeneralCourse) {
      score += 10; // General courses are good for everyone
    }
    
    // GPA difficulty adjustment
    const gpaDiff = course.avgGpa - userProfile.gpa;
    score += (gpaDiff * -10);
    
    // Level progression bonus
    const completedLevels = userProfile.completedCourses.map(c => {
      const num = c.split('-')[1]?.replace(/\D/g, '') || '0';
      return Math.floor(parseInt(num) / 100);
    });
    const maxCompletedLevel = Math.max(...completedLevels, 0);
    const courseLevel = Math.floor(course.level / 100);
    
    if (courseLevel === maxCompletedLevel + 1) {
      score += 20; // Next logical level
    } else if (courseLevel === maxCompletedLevel) {
      score += 10; // Same level
    } else if (courseLevel < maxCompletedLevel) {
      score -= 15; // Lower level
    } else if (courseLevel > maxCompletedLevel + 1) {
      score -= 25; // Too advanced
    }
    
    // Prerequisites met bonus
    const prereqsMet = course.prerequisites.every(prereq => 
      userProfile.completedCourses.includes(prereq)
    );
    if (course.prerequisites.length > 0) {
      if (prereqsMet) {
        score += 15;
      } else {
        score -= 30;
      }
    }
    
    // Major alignment bonus
    if (userProfile.major && course.fulfills.some(req => 
      req.toLowerCase().includes(userProfile.major.toLowerCase().split(' ')[0]) ||
      (studentIsLuddy && ['cs core', 'informatics core', 'data science core', 'engineering core'].some(core => 
        req.toLowerCase().includes(core)))
    )) {
      score += 15;
    }
    
    // Already completed penalty
    if (userProfile.completedCourses.includes(course.id)) {
      score = 0;
    }
    
    // Already swiped penalty
    if (swipedCourses.some(c => c.id === course.id) || rejectedCourses.includes(course.id)) {
      score = 0;
    }
    
    return Math.max(0, score);
  };

  // Enhanced recommendation system with larger pool
  const getRecommendedCourses = () => {
    const allScoredCourses = allCourses
      .map(course => ({
        ...course,
        score: calculateCourseScore(course)
      }))
      .filter(course => course.score > 0)
      .sort((a, b) => b.score - a.score);
    
    // Return top 50 courses instead of just 10
    return allScoredCourses.slice(0, 50);
  };

  const [recommendedCourses, setRecommendedCourses] = useState([]);

  useEffect(() => {
    if (currentStep === 'app' && allCourses.length > 0) {
      const newRecommendations = getRecommendedCourses();
      setRecommendedCourses(newRecommendations);
      setCurrentCourseIndex(0);
    }
  }, [currentStep, userProfile, swipedCourses, rejectedCourses, allCourses]);

  const handleSwipeRight = () => {
    const currentCourse = recommendedCourses[currentCourseIndex];
    if (currentCourse) {
      const newScheduledCredits = swipedCourses.reduce((total, course) => total + course.credits, 0) + currentCourse.credits;
      
      if (newScheduledCredits > 18) {
        alert(`Adding ${currentCourse.id} would exceed the 18 credit maximum (${newScheduledCredits} credits total). Consider dropping a course first.`);
        return;
      }
      
      setSwipedCourses([...swipedCourses, currentCourse]);
      moveToNextCourse();
    }
  };

  const handleSwipeLeft = () => {
    const currentCourse = recommendedCourses[currentCourseIndex];
    if (currentCourse) {
      setRejectedCourses([...rejectedCourses, currentCourse.id]);
      moveToNextCourse();
    }
  };

  const moveToNextCourse = () => {
    if (currentCourseIndex < recommendedCourses.length - 1) {
      setCurrentCourseIndex(currentCourseIndex + 1);
    } else {
      // When we run out of courses, refresh the recommendation pool
      const newRecommendations = getRecommendedCourses();
      const availableCourses = newRecommendations.filter(course => 
        !swipedCourses.some(c => c.id === course.id) && 
        !rejectedCourses.includes(course.id)
      );
      
      if (availableCourses.length > 0) {
        setRecommendedCourses(availableCourses);
        setCurrentCourseIndex(0);
      }
    }
  };

  const removeCourseFromSchedule = (courseId) => {
    setSwipedCourses(swipedCourses.filter(course => course.id !== courseId));
  };

  const addCourseToCompleted = (courseId) => {
    if (!userProfile.completedCourses.includes(courseId)) {
      setUserProfile({
        ...userProfile,
        completedCourses: [...userProfile.completedCourses, courseId]
      });
    }
    setCourseSearchTerm('');
  };

  const removeCourseFromCompleted = (courseId) => {
    setUserProfile({
      ...userProfile,
      completedCourses: userProfile.completedCourses.filter(c => c !== courseId)
    });
  };

  // Enhanced progress calculation
  const calculateDetailedProgress = () => {
    const studentIsLuddy = isLuddyStudent();
    const totalRequiredCredits = 120;
    const completedCredits = userProfile.completedCourses.length * 3;
    const scheduledCredits = swipedCourses.reduce((total, course) => total + course.credits, 0);
    const totalCredits = completedCredits + scheduledCredits;
    
    const allCourses = [...userProfile.completedCourses, ...swipedCourses.map(c => c.id)];
    
    if (studentIsLuddy) {
      // Luddy comprehensive progress
      const csCourses = allCourses.filter(c => c.startsWith('CSCI')).length * 3;
      const infoCourses = allCourses.filter(c => c.startsWith('INFO')).length * 3;
      const mathCourses = allCourses.filter(c => c.startsWith('MATH') || c.startsWith('STAT')).length * 3;
      const scienceCourses = allCourses.filter(c => c.startsWith('PHYS') || c.startsWith('CHEM') || c.startsWith('BIOL')).length * 3;
      const genEdCourses = allCourses.filter(c => c.startsWith('ENG')).length * 3;
      
      let majorSpecificCredits = 0;
      let majorSpecificRequired = 45;
      
      if (userProfile.major.toLowerCase().includes('computer science')) {
        majorSpecificCredits = csCourses;
        majorSpecificRequired = 48;
      } else if (userProfile.major.toLowerCase().includes('data science')) {
        majorSpecificCredits = allCourses.filter(c => c.startsWith('DSCI') || c.startsWith('CSCI') || c.startsWith('STAT')).length * 3;
        majorSpecificRequired = 45;
      } else if (userProfile.major.toLowerCase().includes('informatics')) {
        majorSpecificCredits = infoCourses;
        majorSpecificRequired = 42;
      } else if (userProfile.major.toLowerCase().includes('engineering')) {
        majorSpecificCredits = allCourses.filter(c => c.startsWith('ENGR')).length * 3;
        majorSpecificRequired = 54;
      }
      
      return {
        percentage: Math.min((totalCredits / totalRequiredCredits) * 100, 100),
        completedCredits,
        scheduledCredits,
        totalCredits,
        remainingCredits: Math.max(totalRequiredCredits - totalCredits, 0),
        majorCredits: majorSpecificCredits,
        majorCreditsRequired: majorSpecificRequired,
        mathCredits: mathCourses,
        mathCreditsRequired: 12,
        scienceCredits: scienceCourses,
        scienceCreditsRequired: 8,
        genEdCredits: genEdCourses,
        genEdCreditsRequired: 18,
        electiveCredits: Math.max(0, totalCredits - majorSpecificCredits - mathCourses - scienceCourses - genEdCourses),
        electiveCreditsRequired: 15
      };
    } else {
      // Kelley comprehensive progress
      const businessCourses = allCourses.filter(c => c.startsWith('BUS')).length * 3;
      const mathCourses = allCourses.filter(c => c.startsWith('MATH') || c.startsWith('STAT') || c.startsWith('ECON')).length * 3;
      const genEdCourses = allCourses.filter(c => c.startsWith('ENG')).length * 3;
      
      let majorSpecificCredits = 0;
      let majorSpecificRequired = 36;
      
      if (userProfile.major.toLowerCase().includes('accounting')) {
        majorSpecificCredits = allCourses.filter(c => c.includes('BUS-A')).length * 3;
        majorSpecificRequired = 30;
      } else if (userProfile.major.toLowerCase().includes('finance')) {
        majorSpecificCredits = allCourses.filter(c => c.includes('BUS-F')).length * 3;
        majorSpecificRequired = 27;
      } else if (userProfile.major.toLowerCase().includes('marketing')) {
        majorSpecificCredits = allCourses.filter(c => c.includes('BUS-M')).length * 3;
        majorSpecificRequired = 24;
      } else {
        majorSpecificCredits = businessCourses;
      }
      
      const icoreComplete = ['BUS-T175', 'BUS-C104', 'MATH-M119', 'ECON-E370', 'ENG-W131'].every(req => 
        allCourses.some(c => c.includes(req.split('-')[1]))
      );
      
      return {
        percentage: Math.min((totalCredits / totalRequiredCredits) * 100, 100),
        completedCredits,
        scheduledCredits,
        totalCredits,
        remainingCredits: Math.max(totalRequiredCredits - totalCredits, 0),
        businessCredits: businessCourses,
        businessCreditsRequired: 60,
        majorCredits: majorSpecificCredits,
        majorCreditsRequired: majorSpecificRequired,
        mathCredits: mathCourses,
        mathCreditsRequired: 12,
        genEdCredits: genEdCourses,
        genEdCreditsRequired: 18,
        electiveCredits: Math.max(0, totalCredits - businessCourses - mathCourses - genEdCourses),
        electiveCreditsRequired: 15,
        icoreComplete: icoreComplete
      };
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.loadingIcon}>
            <BookOpen style={{width: '32px', height: '32px', color: 'white'}} />
          </div>
          <h2 style={styles.loadingTitle}>Loading Course Data</h2>
          <p style={styles.loadingText}>Please wait while we prepare your courses...</p>
        </div>
      </div>
    );
  }

  const OnboardingForm = () => (
    <div style={styles.onboardingContainer}>
      <div style={styles.onboardingCard}>
        <div style={styles.onboardingHeader}>
          <div style={styles.onboardingIcon}>
            <GraduationCap style={{width: '32px', height: '32px', color: 'white'}} />
          </div>
          <h1 style={styles.onboardingTitle}>IU Course Finder</h1>
          <p style={styles.onboardingSubtitle}>Let's find your perfect courses!</p>
        </div>
        
        <div style={styles.formContainer}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
              style={styles.input}
              placeholder="Enter your name"
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>School & Major</label>
            <select
              value={userProfile.major}
              onChange={(e) => setUserProfile({...userProfile, major: e.target.value})}
              style={styles.select}
            >
              <option value="">Select your major</option>
              <optgroup label="Kelley School of Business">
                <option value="Accounting">Accounting</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Management">Management</option>
                <option value="Information Systems">Information Systems</option>
                <option value="Supply Chain Management">Supply Chain Management</option>
                <option value="Business Analytics">Business Analytics</option>
              </optgroup>
              <optgroup label="Luddy School of Informatics, Computing, and Engineering">
                <option value="Computer Science (B.S.)">Computer Science (B.S.)</option>
                <option value="Computer Science (B.A.)">Computer Science (B.A.)</option>
                <option value="Data Science (B.S.)">Data Science (B.S.)</option>
                <option value="Informatics (B.S.)">Informatics (B.S.)</option>
                <option value="Intelligent Systems Engineering (B.S.E.)">Intelligent Systems Engineering (B.S.E.)</option>
              </optgroup>
            </select>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Current GPA</label>
            <input
              type="number"
              min="0"
              max="4"
              step="0.1"
              value={userProfile.gpa}
              onChange={(e) => setUserProfile({...userProfile, gpa: parseFloat(e.target.value)})}
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Completed Courses</label>
            
            <div style={styles.searchContainer}>
              <Search style={styles.searchIcon} />
              <input
                type="text"
                value={courseSearchTerm}
                onChange={(e) => setCourseSearchTerm(e.target.value)}
                style={styles.searchInput}
                placeholder="Search courses (e.g., CSCI-C200, Calculus)"
              />
            </div>
            
            {courseSearchTerm && (
              <div style={styles.searchResults}>
                {getFilteredCourses().map(course => (
                  <button
                    key={course.id}
                    onClick={() => addCourseToCompleted(course.id)}
                    style={{
                      ...styles.searchResult,
                      opacity: userProfile.completedCourses.includes(course.id) ? 0.5 : 1
                    }}
                    disabled={userProfile.completedCourses.includes(course.id)}
                  >
                    <div style={styles.searchResultId}>{course.id}</div>
                    <div style={styles.searchResultTitle}>{course.title}</div>
                    <div style={{
                      ...styles.schoolBadge,
                      backgroundColor: course.school === 'kelley' ? '#fee2e2' : course.school === 'luddy' ? '#dbeafe' : '#f3f4f6',
                      color: course.school === 'kelley' ? '#991b1b' : course.school === 'luddy' ? '#1e40af' : '#374151'
                    }}>
                      {course.school === 'kelley' ? 'Kelley' : course.school === 'luddy' ? 'Luddy' : 'General'}
                    </div>
                  </button>
                ))}
                {getFilteredCourses().length === 0 && (
                  <div style={styles.noResults}>No courses found</div>
                )}
              </div>
            )}
            
            <div style={styles.completedCourses}>
              {userProfile.completedCourses.map(courseId => {
                const course = allCourses.find(c => c.id === courseId);
                return (
                  <div key={courseId} style={styles.completedCourse}>
                    <div>
                      <div style={styles.completedCourseId}>{courseId}</div>
                      <div style={styles.completedCourseTitle}>{course?.title || 'Course Title'}</div>
                    </div>
                    <button
                      onClick={() => removeCourseFromCompleted(courseId)}
                      style={styles.removeButton}
                    >
                      <X style={{width: '16px', height: '16px'}} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setCurrentStep('app')}
          disabled={!userProfile.name || !userProfile.major}
          style={{
            ...styles.startButton,
            opacity: (!userProfile.name || !userProfile.major) ? 0.5 : 1,
            cursor: (!userProfile.name || !userProfile.major) ? 'not-allowed' : 'pointer'
          }}
        >
          Start Finding Courses
        </button>
      </div>
    </div>
  );

  const SwipeTab = () => {
    const currentCourse = recommendedCourses[currentCourseIndex];
    const currentScheduledCredits = swipedCourses.reduce((total, course) => total + course.credits, 0);
    const studentIsLuddy = isLuddyStudent();
    
    if (!currentCourse) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <Check style={{width: '48px', height: '48px', color: '#9ca3af'}} />
          </div>
          <h3 style={styles.emptyTitle}>
            {currentScheduledCredits >= 12 ? 'Schedule Complete!' : 'Need More Courses'}
          </h3>
          <p style={styles.emptyText}>
            {currentScheduledCredits >= 12 
              ? `You have ${currentScheduledCredits} credits scheduled - a full course load!` 
              : `You only have ${currentScheduledCredits} credits. You need at least 12 credits.`}
          </p>
          <p style={styles.emptySubtext}>
            {currentScheduledCredits >= 12 
              ? 'Check your schedule and degree progress!' 
              : 'Try removing some courses from your rejected list or check your completed courses.'}
          </p>
          {currentScheduledCredits < 12 && (
            <button 
              onClick={() => setRejectedCourses([])}
              style={styles.resetButton}
            >
              Reset Rejected Courses
            </button>
          )}
        </div>
      );
    }

    const getDifficultyStyle = (difficulty) => {
      switch (difficulty) {
        case 'Beginner': 
          return { backgroundColor: '#dcfce7', color: '#166534' };
        case 'Intermediate': 
          return { backgroundColor: '#fef3c7', color: '#92400e' };
        case 'Advanced': 
          return { backgroundColor: '#fee2e2', color: '#991b1b' };
        default: 
          return { backgroundColor: '#f3f4f6', color: '#374151' };
      }
    };

    const getGpaColor = (gpa) => {
      if (gpa >= 3.5) return '#16a34a';
      if (gpa >= 3.0) return '#ca8a04';
      return '#dc2626';
    };

    const getSchoolStyle = (school) => {
      if (school === 'kelley') return { backgroundColor: '#fee2e2', color: '#991b1b' };
      if (school === 'luddy') return { backgroundColor: '#dbeafe', color: '#1e40af' };
      return { backgroundColor: '#f3f4f6', color: '#374151' };
    };

    const wouldExceedMax = currentScheduledCredits + currentCourse.credits > 18;

    return (
      <div style={styles.swipeContainer}>
        <div style={styles.swipeHeader}>
          <h2 style={styles.swipeTitle}>Find Your Perfect Courses</h2>
          <div style={styles.swipeInfo}>
            <p style={styles.creditsInfo}>Current Credits: {currentScheduledCredits}/18</p>
            <span style={{
              ...styles.studentBadge,
              backgroundColor: studentIsLuddy ? '#dbeafe' : '#fee2e2',
              color: studentIsLuddy ? '#1e40af' : '#991b1b'
            }}>
              {studentIsLuddy ? 'Luddy Student' : 'Kelley Student'}
            </span>
            {currentScheduledCredits < 12 && (
              <span style={{...styles.warningBadge}}>
                Need {12 - currentScheduledCredits} more credits
              </span>
            )}
          </div>
        </div>
        
        <div style={styles.courseCardContainer}>
          <div style={{
            ...styles.courseCard,
            opacity: wouldExceedMax ? 0.6 : 1
          }}>
            {wouldExceedMax && (
              <div style={styles.warningBox}>
                Warning: Adding this course would exceed 18 credit limit ({currentScheduledCredits + currentCourse.credits} credits)
              </div>
            )}
            
            <div style={styles.courseHeader}>
              <h3 style={styles.courseId}>{currentCourse.id}</h3>
              <h4 style={styles.courseTitle}>{currentCourse.title}</h4>
              
              <div style={styles.courseBadges}>
                <span style={{...styles.badge, ...getDifficultyStyle(currentCourse.difficulty)}}>
                  {currentCourse.difficulty}
                </span>
                <span style={{...styles.badge, backgroundColor: '#e9d5ff', color: '#7c3aed'}}>
                  {currentCourse.credits} Credits
                </span>
                <span style={{...styles.badge, ...getSchoolStyle(currentCourse.school)}}>
                  {currentCourse.school === 'kelley' ? 'Kelley' : currentCourse.school === 'luddy' ? 'Luddy' : 'General'}
                </span>
              </div>
            </div>
            
            <div style={styles.courseContent}>
              <p style={styles.courseDescription}>{currentCourse.description}</p>
              
              <div style={styles.courseDetails}>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Average GPA:</span>
                  <span style={{...styles.detailValue, color: getGpaColor(currentCourse.avgGpa)}}>
                    {currentCourse.avgGpa}
                  </span>
                </div>
                
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Professor:</span>
                  <span style={styles.detailValue}>{currentCourse.professor}</span>
                </div>
                
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Term:</span>
                  <span style={styles.detailValue}>{currentCourse.term}</span>
                </div>
              </div>
              
              <div style={styles.fulfillsSection}>
                <span style={styles.fulfillsLabel}>Fulfills Requirements:</span>
                <div style={styles.fulfillsBadges}>
                  {currentCourse.fulfills.map(req => (
                    <span key={req} style={styles.fulfillsBadge}>
                      {req}
                    </span>
                  ))}
                </div>
              </div>
              
              {currentCourse.prerequisites.length > 0 && (
                <div style={styles.prereqSection}>
                  <span style={styles.prereqLabel}>Prerequisites:</span>
                  <div style={styles.prereqBadges}>
                    {currentCourse.prerequisites.map(prereq => (
                      <span key={prereq} style={{
                        ...styles.prereqBadge,
                        backgroundColor: (userProfile.completedCourses.includes(prereq) || swipedCourses.some(c => c.id === prereq))
                          ? '#dcfce7' : '#fee2e2',
                        color: (userProfile.completedCourses.includes(prereq) || swipedCourses.some(c => c.id === prereq))
                          ? '#166534' : '#991b1b'
                      }}>
                        {prereq} {(userProfile.completedCourses.includes(prereq) || swipedCourses.some(c => c.id === prereq)) ? '✓' : '✗'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div style={styles.scoreInfo}>
                Match Score: {currentCourse.score}/100 | Course {currentCourseIndex + 1} of {recommendedCourses.length}
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.swipeButtons}>
          <button
            onClick={handleSwipeLeft}
            style={styles.rejectButton}
            title="Skip this course"
          >
            <X style={{width: '32px', height: '32px', color: '#6b7280'}} />
          </button>
          <button
            onClick={handleSwipeRight}
            style={{
              ...styles.acceptButton,
              opacity: wouldExceedMax ? 0.5 : 1,
              cursor: wouldExceedMax ? 'not-allowed' : 'pointer'
            }}
            title={wouldExceedMax ? "Would exceed credit limit" : "Add to schedule"}
            disabled={wouldExceedMax}
          >
            <Heart style={{width: '32px', height: '32px', color: 'white'}} />
          </button>
        </div>
      </div>
    );
  };

  const CalendarTab = () => {
    // Calendar implementation remains the same but uses regular CSS
    const generateWeeklySchedule = () => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const times = [
        '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
      ];
      
      const schedule = {};
      
      swipedCourses.forEach(course => {
        if (course.meetingTimes && course.meetingTimes.days) {
          course.meetingTimes.days.forEach(day => {
            if (!schedule[day]) schedule[day] = {};
            
            const startTime = course.meetingTimes.startTime;
            const timeSlot = times.find(time => {
              const courseTime = convertToMinutes(startTime);
              const slotTime = convertToMinutes(time);
              return courseTime >= slotTime && courseTime < slotTime + 60;
            });
            
            if (timeSlot) {
              schedule[day][timeSlot] = {
                ...course,
                actualTime: `${course.meetingTimes.startTime}-${course.meetingTimes.endTime}`,
                location: course.meetingTimes.location
              };
            }
          });
        }
      });
      
      return { days, times, schedule };
    };

    const convertToMinutes = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = (hours === 12 ? 0 : hours) * 60 + (minutes || 0);
      if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
      return totalMinutes;
    };

    const { days, times, schedule } = generateWeeklySchedule();
    const studentIsLuddy = isLuddyStudent();
    
    return (
      <div>
        <div style={styles.calendarHeader}>
          <h2 style={styles.calendarTitle}>Your Course Schedule</h2>
          <div style={styles.totalCredits}>
            Total Credits: {swipedCourses.reduce((total, course) => total + course.credits, 0)}
          </div>
        </div>

        {swipedCourses.length === 0 ? (
          <div style={styles.emptyCalendar}>
            <Calendar style={{width: '64px', height: '64px', color: '#9ca3af', marginBottom: '16px'}} />
            <h3 style={{fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>No courses scheduled yet</h3>
            <p style={{color: '#6b7280'}}>Start swiping to build your schedule!</p>
          </div>
        ) : (
          <>
            <div style={styles.calendarSection}>
              <h3 style={styles.sectionTitle}>Weekly Schedule</h3>
              
              <div style={styles.calendarGrid}>
                <div style={styles.timeHeader}>Time</div>
                
                {days.map(day => (
                  <div key={day} style={{
                    ...styles.dayHeader,
                    backgroundColor: studentIsLuddy ? '#2563eb' : '#dc2626'
                  }}>
                    {day}
                  </div>
                ))}
                
                {times.map(time => (
                  <React.Fragment key={time}>
                    <div style={styles.timeSlot}>
                      {time}
                    </div>
                    
                    {days.map(day => (
                      <div key={`${day}-${time}`} style={styles.scheduleCell}>
                        {schedule[day] && schedule[day][time] ? (
                          <div style={{
                            ...styles.courseBlock,
                            backgroundColor: studentIsLuddy ? '#2563eb' : '#dc2626'
                          }}>
                            <div style={styles.courseBlockId}>
                              {schedule[day][time].id}
                            </div>
                            <div style={styles.courseBlockTime}>
                              {schedule[day][time].actualTime}
                            </div>
                            <div style={styles.courseBlockLocation}>
                              {schedule[day][time].location}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div style={styles.courseListSection}>
              <h3 style={styles.sectionTitle}>Enrolled Courses</h3>
              <div style={styles.courseList}>
                {swipedCourses.map(course => (
                  <div key={course.id} style={{
                    ...styles.courseItem,
                    borderLeftColor: studentIsLuddy ? '#2563eb' : '#dc2626'
                  }}>
                    <div style={styles.courseItemContent}>
                      <h4 style={styles.courseItemTitle}>{course.id}</h4>
                      <p style={styles.courseItemSubtitle}>{course.title}</p>
                      <div style={styles.courseItemInfo}>
                        <span>{course.credits} credits</span>
                        <span>{course.professor}</span>
                        <span>Avg GPA: {course.avgGpa}</span>
                        <span style={{
                          ...styles.courseItemSchool,
                          backgroundColor: course.school === 'kelley' ? '#fee2e2' : course.school === 'luddy' ? '#dbeafe' : '#f3f4f6',
                          color: course.school === 'kelley' ? '#991b1b' : course.school === 'luddy' ? '#1e40af' : '#374151'
                        }}>
                          {course.school === 'kelley' ? 'Kelley' : course.school === 'luddy' ? 'Luddy' : 'General'}
                        </span>
                      </div>
                      {course.meetingTimes && (
                        <div style={styles.meetingInfo}>
                          <span style={styles.meetingLabel}>Meets:</span> {course.meetingTimes.days.join(', ')} | {course.meetingTimes.startTime} - {course.meetingTimes.endTime} | {course.meetingTimes.location}
                        </div>
                      )}
                      <div style={styles.courseFulfills}>
                        {course.fulfills.map(req => (
                          <span key={req} style={{
                            ...styles.fulfillsTag,
                            backgroundColor: studentIsLuddy ? '#dbeafe' : '#fee2e2',
                            color: studentIsLuddy ? '#1e40af' : '#991b1b'
                          }}>
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => removeCourseFromSchedule(course.id)}
                      style={styles.removeCourseButton}
                    >
                      <X style={{width: '20px', height: '20px'}} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const ProgressTab = () => {
    const progress = calculateDetailedProgress();
    const studentIsLuddy = isLuddyStudent();
    
    return (
      <div>
        <h2 style={styles.progressTitle}>Degree Progress</h2>
        
        <div style={styles.overallProgressCard}>
          <div style={styles.progressHeader}>
            <div>
              <h3 style={styles.progressCardTitle}>Overall Progress</h3>
              <p style={styles.progressCardSubtitle}>{studentIsLuddy ? 'Luddy School' : 'Kelley School'} - {userProfile.major}</p>
            </div>
            <span style={{
              ...styles.progressPercentage,
              color: studentIsLuddy ? '#2563eb' : '#dc2626'
            }}>
              {progress.percentage.toFixed(1)}%
            </span>
          </div>
          
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${progress.percentage}%`,
                backgroundColor: studentIsLuddy ? '#2563eb' : '#dc2626'
              }}
            />
          </div>
          
          <div style={styles.progressGrid}>
            <div style={styles.progressStat}>
              <div style={styles.statLabel}>Completed Credits</div>
              <div style={styles.statValue}>{progress.completedCredits}</div>
            </div>
            <div style={styles.progressStat}>
              <div style={styles.statLabel}>Scheduled Credits</div>
              <div style={{
                ...styles.statValue,
                color: studentIsLuddy ? '#2563eb' : '#dc2626'
              }}>{progress.scheduledCredits}</div>
            </div>
            <div style={styles.progressStat}>
              <div style={styles.statLabel}>Total Credits</div>
              <div style={{...styles.statValue, color: '#16a34a'}}>{progress.totalCredits}</div>
            </div>
            <div style={styles.progressStat}>
              <div style={styles.statLabel}>Remaining</div>
              <div style={{...styles.statValue, color: '#6b7280'}}>{progress.remainingCredits}</div>
            </div>
          </div>
        </div>

        <div style={styles.requirementsGrid}>
          <div style={styles.requirementsCard}>
            <h3 style={styles.requirementsTitle}>
              {studentIsLuddy ? `${userProfile.major} Requirements` : 'Kelley Degree Requirements'}
            </h3>
            <div style={styles.requirementsList}>
              {studentIsLuddy ? (
                <>
                  <div style={styles.requirementItem}>
                    <div>
                      <div style={styles.requirementName}>Major Courses</div>
                      <div style={styles.requirementDescription}>
                        Core courses in {userProfile.major.split(' ')[0]} 
                      </div>
                    </div>
                    <span style={{
                      ...styles.requirementStatus,
                      color: progress.majorCredits >= progress.majorCreditsRequired ? '#16a34a' : progress.majorCredits > 0 ? '#ca8a04' : '#dc2626'
                    }}>
                      {progress.majorCredits >= progress.majorCreditsRequired ? 'Complete' : `${progress.majorCredits}/${progress.majorCreditsRequired}`}
                    </span>
                  </div>
                  <div style={styles.requirementItem}>
                    <div>
                      <div style={styles.requirementName}>Mathematics & Statistics</div>
                      <div style={styles.requirementDescription}>
                        MATH-M211, STAT-S350, etc.
                      </div>
                    </div>
                    <span style={{
                      ...styles.requirementStatus,
                      color: progress.mathCredits >= progress.mathCreditsRequired ? '#16a34a' : progress.mathCredits > 0 ? '#ca8a04' : '#dc2626'
                    }}>
                      {progress.mathCredits >= progress.mathCreditsRequired ? 'Complete' : `${progress.mathCredits}/${progress.mathCreditsRequired}`}
                    </span>
                  </div>
                  <div style={styles.requirementItem}>
                    <div>
                      <div style={styles.requirementName}>Science Requirements</div>
                      <div style={styles.requirementDescription}>
                        Physics, Chemistry, or Biology
                      </div>
                    </div>
                    <span style={{
                      ...styles.requirementStatus,
                      color: progress.scienceCredits >= progress.scienceCreditsRequired ? '#16a34a' : progress.scienceCredits > 0 ? '#ca8a04' : '#dc2626'
                    }}>
                      {progress.scienceCredits >= progress.scienceCreditsRequired ? 'Complete' : `${progress.scienceCredits}/${progress.scienceCreditsRequired}`}
                    </span>
                  </div>
                  <div style={styles.requirementItem}>
                    <div>
                      <div style={styles.requirementName}>General Education</div>
                      <div style={styles.requirementDescription}>
                        English, Liberal Arts, etc.
                      </div>
                    </div>
                    <span style={{
                      ...styles.requirementStatus,
                      color: progress.genEdCredits >= progress.genEdCreditsRequired ? '#16a34a' : progress.genEdCredits > 0 ? '#ca8a04' : '#dc2626'
                    }}>
                      {progress.genEdCredits >= progress.genEdCreditsRequired ? 'Complete' : `${progress.genEdCredits}/${progress.genEdCreditsRequired}`}
                    </span>
                  </div>
                  <div style={styles.requirementItem}>
                    <div>
                      <div style={styles.requirementName}>Electives</div>
                      <div style={styles.requirementDescription}>
                        Free choice courses
                      </div>
                    </div>
                    <span style={{
                      ...styles.requirementStatus,
                      color: progress.electiveCredits >= progress.electiveCreditsRequired ? '#16a34a' : progress.electiveCredits > 0 ? '#ca8a04' : '#dc2626'
                    }}>
                      {progress.electiveCredits >= progress.electiveCreditsRequired ? 'Complete' : `${progress.electiveCredits}/${progress.electiveCreditsRequired}`}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.requirementItem}>
                    <div>
                      <div style={styles.requirementName}>Business Courses</div>
                      <div style={styles.requirementDescription}>
                        Core business and major courses
                      </div>
                    </div>
                    <span style={{
                      ...styles.requirementStatus,
                      color: progress.businessCredits >= progress.businessCreditsRequired ? '#16a34a' : progress.businessCredits > 0 ? '#ca8a04' : '#dc2626'
                    }}>
                      {progress.businessCredits >= progress.businessCreditsRequired ? 'Complete' : `${progress.businessCredits}/${progress.businessCreditsRequired}`}
                    </span>
                  </div>
                  <div style={styles.requirementItem}>
                    <div>
                      <div style={styles.requirementName}>Major Specialization</div>
                      <div style={styles.requirementDescription}>
                        {userProfile.major} specific courses
                      </div>
                    </div>
                    <span style={{
                      ...styles.requirementStatus,
                      color: progress.majorCredits >= progress.majorCreditsRequired ? '#16a34a' : progress.majorCredits > 0 ? '#ca8a04' : '#dc2626'
                    }}>
                      {progress.majorCredits >= progress.majorCreditsRequired ? 'Complete' : `${progress.majorCredits}/${progress.majorCreditsRequired}`}
                    </span>
                  </div>
                  <div style={styles.requirementItem}>
                    <div>
                      <div style={styles.requirementName}>Math & Economics</div>
                      <div style={styles.requirementDescription}>
                        MATH-M119, ECON-E370, STAT-S300
                      </div>
                    </div>
                    <span style={{
                      ...styles.requirementStatus,
                      color: progress.mathCredits >= progress.mathCreditsRequired ? '#16a34a' : progress.mathCredits > 0 ? '#ca8a04' : '#dc2626'
                    }}>
                      {progress.mathCredits >= progress.mathCreditsRequired ? 'Complete' : `${progress.mathCredits}/${progress.mathCreditsRequired}`}
                    </span>
                  </div>
                  <div style={styles.requirementItem}>
                    <div>
                      <div style={styles.requirementName}>General Education</div>
                      <div style={styles.requirementDescription}>
                        English, Liberal Arts, etc.
                      </div>
                    </div>
                    <span style={{
                      ...styles.requirementStatus,
                      color: progress.genEdCredits >= progress.genEdCreditsRequired ? '#16a34a' : progress.genEdCredits > 0 ? '#ca8a04' : '#dc2626'
                    }}>
                      {progress.genEdCredits >= progress.genEdCreditsRequired ? 'Complete' : `${progress.genEdCredits}/${progress.genEdCreditsRequired}`}
                    </span>
                  </div>
                  <div style={styles.requirementItem}>
                    <div>
                      <div style={styles.requirementName}>I-Core Status</div>
                      <div style={styles.requirementDescription}>
                        Prerequisites completed
                      </div>
                    </div>
                    <span style={{
                      ...styles.requirementStatus,
                      color: progress.icoreComplete ? '#16a34a' : '#dc2626'
                    }}>
                      {progress.icoreComplete ? 'Eligible' : 'Not Ready'}
                    </span>
                  </div>
                  <div style={styles.requirementItem}>
                    <div>
                      <div style={styles.requirementName}>Electives</div>
                      <div style={styles.requirementDescription}>
                        Free choice courses
                      </div>
                    </div>
                    <span style={{
                      ...styles.requirementStatus,
                      color: progress.electiveCredits >= progress.electiveCreditsRequired ? '#16a34a' : progress.electiveCredits > 0 ? '#ca8a04' : '#dc2626'
                    }}>
                      {progress.electiveCredits >= progress.electiveCreditsRequired ? 'Complete' : `${progress.electiveCredits}/${progress.electiveCreditsRequired}`}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={styles.nextStepsCard}>
            <h3 style={styles.requirementsTitle}>Next Steps</h3>
            <div style={styles.nextStepsList}>
              <div style={{
                ...styles.nextStep,
                backgroundColor: progress.percentage < 30 ? '#fef2f2' : '#dbeafe'
              }}>
                <div style={{
                  ...styles.stepIndicator,
                  backgroundColor: progress.percentage < 30 ? '#ef4444' : '#3b82f6'
                }} />
                <div>
                  <div style={styles.stepTitle}>
                    {studentIsLuddy ? (
                      progress.percentage < 25 ? 'Complete Foundation Courses' :
                      progress.percentage < 50 ? 'Build Core Knowledge' :
                      progress.percentage < 75 ? 'Choose Specialization' :
                      'Complete Capstone'
                    ) : (
                      progress.percentage < 15 ? 'Complete Foundation Courses' : 
                      progress.percentage < 30 ? 'Finish I-Core Prerequisites' : 
                      progress.percentage < 60 ? 'Apply to Kelley School' : 
                      'Begin Major Courses'
                    )}
                  </div>
                  <div style={styles.stepDescription}>
                    {studentIsLuddy ? (
                      progress.percentage < 25 ? `Focus on ${userProfile.major.toLowerCase().includes('computer science') ? 'CSCI-C200/211' : userProfile.major.toLowerCase().includes('data science') ? 'INFO-I123, DSCI-D321' : userProfile.major.toLowerCase().includes('informatics') ? 'INFO-I101' : 'ENGR-E101'} and prerequisites` :
                      progress.percentage < 50 ? 'Complete math requirements and core courses' :
                      progress.percentage < 75 ? 'Select concentration and upper-level courses' :
                      'Work on capstone project and remaining electives'
                    ) : (
                      progress.percentage < 15 ? 'Focus on BUS-T175, BUS-C104, and basic requirements' : 
                      progress.percentage < 30 ? 'Complete math, statistics, and remaining prerequisites' : 
                      progress.percentage < 60 ? 'Submit Kelley application with minimum 2.5 GPA' : 
                      'Choose your major concentration and begin specialized courses'
                    )}
                  </div>
                </div>
              </div>
              
              <div style={{
                ...styles.priorityStep,
                borderLeftColor: studentIsLuddy ? '#3b82f6' : '#ef4444'
              }}>
                <div style={styles.stepTitle}>Priority This Semester</div>
                <div style={styles.stepDescription}>
                  {progress.scheduledCredits < 12 ? `Add ${12 - progress.scheduledCredits} more credits to reach full-time status` :
                   progress.scheduledCredits > 15 ? 'Consider reducing course load for better academic performance' :
                   'Perfect course load for academic success'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (currentStep === 'onboarding') {
    return <OnboardingForm />;
  }

  const studentIsLuddy = isLuddyStudent();

  return (
    <div style={styles.appContainer}>
      <div style={{
        ...styles.header,
        backgroundColor: studentIsLuddy ? '#2563eb' : '#dc2626'
      }}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>IU Course Finder</h1>
          <div style={styles.headerUser}>
            <User style={{width: '20px', height: '20px'}} />
            <span style={styles.userName}>{userProfile.name}</span>
            <span style={{
              ...styles.schoolBadge,
              backgroundColor: studentIsLuddy ? '#1d4ed8' : '#b91c1c'
            }}>
              {studentIsLuddy ? 'Luddy' : 'Kelley'}
            </span>
          </div>
        </div>
        
        <div style={styles.tabNavigation}>
          <button
            onClick={() => setActiveTab('swipe')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'swipe' ? styles.activeTab : {})
            }}
          >
            <Heart style={{width: '20px', height: '20px'}} />
            <span>Discover</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'calendar' ? styles.activeTab : {})
            }}
          >
            <Calendar style={{width: '20px', height: '20px'}} />
            <span>Schedule</span>
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'progress' ? styles.activeTab : {})
            }}
          >
            <GraduationCap style={{width: '20px', height: '20px'}} />
            <span>Progress</span>
          </button>
        </div>
      </div>

      <div style={styles.mainContent}>
        {activeTab === 'swipe' && <SwipeTab />}
        {activeTab === 'calendar' && <CalendarTab />}
        {activeTab === 'progress' && <ProgressTab />}
      </div>
    </div>
  );
};

// CSS Styles Object
const styles = {
  // Loading styles
  loadingContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fef2f2 0%, #dbeafe 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingContent: {
    textAlign: 'center'
  },
  loadingIcon: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #dc2626, #2563eb)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px'
  },
  loadingTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '8px'
  },
  loadingText: {
    color: '#6b7280'
  },

  // Onboarding styles
  onboardingContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fef2f2 0%, #dbeafe 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px'
  },
  onboardingCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: '32px',
    maxWidth: '448px',
    width: '100%'
  },
  onboardingHeader: {
    textAlign: 'center',
    marginBottom: '24px'
  },
  onboardingIcon: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #dc2626, #2563eb)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px'
  },
  onboardingTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937'
  },
  onboardingSubtitle: {
    color: '#6b7280',
    marginTop: '8px'
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s'
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '16px',
    backgroundColor: 'white',
    cursor: 'pointer',
    outline: 'none'
  },
  searchContainer: {
    position: 'relative',
    marginBottom: '8px'
  },
  searchIcon: {
    width: '16px',
    height: '16px',
    position: 'absolute',
    left: '12px',
    top: '12px',
    color: '#9ca3af'
  },
  searchInput: {
    width: '100%',
    paddingLeft: '40px',
    paddingRight: '12px',
    paddingTop: '8px',
    paddingBottom: '8px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '16px',
    outline: 'none'
  },
  searchResults: {
    maxHeight: '160px',
    overflowY: 'auto',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    marginBottom: '8px',
    backgroundColor: 'white'
  },
  searchResult: {
    width: '100%',
    textAlign: 'left',
    padding: '12px',
    border: 'none',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'background-color 0.15s'
  },
  searchResultId: {
    fontWeight: '500',
    fontSize: '14px'
  },
  searchResultTitle: {
    fontSize: '12px',
    color: '#6b7280'
  },
  schoolBadge: {
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '4px',
    display: 'inline-block',
    marginTop: '4px'
  },
  noResults: {
    padding: '12px',
    fontSize: '14px',
    color: '#6b7280'
  },
  completedCourses: {
    maxHeight: '128px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  completedCourse: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '6px',
    padding: '12px'
  },
  completedCourseId: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#166534'
  },
  completedCourseTitle: {
    fontSize: '12px',
    color: '#16a34a'
  },
  removeButton: {
    color: '#16a34a',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: '4px'
  },
  startButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #dc2626, #2563eb)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    marginTop: '24px',
    transition: 'background 0.15s'
  },

  // App container styles
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb'
  },
  header: {
    color: 'white',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  headerContent: {
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: '700'
  },
  headerUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  userName: {
    fontSize: '14px'
  },
  tabNavigation: {
    display: 'flex'
  },
  tabButton: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.15s'
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderBottom: '2px solid white'
  },
  mainContent: {
    padding: '16px'
  },

  // Swipe tab styles
  swipeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '60vh'
  },
  swipeHeader: {
    marginBottom: '16px',
    textAlign: 'center'
  },
  swipeTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937'
  },
  swipeInfo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '8px'
  },
  creditsInfo: {
    color: '#6b7280'
  },
  studentBadge: {
    padding: '4px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500'
  },
  warningBadge: {
    padding: '4px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  courseCardContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '32px',
    flex: '1'
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    border: '1px solid #e5e7eb',
    maxWidth: '448px',
    width: '100%'
  },
  warningBox: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#991b1b',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px',
    textAlign: 'center',
    fontSize: '14px'
  },
  courseHeader: {
    textAlign: 'center',
    marginBottom: '16px'
  },
  courseId: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '4px'
  },
  courseTitle: {
    fontSize: '18px',
    color: '#6b7280',
    marginBottom: '12px'
  },
  courseBadges: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px'
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500'
  },
  courseContent: {
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  courseDescription: {
    color: '#374151',
    lineHeight: '1.6'
  },
  courseDetails: {
    backgroundColor: '#f9fafb',
    padding: '12px',
    borderRadius: '6px'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  detailLabel: {
    color: '#6b7280'
  },
  detailValue: {
    fontWeight: '600',
    color: '#1f2937'
  },
  fulfillsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  fulfillsLabel: {
    color: '#6b7280',
    fontWeight: '500'
  },
  fulfillsBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px'
  },
  fulfillsBadge: {
    padding: '4px 8px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500'
  },
  prereqSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  prereqLabel: {
    color: '#6b7280',
    fontWeight: '500'
  },
  prereqBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px'
  },
  prereqBadge: {
    padding: '4px 8px',
    borderRadius: '9999px',
    fontSize: '12px'
  },
  scoreInfo: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '8px',
    borderRadius: '4px'
  },
  swipeButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px'
  },
  rejectButton: {
    width: '64px',
    height: '64px',
    backgroundColor: '#e5e7eb',
    border: 'none',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.15s'
  },
  acceptButton: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #dc2626, #2563eb)',
    border: 'none',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.15s'
  },

  // Empty states
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center'
  },
  emptyIcon: {
    width: '96px',
    height: '96px',
    backgroundColor: '#e5e7eb',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  },
  emptyText: {
    color: '#6b7280',
    marginBottom: '4px'
  },
  emptySubtext: {
    color: '#6b7280'
  },
  resetButton: {
    background: 'linear-gradient(135deg, #dc2626, #2563eb)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    marginTop: '16px'
  },

  // Calendar styles
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  calendarTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937'
  },
  totalCredits: {
    fontSize: '14px',
    color: '#6b7280'
  },
  emptyCalendar: {
    textAlign: 'center',
    padding: '48px'
  },
  calendarSection: {
    marginBottom: '32px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px'
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: '100px repeat(5, 1fr)',
    gap: '1px',
    backgroundColor: '#d1d5db',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  timeHeader: {
    backgroundColor: '#f3f4f6',
    padding: '12px',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '14px'
  },
  dayHeader: {
    color: 'white',
    padding: '12px',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '14px'
  },
  timeSlot: {
    backgroundColor: '#f9fafb',
    padding: '16px',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scheduleCell: {
    backgroundColor: 'white',
    padding: '16px',
    minHeight: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  courseBlock: {
    color: 'white',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '12px',
    textAlign: 'center',
    width: '100%'
  },
  courseBlockId: {
    fontWeight: '600'
  },
  courseBlockTime: {
    fontSize: '10px',
    opacity: 0.9,
    marginTop: '4px'
  },
  courseBlockLocation: {
    fontSize: '10px',
    opacity: 0.8
  },
  courseListSection: {
    marginTop: '32px'
  },
  courseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  courseItem: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    borderLeft: '4px solid'
  },
  courseItemContent: {
    flex: '1'
  },
  courseItemTitle: {
    fontWeight: '600',
    color: '#1f2937'
  },
  courseItemSubtitle: {
    color: '#6b7280',
    fontSize: '14px'
  },
  courseItemInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '8px',
    fontSize: '14px',
    color: '#6b7280'
  },
  courseItemSchool: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px'
  },
  meetingInfo: {
    marginTop: '8px',
    fontSize: '14px',
    color: '#2563eb'
  },
  meetingLabel: {
    fontWeight: '500'
  },
  courseFulfills: {
    marginTop: '8px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px'
  },
  fulfillsTag: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px'
  },
  removeCourseButton: {
    color: '#dc2626',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: '8px',
    marginLeft: '16px'
  },

  // Progress styles
  progressTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '24px'
  },
  overallProgressCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    marginBottom: '24px'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  progressCardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937'
  },
  progressCardSubtitle: {
    fontSize: '14px',
    color: '#6b7280'
  },
  progressPercentage: {
    fontSize: '32px',
    fontWeight: '700'
  },
  progressBar: {
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: '9999px',
    height: '12px',
    marginBottom: '16px'
  },
  progressFill: {
    height: '12px',
    borderRadius: '9999px',
    transition: 'width 0.5s ease-in-out'
  },
  progressGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    fontSize: '14px'
  },
  progressStat: {
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px'
  },
  statLabel: {
    color: '#6b7280'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937'
  },
  requirementsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px'
  },
  requirementsCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '24px'
  },
  requirementsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px'
  },
  requirementsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  requirementItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '6px',
    borderLeft: '4px solid'
  },
  requirementName: {
    fontWeight: '500',
    color: '#374151'
  },
  requirementDescription: {
    fontSize: '12px',
    color: '#6b7280'
  },
  requirementStatus: {
    fontSize: '14px',
    fontWeight: '600'
  },
  nextStepsCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '24px'
  },
  nextStepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  nextStep: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '12px',
    borderRadius: '6px'
  },
  stepIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginTop: '8px',
    marginRight: '12px',
    flexShrink: 0
  },
  stepTitle: {
    fontWeight: '500',
    color: '#1f2937'
  },
  stepDescription: {
    fontSize: '14px',
    color: '#6b7280'
  },
  priorityStep: {
    padding: '12px',
    borderRadius: '6px',
    borderLeft: '4px solid'
  }
};

export default CourseApp;