import { useEffect, useRef, useState } from 'react';
import './App.css';

const messages = [
  "Happy birthday, baby. Life's been better with you in it.",
  "I'm really glad I get to do life with you.",
  "Somehow I end up loving you more every day.",
  "You make my days a lot better just by being you.",
  "Thank you for taking care of me and loving me.",
  "You honestly mean so much to me.",
  "I'm so lucky to have you.",
  "You make everything feel lighter.",
  "I'll always be on your side.",
  "I'll always be your biggest fan.",
  "I love you more than I probably say.",
  "You're my favorite person.",
  "I'm grateful for all the little things you do.",
  "Being with you just feels right.",
  "You make me smile without trying.",
  "I love doing even the simple stuff with you.",
  "Thank you for always being there.",
  "You make my life happier.",
  "I choose you every day.",
  "I'm really proud of you.",
  "I love you the most.",
  "You're the best thing that's happened to me.",
  "I hope you know how loved you are.",
  "Happy birthday, my love. Always you."
];

function App() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const messageRefs = useRef([]);
  const scrollContainerRef = useRef(null);
  const lastScrollTime = useRef(0);
  const isTransitioning = useRef(false);
  const audioRef = useRef(null);

  // Autoplay music on component mount
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current && audioRef.current.paused) {
        try {
          audioRef.current.volume = 0.7; // Set volume to 70%
          await audioRef.current.play();
          console.log('Music started playing');
        } catch (err) {
          console.log('Autoplay blocked, waiting for user interaction:', err);
        }
      }
    };

    // Simulate a click to trigger autoplay
    const simulateClick = () => {
      document.body.click();
    };

    // Try to play immediately on load
    playAudio();

    // Simulate click after a short delay to trigger audio
    const clickTimer = setTimeout(simulateClick, 50);

    // Also try after another delay
    const timer = setTimeout(playAudio, 100);

    // Also try to play on any user interaction - keep listeners active
    const handleInteraction = () => {
      playAudio();
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('scroll', handleInteraction, { passive: true });
    document.addEventListener('wheel', handleInteraction, { passive: true });

    return () => {
      clearTimeout(clickTimer);
      clearTimeout(timer);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
      document.removeEventListener('wheel', handleInteraction);
    };
  }, []);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current && audioRef.current.paused) {
        try {
          audioRef.current.volume = 0.7;
          await audioRef.current.play();
          console.log('Music started playing');
        } catch (err) {
          console.log('Autoplay blocked:', err);
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = parseInt(entry.target.dataset.index);
            setActiveIndex(index);
            // Try to play music when first card comes into view
            if (index === 0) {
              playAudio();
            }
          }
        });
      },
      {
        threshold: [0.5],
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    messageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // Touch handling for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      touchEndY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const now = Date.now();

      // Prevent double scrolling
      if (isTransitioning.current || now - lastScrollTime.current < 1000) {
        return;
      }

      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) > 50) {
        e.preventDefault();

        // Lock immediately
        isTransitioning.current = true;
        lastScrollTime.current = now;

        // Determine direction (positive = swipe up = scroll down)
        const direction = deltaY > 0 ? 1 : -1;
        const nextIndex = Math.max(-1, Math.min(messages.length - 1, activeIndex + direction));

        if (nextIndex >= 0 && nextIndex < messages.length && messageRefs.current[nextIndex]) {
          messageRefs.current[nextIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        } else if (nextIndex === -1) {
          // Scroll to landing page
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }

        // Release lock after animation completes
        setTimeout(() => {
          isTransitioning.current = false;
        }, 1000);
      }
    };

    // Handle wheel/touch scrolling for next/previous navigation
    const handleScroll = (e) => {
      e.preventDefault();

      const now = Date.now();

      // Prevent double scrolling with strict timeout
      if (isTransitioning.current || now - lastScrollTime.current < 1000) {
        return;
      }

      const delta = e.deltaY;

      if (Math.abs(delta) > 5) {
        // Lock immediately
        isTransitioning.current = true;
        lastScrollTime.current = now;

        // Determine direction
        const direction = delta > 0 ? 1 : -1;
        const nextIndex = Math.max(-1, Math.min(messages.length - 1, activeIndex + direction));

        if (nextIndex >= 0 && nextIndex < messages.length && messageRefs.current[nextIndex]) {
          messageRefs.current[nextIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        } else if (nextIndex === -1) {
          // Scroll to landing page
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }

        // Release lock after animation completes
        setTimeout(() => {
          isTransitioning.current = false;
        }, 1000);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    return () => {
      observer.disconnect();
      if (container) {
        container.removeEventListener('wheel', handleScroll);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [activeIndex]);

  const FlowerDecoration = () => (
    <div className="flower-wrapper">
      <div className="flower flower1">
        <div className="petal one"></div>
        <div className="petal two"></div>
        <div className="petal three"></div>
        <div className="petal four"></div>
      </div>
      <div className="flower flower2">
        <div className="petal one"></div>
        <div className="petal two"></div>
        <div className="petal three"></div>
        <div className="petal four"></div>
      </div>
      <div className="flower flower3">
        <div className="petal one"></div>
        <div className="petal two"></div>
        <div className="petal three"></div>
        <div className="petal four"></div>
      </div>
      <div className="flower flower4">
        <div className="petal one"></div>
        <div className="petal two"></div>
        <div className="petal three"></div>
        <div className="petal four"></div>
      </div>
      <div className="flower flower5">
        <div className="petal one"></div>
        <div className="petal two"></div>
        <div className="petal three"></div>
        <div className="petal four"></div>
      </div>
      <div className="flower flower6">
        <div className="petal one"></div>
        <div className="petal two"></div>
        <div className="petal three"></div>
        <div className="petal four"></div>
      </div>
    </div>
  );

  return (
    <div className="app">
      {/* Background music */}
      <audio
        ref={audioRef}
        src="/Libu-Libong Buwan (Uuwian) - Kyle Raphael (Official Music Video).mp3"
        loop
        preload="auto"
        playsInline
        muted={false}
      />

      <div className="landing-page">
        <div className="landing-content">
          <h1 className="landing-title">
            Happy 24th Birthday
          </h1>
          <h2 className="landing-subtitle">
            Jeannine
          </h2>
          <p className="landing-message">
            baby, mahal, my love
          </p>
          <div
            className="start-button"
            onClick={() => {
              if (messageRefs.current[0]) {
                messageRefs.current[0].scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                });
              }
            }}
          >
            Click here ↓
          </div>
        </div>
      </div>

      <div className="messages-container" ref={scrollContainerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            data-index={index}
            ref={(el) => (messageRefs.current[index] = el)}
            className={`message-item ${activeIndex === index ? 'active' : ''}`}
          >
            <div className="message-card">
              <div className="card-flower">
                <FlowerDecoration />
              </div>
              <p className="message-text">{message}</p>
            </div>
          </div>
        ))}

        <div
          className="back-to-top"
          onClick={(e) => {
            e.stopPropagation();
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }}
        >
          Back to top ↑
        </div>
      </div>
    </div>
  );
}

export default App;
