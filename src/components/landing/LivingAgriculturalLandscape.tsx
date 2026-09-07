import React, { useState, useEffect, useRef } from 'react';

interface LivingAgriculturalLandscapeProps {
  isDark?: boolean;
}

export const LivingAgriculturalLandscape: React.FC<LivingAgriculturalLandscapeProps> = ({
  isDark = false
}) => {
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-[520px] sm:h-[580px] lg:h-[640px] overflow-hidden select-none transition-colors duration-700 ${
        isDark ? 'bg-[#060e1a]' : 'bg-[#eaf4f4]'
      }`}
      aria-label="Living Indian Agricultural Landscape"
      role="img"
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* LAYER 1: SKY & DISTANT CELESTIAL ELEMENTS (BACKGROUND PARALLAX) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: reducedMotion
            ? 'none'
            : `translate3d(${offset.x * 6}px, ${offset.y * 3}px, 0)`
        }}
      >
        {/* Sky Gradient */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            isDark
              ? 'bg-gradient-to-b from-[#030712] via-[#0b1b33] to-[#12284c]'
              : 'bg-gradient-to-b from-[#bde0fe] via-[#d0f4de] to-[#fefae0]'
          }`}
        />

        {/* Daylight Sun or Night Moon */}
        {!isDark ? (
          /* Warm Natural Daylight Sun */
          <div className="absolute top-10 right-[18%] sm:right-[22%]">
            <div className="relative">
              {/* Outer Solar Glow */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-amber-200/40 blur-2xl animate-pulse" />
              {/* Sun Core */}
              <div className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-100 shadow-[0_0_50px_rgba(251,191,36,0.5)]" />
              {/* Soft Atmospheric Sunbeams */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-100/10 rounded-full blur-3xl" />
            </div>
          </div>
        ) : (
          /* Peaceful Rural Moon & Stars */
          <div className="absolute top-8 right-[20%]">
            <div className="relative">
              {/* Moonlight Aura */}
              <div className="w-24 h-24 rounded-full bg-indigo-200/20 blur-xl" />
              {/* Crescent Moon */}
              <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-gradient-to-tr from-slate-100 to-amber-100 shadow-[0_0_35px_rgba(224,231,255,0.4)] flex items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-[#0b1b33] translate-x-1.5 -translate-y-1" />
              </div>
            </div>
            {/* Subtle Stars Cluster */}
            <div className="absolute -top-4 -left-32 w-1.5 h-1.5 rounded-full bg-white/70 animate-ping" />
            <div className="absolute top-8 -left-16 w-1 h-1 rounded-full bg-amber-100/80" />
            <div className="absolute -top-2 left-28 w-1 h-1 rounded-full bg-white/60" />
            <div className="absolute top-12 left-24 w-1.5 h-1.5 rounded-full bg-indigo-100/70" />
            <div className="absolute top-20 -left-48 w-1 h-1 rounded-full bg-white/50" />
          </div>
        )}

        {/* Distant Hills / Western Ghats Silhouettes */}
        <svg
          viewBox="0 0 1440 260"
          className="absolute bottom-40 w-full h-auto preserve-3d"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,190 Q220,110 440,160 T880,130 T1320,165 Q1400,175 1440,185 L1440,260 L0,260 Z"
            fill={isDark ? '#0d1f38' : '#a3b18a'}
            fillOpacity={isDark ? '0.7' : '0.45'}
          />
          <path
            d="M0,210 Q280,140 560,190 T1120,160 T1440,200 L1440,260 L0,260 Z"
            fill={isDark ? '#11294a' : '#588157'}
            fillOpacity={isDark ? '0.85' : '0.4'}
          />
        </svg>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* LAYER 2: FARMLAND FIELDS, PATH & PROCUREMENT CENTRE (MIDGROUND) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: reducedMotion
            ? 'none'
            : `translate3d(${offset.x * 14}px, ${offset.y * 6}px, 0)`
        }}
      >
        {/* Tiered Agricultural Crop Terraces & Rows */}
        <svg
          viewBox="0 0 1440 380"
          className="absolute bottom-16 w-full h-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back Agricultural Field Layer */}
          <path
            d="M0,200 C300,170 600,210 900,185 C1200,160 1350,195 1440,210 L1440,380 L0,380 Z"
            fill={isDark ? '#064e3b' : '#3a5a40'}
            fillOpacity={isDark ? '0.75' : '0.65'}
          />

          {/* Cultivated Crop Rows (Subtle Linework) */}
          <g stroke={isDark ? '#047857' : '#a7c957'} strokeWidth="1.2" strokeOpacity="0.45">
            <line x1="120" y1="230" x2="40" y2="380" />
            <line x1="240" y1="220" x2="160" y2="380" />
            <line x1="360" y1="215" x2="300" y2="380" />
            <line x1="480" y1="210" x2="450" y2="380" />
            <line x1="600" y1="210" x2="620" y2="380" />
            <line x1="720" y1="205" x2="780" y2="380" />
            <line x1="840" y1="200" x2="940" y2="380" />
            <line x1="960" y1="195" x2="1100" y2="380" />
            <line x1="1080" y1="190" x2="1260" y2="380" />
            <line x1="1200" y1="195" x2="1420" y2="380" />
          </g>

          {/* Agricultural Gravel / Mud Access Path to Procurement Depot */}
          <path
            d="M620,200 C640,230 650,270 660,310 C670,350 675,380 680,380 L760,380 C745,350 735,310 720,270 C705,230 690,200 680,200 Z"
            fill={isDark ? '#33271e' : '#d4a373'}
            fillOpacity={isDark ? '0.7' : '0.8'}
          />

          {/* Path Edge Grass Tufts */}
          <path
            d="M615,205 Q618,200 622,204 M635,235 Q638,230 642,234 M655,275 Q658,270 662,274 M725,275 Q728,270 732,274"
            stroke={isDark ? '#10b981' : '#6b9080'}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Distant Rural Procurement Centre Depot (Centre C - Singanallur) */}
        <div className="absolute bottom-52 left-[58%] sm:left-[62%] -translate-x-1/2 scale-75 sm:scale-90 lg:scale-100 transition-all">
          <div className="relative flex flex-col items-center">
            {/* Government Mandi Tricolor / Green Signal Flag */}
            <div className="absolute -top-8 right-6 flex flex-col items-center">
              <div className="w-0.5 h-8 bg-slate-400" />
              <div className="absolute top-0 left-0.5 w-4 h-2.5 bg-gradient-to-b from-orange-500 via-white to-green-600 shadow-xs animate-pulse" />
            </div>

            {/* Grain Silos Cluster */}
            <div className="absolute -left-7 bottom-0 flex gap-1 items-end">
              <div
                className={`w-4 h-12 rounded-t-md border-t-2 ${
                  isDark
                    ? 'bg-slate-700 border-slate-500'
                    : 'bg-slate-300 border-slate-400'
                }`}
              />
              <div
                className={`w-5 h-16 rounded-t-md border-t-2 ${
                  isDark
                    ? 'bg-slate-600 border-slate-400'
                    : 'bg-slate-200 border-slate-300'
                }`}
              />
            </div>

            {/* Main Warehouse Shed with Slanted Tin Roof */}
            <div className="relative">
              {/* Triangular Roof Gable */}
              <div
                className={`w-36 h-8 [clip-path:polygon(50%_0%,0%_100%,100%_100%)] shadow-sm ${
                  isDark ? 'bg-amber-900/90' : 'bg-gov-800'
                }`}
              />
              {/* Depot Main Building */}
              <div
                className={`w-36 h-14 px-2 py-1.5 flex items-end justify-between border-t border-slate-300 shadow-md ${
                  isDark ? 'bg-slate-800 text-slate-100' : 'bg-stone-100 text-slate-800'
                }`}
              >
                {/* Gate 1 Intake Bay */}
                <div
                  className={`w-8 h-10 rounded-t-sm border-2 flex items-center justify-center ${
                    isDark
                      ? 'bg-amber-950/60 border-amber-600/40 text-amber-300'
                      : 'bg-amber-100 border-amber-300 text-amber-800'
                  }`}
                >
                  <span className="text-[7px] font-mono font-black">GATE 1</span>
                </div>

                {/* Central Office Windows (Warm Glow in Dark Mode) */}
                <div className="flex gap-1 mb-2">
                  <div
                    className={`w-3 h-3 rounded-xs ${
                      isDark ? 'bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.8)]' : 'bg-sky-200'
                    }`}
                  />
                  <div
                    className={`w-3 h-3 rounded-xs ${
                      isDark ? 'bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.8)]' : 'bg-sky-200'
                    }`}
                  />
                </div>

                {/* Gate 2 Weighbridge Bay */}
                <div
                  className={`w-8 h-10 rounded-t-sm border-2 flex items-center justify-center ${
                    isDark
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                      : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                  }`}
                >
                  <span className="text-[7px] font-mono font-black">SCALE</span>
                </div>
              </div>

              {/* Weighbridge Platform Strip */}
              <div
                className={`w-40 -ml-2 h-2 rounded-xs border flex items-center justify-center ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-[6px] text-emerald-400 font-mono'
                    : 'bg-slate-300 border-slate-400 text-[6px] text-gov-900 font-mono'
                }`}
              >
                ● 60t WEIGHBRIDGE ACTIVE
              </div>
            </div>

            {/* Procurement Centre Signboard */}
            <div
              className={`mt-1 px-2 py-0.5 rounded-xs text-[8px] font-black uppercase tracking-wider border shadow-xs ${
                isDark
                  ? 'bg-gov-900 text-emerald-300 border-emerald-500/40'
                  : 'bg-gov-800 text-white border-gov-900'
              }`}
            >
              SINGANALLUR APMC HUB (CENTRE C)
            </div>

            {/* Small Animated Tractor Trolley Traveling to Mandi */}
            <div className="absolute -bottom-5 -left-12 flex items-center gap-1 animate-pulse">
              <span className="text-sm">🚜</span>
              <div
                className={`w-6 h-3 rounded-xs border text-[6px] font-mono flex items-center justify-center ${
                  isDark ? 'bg-amber-900/60 text-amber-200' : 'bg-amber-200 text-amber-900'
                }`}
              >
                2.5t
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* LAYER 3: RIPE CROPS, SWAYING AWNS & FARMER (FOREGROUND PARALLAX) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: reducedMotion
            ? 'none'
            : `translate3d(${offset.x * 24}px, ${offset.y * 10}px, 0)`
        }}
      >
        {/* Fertile Foreground Soil Line */}
        <div
          className={`absolute bottom-0 inset-x-0 h-14 border-t-2 ${
            isDark
              ? 'bg-[#0f1d18] border-emerald-900/40'
              : 'bg-[#283618] border-[#606c38]'
          }`}
        />

        {/* Swaying Wheat & Paddy Crops (SVG Stalks with Wind Sway Animation) */}
        <svg
          viewBox="0 0 1440 160"
          className="absolute bottom-2 inset-x-0 w-full h-auto overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Individual Swaying Crop Clusters */}
          <g
            className={reducedMotion ? '' : 'origin-bottom animate-[windSway_4s_ease-in-out_infinite]'}
            stroke={isDark ? '#059669' : '#dda15e'}
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            {/* Cluster 1: Left Foreground Wheat Awns */}
            <path d="M40,160 Q55,100 48,50" />
            <path d="M48,50 Q40,42 35,46 M48,50 Q56,42 60,46 M48,40 Q42,32 37,36 M48,40 Q54,32 58,36" />

            <path d="M70,160 Q80,95 85,42" />
            <path d="M85,42 Q78,35 72,39 M85,42 Q92,35 98,39 M85,32 Q78,25 74,29 M85,32 Q92,25 96,29" />

            <path d="M110,160 Q115,105 125,58" />
            <path d="M150,160 Q160,95 152,48" />
            <path d="M190,160 Q205,100 215,55" />
          </g>

          <g
            className={reducedMotion ? '' : 'origin-bottom animate-[windSway_3.5s_ease-in-out_infinite_reverse]'}
            stroke={isDark ? '#10b981' : '#bc6c25'}
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            {/* Cluster 2: Center-Left Paddy Ears */}
            <path d="M280,160 Q295,110 305,62" />
            <path d="M305,62 Q315,50 325,58 M305,62 Q295,50 288,58" />
            <path d="M330,160 Q340,105 348,52" />
            <path d="M370,160 Q380,115 392,68" />
            <path d="M420,160 Q430,100 445,45" />
          </g>

          <g
            className={reducedMotion ? '' : 'origin-bottom animate-[windSway_4.2s_ease-in-out_infinite]'}
            stroke={isDark ? '#059669' : '#dda15e'}
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            {/* Cluster 3: Right Foreground Crops */}
            <path d="M1150,160 Q1165,100 1175,48" />
            <path d="M1175,48 Q1185,38 1195,44 M1175,48 Q1165,38 1158,44" />
            <path d="M1210,160 Q1220,105 1235,52" />
            <path d="M1270,160 Q1280,95 1290,40" />
            <path d="M1320,160 Q1335,105 1345,55" />
            <path d="M1380,160 Q1395,95 1405,45" />
          </g>
        </svg>

        {/* Farmer Silhouette in Traditional Kurta & Pagri (Standing at Edge of Field) */}
        <div className="absolute bottom-6 left-6 sm:left-12 lg:left-20">
          <div className="relative flex flex-col items-center">
            {/* Pagri (Turban) */}
            <div
              className={`w-6 h-4 rounded-t-full -mb-1 shadow-sm ${
                isDark ? 'bg-amber-600' : 'bg-amber-500'
              }`}
            />
            {/* Head & Scarf Wrap */}
            <div
              className={`w-4 h-4 rounded-full ${
                isDark ? 'bg-amber-800' : 'bg-stone-700'
              }`}
            />
            {/* Kurta & Shoulders */}
            <div
              className={`w-9 h-14 rounded-t-lg shadow-md ${
                isDark ? 'bg-slate-900 border border-slate-700' : 'bg-slate-800'
              }`}
            />
            {/* Agricultural Tool / Sieve */}
            <div className="absolute top-7 -right-3 w-1 h-14 bg-amber-800 rotate-12" />
            <div className="absolute top-6 -right-5 w-4 h-4 rounded-full border-2 border-amber-700" />
            {/* Dhoti / Trousers */}
            <div className="flex gap-1 -mt-1">
              <div
                className={`w-3.5 h-10 rounded-b-sm ${
                  isDark ? 'bg-slate-950' : 'bg-slate-900'
                }`}
              />
              <div
                className={`w-3.5 h-10 rounded-b-sm ${
                  isDark ? 'bg-slate-950' : 'bg-slate-900'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* CSS KEYFRAME INJECTION FOR NATURAL WIND SWAY */}
      {/* ───────────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes windSway {
          0%, 100% {
            transform: rotate(0deg) skewX(0deg);
          }
          35% {
            transform: rotate(3deg) skewX(2deg);
          }
          70% {
            transform: rotate(-2.5deg) skewX(-1.5deg);
          }
        }
      `}</style>
    </div>
  );
};
