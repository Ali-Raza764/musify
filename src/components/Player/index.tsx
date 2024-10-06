import { FaPause, FaPlay } from "react-icons/fa";
import { GiNextButton, GiPreviousButton } from "react-icons/gi";
import { AiOutlineShareAlt } from "react-icons/ai";
import { BiShow, BiSolidDownload } from "react-icons/bi";
import { useRef, useState } from "react";
import "./Player.css";

function formatTimeWithHours(seconds: any) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return hours > 0
    ? `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
        remainingSeconds < 10 ? "0" : ""
      }${remainingSeconds}`
    : `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

const Player = ({
  songs,
  sliderColor,
  className,
  options,
  customComponent,
}: PlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(options.autoplay || false);
  const audio = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState("0");
  const [isDragging, setIsDragging] = useState(false);
  const [duration, setDuration] = useState(0); // Add state to track duration
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [modalOPen, setModalOPen] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (audio.current) {
      if (isPlaying) {
        audio.current.pause();
      } else {
        audio.current.play();
      }
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = e.target.value;

    setProgress(newProgress);
    if (!isDragging && audio.current) {
      audio.current.currentTime =
        (parseInt(newProgress) * audio.current.duration) / 100;
    }
  };

  const handleSliderInteractionStart = () => {
    setIsDragging(true);
  };

  const handleSliderInteractionEnd = () => {
    setIsDragging(false);
    if (audio.current) {
      audio.current.currentTime =
        (parseInt(progress) * audio.current.duration) / 100;
    }
  };

  const handleTimeUpdate = () => {
    if (!isDragging && audio.current) {
      setProgress(
        ((audio.current.currentTime / audio.current.duration) * 100).toFixed(0)
      );
    }
  };

  const handleMetadataLoaded = () => {
    if (audio.current) {
      setDuration(audio.current.duration); // Set the duration when metadata is loaded
    }
  };

  const changeSong = (index: number) => {
    const newIndex = currentSongIndex + index;

    if (songs[newIndex]) {
      setCurrentSongIndex(newIndex);
      if (audio.current) {
        audio.current.src = songs[newIndex].url;
        audio.current.play();
      }
    } else {
      setCurrentSongIndex(0);
    }
  };

  if (!songs || songs.length === 0) {
    return <div>No songs available</div>;
  }

  return (
    <div
      className={
        "rounded-xl bg-gray-900 text-white p-3 flex items-center justify-between relative " +
        className
      }
    >
      {/* A modal open button for mobile */}
      <button
        className="absolute -top-5 right-0 bg-black rounded-full p-1 z-50 md:hidden"
        onClick={() => setModalOPen(!modalOPen)}
      >
        <BiShow size={25} className="text-white" />
      </button>
      {/* Song Info */}
      <div className="title flex">
        <img
          src={songs[currentSongIndex].image}
          alt="Img"
          className="h-12 w-12 rounded-md mr-1"
        />
        <div className="flex flex-col">
          <h3 className="md:w-[9vw] line-clamp-1 text-ellipsis font-semibold font-sans">
            {songs[currentSongIndex].title}
          </h3>
          <p className=" md:w-[9vw] line-clamp-1 text-ellipsis text-sm text-gray-400">
            {songs[currentSongIndex].artist}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="controls flex flex-col items-center justify-center md:w-[50%] w-[50%] gap-1">
        <audio
          src={songs[currentSongIndex].url}
          ref={audio}
          preload="auto"
          autoPlay={options.autoplay || true}
          loop={options.loop || false}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onTimeUpdateCapture={handleTimeUpdate}
          onLoadedMetadata={handleMetadataLoaded} // Add event listener for loaded metadata
          onEnded={() => !options?.loop && changeSong(1)}
        ></audio>

        <div className="flex items-center space-x-3">
          <button onClick={() => changeSong(-1)}>
            <GiPreviousButton size={25} />
          </button>
          <button
            onClick={togglePlay}
            className="bg-white rounded-full transition-all duration-300 p-2 flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            {isPlaying ? (
              <FaPause className="text-black" size={20} />
            ) : (
              <FaPlay className="text-black" size={20} />
            )}
          </button>
          <button onClick={() => changeSong(1)}>
            <GiNextButton size={25} />
          </button>
        </div>

        {/* Player whould appear in a modal for mobile devices */}
        <div
          className={`flex md:w-full items-center gap-3 transition-all duration-300 ${
            modalOPen
              ? "absolute -top-20 right-0 left-0 bg-gray-900 rounded-xl p-4 flex-row"
              : "opacity-0 md:opacity-100 transition-transform -translate-y-20 absolute" // Use opacity and translate for a smoother effect
          } md:static`}
        >
          <div className="elapsedtime">
            {formatTimeWithHours(audio?.current?.currentTime || 0)}
          </div>
          <input
            type="range"
            name="slider"
            id="slider"
            min={0}
            max={100}
            step={1}
            value={parseInt(progress) || 0}
            onChange={handleSliderChange}
            onMouseDown={handleSliderInteractionStart}
            onMouseUp={handleSliderInteractionEnd}
            onTouchStart={handleSliderInteractionStart}
            onTouchEnd={handleSliderInteractionEnd}
            className="w-full cursor-pointer mb-1 song-slider"
            style={{
              accentColor: sliderColor || "#1DB954", // Spotify green color for the thumb
              background: `linear-gradient(to right, ${
                sliderColor || "#1DB954"
              } ${progress}%, #535353 ${progress}%)`, // Progress color
              border: "none", // Remove border
              outline: "none", // Remove outline
            }}
          />
          <div className="totaltime">
            {formatTimeWithHours(duration)} {/* Display total duration */}
          </div>
        </div>
      </div>

      {/* Share and Download */}
      <div className="share md:flex items-center space-x-2 hidden">
        {customComponent || (
          <>
            <AiOutlineShareAlt size={30} />
            <BiSolidDownload size={30} />
          </>
        )}
      </div>
    </div>
  );
};

export default Player;
