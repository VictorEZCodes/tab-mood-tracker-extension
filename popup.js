const moodEmojis = {
  positive: '😊',
  negative: '😔',
  neutral: '😐'
};

document.addEventListener('DOMContentLoaded', () => {
  // Get current mood and history
  chrome.storage.local.get(['currentMood', 'currentUrl', 'suggestion', 'moodHistory'], (data) => {
    // Display current mood
    const moodDisplay = document.getElementById('moodDisplay');
    const currentSite = document.getElementById('currentSite');
    const suggestionElement = document.getElementById('suggestion');

    moodDisplay.textContent = moodEmojis[data.currentMood] || '😐';
    currentSite.textContent = new URL(data.currentUrl).hostname;
    suggestionElement.textContent = data.suggestion || 'Welcome to Mood Tracker!';

    // Display mood history
    const historyContainer = document.getElementById('moodHistory');
    const history = data.moodHistory || [];

    historyContainer.innerHTML = history.map(entry => {
      const url = new URL(entry.url).hostname;
      const time = new Date(entry.timestamp).toLocaleTimeString();
      return `
        <div class="history-item">
          <span class="history-emoji">${moodEmojis[entry.mood]}</span>
          <span class="history-url">${url}</span>
          <span class="history-time">${time}</span>
        </div>
      `;
    }).join('');
  });
});