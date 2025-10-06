import { useState, useRef, useEffect } from 'react';

export default function ProjectCard({ project, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 150);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [index]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * -8;
      
      setRotation({ x: rotateX, y: rotateY });
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      data-category={project.category}
      className={`group relative transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative h-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl overflow-hidden"
        style={{
          transform: isHovered 
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.05, 1.05, 1.05)` 
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease',
          boxShadow: isHovered 
            ? `0 25px 50px -12px ${project.color}40, 0 0 0 1px ${project.color}20` 
            : '0 0 0 1px rgba(63, 63, 70, 0.3)',
          willChange: 'transform',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="relative h-64 overflow-hidden">
          <div 
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: isHovered 
                ? `linear-gradient(to bottom, transparent 0%, ${project.color}20 50%, rgb(24 24 27) 100%)`
                : 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgb(24 24 27) 100%)',
              transition: 'background 0.3s ease',
            }}
          />
          
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            style={{
              transform: isHovered ? 'scale3d(1.1, 1.1, 1)' : 'scale3d(1, 1, 1)',
              transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          />

          <div className="absolute top-4 right-4 z-20">
            <span 
              className="px-3 py-1 rounded-full text-xs font-mono font-bold"
              style={{
                backgroundColor: `${project.color}20`,
                color: project.color,
                border: `1px solid ${project.color}40`,
              }}
            >
              {project.category}
            </span>
          </div>
        </div>

        <div className="p-6 relative z-10">
          <h3 
            className="text-xl font-bold text-zinc-100 mb-3 transition-all duration-300"
            style={{
              backgroundImage: isHovered ? `linear-gradient(to right, ${project.color}, #fff)` : 'none',
              WebkitBackgroundClip: isHovered ? 'text' : 'unset',
              WebkitTextFillColor: isHovered ? 'transparent' : 'inherit',
            }}
          >
            {project.title}
          </h3>

          <p className="text-sm text-zinc-400 leading-relaxed mb-4">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.map((tech, i) => (
              <span 
                key={i}
                className="px-2 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded text-xs font-mono text-zinc-400"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {project.demoLink && (
              <a
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium group/link"
                style={{
                  color: isHovered ? project.color : '#a1a1aa',
                  transition: 'color 0.2s ease',
                }}
              >
                Ver Codigo
                <svg className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}

            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800 transition-all"
                aria-label="Ver en GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}