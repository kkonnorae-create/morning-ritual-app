import React, { useState } from 'react';
import { MusicTrack } from '../types';
import { MUSIC_TRACKS } from '../data/mockData';
import { Music, Play, Pause, ChevronRight, ExternalLink, Volume2, Sparkles } from 'lucide-react';

interface YouTubePlayerProps {
  currentTrack: MusicTrack;
  onSelectTrack: (track: MusicTrack) => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ currentTrack, onSelectTrack }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showTrackList, setShowTrackList] = useState<boolean>(false);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-stone-200/80 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
            <Music className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-800 tracking-wider uppercase">오늘의 모닝 사운드</span>
            <span className="ml-2 text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
              {currentTrack.genre}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowTrackList(!showTrackList)}
          className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-0.5 bg-stone-50 hover:bg-stone-100 px-2.5 py-1.5 rounded-lg transition"
        >
          음악 변경 <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 현재 트랙 정보 및 임베드 */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1">
          <h3 className="text-base font-bold text-stone-900 line-clamp-1">{currentTrack.title}</h3>
          <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{currentTrack.description}</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <a
            href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 hover:text-red-600 p-2 rounded-xl border border-stone-200 hover:border-red-200 hover:bg-red-50 transition"
            title="유튜브 앱에서 직접 열기"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 유튜브 반응형 임베드 플레이어 */}
      <div className="mt-4 rounded-xl overflow-hidden shadow-inner bg-stone-900 aspect-video max-h-56 relative w-full">
        <iframe
          key={currentTrack.youtubeId}
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=1&enablejsapi=1&origin=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`}
          title={currentTrack.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* 다른 음악 선택 리스트 드롭다운 */}
      {showTrackList && (
        <div className="mt-4 pt-3 border-t border-stone-100">
          <p className="text-xs font-semibold text-stone-500 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            마음에 드는 다른 테마를 선택해보세요
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {MUSIC_TRACKS.map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  onSelectTrack(track);
                  setShowTrackList(false);
                }}
                className={`text-left p-2.5 rounded-xl border text-xs transition flex flex-col justify-between ${
                  track.id === currentTrack.id
                    ? 'border-amber-400 bg-amber-50/60 font-semibold text-amber-900'
                    : 'border-stone-100 hover:border-stone-300 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium truncate">{track.title}</span>
                  <span className="text-[10px] text-stone-400 shrink-0 ml-1">{track.genre}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
