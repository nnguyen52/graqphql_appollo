let randomEmotes = [' (•◡•) /', '(͠≖ ͜ʖ͠≖)✌', '( ͡° ͜ʖ ͡°)', '( ͡° 👅 ͡°)', '(°̀ ω ́°)✌'];
export const randomEmote = () => {
  return randomEmotes[(Math.random() * randomEmote.length) | 0];
};
