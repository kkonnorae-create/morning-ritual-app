import React from 'react';
import { PersonaType, PersonaInfo } from '../types';
import { PERSONAS } from '../data/mockData';
import { Sparkles, Check, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPersona: PersonaType;
  onSelectPersona: (persona: PersonaType) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  selectedPersona,
  onSelectPersona,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FCFAF7] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200/80 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-2.5 rounded-2xl bg-amber-100 text-amber-800 mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">당신의 오늘 아침 상태는 어떤가요?</h2>
          <p className="text-xs text-stone-500 mt-1">
            선택하신 상태에 맞춰 아침 음악과 마음가짐 글귀를 맞춤 추천해 드립니다.
          </p>
        </div>

        <div className="space-y-3">
          {Object.values(PERSONAS).map((p: PersonaInfo) => {
            const isSelected = selectedPersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  onSelectPersona(p.id);
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                    : 'border-stone-200/80 hover:border-amber-300 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-200/60 text-stone-800">
                    {p.badge}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <h3 className="text-base font-bold text-stone-900 mt-1">{p.title}</h3>
                <p className="text-xs font-medium text-amber-900/80 mt-0.5">{p.tagline}</p>
                <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">{p.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm rounded-xl transition shadow-md"
          >
            선택 완료하고 리추얼 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};
