const rewardMap = {
  "😎": "Sunboy",
};

export default function getEmojiName(emoji: string) {
  return rewardMap[emoji];
}
