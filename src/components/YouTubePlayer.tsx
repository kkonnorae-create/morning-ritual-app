import React, { useState, useRef, useEffect } from 'react';
import { AudioTrack, AUDIO_TRACKS } from '../data/mockData';
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  Sparkles,
  Link,
  ChevronRight,
  Tv,
  Headphones
} from 'lucide-react';

interface MusicPlayerProps {
  currentTrack: AudioTrack;
  onSelectTrack: (track: AudioTrack) => void;
}

export const YouTubePlayer: React.FC<MusicPlayerProps> = ({ currentTrack, onSelectTrack }) => {
  // 모드: 'audio' (앱 내장 무광고 스트리밍) vs 'youtube' (유튜브 임베드)
  const [playerMode, setPlayerMode] = useState<'audio' | 'youtube'>('audio');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showTrackList, setShowTrackList] = useState<boolean>(false);
  const [customYoutubeUrl, setCustomYoutubeUrl] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 트랙 변경 시 오디오 로드 및 자동 재생 시도
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (playerMode === 'audio' && isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrack]);

  // 오디오 재생/일시정지 토글
  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.warn('Audio play error', e);
          setIsPlaying(false);
        });
    }
  };

  // 유튜브 URL 파싱 헬퍼
  const extractYouTubeId = (url: string): string | null => {
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractYouTubeId(customYoutubeUrl.trim());
    if (!id) {
      alert('올바른 유튜브 링크를 입력해 주세요 (예: https://youtu.be/...)');
      return;
    }
    const custom: AudioTrack = {
      id: 'custom-' + Date.now(),
      title: '내가 등록한 유튜브 음악',
      genre: '사용자 플레이리스트',
      audioUrl: '',
      youtubeId: id,
      description: '직접 입력하신 유튜브 영상입니다.',
    };
    onSelectTrack(custom);
    setPlayerMode('youtube');
    setCustomYoutubeUrl('');
    setShowCustomInput(false);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-stone-200/80 transition-all hover:shadow-md">
      {/* 플레이어 모드 전환 탭 */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => {
              setPlayerMode('audio');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              playerMode === 'audio'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-amber-600" />
            <span>고음질 힐링 오디오</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-semibold">추천</span>
          </button>

          <button
            onClick={() => {
              setPlayerMode('youtube');
              if (audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              playerMode === 'youtube'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-red-600" />
            <span>YouTube 영상</span>
          </button>
        </div>

        <button
          onClick={() => setShowTrackList(!showTrackList)}
          className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-0.5 bg-stone-50 hover:bg-stone-100 px-2.5 py-1.5 rounded-lg transition"
        >
          음악 목록 <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 현재 트랙 정보 */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {currentTrack.genre}
            </span>
          </div>
          <h3 className="text-base font-bold text-stone-900 leading-snug">{currentTrack.title}</h3>
          <p className="text-xs text-stone-500 mt-0.5">{currentTrack.description}</p>
        </div>

        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="text-[11px] text-amber-700 hover:text-amber-900 shrink-0 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/60"
        >
          <Link className="w-3 h-3" />
          <span>내 링크 입력</span>
        </button>
      </div>

      {/* 사용자 지정 유튜브 링크 입력 모달/창 */}
      {showCustomInput && (
        <form onSubmit={handleApplyCustomUrl} className="mb-4 p-3 bg-amber-50/60 rounded-xl border border-amber-200">
          <p className="text-xs font-semibold text-amber-900 mb-1.5">좋아하는 유튜브 음악/명상 영상 링크를 입력하세요</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://youtu.be/... 또는 watch?v=..."
              value={customYoutubeUrl}
              onChange={(e) => setCustomYoutubeUrl(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition"
            >
              적용
            </button>
          </div>
        </form>
      )}

      {/* 모드 1: 앱 내장 고음질 힐링 오디오 플레이어 (0초 딜레이, 100% 무조건 재생 보장) */}
      {playerMode === 'audio' && (
        <div className="bg-gradient-to-br from-amber-50/80 to-stone-100/90 rounded-2xl p-5 border border-amber-200/60 flex flex-col items-center justify-center text-center">
          <audio
            ref={audioRef}
            src={currentTrack.audioUrl}
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          <div className="relative mb-3">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-lg transition-transform ${isPlaying ? 'scale-105 shadow-amber-300/80' : 'hover:scale-105'}`}>
              <button
                onClick={togglePlayAudio}
                className="w-full h-full flex items-center justify-center focus:outline-none"
                title={isPlaying ? '일시정지' : '재생'}
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white ml-1" />}
              </button>
            </div>
            {isPlaying && (
              <span className="absolute -inset-1 rounded-full border-2 border-amber-400 animate-ping opacity-50 pointer-events-none"></span>
            )}
          </div>

          <p className="text-xs font-bold text-stone-800">
            {isPlaying ? '음악이 재생 중입니다' : '재생 버튼을 눌러 아침 명상 음악을 시작하세요'}
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5">
            광고나 영상 차단 없이 브라우저에서 바로 재생됩니다
          </p>
        </div>
      )}

      {/* 모드 2: YouTube 영상 임베드 플레이어 */}
      {playerMode === 'youtube' && (
        <div className="space-y-3">
          <div className="rounded-xl overflow-hidden shadow-inner bg-black aspect-video max-h-56 relative w-full border border-stone-800">
            <iframe
              key={currentTrack.youtubeId}
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${currentTrack.youtubeId}`}
              title={currentTrack.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
            <div className="text-[11px] text-stone-600 leading-tight">
              💡 유튜브 오류가 뜨면 앱에서 바로 열어 백그라운드로 들어보세요.
            </div>
            <a
              href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition shrink-0 shadow-sm"
            >
              <span>YouTube에서 열기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* 다른 추천 트랙 목록 드롭다운 */}
      {showTrackList && (
        <div className="mt-4 pt-3 border-t border-stone-100">
          <p className="text-xs font-semibold text-stone-500 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            추천 아침 사운드 목록
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {AUDIO_TRACKS.map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  onSelectTrack(track);
                  setShowTrackList(false);
                }}
                className={`text-left p-3 rounded-xl border text-xs transition flex flex-col justify-between ${
                  track.id === currentTrack.id
                    ? 'border-amber-400 bg-amber-50/60 font-semibold text-amber-900 shadow-sm'
                    : 'border-stone-100 hover:border-stone-300 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold truncate">{track.title}</span>
                  <span className="text-[10px] text-stone-400 shrink-0 ml-1">{track.genre}</span>
                </div>
                <p className="text-[10px] text-stone-500 mt-1 line-clamp-1">{track.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
