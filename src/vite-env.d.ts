/// <reference types="vite/client" />
type Song = {
  id: string;
  title: string;
  artist: string;
  image: string;
  url: string;
};

type audioOptions = {
  loop: boolean;
  autoplay: boolean;
};

type PlayerProps = {
  songs: Song[];
  className?: string;
  sliderColor?: string;
  options: audioOptions;
  customComponent?: React.ReactNode;
};
