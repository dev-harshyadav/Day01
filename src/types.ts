export interface MemoryItem {
  id: string;
  title: string;
  text: string; // <!-- PERSONALIZE: memory text -->
  date?: string;
  icon?: string;
}

export interface GalleryPhoto {
  id: string;
  url: string; // <!-- PERSONALIZE: images/photoX.jpg -->
  title: string;
  caption: string; // <!-- PERSONALIZE: caption -->
}

export interface PersonalizationConfig {
  title: string;
  subtitle: string;
  personalNote: string; // <!-- PERSONALIZE: personal note -->
  voiceNoteUrl: string; // <!-- PERSONALIZE: audio/voicenote.mp3 -->
  closingMessage: string; // <!-- PERSONALIZE: closing message -->
  memories: MemoryItem[];
  photos: GalleryPhoto[];
}
