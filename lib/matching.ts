export interface Profile {
  id: string;
  full_name: string;
  bio: string;
  major: string;
  year_of_study: string;
  study_subjects: string[];
  timezone: string;
  interests: string[];
}

export function calculateSimilarityScore(
  profile1: Profile,
  profile2: Profile
): number {
  let score = 0;
  let maxScore = 0;

  // Same major (30 points)
  maxScore += 30;
  if (
    profile1.major.toLowerCase() === profile2.major.toLowerCase()
  ) {
    score += 30;
  }

  // Same year of study (25 points)
  maxScore += 25;
  if (
    profile1.year_of_study.toLowerCase() === profile2.year_of_study.toLowerCase()
  ) {
    score += 25;
  }

  // Shared study subjects (25 points)
  maxScore += 25;
  const sharedSubjects = profile1.study_subjects.filter((subject) =>
    profile2.study_subjects.some(
      (s) => s.toLowerCase() === subject.toLowerCase()
    )
  );
  if (sharedSubjects.length > 0 && profile1.study_subjects.length > 0) {
    const subjectScore =
      (sharedSubjects.length / profile1.study_subjects.length) * 25;
    score += subjectScore;
  }

  // Shared interests (20 points)
  maxScore += 20;
  const sharedInterests = profile1.interests.filter((interest) =>
    profile2.interests.some(
      (i) => i.toLowerCase() === interest.toLowerCase()
    )
  );
  if (sharedInterests.length > 0 && profile1.interests.length > 0) {
    const interestScore =
      (sharedInterests.length / profile1.interests.length) * 20;
    score += interestScore;
  }

  // Similar timezone (5 points)
  maxScore += 5;
  if (
    profile1.timezone.toLowerCase() === profile2.timezone.toLowerCase()
  ) {
    score += 5;
  }

  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  return Math.round(percentage);
}
