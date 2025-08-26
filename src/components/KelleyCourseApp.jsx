import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, X, Calendar, BookOpen, GraduationCap, User, Check } from 'lucide-react';

const KelleyCourseApp = () => {
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

  // Sample course data with REAL meeting times from sections data
  const [availableCourses] = useState([
    // TOP PRIORITY - Essential Kelley prerequisites (with actual meeting times)
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
      meetingTimes: {
        days: ['Thursday'],
        startTime: '2:00 PM',
        endTime: '3:15 PM',
        location: 'KMC 2002'
      }
    },
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
      meetingTimes: {
        days: ['Monday', 'Wednesday'],
        startTime: '11:00 AM',
        endTime: '12:15 PM',
        location: 'BH 340'
      }
    },
    {
      id: 'CMLT-C110',
      title: 'Introduction to College Writing',
      description: 'Basic college-level writing skills and composition.',
      credits: 3,
      avgGpa: 3.5,
      difficulty: 'Beginner',
      professor: 'Prof. Martinez',
      fulfills: ['General Education', 'iCore Prerequisites', 'English Composition'],
      prerequisites: [],
      level: 100,
      term: 'Fall 2025',
      priority: 85,
      meetingTimes: {
        days: ['Wednesday'],
        startTime: '12:00 PM',
        endTime: '1:15 PM',
        location: 'BH 245'
      }
    },
    {
      id: 'HPER-P150',
      title: 'Living Well',
      description: 'Health and wellness concepts for lifelong healthy living.',
      credits: 2,
      avgGpa: 3.7,
      difficulty: 'Beginner',
      professor: 'Prof. Health',
      fulfills: ['General Education', 'Health & Wellness'],
      prerequisites: [],
      level: 100,
      term: 'Fall 2025',
      priority: 80,
      meetingTimes: {
        days: ['Friday'],
        startTime: '4:00 PM',
        endTime: '5:15 PM',
        location: 'HPER 112'
      }
    },
    {
      id: 'ECON-B251',
      title: 'Microeconomics',
      description: 'Principles of microeconomic theory and applications.',
      credits: 3,
      avgGpa: 3.0,
      difficulty: 'Intermediate',
      professor: 'Dr. Smith',
      fulfills: ['Economics Requirement', 'Other Required', 'Social & Historical Studies'],
      prerequisites: [],
      level: 200,
      term: 'Fall 2025',
      priority: 55,
      meetingTimes: {
        days: ['Tuesday'],
        startTime: '10:00 AM',
        endTime: '11:15 AM',
        location: 'KMC 3020'
      }
    },
    // Add more courses with meeting times...
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
      meetingTimes: {
        days: ['Monday', 'Wednesday', 'Friday'],
        startTime: '9:00 AM',
        endTime: '9:50 AM',
        location: 'SY 103'
      }
    },
    {
      id: 'BUS-A100',
      title: 'Basic Accounting Skills',
      description: 'Introduction to accounting fundamentals and business applications.',
      credits: 1,
      avgGpa: 3.2,
      difficulty: 'Beginner',
      professor: 'Dr. Smith',
      fulfills: ['Business Foundation'],
      prerequisites: [],
      level: 100,
      term: 'Fall 2025',
      priority: 65,
      meetingTimes: {
        days: ['Tuesday'],
        startTime: '2:30 PM',
        endTime: '3:20 PM',
        location: 'KMC 1010'
      }
    }
  ]);

  // Calculate recommendation score for each course
  const calculateCourseScore = (course) => {
    let score = 50; // Base score
    
    // GPA difficulty adjustment
    const gpaDiff = course.avgGpa - userProfile.gpa;
    score += (gpaDiff * -10); // Higher course GPA = easier, so negative diff should increase score
    
    // Level progression bonus
    const completedLevels = userProfile.completedCourses.map(c => Math.floor(parseInt(c.split('-')[1]?.substring(1) || '0') / 100));
    const maxCompletedLevel = Math.max(...completedLevels, 0);
    const courseLevel = course.level / 100;
    
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
    if (prereqsMet) {
      score += 15;
    } else {
      score -= 30;
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

  const getRecommendedCourses = () => {
    return availableCourses
      .map(course => ({
        ...course,
        score: calculateCourseScore(course)
      }))
      .filter(course => course.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };

  const [recommendedCourses, setRecommendedCourses] = useState([]);

  useEffect(() => {
    if (currentStep === 'app') {
      const newRecommendations = getRecommendedCourses();
      setRecommendedCourses(newRecommendations);
      setCurrentCourseIndex(0);
    }
  }, [currentStep, userProfile, swipedCourses, rejectedCourses]);

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
      // When we run out of courses, generate new recommendations
      const newRecommendations = getRecommendedCourses();
      if (newRecommendations.length > 0) {
        setRecommendedCourses(newRecommendations);
        setCurrentCourseIndex(0);
      }
    }
  };

  const removeCourseFromSchedule = (courseId) => {
    setSwipedCourses(swipedCourses.filter(course => course.id !== courseId));
  };

  const calculateProgress = () => {
    const totalRequiredCredits = 120; // Typical for Kelley
    const completedCredits = userProfile.completedCourses.length * 3; // Assuming 3 credits each
    const scheduledCredits = swipedCourses.reduce((total, course) => total + course.credits, 0);
    const totalCredits = completedCredits + scheduledCredits;
    
    return {
      percentage: Math.min((totalCredits / totalRequiredCredits) * 100, 100),
      completedCredits,
      scheduledCredits,
      totalCredits,
      remainingCredits: Math.max(totalRequiredCredits - totalCredits, 0)
    };
  };

  const OnboardingForm = () => (
    <div className="min-h-screen bg-gradient-red flex items-center justify-center" style={{ padding: '1rem' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">IU Kelley Course Finder</h1>
          <p className="text-gray-600 mt-2">Let's find your perfect courses!</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
              className="form-input"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
            <select
              value={userProfile.major}
              onChange={(e) => setUserProfile({...userProfile, major: e.target.value})}
              className="form-select"
            >
              <option value="">Select your major</option>
              <option value="Accounting">Accounting</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Management">Management</option>
              <option value="Information Systems">Information Systems</option>
              <option value="Supply Chain">Supply Chain Management</option>
              <option value="Business Analytics">Business Analytics</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current GPA</label>
            <input
              type="number"
              min="0"
              max="4"
              step="0.1"
              value={userProfile.gpa}
              onChange={(e) => setUserProfile({...userProfile, gpa: parseFloat(e.target.value)})}
              className="form-input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Completed Courses</label>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {availableCourses.map(course => (
                <label key={course.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={userProfile.completedCourses.includes(course.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setUserProfile({
                          ...userProfile,
                          completedCourses: [...userProfile.completedCourses, course.id]
                        });
                      } else {
                        setUserProfile({
                          ...userProfile,
                          completedCourses: userProfile.completedCourses.filter(c => c !== course.id)
                        });
                      }
                    }}
                  />
                  <span className="text-sm text-gray-700">{course.id} - {course.title}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setCurrentStep('app')}
          disabled={!userProfile.name || !userProfile.major}
          className="btn btn-primary w-full mt-6"
        >
          Start Finding Courses
        </button>
      </div>
    </div>
  );

  const SwipeTab = () => {
    const currentCourse = recommendedCourses[currentCourseIndex];
    const currentScheduledCredits = swipedCourses.reduce((total, course) => total + course.credits, 0);
    
    if (!currentCourse) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <Check className="w-12 h-12 text-gray-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            {currentScheduledCredits >= 12 ? 'Schedule Complete!' : 'Need More Courses'}
          </h3>
          <p className="text-gray-500 mb-1">
            {currentScheduledCredits >= 12 
              ? `You have ${currentScheduledCredits} credits scheduled - a full course load!` 
              : `You only have ${currentScheduledCredits} credits. You need at least 12 credits.`}
          </p>
          <p className="text-gray-500">
            {currentScheduledCredits >= 12 
              ? 'Check your schedule and degree progress!' 
              : 'Try removing some courses from your rejected list or check your completed courses.'}
          </p>
          {currentScheduledCredits < 12 && (
            <button 
              onClick={() => setRejectedCourses([])}
              className="btn btn-primary mt-4"
            >
              Reset Rejected Courses
            </button>
          )}
        </div>
      );
    }

    const getDifficultyClass = (difficulty) => {
      switch (difficulty) {
        case 'Beginner': return 'badge-green';
        case 'Intermediate': return 'badge-yellow';
        case 'Advanced': return 'badge-red';
        default: return 'badge-gray';
      }
    };

    const getGpaColor = (gpa) => {
      if (gpa >= 3.5) return 'text-green-600';
      if (gpa >= 3.0) return 'text-yellow-600';
      return 'text-red-600';
    };

    const wouldExceedMax = currentScheduledCredits + currentCourse.credits > 18;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <h2 className="text-2xl font-bold text-gray-800">Find Your Perfect Courses</h2>
          <div className="flex justify-center items-center space-x-4 mt-2">
            <p className="text-gray-600">Current Credits: {currentScheduledCredits}/18</p>
            {currentScheduledCredits < 12 && (
              <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                Need {12 - currentScheduledCredits} more credits
              </span>
            )}
            {currentScheduledCredits >= 15 && (
              <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
                Near maximum
              </span>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', flex: 1 }}>
          <div className="card" style={{ maxWidth: '400px', width: '100%', opacity: wouldExceedMax ? 0.6 : 1 }}>
            {wouldExceedMax && (
              <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                ⚠️ Adding this course would exceed 18 credit limit ({currentScheduledCredits + currentCourse.credits} credits)
              </div>
            )}
            
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{currentCourse.id}</h3>
              <h4 className="text-lg text-gray-600 mb-3">{currentCourse.title}</h4>
              
              <div className="flex justify-center space-x-2 mb-4">
                <span className={`badge ${getDifficultyClass(currentCourse.difficulty)}`}>
                  {currentCourse.difficulty}
                </span>
                <span className="badge badge-blue">
                  {currentCourse.credits} Credits
                </span>
              </div>
            </div>
            
            <div className="space-y-4 text-sm">
              <p className="text-gray-700" style={{ lineHeight: '1.6' }}>{currentCourse.description}</p>
              
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Average GPA:</span>
                  <span className={`font-semibold ${getGpaColor(currentCourse.avgGpa)}`}>
                    {currentCourse.avgGpa}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Professor:</span>
                  <span className="font-semibold text-gray-800">{currentCourse.professor}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Term:</span>
                  <span className="font-semibold text-gray-800">{currentCourse.term}</span>
                </div>
              </div>
              
              <div>
                <span className="text-gray-600 block mb-2 font-medium">Fulfills Requirements:</span>
                <div className="flex flex-wrap gap-1">
                  {currentCourse.fulfills.map(req => (
                    <span key={req} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      {req}
                    </span>
                  ))}
                </div>
              </div>
              
              {currentCourse.prerequisites.length > 0 && (
                <div>
                  <span className="text-gray-600 block mb-2 font-medium">Prerequisites:</span>
                  <div className="flex flex-wrap gap-1">
                    {currentCourse.prerequisites.map(prereq => (
                      <span key={prereq} className={`px-3 py-1 rounded-full text-xs ${
                        userProfile.completedCourses.includes(prereq) || swipedCourses.some(c => c.id === prereq)
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {prereq} {userProfile.completedCourses.includes(prereq) || swipedCourses.some(c => c.id === prereq) ? '✓' : '✗'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-center text-xs text-gray-500 mt-4" style={{ padding: '0.5rem', backgroundColor: '#f1f5f9', borderRadius: '0.25rem' }}>
                Match Score: {currentCourse.score}/100 | Course {currentCourseIndex + 1} of {recommendedCourses.length}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-8">
          <button
            onClick={handleSwipeLeft}
            className="btn-round bg-gray-200 hover:bg-gray-300"
            style={{ width: '4rem', height: '4rem' }}
            title="Skip this course"
          >
            <X className="w-8 h-8 text-gray-600" />
          </button>
          <button
            onClick={handleSwipeRight}
            className="btn-round bg-red-600 hover:bg-red-700"
            style={{ width: '4rem', height: '4rem', opacity: wouldExceedMax ? 0.5 : 1 }}
            title={wouldExceedMax ? "Would exceed credit limit" : "Add to schedule"}
            disabled={wouldExceedMax}
          >
            <Heart className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>
    );
  };

  const CalendarTab = () => {
    // Create schedule grid with actual meeting times
    const generateWeeklySchedule = () => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const times = [
        '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
      ];
      
      // Build schedule from actual course meeting times
      const schedule = {};
      
      swipedCourses.forEach(course => {
        if (course.meetingTimes && course.meetingTimes.days) {
          course.meetingTimes.days.forEach(day => {
            if (!schedule[day]) schedule[day] = {};
            
            // Find the time slot that contains the start time
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

    // Helper function to convert time to minutes for comparison
    const convertToMinutes = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = (hours === 12 ? 0 : hours) * 60 + (minutes || 0);
      if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
      return totalMinutes;
    };

    const { days, times, schedule } = generateWeeklySchedule();
    
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className="text-2xl font-bold text-gray-800">Your Course Schedule</h2>
          <div className="text-sm text-gray-600">
            Total Credits: {swipedCourses.reduce((total, course) => total + course.credits, 0)}
          </div>
        </div>

        {swipedCourses.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses scheduled yet</h3>
            <p className="text-gray-500">Start swiping to build your schedule!</p>
          </div>
        ) : (
          <>
            {/* Weekly Calendar View with Real Times */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Schedule</h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '100px repeat(5, 1fr)',
                gap: '1px',
                backgroundColor: '#e5e7eb',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                overflow: 'hidden'
              }}>
                {/* Time column header */}
                <div style={{ 
                  backgroundColor: '#f3f4f6', 
                  padding: '0.75rem 0.5rem', 
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  textAlign: 'center'
                }}>
                  Time
                </div>
                
                {/* Day headers */}
                {days.map(day => (
                  <div key={day} style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '0.75rem 0.5rem',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  }}>
                    {day}
                  </div>
                ))}
                
                {/* Time slots and courses */}
                {times.map(time => (
                  <React.Fragment key={time}>
                    <div style={{
                      backgroundColor: '#f9fafb',
                      padding: '1rem 0.5rem',
                      fontWeight: '500',
                      fontSize: '0.75rem',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {time}
                    </div>
                    
                    {days.map(day => (
                      <div key={`${day}-${time}`} style={{
                        backgroundColor: 'white',
                        padding: '1rem 0.5rem',
                        minHeight: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {schedule[day] && schedule[day][time] ? (
                          <div style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            padding: '0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            textAlign: 'center',
                            width: '100%'
                          }}>
                            <div style={{ fontWeight: '600' }}>
                              {schedule[day][time].id}
                            </div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.9, marginTop: '2px' }}>
                              {schedule[day][time].actualTime}
                            </div>
                            <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>
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

            {/* Course List with Meeting Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Enrolled Courses</h3>
              <div className="space-y-4">
                {swipedCourses.map(course => (
                  <div key={course.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-600">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{course.id}</h4>
                        <p className="text-gray-600 text-sm">{course.title}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{course.credits} credits</span>
                          <span>{course.professor}</span>
                          <span>Avg GPA: {course.avgGpa}</span>
                        </div>
                        {course.meetingTimes && (
                          <div className="mt-2 text-sm text-blue-600">
                            <span className="font-medium">Meets:</span> {course.meetingTimes.days.join(', ')} | {course.meetingTimes.startTime} - {course.meetingTimes.endTime} | {course.meetingTimes.location}
                          </div>
                        )}
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {course.fulfills.map(req => (
                              <span key={req} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeCourseFromSchedule(course.id)}
                        className="text-red-600 hover:text-red-800 ml-4"
                        style={{ padding: '0.5rem' }}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
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
    const progress = calculateProgress();
    
    // Calculate specific requirement completion
    const calculateRequirementProgress = () => {
      const completed = userProfile.completedCourses;
      const scheduled = swipedCourses.map(c => c.id);
      
      // iCore Prerequisites (specific requirements)
      const icorePrereqs = {
        englishComposition: {
          name: 'English Composition',
          required: 1,
          completed: completed.filter(c => ['ENG-W131', 'CMLT-C110', 'ENG-W170', 'ENG-W171'].includes(c)).length,
          scheduled: scheduled.filter(c => ['ENG-W131', 'CMLT-C110', 'ENG-W170', 'ENG-W171'].includes(c)).length,
          courses: ['ENG-W131', 'CMLT-C110', 'ENG-W170', 'ENG-W171']
        },
        mathForBusiness: {
          name: 'Math for Business',
          required: 1,
          completed: completed.filter(c => ['MATH-B110', 'MATH-M119', 'MATH-M211', 'MATH-S211'].includes(c)).length,
          scheduled: scheduled.filter(c => ['MATH-B110', 'MATH-M119', 'MATH-M211', 'MATH-S211'].includes(c)).length,
          courses: ['MATH-B110', 'MATH-M119', 'MATH-M211', 'MATH-S211']
        },
        statistics: {
          name: 'Statistics for Business',
          required: 1,
          completed: completed.filter(c => ['ECON-E370', 'STAT-S301', 'ECON-S370', 'MATH-M365'].includes(c)).length,
          scheduled: scheduled.filter(c => ['ECON-E370', 'STAT-S301', 'ECON-S370', 'MATH-M365'].includes(c)).length,
          courses: ['ECON-E370', 'STAT-S301', 'ECON-S370', 'MATH-M365']
        },
        businessFoundation: {
          name: 'Business Foundation',
          required: 2,
          completed: completed.filter(c => ['BUS-T175', 'BUS-C104'].includes(c)).length,
          scheduled: scheduled.filter(c => ['BUS-T175', 'BUS-C104'].includes(c)).length,
          courses: ['BUS-T175', 'BUS-C104']
        }
      };
      
      // General Education Requirements
      const genEd = {
        naturalScience: {
          name: 'Natural & Mathematical Sciences',
          required: 5, // credits
          completed: completed.filter(c => availableCourses.find(course => 
            course.id === c && course.fulfills.includes('Natural Science')
          )).length * 3, // assuming 3 credits each
          scheduled: scheduled.filter(c => availableCourses.find(course => 
            course.id === c && course.fulfills.includes('Natural Science')
          )).length * 3,
          courses: ['BIOL-L100', 'CHEM-C100', 'PHYS-P100', 'GEOL-G100']
        },
        artsHumanities: {
          name: 'Arts & Humanities',
          required: 6, // credits
          completed: completed.filter(c => availableCourses.find(course => 
            course.id === c && course.fulfills.includes('Arts & Humanities')
          )).length * 3,
          scheduled: scheduled.filter(c => availableCourses.find(course => 
            course.id === c && course.fulfills.includes('Arts & Humanities')
          )).length * 3,
          courses: ['HIST-H105', 'PHIL-P100', 'MUS-M174', 'ART-A100']
        },
        socialHistorical: {
          name: 'Social & Historical Studies',
          required: 6, // credits
          completed: completed.filter(c => availableCourses.find(course => 
            course.id === c && course.fulfills.includes('Social & Historical Studies')
          )).length * 3,
          scheduled: scheduled.filter(c => availableCourses.find(course => 
            course.id === c && course.fulfills.includes('Social & Historical Studies')
          )).length * 3,
          courses: ['PSY-P101', 'SOC-S100', 'POLS-Y103', 'ECON-B251']
        },
        worldLanguage: {
          name: 'World Language & Culture',
          required: 1,
          completed: completed.filter(c => ['SPAN-S100', 'FREN-F100', 'GER-G100'].includes(c)).length,
          scheduled: scheduled.filter(c => ['SPAN-S100', 'FREN-F100', 'GER-G100'].includes(c)).length,
          courses: ['SPAN-S100', 'FREN-F100', 'GER-G100']
        },
        healthWellness: {
          name: 'Health & Wellness',
          required: 1,
          completed: completed.filter(c => ['HPER-P150'].includes(c)).length,
          scheduled: scheduled.filter(c => ['HPER-P150'].includes(c)).length,
          courses: ['HPER-P150']
        }
      };
      
      // Other Required Courses
      const otherRequired = {
        economics: {
          name: 'Economics',
          required: 2,
          completed: completed.filter(c => ['ECON-B251', 'ECON-B252'].includes(c)).length,
          scheduled: scheduled.filter(c => ['ECON-B251', 'ECON-B252'].includes(c)).length,
          courses: ['ECON-B251', 'ECON-B252']
        }
      };
      
      return { icorePrereqs, genEd, otherRequired };
    };

    const { icorePrereqs, genEd, otherRequired } = calculateRequirementProgress();
    
    const getStatusColor = (completed, scheduled, required, isCredits = false) => {
      const total = completed + scheduled;
      if (isCredits) {
        if (total >= required) return 'text-green-600';
        if (total >= required * 0.5) return 'text-yellow-600';
        return 'text-red-600';
      } else {
        if (total >= required) return 'text-green-600';
        if (total > 0) return 'text-yellow-600';
        return 'text-red-600';
      }
    };

    const getStatusText = (completed, scheduled, required, isCredits = false) => {
      const total = completed + scheduled;
      if (isCredits) {
        if (total >= required) return 'Complete';
        return `${total}/${required} credits`;
      } else {
        if (total >= required) return 'Complete';
        return `${total}/${required} courses`;
      }
    };
    
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Degree Progress</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Overall Progress</h3>
            <span className="text-3xl font-bold text-red-600">{progress.percentage.toFixed(1)}%</span>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <div className="text-gray-600">Completed Credits</div>
              <div className="text-2xl font-bold text-gray-800">{progress.completedCredits}</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <div className="text-gray-600">Scheduled Credits</div>
              <div className="text-2xl font-bold text-blue-600">{progress.scheduledCredits}</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <div className="text-gray-600">Total Credits</div>
              <div className="text-2xl font-bold text-green-600">{progress.totalCredits}</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <div className="text-gray-600">Remaining</div>
              <div className="text-2xl font-bold text-red-600">{progress.remainingCredits}</div>
            </div>
          </div>
        </div>

        {/* Detailed Requirements Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          
          {/* iCore Prerequisites */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">iCore Prerequisites</h3>
            <div className="space-y-3">
              {Object.entries(icorePrereqs).map(([key, req]) => (
                <div key={key} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '0.75rem', 
                  backgroundColor: req.completed + req.scheduled >= req.required ? '#f0fdf4' : '#fef3c7', 
                  borderRadius: '0.5rem', 
                  borderLeft: `4px solid ${req.completed + req.scheduled >= req.required ? '#16a34a' : '#f59e0b'}` 
                }}>
                  <div>
                    <div className="font-medium text-gray-700">{req.name}</div>
                    <div className="text-xs text-gray-500">Options: {req.courses.join(', ')}</div>
                  </div>
                  <span className={`text-sm font-semibold ${getStatusColor(req.completed, req.scheduled, req.required)}`}>
                    {getStatusText(req.completed, req.scheduled, req.required)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* General Education */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">General Education</h3>
            <div className="space-y-3">
              {Object.entries(genEd).map(([key, req]) => (
                <div key={key} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '0.75rem', 
                  backgroundColor: req.completed + req.scheduled >= req.required ? '#f0fdf4' : '#fef3c7', 
                  borderRadius: '0.5rem', 
                  borderLeft: `4px solid ${req.completed + req.scheduled >= req.required ? '#16a34a' : '#f59e0b'}` 
                }}>
                  <div>
                    <div className="font-medium text-gray-700">{req.name}</div>
                    <div className="text-xs text-gray-500">
                      {req.courses.slice(0, 3).join(', ')}
                      {req.courses.length > 3 ? ` +${req.courses.length - 3} more` : ''}
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${getStatusColor(req.completed, req.scheduled, req.required, key !== 'worldLanguage' && key !== 'healthWellness')}`}>
                    {getStatusText(req.completed, req.scheduled, req.required, key !== 'worldLanguage' && key !== 'healthWellness')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Other Requirements */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Other Requirements</h3>
            <div className="space-y-3">
              {Object.entries(otherRequired).map(([key, req]) => (
                <div key={key} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '0.75rem', 
                  backgroundColor: req.completed + req.scheduled >= req.required ? '#f0fdf4' : '#fef3c7', 
                  borderRadius: '0.5rem', 
                  borderLeft: `4px solid ${req.completed + req.scheduled >= req.required ? '#16a34a' : '#f59e0b'}` 
                }}>
                  <div>
                    <div className="font-medium text-gray-700">{req.name}</div>
                    <div className="text-xs text-gray-500">Required: {req.courses.join(', ')}</div>
                  </div>
                  <span className={`text-sm font-semibold ${getStatusColor(req.completed, req.scheduled, req.required)}`}>
                    {getStatusText(req.completed, req.scheduled, req.required)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Next Steps</h3>
            <div className="space-y-3">
              <div style={{ display: 'flex', alignItems: 'flex-start', padding: '0.75rem', backgroundColor: progress.percentage < 30 ? '#fef2f2' : '#f8fafc', borderRadius: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: progress.percentage < 30 ? '#dc2626' : '#6b7280', marginTop: '6px', marginRight: '0.75rem', flexShrink: 0 }}></div>
                <div>
                  <div className="font-medium text-gray-800">
                    {progress.percentage < 15 ? 'Complete Foundation Courses' : 
                     progress.percentage < 30 ? 'Finish iCore Prerequisites' : 
                     progress.percentage < 60 ? 'Apply to Kelley School' : 
                     'Begin Major Courses'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {progress.percentage < 15 ? 'Focus on BUS-T175, BUS-C104, and basic requirements' : 
                     progress.percentage < 30 ? 'Complete math, statistics, and remaining prerequisites' : 
                     progress.percentage < 60 ? 'Submit Kelley application with minimum 2.5 GPA' : 
                     'Choose your major concentration and begin specialized courses'}
                  </div>
                </div>
              </div>
              
              <div style={{ padding: '0.75rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', borderLeft: '4px solid #0ea5e9' }}>
                <div className="font-medium text-gray-800">Priority This Semester</div>
                <div className="text-sm text-gray-600 mt-1">
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

  return (
    <div className="app-main">
      {/* Header */}
      <div className="bg-red-600 text-white shadow-lg">
        <div style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="text-xl font-bold">IU Kelley Courses</h1>
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span className="text-sm">{userProfile.name}</span>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            onClick={() => setActiveTab('swipe')}
            className={`nav-item ${activeTab === 'swipe' ? 'active' : ''}`}
          >
            <Heart className="w-5 h-5" />
            <span>Discover</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
          >
            <Calendar className="w-5 h-5" />
            <span>Schedule</span>
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`nav-item ${activeTab === 'progress' ? 'active' : ''}`}
          >
            <GraduationCap className="w-5 h-5" />
            <span>Progress</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="app-content">
        {activeTab === 'swipe' && <SwipeTab />}
        {activeTab === 'calendar' && <CalendarTab />}
        {activeTab === 'progress' && <ProgressTab />}
      </div>
    </div>
  );
};

export default KelleyCourseApp;