const STUDY_TIPS_API = 'https://zenquotes.io/api/random';

export interface StudyTip {
  text: string;
  author?: string;
}

export const fetchStudyTip = async (): Promise<StudyTip> => {
  try {
    const response = await fetch(STUDY_TIPS_API);
    const data = await response.json();
    
    if (data && data[0]) {
      return {
        text: data[0].q || 'Stay focused and keep learning!',
        author: data[0].a,
      };
    }
    
    // Fallback tips if API fails
    const fallbackTips = [
      'Break your study sessions into manageable chunks.',
      'Take regular breaks to maintain focus.',
      'Review your notes regularly to reinforce learning.',
      'Stay hydrated and get enough sleep.',
      'Set specific goals for each study session.',
    ];
    
    const randomTip = fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
    return { text: randomTip };
  } catch (error) {
    console.error('Error fetching study tip:', error);
    return {
      text: 'Stay focused and keep learning!',
    };
  }
};

