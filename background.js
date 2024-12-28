const moodKeywords = {
  positive: ['happy', 'fun', 'joy', 'laugh', 'smile', 'positive', 'good'],
  negative: ['sad', 'angry', 'depression', 'anxiety', 'stress', 'negative'],
  neutral: ['news', 'weather', 'search', 'mail']
};

const suggestions = {
  positive: [
    "Keep up the good vibes! 🌟",
    "You're browsing happy content! 🎉"
  ],
  negative: [
    "Would you like to listen to some calming music? 🎵",
    "How about checking out some cute animal videos? 🐱",
    "Take a deep breath and try some meditation 🧘‍♀️"
  ],
  neutral: [
    "Hope you're having a good day! ✨",
    "Remember to take breaks between browsing! 💫"
  ]
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    analyzeMood(tab.url);
  }
});

function analyzeMood(url) {
  let mood = 'neutral';
  const urlLower = url.toLowerCase();

  for (const [category, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some(keyword => urlLower.includes(keyword))) {
      mood = category;
      break;
    }
  }

  // Save to history
  saveMoodHistory(mood, url);

  chrome.storage.local.set({
    currentMood: mood,
    currentUrl: url,
    suggestion: suggestions[mood][Math.floor(Math.random() * suggestions[mood].length)]
  });
}

function saveMoodHistory(mood, url) {
  const timestamp = new Date().toISOString();
  chrome.storage.local.get(['moodHistory'], (data) => {
    const history = data.moodHistory || [];
    history.unshift({ mood, url, timestamp }); // Add to beginning of array
    // Keep last 10 entries
    if (history.length > 10) history.pop();
    chrome.storage.local.set({ moodHistory: history });
  });
}