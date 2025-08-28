"use client";
import React, { useState, useEffect } from 'react';

const IUCourseMatch = () => {
  // State management
  const [currentUser, setCurrentUser] = useState({});
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [courseRecommendations, setCourseRecommendations] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('courses');
  const [setupPhase, setSetupPhase] = useState('login');
  const [showMajorDropdown, setShowMajorDropdown] = useState(false);
  const [majorSearchTerm, setMajorSearchTerm] = useState('');
  const [gpaInputs, setGpaInputs] = useState([]);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [priorities, setPriorities] = useState([
    { id: 'major_fulfillment', title: 'Major Fulfillment', desc: 'Courses that count toward your degree requirements' },
    { id: 'grade_distribution', title: 'Grade Distribution', desc: 'Classes with high percentage of A grades' },
    { id: 'teacher_rating', title: 'Teacher Quality', desc: 'Instructors with positive student feedback' }
  ]);

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    mainWrapper: {
      minHeight: '100vh',
      background: '#ffffff',
      maxWidth: '1400px',
      margin: '0 auto',
      borderRadius: '24px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
      overflow: 'hidden'
    },
    header: {
      background: 'linear-gradient(135deg, #990000 0%, #cc3333 100%)',
      color: 'white',
      padding: '32px 24px',
      textAlign: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    headerTitle: {
      fontSize: '36px',
      fontWeight: '700',
      margin: '0',
      letterSpacing: '-0.5px'
    },
    headerSubtitle: {
      fontSize: '18px',
      opacity: '0.9',
      marginTop: '8px',
      fontWeight: '400'
    },
    creditCounter: {
      position: 'fixed',
      top: '24px',
      right: '24px',
      background: 'linear-gradient(135deg, #990000 0%, #b91c1c 100%)',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '24px',
      fontWeight: '700',
      zIndex: '100',
      fontSize: '16px',
      boxShadow: '0 4px 12px rgba(153, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)'
    },
    tabNav: {
      display: 'flex',
      background: '#ffffff',
      borderBottom: '1px solid #f1f3f4',
      padding: '0 16px',
      gap: '8px',
      position: 'sticky',
      top: '0',
      zIndex: '40'
    },
    tabBtn: {
      flex: '1',
      padding: '20px 16px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      borderRadius: '16px 16px 0 0',
      color: '#6b7280'
    },
    tabBtnActive: {
      background: 'linear-gradient(135deg, #990000 0%, #b91c1c 100%)',
      color: 'white',
      boxShadow: '0 2px 8px rgba(153, 0, 0, 0.2)'
    },
    tabContent: {
      padding: '40px 32px',
      minHeight: 'calc(100vh - 200px)'
    },
    setupForm: {
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center'
    },
    setupTitle: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#990000',
      marginBottom: '32px'
    },
    setupSubtitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '24px'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px',
      marginBottom: '32px'
    },
    formGroup: {
      marginBottom: '24px',
      textAlign: 'left'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#374151',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '16px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      background: '#ffffff',
      color: '#1f2937'
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#990000',
      boxShadow: '0 0 0 3px rgba(153, 0, 0, 0.1)'
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      background: 'white',
      border: '2px solid #e5e7eb',
      borderTop: 'none',
      borderRadius: '0 0 12px 12px',
      maxHeight: '200px',
      overflowY: 'auto',
      zIndex: '10',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    dropdownOption: {
      padding: '12px 16px',
      cursor: 'pointer',
      borderBottom: '1px solid #f3f4f6',
      fontSize: '14px',
      transition: 'background-color 0.2s ease'
    },
    btn: {
      background: 'linear-gradient(135deg, #990000 0%, #b91c1c 100%)',
      color: 'white',
      border: 'none',
      padding: '16px 32px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      width: '100%',
      boxShadow: '0 4px 12px rgba(153, 0, 0, 0.2)'
    },
    courseCard: {
      background: '#ffffff',
      borderRadius: '24px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)',
      padding: '32px',
      maxWidth: '700px',
      margin: '0 auto',
      border: '1px solid #f3f4f6',
      transition: 'all 0.3s ease'
    },
    courseTitle: {
      color: '#990000',
      marginBottom: '12px',
      fontSize: '28px',
      fontWeight: '700',
      letterSpacing: '-0.3px'
    },
    courseSubtitle: {
      color: '#4b5563',
      marginBottom: '24px',
      fontSize: '20px',
      fontWeight: '500',
      lineHeight: '1.4'
    },
    courseDetails: {
      background: '#f9fafb',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid #e5e7eb',
      marginBottom: '24px'
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px'
    },
    detailItem: {
      margin: '12px 0',
      fontSize: '16px',
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    gpaIndicator: {
      padding: '16px 24px',
      borderRadius: '20px',
      display: 'inline-block',
      fontWeight: '700',
      margin: '20px 0',
      fontSize: '18px',
      color: 'white'
    },
    actionButtons: {
      display: 'flex',
      gap: '16px',
      marginTop: '32px'
    },
    rejectBtn: {
      flex: '1',
      padding: '20px 24px',
      border: 'none',
      borderRadius: '20px',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      boxShadow: '0 6px 16px rgba(239, 68, 68, 0.3)'
    },
    acceptBtn: {
      flex: '1',
      padding: '20px 24px',
      border: 'none',
      borderRadius: '20px',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      boxShadow: '0 6px 16px rgba(16, 185, 129, 0.3)'
    },
    priorityItem: {
      background: '#ffffff',
      border: '2px solid #e5e7eb',
      borderRadius: '16px',
      padding: '24px',
      margin: '16px 0',
      cursor: 'grab',
      transition: 'all 0.2s ease',
      userSelect: 'none',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
    },
    scheduleGrid: {
      display: 'grid',
      gridTemplateColumns: '100px repeat(5, 1fr)',
      gap: '2px',
      background: '#dee2e6',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '32px'
    },
    scheduleHeader: {
      background: '#990000',
      color: 'white',
      padding: '16px 8px',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '14px'
    },
    scheduleCell: {
      background: 'white',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    gpaCard: {
      background: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      padding: '32px',
      border: '1px solid #f3f4f6'
    },
    gpaInput: {
      background: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '12px',
      padding: '20px',
      margin: '12px 0',
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    gpaResult: {
      background: 'linear-gradient(45deg, #990000, #cc3333)',
      color: 'white',
      padding: '24px',
      borderRadius: '16px',
      textAlign: 'center',
      fontSize: '28px',
      fontWeight: 'bold',
      margin: '24px 0'
    },
    requirementSection: {
      border: '1px solid #dee2e6',
      borderRadius: '12px',
      margin: '20px 0',
      overflow: 'hidden',
      background: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
    },
    requirementHeader: {
      background: '#990000',
      color: 'white',
      padding: '20px',
      fontWeight: 'bold',
      fontSize: '18px'
    },
    requirementContent: {
      padding: '20px'
    },
    requirementItem: {
      padding: '12px 0',
      borderBottom: '1px solid #f1f3f4',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '16px'
    },
    swipeHint: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '16px 32px',
      borderRadius: '24px',
      fontSize: '18px',
      fontWeight: '600',
      zIndex: '100',
      backdropFilter: 'blur(10px)',
      transition: 'opacity 0.3s ease',
      opacity: showSwipeHint ? '1' : '0',
      pointerEvents: 'none'
    }
  };

  // Major data
  const LUDDY_MAJORS = [
    'Computer Science (B.S.)',
    'Informatics (B.S.)',
    'Intelligent Systems Engineering (B.S.)',
    'Data Science (B.S.)',
    'Cybersecurity Risk Management (B.S.)',
    'Media Arts and Science (B.S.)',
    'Information and Library Science (B.S.)',
    'Human-Computer Interaction Design (B.S.)',
    'Bioinformatics (B.S.)',
    'Complex Systems (B.S.)'
  ];

  const KELLEY_MAJORS = [
    'Accounting (B.S.)',
    'Business Analytics (B.S.)',
    'Economics (B.S.)',
    'Entrepreneurship & Corporate Innovation (B.S.)',
    'Finance (B.S.)',
    'International Business (B.S.)',
    'Law, Ethics & Decision-Making (Co-major)',
    'Management (B.S.)',
    'Marketing (B.S.)',
    'Operations Management (B.S.)',
    'Real Estate (B.S.)',
    'Supply Chain Management (B.S.)',
    'Sustainable & Responsible Business (Co-major)',
    'Technology Management (B.S.)'
  ];

  const ALL_MAJORS = [...LUDDY_MAJORS, ...KELLEY_MAJORS].sort();

  // Sample course data
  const sampleCourses = [
    {
      code: 'CSCI-A 201',
      title: 'Introduction to Programming I',
      instructor: 'Dr. Smith, John',
      credits: 4,
      gpa_section: 3.2,
      gpa_student: 2.8,
      grades_a_percent: 45,
      building: 'Luddy Hall',
      room: '1106',
      time_slots: ['MWF 10:10-11:00'],
      open_seats: 15,
      total_seats: 25,
      level: 200,
      prereqs: ['MATH-M 119 or equivalent']
    },
    {
      code: 'MATH-M 211',
      title: 'Calculus I',
      instructor: 'Prof. Johnson, Sarah',
      credits: 4,
      gpa_section: 2.9,
      gpa_student: 2.7,
      grades_a_percent: 35,
      building: 'Swain Hall',
      room: 'SW 222',
      time_slots: ['MWF 9:05-9:55'],
      open_seats: 8,
      total_seats: 30,
      level: 200,
      prereqs: ['MATH-M 119 or AP Calculus']
    },
    {
      code: 'INFO-I 101',
      title: 'Introduction to Informatics',
      instructor: 'Dr. Brown, Michael',
      credits: 3,
      gpa_section: 3.4,
      gpa_student: 3.0,
      grades_a_percent: 60,
      building: 'Luddy Hall',
      room: '0112',
      time_slots: ['TR 2:30-3:45'],
      open_seats: 22,
      total_seats: 40,
      level: 100,
      prereqs: ['None']
    },
    {
      code: 'BUS-A 100',
      title: 'Basic Accounting',
      instructor: 'Prof. Davis, Jennifer',
      credits: 3,
      gpa_section: 3.1,
      gpa_student: 2.9,
      grades_a_percent: 42,
      building: 'Kelley School',
      room: 'BU 423',
      time_slots: ['TR 11:15-12:30'],
      open_seats: 12,
      total_seats: 35,
      level: 100,
      prereqs: ['None']
    },
    {
      code: 'ENG-W 131',
      title: 'Elementary Composition',
      instructor: 'Prof. Wilson, Amanda',
      credits: 3,
      gpa_section: 3.0,
      gpa_student: 2.8,
      grades_a_percent: 38,
      building: 'Ballantine Hall',
      room: 'BH 338',
      time_slots: ['MWF 1:25-2:15'],
      open_seats: 5,
      total_seats: 20,
      level: 100,
      prereqs: ['None']
    }
  ];

  // Effects
  useEffect(() => {
    if (setupPhase === 'complete') {
      setCourseRecommendations(sampleCourses);
      setCurrentCardIndex(0);
      setTimeout(() => setShowSwipeHint(true), 1000);
      setTimeout(() => setShowSwipeHint(false), 4000);
    }
  }, [setupPhase]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (activeTab === 'courses' && setupPhase === 'complete') {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          rejectCourse();
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          acceptCourse();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [activeTab, setupPhase, currentCardIndex]);

  // Helper functions
  const filteredMajors = ALL_MAJORS.filter(major => 
    major.toLowerCase().includes(majorSearchTerm.toLowerCase())
  );

  const proceedToProfile = () => {
    const username = document.getElementById('username').value;
    if (!username) {
      alert('Please enter a username');
      return;
    }
    setCurrentUser(prev => ({ ...prev, username }));
    setSetupPhase('profile');
  };

  const proceedToPriorities = () => {
    const major = document.getElementById('majorSearch').value;
    const gradYear = document.getElementById('gradYear').value;
    
    if (!major || !gradYear) {
      alert('Please fill in all required fields');
      return;
    }
    
    setCurrentUser(prev => ({ ...prev, major, gradYear }));
    setSetupPhase('priorities');
  };

  const startCourseRecommendation = () => {
    setSetupPhase('complete');
    setActiveTab('courses');
  };

  const selectMajor = (major) => {
    setMajorSearchTerm(major);
    setCurrentUser(prev => ({ ...prev, major }));
    setShowMajorDropdown(false);
  };

  const rejectCourse = () => {
    if (currentCardIndex < courseRecommendations.length) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const acceptCourse = () => {
    if (currentCardIndex >= courseRecommendations.length) return;
    
    const course = courseRecommendations[currentCardIndex];
    
    if (totalCredits + course.credits > 18) {
      alert('Adding this course would exceed the 18 credit limit!');
      return;
    }
    
    setSelectedCourses(prev => [...prev, course]);
    setTotalCredits(prev => prev + course.credits);
    setCurrentCardIndex(prev => prev + 1);
  };

  const addGPACourse = () => {
    setGpaInputs(prev => [...prev, { id: Date.now(), courseName: '', grade: '', credits: '' }]);
  };

  const updateGPAInput = (id, field, value) => {
    setGpaInputs(prev => prev.map(input => 
      input.id === id ? { ...input, [field]: value } : input
    ));
  };

  const removeGPACourse = (id) => {
    setGpaInputs(prev => prev.filter(input => input.id !== id));
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCreditHours = 0;
    
    gpaInputs.forEach(input => {
      const grade = parseFloat(input.grade);
      const credits = parseFloat(input.credits);
      
      if (!isNaN(grade) && !isNaN(credits)) {
        totalPoints += grade * credits;
        totalCreditHours += credits;
      }
    });
    
    return totalCreditHours > 0 ? (totalPoints / totalCreditHours).toFixed(2) : '0.00';
  };

  // Render current course card
  const renderCurrentCard = () => {
    if (currentCardIndex >= courseRecommendations.length) {
      return (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: '#6b7280' }}>
          <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            All done!
          </h3>
          <p style={{ fontSize: '18px', marginBottom: '16px' }}>
            You've reviewed all recommended courses.
          </p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            <strong>Tip:</strong> Visit your academic advisor to finalize your course registration!
          </p>
        </div>
      );
    }

    const course = courseRecommendations[currentCardIndex];
    const gpaDiff = (course.gpa_section - course.gpa_student).toFixed(2);
    const gpaColor = parseFloat(gpaDiff) > 0 ? '#10b981' : 
                     parseFloat(gpaDiff) < 0 ? '#ef4444' : '#6b7280';

    return (
      <div style={styles.courseCard}>
        <h3 style={styles.courseTitle}>{course.code}</h3>
        <h4 style={styles.courseSubtitle}>{course.title}</h4>
        
        <div style={styles.courseDetails}>
          <div style={styles.detailsGrid}>
            <div style={styles.detailItem}><strong>Instructor:</strong> {course.instructor}</div>
            <div style={styles.detailItem}><strong>Credits:</strong> {course.credits}</div>
            <div style={styles.detailItem}><strong>Location:</strong> {course.building} {course.room}</div>
            <div style={styles.detailItem}><strong>Course Level:</strong> {course.level}-level</div>
            <div style={{ ...styles.detailItem, gridColumn: 'span 2' }}>
              <strong>Prerequisites:</strong> {course.prereqs.join(', ')}
            </div>
          </div>
        </div>
        
        <div style={{ 
          ...styles.gpaIndicator, 
          background: `linear-gradient(135deg, ${gpaColor} 0%, ${gpaColor}dd 100%)`
        }}>
          GPA Impact: {parseFloat(gpaDiff) >= 0 ? '+' : ''}{gpaDiff}
        </div>
        
        <div style={{
          background: '#f3f4f6',
          padding: '16px 20px',
          borderRadius: '12px',
          fontSize: '14px',
          color: '#6b7280',
          margin: '20px 0',
          lineHeight: '1.5',
          borderLeft: '4px solid #d1d5db'
        }}>
          This shows the difference between course GPA ({course.gpa_section}) and average student GPA ({course.gpa_student}). 
          Positive numbers suggest this course typically awards higher grades than students' overall GPAs.
        </div>
        
        <div style={{
          background: '#ffffff',
          padding: '20px',
          borderRadius: '12px',
          margin: '20px 0',
          border: '1px solid #e5e7eb'
        }}>
          <strong style={{ display: 'block', marginBottom: '12px', color: '#374151' }}>Schedule:</strong>
          {course.time_slots.map((slot, index) => (
            <div key={index} style={{ marginBottom: '8px', fontSize: '15px' }}>{slot}</div>
          ))}
          
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <strong style={{ color: '#374151' }}>Availability: </strong>
            <span style={{ color: course.open_seats < 10 ? '#dc3545' : '#28a745' }}>
              {course.open_seats}/{course.total_seats} seats open
              {course.open_seats < 10 ? ' (Limited!)' : ''}
            </span>
            <br />
            <strong style={{ color: '#374151' }}>Grade Distribution:</strong> {course.grades_a_percent}% A grades
          </div>
        </div>
        
        <div style={styles.actionButtons}>
          <button 
            onClick={rejectCourse}
            style={styles.rejectBtn}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Pass
          </button>
          <button 
            onClick={acceptCourse}
            style={styles.acceptBtn}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Add to Schedule
          </button>
        </div>
      </div>
    );
  };

  // Render setup phases
  const renderLogin = () => (
    <div style={styles.setupForm}>
      <h2 style={styles.setupTitle}>Welcome to IU Course Match!</h2>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Username</label>
          <input 
            type="text" 
            id="username"
            style={styles.input}
            placeholder="Enter your IU username"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input 
            type="password" 
            id="password"
            style={styles.input}
            placeholder="Enter your password"
          />
        </div>
        <button 
          onClick={proceedToProfile}
          style={styles.btn}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Log In
        </button>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div style={styles.setupForm}>
      <h3 style={styles.setupSubtitle}>Set Up Your Profile</h3>
      <div style={styles.formGrid}>
        <div>
          <div style={{ ...styles.formGroup, position: 'relative' }}>
            <label style={styles.label}>Major</label>
            <input 
              type="text" 
              id="majorSearch"
              value={majorSearchTerm}
              onChange={(e) => setMajorSearchTerm(e.target.value)}
              onFocus={() => setShowMajorDropdown(true)}
              style={styles.input}
              placeholder="Search for your major..."
            />
            {showMajorDropdown && (
              <div style={styles.dropdown}>
                {filteredMajors.map(major => (
                  <div 
                    key={major}
                    onClick={() => selectMajor(major)}
                    style={styles.dropdownOption}
                    onMouseOver={(e) => e.target.style.background = '#f9fafb'}
                    onMouseOut={(e) => e.target.style.background = 'white'}
                  >
                    {major}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Expected Graduation Year</label>
            <select id="gradYear" style={styles.input}>
              <option value="">Select Year</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
            </select>
          </div>
        </div>

        <div style={{
          background: '#f9fafb',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            AP Credits (Optional)
          </h4>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
            Select any AP exams you've taken:
          </p>
          <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '8px' }}>
            {['Calculus AB', 'Calculus BC', 'Computer Science A', 'English Language', 'Psychology', 'Statistics'].map(exam => (
              <div key={exam} style={{
                display: 'flex',
                alignItems: 'center',
                margin: '12px 0',
                cursor: 'pointer',
                padding: '12px',
                borderRadius: '8px',
                transition: 'background-color 0.2s ease',
                border: '1px solid transparent'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              >
                <input 
                  type="checkbox" 
                  style={{ 
                    marginRight: '12px', 
                    width: '18px', 
                    height: '18px',
                    accentColor: '#990000',
                    cursor: 'pointer'
                  }} 
                />
                <span style={{ fontSize: '15px', color: '#374151', fontWeight: '500' }}>
                  {exam}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <button 
        onClick={proceedToPriorities}
        style={styles.btn}
        onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
      >
        Continue
      </button>
    </div>
  );

  const renderPriorities = () => (
    <div style={styles.setupForm}>
      <h3 style={styles.setupSubtitle}>Rank Your Priorities</h3>
      <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '16px' }}>
        Drag to reorder your preferences for course selection:
      </p>
      
      <div style={{ maxWidth: '600px', margin: '0 auto 32px' }}>
        {priorities.map(priority => (
          <div 
            key={priority.id}
            style={styles.priorityItem}
            onMouseOver={(e) => {
              e.target.style.borderColor = '#990000';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <strong style={{ fontSize: '18px', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
              {priority.title}
            </strong>
            <small style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.4' }}>
              {priority.desc}
            </small>
          </div>
        ))}
      </div>
      
      <button 
        onClick={startCourseRecommendation}
        style={styles.btn}
        onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
      >
        Start Finding Courses!
      </button>
    </div>
  );

  // Main app navigation
  const renderNavigation = () => {
    if (setupPhase !== 'complete') return null;

    return (
      <div style={styles.tabNav}>
        {[
          { id: 'courses', label: 'Courses' },
          { id: 'schedule', label: 'Schedule' },
          { id: 'gpa', label: 'GPA Calc' },
          { id: 'progress', label: 'Progress' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tabBtn,
              ...(activeTab === tab.id ? styles.tabBtnActive : {})
            }}
            onMouseOver={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.background = '#f9fafb';
                e.target.style.color = '#374151';
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.background = 'none';
                e.target.style.color = '#6b7280';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  // Tab content renderers
  const renderCoursesTab = () => (
    <div style={{ position: 'relative', minHeight: '600px' }}>
      <div style={{ padding: '40px 24px' }}>
        {currentCardIndex < courseRecommendations.length ? (
          renderCurrentCard()
        ) : (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <div style={{
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #990000',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 24px'
            }}></div>
            <p style={{ fontSize: '18px', fontWeight: '500', color: '#6b7280' }}>
              Finding perfect courses for you...
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderScheduleTab = () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '32px' }}>
        Your Schedule
      </h3>
      
      <div style={styles.scheduleGrid}>
        <div style={styles.scheduleHeader}>Time</div>
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
          <div key={day} style={styles.scheduleHeader}>{day}</div>
        ))}
        
        {['8:00', '9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00', '5:00'].map(time => (
          <React.Fragment key={time}>
            <div style={styles.scheduleCell}>{time}</div>
            {[0, 1, 2, 3, 4].map(day => (
              <div key={`${time}-${day}`} style={{ ...styles.scheduleCell, height: '80px' }}>
                {/* Course blocks would be rendered here */}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div style={styles.gpaCard}>
        <h4 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
          Enrolled Courses:
        </h4>
        {selectedCourses.length === 0 ? (
          <p style={{ color: '#6b7280', fontStyle: 'italic', fontSize: '16px' }}>
            No courses selected yet. Visit the Courses tab to start adding classes!
          </p>
        ) : (
          <div>
            {selectedCourses.map((course, index) => (
              <div key={index} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                margin: '12px 0',
                background: '#fafafa'
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#1f2937', marginBottom: '8px' }}>
                  {course.code}: {course.title}
                </div>
                <div style={{ color: '#6b7280', marginBottom: '4px' }}>
                  {course.building} {course.room} | {course.instructor} | {course.credits} credits
                </div>
                <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                  {course.time_slots.join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderGPATab = () => (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '32px' }}>
        GPA Calculator
      </h3>
      
      <div style={styles.gpaCard}>
        <div style={{ marginBottom: '24px' }}>
          {gpaInputs.map(input => (
            <div key={input.id} style={styles.gpaInput}>
              <input 
                type="text" 
                placeholder="Course Name"
                value={input.courseName}
                onChange={(e) => updateGPAInput(input.id, 'courseName', e.target.value)}
                style={{ flex: '1', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
              />
              <select 
                value={input.grade}
                onChange={(e) => updateGPAInput(input.id, 'grade', e.target.value)}
                style={{ width: '100px', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
              >
                <option value="">Grade</option>
                <option value="4.0">A+</option>
                <option value="4.0">A</option>
                <option value="3.7">A-</option>
                <option value="3.3">B+</option>
                <option value="3.0">B</option>
                <option value="2.7">B-</option>
                <option value="2.3">C+</option>
                <option value="2.0">C</option>
                <option value="1.7">C-</option>
                <option value="1.0">D</option>
                <option value="0.0">F</option>
              </select>
              <input 
                type="number" 
                placeholder="Credits" 
                min="1" 
                max="6"
                value={input.credits}
                onChange={(e) => updateGPAInput(input.id, 'credits', e.target.value)}
                style={{ width: '100px', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
              />
              <button 
                onClick={() => removeGPACourse(input.id)}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <button 
          onClick={addGPACourse}
          style={styles.btn}
        >
          Add Course
        </button>
        
        <div style={styles.gpaResult}>
          Current GPA: {calculateGPA()}
        </div>
      </div>
    </div>
  );

  const renderProgressTab = () => {
    const requirements = {
      'Core Computer Science': [
        { course: 'CSCI-A 201', title: 'Introduction to Programming I', completed: selectedCourses.some(c => c.code === 'CSCI-A 201'), credits: 4 },
        { course: 'CSCI-A 202', title: 'Introduction to Programming II', completed: false, credits: 4 },
        { course: 'CSCI-C 241', title: 'Discrete Structures', completed: false, credits: 3 },
        { course: 'CSCI-B 351', title: 'Introduction to Systems Programming', completed: false, credits: 3 }
      ],
      'Mathematics': [
        { course: 'MATH-M 211', title: 'Calculus I', completed: selectedCourses.some(c => c.code === 'MATH-M 211'), credits: 4 },
        { course: 'MATH-M 212', title: 'Calculus II', completed: false, credits: 4 },
        { course: 'STAT-S 301', title: 'Applied Statistical Methods', completed: false, credits: 3 }
      ],
      'General Education': [
        { course: 'ENG-W 131', title: 'Elementary Composition', completed: selectedCourses.some(c => c.code === 'ENG-W 131'), credits: 3 },
        { course: 'Cultural Studies', title: 'Cultural Studies Requirement', completed: false, credits: 3 },
        { course: 'Natural Sciences', title: 'Natural Sciences Requirement', completed: false, credits: 6 }
      ]
    };

    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '32px' }}>
          Degree Progress
        </h3>
        
        <div>
          {Object.entries(requirements).map(([category, courses]) => {
            const completedCount = courses.filter(c => c.completed).length;
            const totalCount = courses.length;
            const completedCredits = courses.filter(c => c.completed).reduce((sum, c) => sum + c.credits, 0);
            const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
            
            return (
              <div key={category} style={styles.requirementSection}>
                <div style={styles.requirementHeader}>
                  {category} ({completedCount}/{totalCount} courses, {completedCredits}/{totalCredits} credits)
                </div>
                <div style={styles.requirementContent}>
                  {courses.map(course => (
                    <div key={course.course} style={styles.requirementItem}>
                      <span style={{ color: course.completed ? '#28a745' : '#dc3545', fontWeight: '500' }}>
                        {course.completed ? '✅' : '⏳'} {course.course}: {course.title}
                      </span>
                      <span style={{ color: '#6b7280', fontWeight: '600' }}>{course.credits} cr</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div style={styles.container}>
      <div style={styles.mainWrapper}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>IU Course Match</h1>
          <div style={styles.headerSubtitle}>Find your perfect classes</div>
        </div>
        
        {/* Credit Counter */}
        {setupPhase === 'complete' && (
          <div style={styles.creditCounter}>
            Credits: {totalCredits}/18
          </div>
        )}

        {/* Swipe Hint */}
        <div style={styles.swipeHint}>
          Use arrow keys or A/D keys to swipe!
        </div>

        {/* Navigation */}
        {renderNavigation()}

        {/* Content */}
        <div style={styles.tabContent}>
          {setupPhase === 'login' && renderLogin()}
          {setupPhase === 'profile' && renderProfile()}
          {setupPhase === 'priorities' && renderPriorities()}
          {setupPhase === 'complete' && activeTab === 'courses' && renderCoursesTab()}
          {setupPhase === 'complete' && activeTab === 'schedule' && renderScheduleTab()}
          {setupPhase === 'complete' && activeTab === 'gpa' && renderGPATab()}
          {setupPhase === 'complete' && activeTab === 'progress' && renderProgressTab()}
        </div>
      </div>
      
      {/* Click outside handler for major dropdown */}
      {showMajorDropdown && (
        <div 
          style={{ position: 'fixed', inset: '0', zIndex: '0' }}
          onClick={() => setShowMajorDropdown(false)}
        />
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default IUCourseMatch;