// Data processing utilities for Course App
// This file contains functions to process the CSV and JSON data

/**
 * Process the grade distribution CSV to extract course GPA information
 * @param {Array} gradeData - Parsed CSV data from IU_Grade_Distribution_All.csv
 * @returns {Object} - Object with course IDs as keys and average GPA as values
 */
 export const processGradeData = (gradeData) => {
    const courseGpaMap = {};
    
    gradeData.forEach(row => {
      if (row.SUBJECT && row.COURSE && row['AVG SECT GPA'] && row['AVG SECT GPA'] !== 'NR') {
        const courseId = `${row.SUBJECT}-${row.COURSE}`;
        const gpa = parseFloat(row['AVG SECT GPA']);
        
        if (!isNaN(gpa)) {
          if (courseGpaMap[courseId]) {
            // Average multiple sections
            courseGpaMap[courseId] = (courseGpaMap[courseId] + gpa) / 2;
          } else {
            courseGpaMap[courseId] = gpa;
          }
        }
      }
    });
    
    return courseGpaMap;
  };
  
  /**
   * Process Kelley requirements JSON to create a structured requirements map
   * @param {Array} kelleyRequirements - Parsed JSON data from kelley_requirements.json
   * @returns {Object} - Structured requirements by program
   */
  export const processKelleyRequirements = (kelleyRequirements) => {
    const requirementsMap = {};
    
    kelleyRequirements.forEach(req => {
      const programCode = req.program_code;
      
      if (!requirementsMap[programCode]) {
        requirementsMap[programCode] = {
          programName: req.program_name,
          requirements: []
        };
      }
      
      if (req.children && req.children.length > 0) {
        const courses = req.children.map(child => child.ref).filter(Boolean);
        if (courses.length > 0) {
          requirementsMap[programCode].requirements.push({
            id: req.node_id,
            type: req.node_type,
            title: req.title,
            description: req.description,
            courses: courses,
            ruleType: req['rule.type'],
            ruleN: req['rule.n']
          });
        }
      }
    });
    
    return requirementsMap;
  };
  
  /**
   * Process Luddy requirements JSON to create a structured requirements map
   * @param {Array} luddyRequirements - Parsed JSON data from luddy_requirements.json
   * @returns {Object} - Structured requirements by program
   */
  export const processLuddyRequirements = (luddyRequirements) => {
    const requirementsMap = {};
    
    luddyRequirements.forEach(req => {
      const programCode = req.program_code;
      
      if (!requirementsMap[programCode]) {
        requirementsMap[programCode] = {
          programName: req.program_name,
          requirements: []
        };
      }
      
      if (req.children && req.children.length > 0) {
        const courses = req.children.map(child => child.ref).filter(Boolean);
        if (courses.length > 0) {
          requirementsMap[programCode].requirements.push({
            id: req.node_id,
            type: req.node_type,
            title: req.title,
            description: req.description,
            courses: courses,
            ruleType: req['rule.type'],
            ruleN: req['rule.n']
          });
        }
      }
    });
    
    return requirementsMap;
  };
  
  /**
   * Process course data to create enriched course objects
   * @param {Array} courseData - Parsed CSV data from courses_normalized.csv
   * @param {Object} gradeMap - Grade data map from processGradeData
   * @param {Array} requirementsMap - Requirements mapping from CSV
   * @param {string} school - 'kelley' or 'luddy' to determine processing logic
   * @returns {Array} - Array of enriched course objects
   */
  export const processCourseData = (courseData, gradeMap, requirementsMap, school = 'kelley') => {
    return courseData.map(course => {
      const courseId = course.course_id;
      const avgGpa = gradeMap[courseId] || 3.0; // Default GPA if not found
      
      // Extract level from course number
      const catalogNum = course.catalog_number || '';
      const level = parseInt(catalogNum.replace(/\D/g, '')) || 100;
      
      // Find what requirements this course fulfills
      const fulfills = [];
      requirementsMap.forEach(req => {
        if (req.course_id === courseId) {
          fulfills.push(req.group_label || req.program_name);
        }
      });
      
      // Determine difficulty based on level and GPA and school
      let difficulty = 'Beginner';
      if (school === 'luddy') {
        // Luddy courses tend to be more rigorous, especially CS and Engineering
        if (level >= 300 || avgGpa < 2.9) {
          difficulty = 'Advanced';
        } else if (level >= 200 || avgGpa < 3.1) {
          difficulty = 'Intermediate';
        }
      } else {
        // Kelley difficulty mapping
        if (level >= 300 || avgGpa < 2.8) {
          difficulty = 'Advanced';
        } else if (level >= 200 || avgGpa < 3.2) {
          difficulty = 'Intermediate';
        }
      }
      
      return {
        id: courseId,
        title: course.title || extractTitleFromDescription(courseId, school),
        description: course.description || generateDefaultDescription(courseId, school),
        credits: course.credits_min || 3,
        avgGpa: avgGpa,
        difficulty: difficulty,
        professor: course.instructor_name || 'TBD',
        fulfills: fulfills.length > 0 ? fulfills : getDefaultFulfills(courseId, school),
        prerequisites: extractPrerequisites(course.prereq_text),
        level: level,
        term: course.term || 'Fall 2025',
        subject: course.subject,
        catalogNumber: course.catalog_number,
        school: school
      };
    });
  };
  
  /**
   * Extract prerequisites from prerequisite text
   * @param {string} prereqText - Prerequisite text from course data
   * @returns {Array} - Array of prerequisite course IDs
   */
  const extractPrerequisites = (prereqText) => {
    if (!prereqText) return [];
    
    const prerequisites = [];
    // Enhanced regex to match both Kelley and Luddy course patterns
    const coursePattern = /([A-Z]{2,4}-[A-Z]\s*\d{3})/g;
    const matches = prereqText.match(coursePattern);
    
    if (matches) {
      matches.forEach(match => {
        const normalized = match.replace(/\s+/g, '');
        prerequisites.push(normalized);
      });
    }
    
    return prerequisites;
  };
  
  /**
   * Extract title from course ID when title is not available
   * @param {string} courseId - Course ID like "BUS-A100" or "CSCI-C211"
   * @param {string} school - School identifier ('kelley' or 'luddy')
   * @returns {string} - Generated title
   */
  const extractTitleFromDescription = (courseId, school) => {
    const kelleyTitleMap = {
      'BUS-A': 'Accounting',
      'BUS-F': 'Finance',
      'BUS-M': 'Marketing',
      'BUS-P': 'Operations',
      'BUS-Z': 'Management',
      'BUS-K': 'Information Systems',
      'BUS-L': 'Business Law',
      'BUS-G': 'Government & Economics',
      'ECON': 'Economics',
      'MATH': 'Mathematics',
      'ENG': 'English',
      'STAT': 'Statistics'
    };
    
    const luddyTitleMap = {
      'CSCI': 'Computer Science',
      'INFO': 'Informatics',
      'DSCI': 'Data Science',
      'ENGR': 'Engineering',
      'MATH': 'Mathematics',
      'STAT': 'Statistics',
      'PHYS': 'Physics',
      'CHEM': 'Chemistry',
      'BIOL': 'Biology'
    };
    
    const titleMap = school === 'luddy' ? luddyTitleMap : kelleyTitleMap;
    
    const subject = courseId.split('-')[0];
    const subjectCode = courseId.includes('-') ? courseId.split('-')[0] + '-' + courseId.split('-')[1][0] : subject;
    
    return titleMap[subjectCode] || titleMap[subject] || 
           (school === 'luddy' ? 'Luddy Course' : 'Business Course');
  };
  
  /**
   * Generate default description for courses without descriptions
   * @param {string} courseId - Course ID
   * @param {string} school - School identifier
   * @returns {string} - Default description
   */
  const generateDefaultDescription = (courseId, school) => {
    const subject = courseId.split('-')[0];
    const level = parseInt(courseId.match(/\d{3}/)?.[0] || '100');
    
    if (school === 'luddy') {
      const descriptions = {
        'CSCI': 'Computer Science course focusing on computational thinking and programming',
        'INFO': 'Informatics course exploring the intersection of technology and society',
        'DSCI': 'Data Science course covering data analysis and statistical methods',
        'ENGR': 'Engineering course applying scientific principles to solve problems'
      };
      
      const baseDesc = descriptions[subject] || 'Luddy School course';
      
      if (level >= 400) return `Advanced ${baseDesc.toLowerCase()} with specialized applications`;
      if (level >= 300) return `Intermediate ${baseDesc.toLowerCase()} with practical applications`;
      if (level >= 200) return `Foundational ${baseDesc.toLowerCase()} building on core concepts`;
      return `Introduction to ${baseDesc.toLowerCase()}`;
    } else {
      return `Course in ${subject} department focusing on business applications`;
    }
  };
  
  /**
   * Get default fulfills array for courses without explicit requirements
   * @param {string} courseId - Course ID
   * @param {string} school - School identifier
   * @returns {Array} - Default fulfills array
   */
  const getDefaultFulfills = (courseId, school) => {
    const subject = courseId.split('-')[0];
    const level = parseInt(courseId.match(/\d{3}/)?.[0] || '100');
    
    if (school === 'luddy') {
      const luddyFulfills = {
        'CSCI': level >= 300 ? ['CS Core', 'Major Requirement'] : ['CS Foundation'],
        'INFO': level >= 300 ? ['Informatics Core', 'Major Requirement'] : ['Informatics Foundation'],
        'DSCI': level >= 300 ? ['Data Science Core', 'Major Requirement'] : ['Data Science Foundation'],
        'ENGR': level >= 300 ? ['Engineering Core', 'Major Requirement'] : ['Engineering Foundation'],
        'MATH': ['Mathematics Requirement'],
        'STAT': ['Statistics Requirement']
      };
      
      return luddyFulfills[subject] || ['General Requirement'];
    } else {
      return ['General Requirement'];
    }
  };
  
  /**
   * Calculate course recommendation score
   * @param {Object} course - Course object
   * @param {Object} userProfile - User profile with completed courses, GPA, etc.
   * @param {Array} swipedCourses - Already selected courses
   * @param {Array} rejectedCourses - Rejected course IDs
   * @returns {number} - Recommendation score (0-100)
   */
  export const calculateCourseScore = (course, userProfile, swipedCourses = [], rejectedCourses = []) => {
    let score = 50; // Base score
    
    // School-specific adjustments
    const isLuddyStudent = isLuddyMajor(userProfile.major);
    const courseIsLuddy = course.school === 'luddy';
    const courseIsKelley = course.school === 'kelley';
    const isGeneralCourse = course.school === 'general';
    
    // Complete disqualification for cross-school courses
    if (isLuddyStudent && courseIsKelley) {
      return 0; // Luddy students cannot take Kelley courses
    } else if (!isLuddyStudent && courseIsLuddy) {
      return 0; // Kelley students cannot take Luddy courses
    }
    
    // School alignment bonuses
    if (isLuddyStudent && courseIsLuddy) {
      score += 30; // Strong preference for Luddy courses for Luddy students
    } else if (!isLuddyStudent && courseIsKelley) {
      score += 30; // Strong preference for Kelley courses for Kelley students
    } else if (isGeneralCourse) {
      score += 10; // General courses are good for everyone
    }
    
    // GPA difficulty adjustment
    const gpaDiff = course.avgGpa - userProfile.gpa;
    score += (gpaDiff * -10); // Higher course GPA = easier, bonus for lower GPA students
    
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
        score -= 30; // Heavy penalty for unmet prerequisites
      }
    }
    
    // Major alignment bonus - enhanced for Luddy
    if (userProfile.major && course.fulfills.some(req => 
      req.toLowerCase().includes(userProfile.major.toLowerCase()) ||
      (isLuddyStudent && isLuddyCoreRequirement(req, userProfile.major))
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
    
    return Math.max(0, Math.min(100, score));
  };
  
  /**
   * Check if a major is from Luddy school
   * @param {string} major - Major name
   * @returns {boolean} - True if Luddy major
   */
  const isLuddyMajor = (major) => {
    if (!major) return false;
    const luddyMajors = [
      'computer science', 'cs', 'computer science (b.s.)', 'computer science (b.a.)',
      'data science', 'data science (b.s.)',
      'informatics', 'informatics (b.s.)',
      'intelligent systems engineering', 'ise', 'intelligent systems engineering (b.s.e.)'
    ];
    return luddyMajors.some(m => major.toLowerCase().includes(m));
  };
  
  /**
   * Check if a requirement is a Luddy core requirement for the major
   * @param {string} req - Requirement name
   * @param {string} major - Major name
   * @returns {boolean} - True if it's a core requirement
   */
  const isLuddyCoreRequirement = (req, major) => {
    const reqLower = req.toLowerCase();
    const majorLower = major.toLowerCase();
    
    if (majorLower.includes('computer science') || majorLower.includes('cs')) {
      return reqLower.includes('cs core') || reqLower.includes('computer science');
    }
    if (majorLower.includes('data science')) {
      return reqLower.includes('data science core') || reqLower.includes('data science');
    }
    if (majorLower.includes('informatics')) {
      return reqLower.includes('informatics core') || reqLower.includes('informatics');
    }
    if (majorLower.includes('engineering') || majorLower.includes('ise')) {
      return reqLower.includes('engineering core') || reqLower.includes('engineering');
    }
    
    return false;
  };
  
  /**
   * Get recommended courses based on user profile
   * @param {Array} allCourses - All available courses
   * @param {Object} userProfile - User profile
   * @param {Array} swipedCourses - Already selected courses
   * @param {Array} rejectedCourses - Rejected course IDs
   * @param {number} limit - Number of courses to return
   * @returns {Array} - Recommended courses sorted by score
   */
  export const getRecommendedCourses = (allCourses, userProfile, swipedCourses = [], rejectedCourses = [], limit = 10) => {
    return allCourses
      .map(course => ({
        ...course,
        score: calculateCourseScore(course, userProfile, swipedCourses, rejectedCourses)
      }))
      .filter(course => course.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  };
  
  /**
   * Calculate degree progress based on completed and scheduled courses
   * @param {Object} userProfile - User profile
   * @param {Array} scheduledCourses - Courses in schedule
   * @param {Object} requirements - Degree requirements
   * @returns {Object} - Progress information
   */
  export const calculateDegreeProgress = (userProfile, scheduledCourses = [], requirements = {}) => {
    const isLuddy = isLuddyMajor(userProfile.major);
    const totalRequiredCredits = 120; // Standard for both Kelley and Luddy
    
    // Calculate completed credits
    const completedCredits = userProfile.completedCourses.length * 3; // Assuming 3 credits each
    
    // Calculate scheduled credits
    const scheduledCredits = scheduledCourses.reduce((total, course) => total + (course.credits || 3), 0);
    
    const totalCredits = completedCredits + scheduledCredits;
    const percentage = Math.min((totalCredits / totalRequiredCredits) * 100, 100);
    
    // School-specific progress tracking
    let progressMetrics = {
      percentage: percentage,
      completedCredits: completedCredits,
      scheduledCredits: scheduledCredits,
      totalCredits: totalCredits,
      remainingCredits: Math.max(totalRequiredCredits - totalCredits, 0),
      onTrack: percentage >= (new Date().getMonth() >= 8 ? 25 : 50)
    };
    
    if (isLuddy) {
      // Add Luddy-specific metrics
      progressMetrics.majorCredits = calculateMajorCredits(userProfile, scheduledCourses, 'luddy');
      progressMetrics.residencyCredits = calculateResidencyCredits(userProfile, scheduledCourses, 'luddy');
      progressMetrics.capstoneComplete = checkCapstoneComplete(userProfile, scheduledCourses, 'luddy');
    } else {
      // Add Kelley-specific metrics
      progressMetrics.icoreEligible = checkIcoreEligibility(userProfile, scheduledCourses);
      progressMetrics.businessCredits = calculateBusinessCredits(userProfile, scheduledCourses);
    }
    
    return progressMetrics;
  };
  
  /**
   * Calculate major-specific credits completed/scheduled
   */
  const calculateMajorCredits = (userProfile, scheduledCourses, school) => {
    const allCourses = [...userProfile.completedCourses, ...scheduledCourses.map(c => c.id)];
    
    if (school === 'luddy') {
      const majorPrefixes = getMajorPrefixes(userProfile.major);
      return allCourses.filter(courseId => 
        majorPrefixes.some(prefix => courseId.toLowerCase().startsWith(prefix.toLowerCase()))
      ).length * 3; // Assuming 3 credits each
    }
    
    return 0;
  };
  
  /**
   * Get course prefixes for a Luddy major
   */
  const getMajorPrefixes = (major) => {
    const majorLower = major.toLowerCase();
    
    if (majorLower.includes('computer science')) {
      return ['CSCI', 'MATH-M', 'MATH-T'];
    }
    if (majorLower.includes('data science')) {
      return ['DSCI', 'CSCI', 'STAT', 'MATH-E'];
    }
    if (majorLower.includes('informatics')) {
      return ['INFO'];
    }
    if (majorLower.includes('engineering')) {
      return ['ENGR', 'MATH-M', 'PHYS'];
    }
    
    return [];
  };
  
  /**
   * Calculate residency credits (courses taken at IU Bloomington)
   */
  const calculateResidencyCredits = (userProfile, scheduledCourses, school) => {
    // For simplicity, assume all courses in the system are IU Bloomington courses
    return calculateMajorCredits(userProfile, scheduledCourses, school);
  };
  
  /**
   * Check if capstone requirements are complete
   */
  const checkCapstoneComplete = (userProfile, scheduledCourses, school) => {
    const allCourses = [...userProfile.completedCourses, ...scheduledCourses.map(c => c.id)];
    const capstonePatterns = ['Y399', 'Y499', 'D498', 'D499', 'I494', 'I495', 'E490', 'E491'];
    
    return allCourses.some(courseId => 
      capstonePatterns.some(pattern => courseId.includes(pattern))
    );
  };
  
  /**
   * Check I-Core eligibility for Kelley students
   */
  const checkIcoreEligibility = (userProfile, scheduledCourses) => {
    const allCourses = [...userProfile.completedCourses, ...scheduledCourses.map(c => c.id)];
    const icorePrereqs = ['ENG-W131', 'BUS-C104', 'BUS-T175', 'MATH-M119', 'ECON-E370'];
    
    return icorePrereqs.every(prereq => 
      allCourses.some(courseId => courseId.includes(prereq.split('-')[1]))
    );
  };
  
  /**
   * Calculate business credits for Kelley students
   */
  const calculateBusinessCredits = (userProfile, scheduledCourses) => {
    const allCourses = [...userProfile.completedCourses, ...scheduledCourses.map(c => c.id)];
    return allCourses.filter(courseId => courseId.startsWith('BUS')).length * 3;
  };