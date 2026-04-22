import { Track } from './types';

export const GRID_SIZE = 20;
export const CELL_SIZE = 20;
export const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
export const INITIAL_SPEED = 150;

// Using reliable public domain/test audio files as dummy AI generated tracks
export const DUMMY_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Neon Overdrive (AI Gen)',
    artist: 'SynthMind',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12'
  },
  {
    id: 'track-2',
    title: 'Cybernetic Pulse (AI Gen)',
    artist: 'Neural Net',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05'
  },
  {
    id: 'track-3',
    title: 'Digital Horizon (AI Gen)',
    artist: 'Deep Learning',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44'
  }
];
