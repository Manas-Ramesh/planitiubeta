// Advanced course recommendation algorithms for Course App
// Now supports Kelley + Luddy majors in major-alignment scoring

/**
 * Advanced recommendation engine that considers multiple factors
 * @param {Array} courses - All available courses
 * @param {Object} userProfile - { name, major, completedCourses: [ids] }
 * @param {Array} swipedCourses - Courses the user has liked/added
 * @param {Array} rejectedCourses - Course IDs the user rejected
 * @param {Object} gradeData - (optional) grade distribution map
 * @param {Object} requirements - (optional) requirement structures
 * @returns {Array} - Recommended courses with detailed scoring
 */
 export const getAdvancedRecommendations = (
    courses,
    userProfile,
    swipedCourses = [],
    rejectedCourses = [],
    gradeData = {},
    requirements = {}
  ) => {
    return courses
      .filter(c => !rejectedCourses.includes(c.id))
      .map(course => ({
        ...course,
        score: calculateAdvancedScore(course, userProfile, swipedCourses, rejectedCourses, gradeData, requirements),
        scoreBreakdown: getScoreBreakdown(course, userProfile, swipedCourses, rejectedCourses, gradeData, requirements)
      }))
      .sort((a, b) => b.score - a.score);
  };
  
  /**
   * Calculate the overall advanced score for a single course
   */
  const calculateAdvancedScore = (course, userProfile, swipedCourses, rejectedCourses, gradeData, requirements) => {
    // School filtering - immediately return 0 for wrong school courses
    const studentIsLuddy = isLuddyMajor(userProfile.major);
    const courseIsLuddy = course.school === 'luddy';
    const courseIsKelley = course.school === 'kelley';
    const isGeneralCourse = course.school === 'general';
    
    // Complete disqualification for cross-school courses
    if (studentIsLuddy && courseIsKelley) {
      return 0; // Luddy students cannot take Kelley courses
    } else if (!studentIsLuddy && courseIsLuddy) {
      return 0; // Kelley students cannot take Luddy courses
    }
  
    const weights = {
      gpaFitness: 0.25,
      levelProgression: 0.15,
      prerequisites: 0.15,
      majorAlignment: 0.20,
      requirementFulfillment: 0.15,
      courseLoad: 0.05,
      timeConflicts: 0.03,
      diversity: 0.02
    };
  
    let score = 0;
  
    // School alignment bonus
    if (studentIsLuddy && courseIsLuddy) {
      score += 30; // Bonus for Luddy courses for Luddy students
    } else if (!studentIsLuddy && courseIsKelley) {
      score += 30; // Bonus for Kelley courses for Kelley students
    } else if (isGeneralCourse) {
      score += 10; // General courses are good for everyone
    }
  
    // 1) GPA fit (0-100)
    const gpaScore = calculateGpaFitnessScore(course, userProfile, gradeData);
    score += gpaScore * weights.gpaFitness;
  
    // 2) Level progression (0-100)
    const levelScore = calculateLevelProgressionScore(course, userProfile);
    score += levelScore * weights.levelProgression;
  
    // 3) Prerequisites (0-100)
    const prereqScore = calculatePrerequisiteScore(course, userProfile);
    score += prereqScore * weights.prerequisites;
  
    // 4) Major alignment (0-100)
    const majorScore = calculateMajorAlignmentScore(course, userProfile);
    score += majorScore * weights.majorAlignment;
  
    // 5) Requirement fulfillment (0-100)
    const requirementScore = calculateRequirementScore(course, userProfile, requirements);
    score += requirementScore * weights.requirementFulfillment;
  
    // 6) Course load balance (0-100)
    const loadScore = calculateCourseLoadScore(course, swipedCourses);
    score += loadScore * weights.courseLoad;
  
    // 7) Time conflicts (0-100)
    const timeScore = calculateTimeConflictScore(course, swipedCourses);
    score += timeScore * weights.timeConflicts;
  
    // 8) Diversity (0-100)
    const diversityScore = calculateDiversityScore(course, swipedCourses, userProfile);
    score += diversityScore * weights.diversity;
  
    return Math.round(score);
  };
  
  /**
   * Check if a major is from Luddy school
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
   * GPA fitness: prefers courses with historically higher GPAs unless user is very strong
   */
  const calculateGpaFitnessScore = (course, userProfile, gradeData) => {
    const avgGpa = typeof course.avgGpa === 'number'
      ? course.avgGpa
      : (gradeData?.[course.id]?.avgGpa || 3.2);
  
    // Heuristic: if user lists strong completed coursework, reduce dependence on GPA
    const rigorBoost = (userProfile.completedCourses || []).length >= 6 ? 10 : 0;
  
    // Map 2.5-3.9 GPA to 30-95 baseline
    const clamped = Math.max(2.5, Math.min(3.9, avgGpa));
    const base = 30 + ((clamped - 2.5) / (3.9 - 2.5)) * 65;
  
    return Math.max(0, Math.min(100, Math.round(base + rigorBoost)));
  };
  
  /**
   * Level progression: match 100/200/300/400 level to user's current path
   */
  const calculateLevelProgressionScore = (course, userProfile) => {
    const level = course.level || inferLevelFromId(course.id);
    const completed = (userProfile.completedCourses || []).length;
  
    // beginners: prefer 100-200; more experience → okay to climb
    if (completed <= 4) {
      if (level <= 100) return 95;
      if (level <= 200) return 80;
      if (level <= 300) return 55;
      return 35;
    }
  
    if (completed <= 10) {
      if (level <= 200) return 75;
      if (level <= 300) return 85;
      return 60;
    }
  
    // advanced
    if (level >= 300) return 90;
    if (level >= 200) return 75;
    return 65;
  };
  
  const inferLevelFromId = (id = '') => {
    // e.g., BUS-K303 → 300-level, CSCI-C343 → 300-level, INFO-I101 → 100-level
    const m = id.match(/(\d{3})/);
    return m ? parseInt(m[1], 10) : 200;
  };
  
  /**
   * Prerequisites: if user is missing many listed prereqs, score drops
   */
  const calculatePrerequisiteScore = (course, userProfile) => {
    const prereqs = Array.isArray(course.prerequisites) ? course.prerequisites : [];
    if (prereqs.length === 0) return 85;
  
    const completed = new Set(userProfile.completedCourses || []);
    let satisfied = 0;
  
    for (const p of prereqs) {
      // loose match by id prefix (e.g., INFO-I201) or exact
      if ([...completed].some(c => c.toLowerCase().includes(String(p).toLowerCase()))) {
        satisfied++;
      }
    }
  
    const ratio = satisfied / prereqs.length; // 0 → 1
    return Math.round(30 + ratio * 70);
  };
  
  /**
   * Major alignment: adds Luddy majors/subjects mapping
   */
  const calculateMajorAlignmentScore = (course, userProfile) => {
    const major = (userProfile.major || '').toLowerCase();
    if (!major) return 50;
  
    const subject = (course.subject || '').toLowerCase();
    const fulfills = (course.fulfills || []).map(x => String(x).toLowerCase());
  
    // Fast-path: if fulfills mentions major or core words, give strong match
    const coreWords = [
      'major core', 'core', 'foundation', 'prereq', 'icore',
      'cs core', 'informatics core', 'data science core', 'engineering core', 'luddy core'
    ];
    if (fulfills.some(f => f.includes(major) || coreWords.some(w => f.includes(w)))) {
      return 95;
    }
  
    // Subject prefix mapping
    const map = {
      // Kelley
      'accounting': ['bus-a', 'acct', 'accounting'],
      'finance': ['bus-f', 'fin', 'finance', 'econ'],
      'marketing': ['bus-m', 'mkt', 'marketing'],
      'management': ['bus-z', 'bus-w', 'mgmt', 'management', 'org'],
      'information systems': ['bus-s', 'bus-k', 'info systems', 'is', 'k'],
      'supply chain management': ['bus-p', 'ops', 'supply', 'logistics'],
      'business analytics': ['bus-k', 'k', 'stat', 'analytics', 'ds'],
  
      // Luddy
      'computer science': ['csci', 'c', 'p'],
      'computer science (b.s.)': ['csci', 'c', 'p'],
      'computer science (b.a.)': ['csci', 'c', 'p'],
      'data science': ['dsci', 'stat', 'csci', 'info-i', 'math-e'],
      'data science (b.s.)': ['dsci', 'stat', 'csci', 'info-i', 'math-e'],
      'informatics': ['info-i', 'info'],
      'informatics (b.s.)': ['info-i', 'info'],
      'intelligent systems engineering': ['engr-e', 'engr'],
      'intelligent systems engineering (b.s.e.)': ['engr-e', 'engr']
    };
  
    // try exact major keys first
    const key = Object.keys(map).find(k => major.includes(k));
    if (key) {
      if (startsWithAny(subject, map[key])) return 85;
    } else {
      // fallbacks: if user put something like "CS (B.S.)" we still detect keywords
      if (major.includes('computer') || major.includes('cs')) {
        if (startsWithAny(subject, map['computer science'])) return 85;
      }
      if (major.includes('data')) {
        if (startsWithAny(subject, map['data science'])) return 80;
      }
      if (major.includes('informatic')) {
        if (startsWithAny(subject, map['informatics'])) return 80;
      }
      if (major.includes('engineering') || major.includes('intelligent')) {
        if (startsWithAny(subject, map['intelligent systems engineering'])) return 80;
      }
    }
  
    // still might be relevant if fulfills has any "general/major/prereq/core" hints
    if (fulfills.some(f => ['general', 'prereq', 'core', 'major'].some(w => f.includes(w)))) {
      return 65;
    }
  
    return 35;
  };
  
  const startsWithAny = (str, prefixes) => prefixes.some(p => str.startsWith(p));
  
  /**
   * Requirement fulfillment: bump if course hits a critical bucket
   */
  const calculateRequirementScore = (course, userProfile, requirements) => {
    if (!course.fulfills || course.fulfills.length === 0) return 30;
  
    const critical = [
      'icore prerequisites', 'major core', 'general education', 
      'cs core', 'informatics core', 'data science core', 'engineering core',
      'luddy core', 'capstone', 'foundation'
    ];
    const courseFulfills = course.fulfills.map(f => String(f).toLowerCase());
  
    // If any fulfill string includes a critical token
    const fulfillsCritical = courseFulfills.some(
      f => critical.some(crit => f.includes(crit))
    );
    if (fulfillsCritical) return 100;
  
    // Otherwise: any requirement still useful
    return 70;
  };
  
  /**
   * Course load: soft-cap around 15 credits
   */
  const calculateCourseLoadScore = (course, swipedCourses) => {
    const total = (swipedCourses || []).reduce((sum, c) => sum + (+c.credits || 3), 0) + (+course.credits || 3);
    if (total <= 12) return 90;
    if (total <= 15) return 85;
    if (total <= 18) return 65;
    return 45; // getting heavy
  };
  
  /**
   * Very light time conflict checker by day/time string overlap (best-effort)
   */
  const calculateTimeConflictScore = (course, swipedCourses) => {
    const mt = normTimes(course.meetingTimes);
    if (!mt) return 80;
  
    for (const c of swipedCourses || []) {
      const other = normTimes(c.meetingTimes);
      if (!other) continue;
      if (overlaps(mt, other)) return 40; // penalty
    }
    return 90;
  };
  
  const normTimes = (mt) => {
    if (!mt || !mt.days || !mt.startTime || !mt.endTime) return null;
    return {
      days: (mt.days || []).map(String),
      start: toMinutes(mt.startTime),
      end: toMinutes(mt.endTime)
    };
  };
  
  const toMinutes = (t = '') => {
    // "8:00 AM" → minutes
    const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!m) return null;
    let h = parseInt(m[1], 10);
    const mins = parseInt(m[2], 10);
    const ampm = m[3].toUpperCase();
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + mins;
  };
  
  const overlaps = (a, b) => {
    // if any day overlaps and time ranges intersect
    const dayOverlap = a.days.some(d => b.days.includes(d));
    const timeOverlap = a.start < b.end && b.start < a.end;
    return dayOverlap && timeOverlap;
  };
  
  /**
   * Diversity: avoid recommending too many from the exact same subject prefix
   */
  const calculateDiversityScore = (course, swipedCourses, userProfile) => {
    const subj = (course.subject || '').toLowerCase();
    const recent = (swipedCourses || []).slice(-4);
    const sameCount = recent.filter(c => (c.subject || '').toLowerCase().startsWith(subj.slice(0, 4))).length;
  
    // 0 same → 100, 1 → 85, 2 → 70, 3+ → 55
    return [100, 85, 70, 55][Math.min(sameCount, 3)];
  };
  
  /**
   * Provide a human-friendly score breakdown for UI
   */
  const getScoreBreakdown = (course, userProfile, swipedCourses, rejectedCourses, gradeData, requirements) => {
    const parts = {
      gpaFitness: calculateGpaFitnessScore(course, userProfile, gradeData),
      levelProgression: calculateLevelProgressionScore(course, userProfile),
      prerequisites: calculatePrerequisiteScore(course, userProfile),
      majorAlignment: calculateMajorAlignmentScore(course, userProfile),
      requirementFulfillment: calculateRequirementScore(course, userProfile, requirements),
      courseLoad: calculateCourseLoadScore(course, swipedCourses),
      timeConflicts: calculateTimeConflictScore(course, swipedCourses),
      diversity: calculateDiversityScore(course, swipedCourses, userProfile)
    };
  
    const weights = {
      gpaFitness: 0.25,
      levelProgression: 0.15,
      prerequisites: 0.15,
      majorAlignment: 0.20,
      requirementFulfillment: 0.15,
      courseLoad: 0.05,
      timeConflicts: 0.03,
      diversity: 0.02
    };
  
    const weighted = Object.entries(parts).reduce((acc, [k, v]) => acc + v * weights[k], 0);
    return { parts, weighted: Math.round(weighted) };
  };
  
  /**
   * Lightweight requirement-driven suggestions
   */
  export const getRequirementBasedRecommendations = (courses, userProfile, requirements = {}) => {
    return (courses || [])
      .map(course => ({
        ...course,
        score: calculateAdvancedScore(course, userProfile, [], [], {}, {})
      }))
      .sort((a, b) => b.score - a.score);
  };
  
  /**
   * Predict course success likelihood (0–100) + qualitative hints
   */
  export const predictCourseSuccess = (course, userProfile, historicalData = {}) => {
    const factors = {
      gpaAlignment: calculateGpaFitnessScore(course, userProfile, {}),
      prerequisitePreparation: calculatePrerequisiteScore(course, userProfile),
      levelAppropriate: calculateLevelProgressionScore(course, userProfile),
      majorRelevance: calculateMajorAlignmentScore(course, userProfile)
    };
  
    // Simple weighted blend
    const successScore =
      Math.round(
        factors.gpaAlignment * 0.3 +
        factors.prerequisitePreparation * 0.25 +
        factors.levelAppropriate * 0.2 +
        factors.majorRelevance * 0.25
      );
  
    return {
      score: successScore,
      factors,
      recommendations: generateSuccessRecommendations(factors, course)
    };
  };
  
  const generateSuccessRecommendations = (factors, course) => {
    const tips = [];
  
    if (factors.prerequisitePreparation < 50) {
      tips.push('You may want to complete prerequisite or foundation courses first.');
    }
    if (factors.gpaAlignment < 55) {
      tips.push('Consider pairing with a historically higher-GPA course to balance difficulty.');
    }
    if (factors.majorRelevance < 50) {
      tips.push('This may not closely align with your major; take it if it meets electives or exploration goals.');
    } else if (factors.majorRelevance >= 80) {
      tips.push('Great alignment with your major\'s core or foundation.');
    }
    if (factors.levelAppropriate < 50) {
      tips.push('Pick a course closer to your current level this term.');
    }
  
    if (tips.length === 0) tips.push('You appear well-prepared for this course!');
    return tips;
  };