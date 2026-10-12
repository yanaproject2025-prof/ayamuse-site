/* ==========================================================
   THE MIDNIGHT MASQUERADE — content configuration
   Edit texts, programme, looks and links here.
   No animation code needs to change when this file changes.
   ========================================================== */
window.MASQUERADE = {
  event: {
    name: "The Midnight Masquerade",
    place: "A private palazzo, Italy",
    date: "One night only · as the clock strikes midnight",
    concept: true
  },

  /* Scene 02 — handwritten lines that appear over the sealed envelope */
  invitationLines: [
    "You are cordially invited to",
    "The Midnight Masquerade",
    "An evening of mystery,",
    "elegance & enchantment."
  ],

  /* Scene 03 — dress code chapters */
  looks: [
    { id: "noir",     chapter: "I",   name: "Noir",     video: "assets/portrait-noir.mp4",     poster: "assets/portrait-noir.jpg",
      text: "Black lace, velvet and one diamond at the ear. The oldest secret in the room.",
      alt: "A woman in a black lace mask and sheer embroidered gown looks back over her shoulder in a candlelit ballroom" },
    { id: "crimson",  chapter: "II",  name: "Crimson",  video: "assets/portrait-crimson.mp4",  poster: "assets/portrait-crimson.jpg",
      text: "Sculpted silk the colour of old wine, worn on the candlelit terrace at blue hour.",
      alt: "A woman in a sculptural crimson gown and black mask stands on a stone terrace lined with candles" },
    { id: "ivory",    chapter: "III", name: "Ivory",    video: "assets/portrait-ivory.mp4",    poster: "assets/portrait-ivory.jpg",
      text: "Feathers, pearls and lace, descending the grand staircase between two rivers of candles.",
      alt: "A woman in an ivory feathered gown and pearl lace mask descends a candlelit marble staircase" },
    { id: "sapphire", chapter: "IV",  name: "Sapphire", video: "assets/portrait-sapphire.mp4", poster: "assets/portrait-sapphire.jpg",
      text: "Midnight satin, an open back and a whisper of beading beneath the chandeliers.",
      alt: "A woman in a midnight-blue satin gown with an open back walks past gilded mirrors" },
    { id: "gold",     chapter: "V",   name: "Gold",     video: "assets/portrait-couple.mp4",   poster: "assets/portrait-couple.jpg",
      text: "Two masks, one dance. Embroidered tulle in antique gold against black tailoring.",
      alt: "A masked couple in an embrace, she in gold embroidered tulle, he in a black tuxedo" }
  ],

  /* Scene 05 — programme (times are illustrative and editable) */
  programme: [
    { time: "21:00", title: "Arrival & Welcome",        text: "Candlelit steps, a glass of something cold, and the first masks of the night." },
    { time: "21:45", title: "The First Toast",           text: "The host raises a glass beneath the great chandelier." },
    { time: "22:30", title: "The Masquerade Unveiled",   text: "Every guest becomes a stranger. Every stranger, a story." },
    { time: "23:15", title: "Dancing After Dark",        text: "The orchestra plays; the ballroom forgets the hour." },
    { time: "00:00", title: "The Midnight Moment",       text: "One stroke of the clock. One secret revealed." }
  ],

  /* Scene 07 — the Atelier offer */
  atelier: {
    ctaLabel: "Create Your Event World",
    ctaUrl: "https://ayamuse.com/#contact",
    portfolioUrl: "https://ayamuse.com/#work",
    occasions: ["Weddings", "Milestone birthdays", "Private parties", "Galas", "Brand evenings"]
  }
};
