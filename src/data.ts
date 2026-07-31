import { PersonalizationConfig } from './types';
import photo1 from './assets/photo1.jpeg';
import photo2 from './assets/photo2.jpeg';
import photo3 from './assets/photo3.jpeg';
import photo4 from './assets/photo4.jpeg';
import photo5 from './assets/photo5.jpeg';
import photo6 from './assets/photo6.jpeg';
import voiceNote1 from './assets/voicenote.m4a';

export const INITIAL_CONFIG: PersonalizationConfig = {
  title: "For Akshita",
  subtitle: "19 days. 19 gifts. One reason.",
  
  /* <!-- PERSONALIZE: personal note --> */
  personalNote: `Dearest Akshita,

From the quiet stillness of dawn to the brightest moments we share, every single day with you feels like discovering a new piece of magic in this world. 

These 19 gifts represent nineteen moments, nineteen memories, and nineteen reasons why my heart chose you. As you scroll through these pages crafted just for you, I hope you feel even a fraction of the love, warmth, and joy you bring into my life every single day.

You are my quiet comfort, my loudest laughter, and my favorite place to be.`,

  /* <!-- PERSONALIZE: audio/voicenote.mp3 --> */
  voiceNoteUrl: voiceNote1,

  /* <!-- PERSONALIZE: closing message --> */
  closingMessage: "19 gifts. 19 days. And still not enough ways to show it. Happy Birthday, Akshita.",

  memories: [
    {
      id: "mem-1",
      title: "Your smile",
      /* <!-- PERSONALIZE: memory text --> */
      text: "The way your eyes light up before you even start laughing. It instantly turns my worst days into pure sunshine."
    },
    {
      id: "mem-2",
      title: "The way you talk",
      /* <!-- PERSONALIZE: memory text --> */
      text: "Whether you're passionately explaining the smallest detail of your day or whispering soft secrets, every word you say feels like melody."
    },
    {
      id: "mem-3",
      title: "7 AM tea",
      /* <!-- PERSONALIZE: memory text --> */
      text: "Holding warm cups in the early morning hush, wrapped in blankets, realizing that peace isn't a place — it's sitting right next to you."
    },
    {
      id: "mem-4",
      title: "The walk by the lake in Indore",
      /* <!-- PERSONALIZE: memory text --> */
      text: "Golden hour reflections on the water, cool breezes, and endless conversations about everything and nothing at all."
    },
    {
      id: "mem-5",
      title: "Your hand in mine at the mandir",
      /* <!-- PERSONALIZE: memory text --> */
      text: "The sound of bells ringing, temple fragrance in the air, and the quiet gratitude in my heart for having you by my side."
    },
    {
      id: "mem-6",
      title: "That 2-hour train journey",
      /* <!-- PERSONALIZE: memory text --> */
      text: "Sharing headphones, watching the trees rush past outside the window, wishing the tracks would stretch out forever."
    }
  ],

  photos: [
    {
      id: "photo-1",
      /* <!-- PERSONALIZE: images/photo1.jpg --> */
      url: photo1,
      title: "Unforgettable Sunset",
      /* <!-- PERSONALIZE: caption --> */
      caption: "That serene evening when time stood completely still."
    },
    {
      id: "photo-2",
      /* <!-- PERSONALIZE: images/photo2.jpg --> */
      url: photo2,
      title: "Indore Lake Walk",
      /* <!-- PERSONALIZE: caption --> */
      caption: "Golden light casting soft shadows on our favorite trail."
    },
    {
      id: "photo-3",
      /* <!-- PERSONALIZE: images/photo3.jpg --> */
      url: photo3,
      title: "Subtle Moments",
      /* <!-- PERSONALIZE: caption --> */
      caption: "The spontaneous candid picture where you caught me admiring you."
    },
    {
      id: "photo-4",
      /* <!-- PERSONALIZE: images/photo4.jpg --> */
      url: photo4,
      title: "Celebration Night",
      /* <!-- PERSONALIZE: caption --> */
      caption: "Fairy lights, soft laughter, and the glow in your eyes."
    },
    {
      id: "photo-5",
      /* <!-- PERSONALIZE: images/photo5.jpg --> */
      url: photo5,
      title: "Your Radiance",
      /* <!-- PERSONALIZE: caption --> */
      caption: "You make every backdrop look vibrant effortlessly."
    },
    {
      id: "photo-6",
      /* <!-- PERSONALIZE: images/photo6.jpg --> */
      url: photo6,
      title: "Train Ride Memories",
      /* <!-- PERSONALIZE: caption --> */
      caption: "Window seat views and soft playlists on repeat."
    }
  ]
};
