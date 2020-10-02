const rewardMap = {
  "😎": "Sunboy",
  "😁": "Hehe xD",
  "😂": "roflcopter",
  "🤣": "Help! I fell",
  "😃": "Happiest",
  "😄": "Happiester",
};

export default function getEmojiName(emoji: string) {
  return rewardMap[emoji];
}
