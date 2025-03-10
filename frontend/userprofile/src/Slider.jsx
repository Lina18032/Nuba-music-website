import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Howl } from 'howler';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

const tracks = [
  { id: 1, title: 'Track 1', audioSrc: './audios/snowman.mp3',descp:"nti sbabi w sbab blaya",urlimg:'./elements/khaled3.jpeg' },
  { id: 2, title: 'Track 2', audioSrc: './audios/snowman.mp3' ,descp:"bkhata" ,urlimg:'./elements/khaled2.jpeg'},
  { id: 3, title: 'Track 3', audioSrc: './audios/snowman.mp3' ,descp:"aicha",urlimg:'./elements/khaled1.jpeg' },
  { id: 4, title: 'Track 4', audioSrc: './audios/snowman.mp3',descp:"snowman",urlimg:'./elements/snowman.jpeg' },
  { id: 5, title: 'Track 5', audioSrc: './audios/snowman.mp3' ,descp:"lbayda mon amour",urlimg:'./elements/hasni.webp'},
  { id: 6, title: 'Track 6', audioSrc: './audios/snowman.mp3',descp:"look around",urlimg:'./elements/alan.jpeg' },
];

function Slider() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const howlRef = useRef(null);

  const playPauseHandler = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      howlRef.current.pause();
    } else {
      howlRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const trackChangeHandler = (index) => {
    setCurrentTrack(index);
    setIsPlaying(true);

    if (howlRef.current) {
      howlRef.current.stop();
    }

    const sound = new Howl({
      src: [tracks[index].audioSrc],
      onplay: () => {
        setDuration(sound.duration());
      },
      onend: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
      onseek: () => {
        setCurrentTime(sound.seek());
      },
      onstop: () => {
        setCurrentTime(0);
      },
    });

    sound.play();
    howlRef.current = sound;
  };

  const updateTime = () => {
    if (howlRef.current) {
      setCurrentTime(howlRef.current.seek());
    }
  };

  useEffect(() => {
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const seekHandler = (e) => {
    const seekTime = e.target.value;
    setCurrentTime(seekTime);
    if (howlRef.current) {
      howlRef.current.seek(seekTime);
    }
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={1}     
       slidesPerView={3}
      navigation
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
      className='mb-5 p-10 place-items-center'
    >

      {tracks.map((track, index) => (
        <SwiperSlide key={track.id}>
          <div className='border-2 w-60 h-50 p-4 flex flex-col gap-4 hover:shadow-2xl text-white '>
            <img className='h-24' src={track.urlimg} alt="" />
            <p className='text-black font-bold'>{track.title}</p>
            <p>{track.descp}</p>
            <button
              className='rounded-sm bg-blue-500 text-white hover:bg-red-200 hover:border-0'
              onClick={() => trackChangeHandler(index)}
            >
              Play
            </button>
            <FontAwesomeIcon className='cursor-pointer hover:text-red-500' icon={faTrashCan} />
          </div>
        </SwiperSlide>
      ))}
      <div className='mt-7 text-white gap-5 flex flex-col place-items-center'>
        <input className='w-96 h-5' type="range" min="0" max={duration} value={currentTime} onChange={seekHandler} />
        <div>  <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span></div>
       
        <button className='text-black w-32 ' onClick={playPauseHandler}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </Swiper>
  );
}

export default Slider;
