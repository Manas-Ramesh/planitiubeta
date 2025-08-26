// Data processing utilities for Kelley Course App
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
   * Process course data to create enriched course objects
   * @param {Array} courseData - Parsed CSV data from kelley_courses_normalized.csv
   * @param {Object} gradeMap - Grade data map from processGradeData
   * @param {Array} requirementsMap - Requirements mapping from CSV
   * @returns {Array} - Array of enriched course objects
   */
  export const processCourseData = (courseData, gradeMap, requirementsMap) => {
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
      
      // Determine difficulty based on level and GPA
      let difficulty = 'Beginner';
      if (level >= 300 || avgGpa < 2.8) {
        difficulty = 'Advanced';
      } else if (level >= 200 || avgGpa < 3.2) {
        difficulty = 'Intermediate';
      }
      
      return {
        id: courseId,
        title: course.title || extractTitleFromDescription(courseId),
        description: course.description || `Course in ${course.subject} department`,
        credits: course.credits_min || 3,
        avgGpa: avgGpa,
        difficulty: difficulty,
        professor: course.instructor_name || 'TBD',
        fulfills: fulfills.length > 0 ? fulfills : ['General Requirement'],
        prerequisites: extractPrerequisites(course.prereq_text),
        level: level,
        term: course.term || 'Fall 2025',
        subject: course.subject,
        catalogNumber: course.catalog_number
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
    // Simple regex to match course patterns like "BUS-A 100" or "MATH-M 119"
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
   * @param {string} courseId - Course ID like "BUS-A100"
   * @returns {string} - Generated title
   */
  const extractTitleFromDescription = (courseId) => {
    const titleMap = {
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
    
    const subject = courseId.split('-')[0];
    const subjectCode = courseId.includes('-') ? courseId.split('-')[0] + '-' + courseId.split('-')[1][0] : subject;
    
    return titleMap[subjectCode] || titleMap[subject] || 'Business Course';
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
    
    // Major alignment bonus
    if (userProfile.major && course.fulfills.some(req => 
      req.toLowerCase().includes(userProfile.major.toLowerCase())
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
    const totalRequiredCredits = 120; // Standard for Kelley
    
    // Calculate completed credits
    const completedCredits = userProfile.completedCourses.length * 3; // Assuming 3 credits each
    
    // Calculate scheduled credits
    const scheduledCredits = scheduledCourses.reduce((total, course) => total + (course.credits || 3), 0);
    
    const totalCredits = completedCredits + scheduledCredits;
    const percentage = Math.min((totalCredits / totalRequiredCredits) * 100, 100);
    
    return {
      percentage: percentage,
      completedCredits: completedCredits,
      scheduledCredits: scheduledCredits,
      totalCredits: totalCredits,
      remainingCredits: Math.max(totalRequiredCredits - totalCredits, 0),
      onTrack: percentage >= (new Date().getMonth() >= 8 ? 25 : 50) // Rough semester progress
    };
  };