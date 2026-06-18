/**
 * Update these URLs with your real profiles.
 * SoundCloud profile URL — replace with your actual page when ready.
 */
const SITE_LINKS = {
  soundcloud: 'https://soundcloud.com/last-call-431091673',
  featuredTrack: 'https://soundcloud.com/last-call-431091673/you-like-that-3',
  latestMix: 'https://soundcloud.com/last-call-431091673/sets/lightsofflastcall',
  instagram: 'https://instagram.com/',
  bookingEmail: 'booking@lastcall.dj',
};

/**
 * Each track has a SoundCloud URL (`scUrl`). Clicking a card plays it inside the
 * on-page player widget using the SoundCloud Widget API. Defaults to the artist
 * profile when an individual track URL isn't set yet.
 */
/**
 * Master track list — add new tracks here.
 * art: local path to downloaded cover (500×500 jpg from SoundCloud CDN)
 * scUrl: direct SoundCloud track URL
 */
const SC_TRACKS = [
  {
    title: 'Worker Bees (House Remix)',
    art: 'assets/art-worker-bees.jpg',
    scUrl: 'https://soundcloud.com/last-call-431091673/worker-bees-last-call-house',
  },
  {
    title: 'You Like That',
    art: 'assets/art-you-like-that.jpg',
    scUrl: 'https://soundcloud.com/last-call-431091673/you-like-that-3',
  },
  {
    title: 'Ladies and Gentlemen',
    art: 'assets/art-ladies-gentlemen.jpg',
    scUrl: 'https://soundcloud.com/last-call-431091673/ladies-and-gentlemen-1',
  },
  {
    title: "Whatchu Lookin' At",
    art: 'assets/art-whatchu-lookin-at.jpg',
    scUrl: 'https://soundcloud.com/last-call-431091673/whatchu-lookin-at-2',
  },
  {
    title: 'Say Yeah',
    art: 'assets/art-say-yeah-playlist.jpg',
    scUrl: 'https://soundcloud.com/last-call-431091673/say-yeah-4',
  },
  {
    title: 'Soulful Selekta',
    art: 'assets/art-soulful-selekta.jpg',
    scUrl: 'https://soundcloud.com/last-call-431091673/soulful-selekta-6',
  },
  {
    title: 'Someone New (UKG Remix)',
    art: 'assets/art-someone-new.jpg',
    scUrl: 'https://soundcloud.com/last-call-431091673/lastcall-someonenew',
  },
  {
    title: 'We Found Love (UKG Remix)',
    art: 'assets/art-we-found-love.jpg',
    scUrl: 'https://soundcloud.com/last-call-431091673/lastcall-wefoundlove',
  },
  {
    title: 'Throne (Last Call Remix)',
    art: 'assets/art-throne-remix.jpg',
    scUrl: 'https://soundcloud.com/last-call-431091673/lastcallremix',
  },
];

const FEATURED_TRACK = {
  title: SC_TRACKS[0].title,
  artist: 'LAST CALL',
  art: SC_TRACKS[0].art,
  scUrl: SC_TRACKS[0].scUrl,
};

function makeTrack(sc) {
  return { title: sc.title, artist: 'LAST CALL', art: sc.art, scUrl: sc.scUrl };
}

/* All 8 tracks in one row, 4 visible at a time */
const TRACKS = {
  popular: SC_TRACKS.map(makeTrack),
};

/* Shared bridge to the player. initPlayer() fills these in. */
const PlayerBridge = {
  playUrl: (_scUrl, _meta) => {},
  ready: false,
};

const CAROUSEL_STATE = {
  popular: { index: 0, visible: 4 },
};

const SLIDE_WIDTH = 280; /* 220px card + 60px gap */
const MOBILE_SLIDE_STEP = 185; /* 165px card + 20px gap */

function isMobileLayout() {
  return document.body.classList.contains('is-mobile') || window.innerWidth < 768;
}

function getCarouselViewport(name) {
  return document.getElementById(`${name}-track`)?.closest('.carousel-viewport');
}

function updateCarousel(name) {
  const state = CAROUSEL_STATE[name];
  const trackEl = document.getElementById(`${name}-track`);
  const viewportEl = getCarouselViewport(name);
  const mobile = isMobileLayout();
  const maxIndex = mobile
    ? Math.max(0, TRACKS[name].length - 1)
    : Math.max(0, TRACKS[name].length - state.visible);

  state.index = Math.min(Math.max(state.index, 0), maxIndex);

  if (mobile && trackEl && viewportEl) {
    trackEl.style.transform = '';
    const slide = trackEl.children[state.index];
    if (slide) {
      viewportEl.scrollTo({
        left: slide.offsetLeft - viewportEl.offsetLeft,
        behavior: 'smooth',
      });
    }
  } else if (trackEl) {
    trackEl.style.transform = `translateX(${-state.index * SLIDE_WIDTH}px)`;
  }

  document.querySelector(`[data-carousel-prev="${name}"]`).disabled = state.index === 0;
  document.querySelector(`[data-carousel-next="${name}"]`).disabled = state.index === maxIndex;
}

function resetCarouselTransforms() {
  document.querySelectorAll('.carousel-track').forEach((track) => {
    track.style.transform = '';
  });
}

function createSlide(track, section) {
  const slide = document.createElement('article');
  slide.className = 'carousel-slide';
  slide.dataset.title = track.title.toLowerCase();
  slide.dataset.section = section;
  slide.dataset.trackTitle = track.title.toLowerCase();
  slide.dataset.scUrl = track.scUrl || SITE_LINKS.soundcloud;

  slide.innerHTML = `
    <button class="carousel-card-link" type="button" aria-label="Play ${track.title} by ${track.artist}">
      <div class="vinyl-card">
        <img class="vinyl-sleeve" src="${track.art}" alt="${track.title} by ${track.artist}">
        <span class="vinyl-play-overlay" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </span>
      </div>
    </button>
    <a class="card-sc-link" href="${track.scUrl || SITE_LINKS.soundcloud}" target="_blank" rel="noopener noreferrer" aria-label="Open ${track.title} on SoundCloud">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>
      <span>SoundCloud</span>
    </a>
    <div class="carousel-label">
      <span class="track-label-bold">${track.title}</span><br>
      <span class="track-label-italic">${track.artist}</span>
    </div>
  `;

  /* Click the card → load + play this track in the on-page player widget */
  const playBtn = slide.querySelector('.carousel-card-link');
  playBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    PlayerBridge.playUrl(slide.dataset.scUrl, {
      title: track.title,
      artist: track.artist,
      art: track.art,
    });
  });

  return slide;
}

function renderCarousel(name) {
  const trackEl = document.getElementById(`${name}-track`);
  trackEl.innerHTML = '';
  TRACKS[name].forEach((track) => {
    trackEl.appendChild(createSlide(track, name));
  });
  updateCarousel(name);
}

function initVinylPop() {
  document.querySelectorAll('.vinyl-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (window.matchMedia('(hover: none)').matches) {
        e.preventDefault();
        const link = card.closest('.carousel-card-link');
        const wasPopped = card.classList.contains('is-popped');

        document.querySelectorAll('.vinyl-card.is-popped').forEach((c) => {
          c.classList.remove('is-popped');
        });

        if (!wasPopped) {
          card.classList.add('is-popped');
        } else if (link?.href) {
          window.open(link.href, '_blank', 'noopener,noreferrer');
        }
      }
    });
  });
}

function addTouchSwipe(viewportEl, name) {
  let startX = 0;
  let startY = 0;
  let isDragging = false;

  viewportEl.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  viewportEl.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy)) e.preventDefault();
  }, { passive: false });

  viewportEl.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 48) {
      CAROUSEL_STATE[name].index += dx < 0 ? 1 : -1;
      updateCarousel(name);
    }
  }, { passive: true });
}

function initCarousels() {
  renderCarousel('popular');
  initVinylPop();

  document.querySelectorAll('[data-carousel-prev]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.carouselPrev;
      CAROUSEL_STATE[name].index -= 1;
      updateCarousel(name);
    });
  });

  document.querySelectorAll('[data-carousel-next]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.carouselNext;
      CAROUSEL_STATE[name].index += 1;
      updateCarousel(name);
    });
  });

  if (!isMobileLayout()) {
    addTouchSwipe(document.querySelector('.popular-viewport'), 'popular');
  } else {
    resetCarouselTransforms();
  }
}

function initLinks() {
  const soundcloudLinks = [
    'sc-fab',
    'about-soundcloud',
    'footer-soundcloud-label',
    'footer-soundcloud-box',
    'footer-soundcloud-icon',
    'footer-mixes',
    'sticky-soundcloud',
  ];

  soundcloudLinks.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = SITE_LINKS.soundcloud;
  });

  document.getElementById('footer-mix-drop').href = SITE_LINKS.latestMix;
  document.getElementById('about-latest-mix').href = SITE_LINKS.latestMix;
  document.getElementById('about-instagram').href = SITE_LINKS.instagram;
  document.getElementById('footer-instagram').href = SITE_LINKS.instagram;
  const stickyInstagram = document.getElementById('sticky-instagram');
  if (stickyInstagram) stickyInstagram.href = SITE_LINKS.instagram;
  const footerIgLabel = document.getElementById('footer-instagram-label');
  if (footerIgLabel) footerIgLabel.href = SITE_LINKS.instagram;
  const igFab = document.getElementById('ig-fab');
  if (igFab) igFab.href = SITE_LINKS.instagram;

  const bookingBase = `mailto:${SITE_LINKS.bookingEmail}`;
  document.getElementById('about-book').href = `${bookingBase}?subject=Book%20a%20Set`;
  document.getElementById('footer-book').href = `${bookingBase}?subject=Book%20a%20Set`;
  document.getElementById('footer-residencies').href = `${bookingBase}?subject=Residency%20Inquiry`;
  document.getElementById('footer-events').href = `${bookingBase}?subject=Private%20Event%20Inquiry`;
}

/**
 * Player powered by the SoundCloud Widget API.
 * Docs: https://developers.soundcloud.com/docs/api/html5-widget
 */
function initPlayer() {
  const iframe = document.getElementById('sc-widget');
  const widgetEl = document.getElementById('player-widget');
  const discArt = document.getElementById('player-disc-art');
  const titleEl = document.getElementById('player-title');
  const artistEl = document.getElementById('player-artist');
  const progressBar = document.getElementById('player-progress');
  const progressFill = document.getElementById('player-progress-fill');
  const playBtn = document.getElementById('player-play');
  const prevBtn = document.getElementById('player-prev');
  const nextBtn = document.getElementById('player-next');
  const muteBtn = document.getElementById('player-mute');

  if (!iframe || typeof SC === 'undefined') return;

  const scWidget = SC.Widget(iframe);
  let isPlaying = false;
  let isMuted = false;
  let lastVolume = 100;
  let widgetReady = false;
  let pendingLoad = null;

  /* Flat ordered track list used for next/prev navigation */
  const allTracks = TRACKS.popular;
  let currentTrackUrl = FEATURED_TRACK.scUrl;

  function trackIndex() {
    const idx = allTracks.findIndex((t) => t.scUrl === currentTrackUrl);
    return idx >= 0 ? idx : 0;
  }

  const todBadge = document.querySelector('.track-of-day-badge');

  function updateTodBadge() {
    if (!todBadge) return;
    /* Show badge only while the featured "Track of the Day" is loaded */
    const isTod = currentTrackUrl === FEATURED_TRACK.scUrl;
    todBadge.hidden = !isTod;
  }

  const soundwave = initSoundwave();

  function setPlaying(playing) {
    isPlaying = playing;
    widgetEl.classList.toggle('is-playing', playing);
    if (soundwave) soundwave.setPlaying(playing);
    playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    playBtn.setAttribute('aria-pressed', String(playing));
  }

  function updateTrackUI(meta) {
    if (meta.title) titleEl.textContent = meta.title;
    if (meta.artist) artistEl.textContent = String(meta.artist).toUpperCase();
    if (meta.art) {
      discArt.src = meta.art;
      discArt.alt = `${meta.title || 'Track'} cover art`;
    }
    widgetEl.setAttribute('aria-label', `Now playing: ${meta.title || ''} by ${meta.artist || 'LAST CALL'}`);
  }

  /**
   * Public bridge — invoked by carousel-card clicks.
   * Loads the SoundCloud URL into the widget and starts playback.
   */
  PlayerBridge.playUrl = (scUrl, meta = {}) => {
    if (!scUrl) return;
    currentTrackUrl = scUrl;
    updateTodBadge();
    if (meta && (meta.title || meta.artist || meta.art)) updateTrackUI(meta);
    if (soundwave) soundwave.loadTrack(scUrl);

    const doLoad = () => {
      scWidget.load(scUrl, {
        auto_play: true,
        callback: () => {
          scWidget.getCurrentSound((sound) => {
            if (!sound) return;
            const liveMeta = {
              title: sound.title || meta.title,
              artist: sound.user?.username || meta.artist || 'LAST CALL',
              art: meta.art,
            };
            if (sound.artwork_url) {
              liveMeta.art = sound.artwork_url.replace('-large', '-t500x500');
            }
            updateTrackUI(liveMeta);
          });
        },
      });
    };

    if (widgetReady) {
      doLoad();
    } else {
      pendingLoad = doLoad;
    }
  };

  /* Seed UI immediately so it doesn't show empty while widget loads */
  updateTrackUI({ title: FEATURED_TRACK.title, artist: FEATURED_TRACK.artist, art: FEATURED_TRACK.art });

  scWidget.bind(SC.Widget.Events.READY, () => {
    widgetReady = true;
    PlayerBridge.ready = true;
    scWidget.setVolume(lastVolume);

    /* Load featured track and try to auto-play immediately */
    scWidget.load(FEATURED_TRACK.scUrl, { auto_play: true });
    if (soundwave) soundwave.loadTrack(FEATURED_TRACK.scUrl);

    if (pendingLoad) {
      const fn = pendingLoad;
      pendingLoad = null;
      fn();
    }
  });

  /*
   * Autoplay fallback: browsers may block autoplay before a user gesture.
   * On the very first click/keydown anywhere on the page, start playback
   * if it hasn't begun yet.
   */
  function tryAutoplayOnInteraction() {
    if (isPlaying || !widgetReady) return;
    scWidget.play();
  }
  document.addEventListener('click',   tryAutoplayOnInteraction, { once: true, passive: true });
  document.addEventListener('keydown', tryAutoplayOnInteraction, { once: true, passive: true });

  scWidget.bind(SC.Widget.Events.PLAY, () => setPlaying(true));
  scWidget.bind(SC.Widget.Events.PAUSE, () => setPlaying(false));

  /* Auto-advance to next track when the current one ends */
  scWidget.bind(SC.Widget.Events.FINISH, () => {
    setPlaying(false);
    progressFill.style.width = '0%';
    const nextIdx = (trackIndex() + 1) % allTracks.length;
    const next = allTracks[nextIdx];
    PlayerBridge.playUrl(next.scUrl, { title: next.title, artist: next.artist, art: next.art });
  });

  scWidget.bind(SC.Widget.Events.PLAY_PROGRESS, (data) => {
    progressFill.style.width = `${Math.max(0, Math.min(1, data.relativePosition || 0)) * 100}%`;
  });

  /* When a new track loads its metadata, refresh title/artist/art */
  scWidget.bind(SC.Widget.Events.LOAD_PROGRESS, () => {
    scWidget.getCurrentSound((sound) => {
      if (!sound) return;
      if (sound.title && titleEl.textContent !== sound.title) {
        const meta = {
          title: sound.title,
          artist: sound.user?.username || 'LAST CALL',
        };
        if (sound.artwork_url) {
          meta.art = sound.artwork_url.replace('-large', '-t500x500');
        }
        updateTrackUI(meta);
      }
    });
  });

  /* ── Controls ── */

  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!widgetReady) return;
    scWidget.toggle();
  });

  /* Rewind: seek back 10 s if past 3 s into track, else load previous track */
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!widgetReady) return;
    scWidget.getPosition((position) => {
      if (position > 3000) {
        scWidget.seekTo(Math.max(0, position - 10000));
      } else {
        const prevIdx = (trackIndex() - 1 + allTracks.length) % allTracks.length;
        const prev = allTracks[prevIdx];
        PlayerBridge.playUrl(prev.scUrl, { title: prev.title, artist: prev.artist, art: prev.art });
      }
    });
  });

  /* Skip: load the next track in our ordered list */
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!widgetReady) return;
    const nextIdx = (trackIndex() + 1) % allTracks.length;
    const next = allTracks[nextIdx];
    PlayerBridge.playUrl(next.scUrl, { title: next.title, artist: next.artist, art: next.art });
  });

  muteBtn.addEventListener('click', () => {
    if (!widgetReady) return;
    if (isMuted) {
      scWidget.setVolume(lastVolume);
      isMuted = false;
    } else {
      scWidget.getVolume((v) => { lastVolume = (typeof v === 'number' && v > 0) ? v : 100; });
      scWidget.setVolume(0);
      isMuted = true;
    }
    muteBtn.classList.toggle('is-muted', isMuted);
    muteBtn.setAttribute('aria-pressed', String(isMuted));
    muteBtn.setAttribute('aria-label', isMuted ? 'Unmute' : 'Mute');
  });

  progressBar.addEventListener('click', (event) => {
    if (!widgetReady) return;
    scWidget.getDuration((duration) => {
      if (!duration) return;
      const rect = progressBar.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      scWidget.seekTo(ratio * duration);
    });
  });
}

function buildSearchIndex() {
  const seen = new Set();
  const index = [];

  Object.entries(TRACKS).forEach(([section, tracks]) => {
    tracks.forEach((track) => {
      const key = `${track.title}|${track.artist}|${section}`;
      if (seen.has(key)) return;
      seen.add(key);
      index.push({
        title: track.title,
        artist: track.artist,
        art: track.art,
        url: track.url,
        section,
        haystack: track.title.toLowerCase(),
      });
    });
  });

  return index;
}

function initSearch() {
  const wrap = document.getElementById('search-wrap');
  const field = document.getElementById('search-field');
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  const resultsEl = document.getElementById('search-results');
  const searchIndex = buildSearchIndex();

  let activeIndex = -1;
  let visibleResults = [];

  function filterSlides(query) {
    document.querySelectorAll('.carousel-slide').forEach((slide) => {
      const match = !query || slide.dataset.title.includes(query);
      slide.classList.toggle('search-hidden', !match);
    });
  }

  function getMatches(query) {
    if (!query) return searchIndex.slice(0, 6);
    return searchIndex.filter((item) => item.haystack.includes(query));
  }

  function closeResults() {
    resultsEl.hidden = true;
    resultsEl.classList.remove('is-open');
    input.setAttribute('aria-expanded', 'false');
    activeIndex = -1;
    visibleResults = [];
  }

  function openResults() {
    resultsEl.hidden = false;
    requestAnimationFrame(() => resultsEl.classList.add('is-open'));
    input.setAttribute('aria-expanded', 'true');
  }

  function renderResults(matches) {
    const displayMatches = matches.slice(0, 6);
    visibleResults = displayMatches;
    activeIndex = -1;

    if (!input.value.trim()) {
      resultsEl.innerHTML = `
        <p class="search-hint">Popular tracks</p>
        ${displayMatches.map((item, i) => renderResultItem(item, i)).join('')}
      `;
      openResults();
      return;
    }

    if (matches.length === 0) {
      resultsEl.innerHTML = `<p class="search-empty">No tracks found for “${input.value.trim()}”</p>`;
      openResults();
      return;
    }

    resultsEl.innerHTML = displayMatches.map((item, i) => renderResultItem(item, i)).join('');
    openResults();
  }

  function renderResultItem(item, index) {
    const sectionLabel = item.section === 'popular' ? 'Popular' : 'Recent';
    return `
      <button
        type="button"
        class="search-result"
        role="option"
        data-index="${index}"
        aria-selected="false"
      >
        <img class="search-result-art" src="${item.art}" alt="">
        <span class="search-result-body">
          <span class="search-result-title">${item.title}</span>
          <span class="search-result-artist">${item.artist}</span>
        </span>
        <span class="search-result-section">${sectionLabel}</span>
      </button>
    `;
  }

  function setActiveResult(index) {
    activeIndex = index;
    resultsEl.querySelectorAll('.search-result').forEach((el, i) => {
      const isActive = i === index;
      el.classList.toggle('is-active', isActive);
      el.setAttribute('aria-selected', String(isActive));
    });
  }

  function scrollToTrack(item) {
    const slide = document.querySelector(
      `.carousel-slide[data-section="${item.section}"][data-track-title="${item.title.toLowerCase()}"]`,
    );

    if (slide) {
      slide.classList.remove('search-hidden');
      slide.classList.remove('search-highlight');
      void slide.offsetWidth;
      slide.classList.add('search-highlight');

      slide.closest('.carousel-viewport')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function selectResult(item) {
    input.value = item.title;
    field.classList.add('has-value');
    clearBtn.hidden = false;
    filterSlides(item.haystack);
    scrollToTrack(item);
    closeResults();
    input.blur();
  }

  function handleInput() {
    const query = input.value.trim().toLowerCase();
    field.classList.toggle('has-value', Boolean(query));
    clearBtn.hidden = !query;
    filterSlides(query);
    renderResults(getMatches(query));
  }

  function clearSearch() {
    input.value = '';
    field.classList.remove('has-value');
    clearBtn.hidden = true;
    filterSlides('');
    closeResults();
    input.focus();
  }

  input.addEventListener('focus', () => {
    field.classList.add('is-focused');
    renderResults(getMatches(input.value.trim().toLowerCase()));
  });

  input.addEventListener('blur', () => {
    field.classList.remove('is-focused');
    setTimeout(closeResults, 150);
  });

  input.addEventListener('input', handleInput);

  input.addEventListener('keydown', (event) => {
    const items = resultsEl.querySelectorAll('.search-result');

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!resultsEl.classList.contains('is-open')) renderResults(getMatches(input.value.trim().toLowerCase()));
      setActiveResult(Math.min(activeIndex + 1, items.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveResult(Math.max(activeIndex - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const pick = visibleResults[activeIndex] || visibleResults[0];
      if (pick) selectResult(pick);
    } else if (event.key === 'Escape') {
      if (input.value) {
        clearSearch();
      } else {
        closeResults();
        input.blur();
      }
    }
  });

  clearBtn.addEventListener('mousedown', (event) => event.preventDefault());
  clearBtn.addEventListener('click', clearSearch);

  resultsEl.addEventListener('mousedown', (event) => event.preventDefault());

  resultsEl.addEventListener('click', (event) => {
    const btn = event.target.closest('.search-result');
    if (!btn) return;
    const item = visibleResults[Number(btn.dataset.index)];
    if (item) selectResult(item);
  });

  document.addEventListener('click', (event) => {
    if (!wrap.contains(event.target)) closeResults();
  });
}

function initResponsiveScale() {
  const wrap = document.querySelector('.page-scale-wrap');
  const page = document.querySelector('.page');
  const designWidth = 1728;
  const designHeight = 2380;

  function applyScale() {
    const vw = document.documentElement.clientWidth;

    if (vw < 768) {
      /* Mobile: let CSS handle the layout, remove JS scaling */
      document.body.classList.add('is-mobile');
      wrap.style.width = '';
      wrap.style.height = '';
      page.style.transform = 'none';
      resetCarouselTransforms();
      updateCarousel('popular');
    } else {
      document.body.classList.remove('is-mobile');
      const scale = Math.min(1, vw / designWidth);
      const scaledWidth = designWidth * scale;
      const scaledHeight = designHeight * scale;
      wrap.style.width = `${scaledWidth}px`;
      wrap.style.height = `${scaledHeight}px`;
      page.style.transform = scale === 1 ? 'none' : `scale(${scale})`;
      updateCarousel('popular');
    }
  }

  applyScale();
  window.addEventListener('resize', applyScale);
  window.addEventListener('orientationchange', applyScale);
  window.visualViewport?.addEventListener('resize', applyScale);
}

/* ─── Booking modal ─── */
function initBookingModal() {
  const modal       = document.getElementById('booking-modal');
  const backdrop    = document.getElementById('booking-backdrop');
  const closeBtn    = document.getElementById('booking-close');
  const form        = document.getElementById('booking-form');
  const bodyEl      = document.getElementById('booking-body');
  const successEl   = document.getElementById('booking-success');
  const successClose= document.getElementById('booking-success-close');

  if (!modal) return;

  /* All elements that should open the modal */
  const triggers = [
    document.getElementById('about-book'),
    document.getElementById('footer-book'),
    document.getElementById('footer-residencies'),
    document.getElementById('footer-events'),
  ].filter(Boolean);

  /* Pre-fill subject based on which link was clicked */
  const subjectMap = {
    'footer-residencies': 'Residency Inquiry',
    'footer-events':      'Private Event Inquiry',
  };

  function open(triggerId) {
    const typeSelect = document.getElementById('bf-type');
    if (typeSelect && subjectMap[triggerId]) {
      /* Pre-select the matching event type */
      const matchMap = {
        'footer-residencies': 'Residency',
        'footer-events':      'Private Event',
      };
      typeSelect.value = matchMap[triggerId] || '';
    }
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    /* Focus first input */
    setTimeout(() => {
      const first = modal.querySelector('input, select, textarea, button');
      if (first) first.focus();
    }, 50);
  }

  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
    /* Reset to form view */
    bodyEl.hidden = false;
    successEl.hidden = true;
    form.reset();
  }

  triggers.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      open(el.id);
    });
  });

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  successClose.addEventListener('click', close);

  /* Escape key closes */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });

  /* Form submission → build mailto and open email client */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('bf-name').value.trim();
    const email   = document.getElementById('bf-email').value.trim();
    const type    = document.getElementById('bf-type').value;
    const date    = document.getElementById('bf-date').value;
    const venue   = document.getElementById('bf-venue').value.trim();
    const message = document.getElementById('bf-message').value.trim();

    const subject = encodeURIComponent(`Booking Request — ${type || 'General'}`);
    const body = encodeURIComponent(
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Event Type: ${type}\n` +
      `Date: ${date}\n` +
      `Venue: ${venue}\n\n` +
      `Details:\n${message}`
    );

    window.location.href = `mailto:${SITE_LINKS.bookingEmail}?subject=${subject}&body=${body}`;

    /* Show success screen */
    bodyEl.hidden = true;
    successEl.hidden = false;
    successEl.querySelector('.booking-success-close').focus();
  });
}

/* ─── Sticky header ─── */
function initStickyHeader() {
  const header = document.getElementById('sticky-header');
  if (!header) return;

  // Show header once the user has scrolled past the in-page hero header (~120px)
  const THRESHOLD = 120;

  function update() {
    const visible = window.scrollY > THRESHOLD;
    header.classList.toggle('is-visible', visible);
    header.setAttribute('aria-hidden', visible ? 'false' : 'true');
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ─── Theme: dark / light mode ─── */
function initTheme() {
  const html = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const label = document.getElementById('theme-toggle-label');
  const saved = localStorage.getItem('lastcall-theme');
  const isDark = saved === 'dark';

  function applyTheme(dark) {
    html.classList.toggle('dark-mode', dark);
    if (btn) {
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    if (label) label.textContent = dark ? 'Light Mode' : 'Dark Mode';
  }

  applyTheme(isDark);

  if (btn) {
    btn.addEventListener('click', () => {
      btn.classList.remove('theme-toggle-hint');
      const nowDark = !html.classList.contains('dark-mode');
      applyTheme(nowDark);
      localStorage.setItem('lastcall-theme', nowDark ? 'dark' : 'light');
    });
  }
}

/* ─────────────────────────────────────────────
   Monster Soundwave — Web Audio FFT visualiser
   Strategy: the SoundCloud iframe is cross-origin so we can't tap its audio
   directly. We resolve the real stream URL via SC's /resolve API (public,
   no key needed for track info), then play it in a hidden <audio> element
   that we OWN, route through an AnalyserNode, and draw real FFT bars on the
   canvas. The SC widget continues to be the source-of-truth for UI state.
   ───────────────────────────────────────────── */
function initSoundwave() {
  const canvas = document.getElementById('monster-soundwave');
  if (!canvas || !canvas.getContext) return null;

  const ctx = canvas.getContext('2d');
  const BAR_COUNT = 90;
  const smoothed = new Float32Array(BAR_COUNT);
  let raf = null;
  let playing = false;
  let audioCtx = null;
  let analyser = null;
  let freqData = null;
  let hiddenAudio = null;
  let sourceNode = null;
  let currentUrl = '';

  /* Resize canvas to its CSS pixel size */
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = canvas.offsetWidth  * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', () => { ctx.setTransform(1,0,0,1,0,0); resize(); });
  resize();

  /* Fetch the actual streamable audio URL for a SoundCloud track page URL */
  async function resolveStreamUrl(scPageUrl) {
    try {
      /* SC /resolve gives us track JSON including stream_url */
      const oembed = await fetch(
        `https://soundcloud.com/oembed?url=${encodeURIComponent(scPageUrl)}&format=json`
      ).then(r => r.json());
      /* Extract the numeric track ID from the iframe embed URL */
      const iframeSrc = oembed.html.match(/src="([^"]+)"/)?.[1] || '';
      const trackId   = iframeSrc.match(/tracks%2F(\d+)|tracks\/(\d+)/)?.[1]
                      || iframeSrc.match(/tracks%2F(\d+)|tracks\/(\d+)/)?.[2];
      if (!trackId) return null;
      /* Public stream URL — works without an API key for browser playback */
      return `https://api.soundcloud.com/tracks/${trackId}/stream?client_id=iZIs9mchVcX5lhVRyQGGAYlNPVldzAoX`;
    } catch (_) {
      return null;
    }
  }

  /* Connect a stream URL to Web Audio */
  async function connectAudio(streamUrl) {
    if (!streamUrl) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.82;
        freqData = new Uint8Array(analyser.frequencyBinCount);
        analyser.connect(audioCtx.destination);
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();

      /* Tear down previous source */
      if (hiddenAudio) { hiddenAudio.pause(); hiddenAudio.src = ''; }
      if (sourceNode)  { try { sourceNode.disconnect(); } catch(_) {} }

      hiddenAudio = new Audio();
      hiddenAudio.crossOrigin = 'anonymous';
      hiddenAudio.src = streamUrl;
      hiddenAudio.volume = 0;        /* silent — SC widget is the real output */
      hiddenAudio.muted  = true;

      sourceNode = audioCtx.createMediaElementSource(hiddenAudio);
      sourceNode.connect(analyser);

      if (playing) {
        hiddenAudio.play().catch(() => {});
      }
    } catch (_) {}
  }

  /* Load a new track into the analyser */
  async function loadTrack(scPageUrl) {
    if (scPageUrl === currentUrl) return;
    currentUrl = scPageUrl;
    const streamUrl = await resolveStreamUrl(scPageUrl);
    await connectAudio(streamUrl);
  }

  /* Draw one frame */
  function draw() {
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    ctx.clearRect(0, 0, W, H);

    const dark = document.documentElement.classList.contains('dark-mode');

    if (analyser && freqData && playing) {
      analyser.getByteFrequencyData(freqData);
    }

    const barW   = (W - BAR_COUNT) / BAR_COUNT;
    const gutter = 1;

    for (let i = 0; i < BAR_COUNT; i++) {
      /* Map bar index to a frequency bin (log-ish scale, weighted toward bass) */
      const binIdx = Math.floor(Math.pow(i / BAR_COUNT, 1.6) * (freqData ? freqData.length : 1));
      const raw    = freqData ? (freqData[binIdx] || 0) / 255 : 0;

      /* Smooth towards raw value */
      const speed  = raw > smoothed[i] ? 0.35 : 0.12;
      smoothed[i] += (raw - smoothed[i]) * (playing ? speed : 0.05);

      /* Idle gentle floor so bars are faintly visible */
      const val    = playing ? smoothed[i] : Math.max(0, smoothed[i]);
      const h      = Math.max(3, val * H * 0.92);
      const x      = i * (barW + gutter);
      const y      = H - h;

      /* Gradient: bright at peak, fade to transparent at base */
      const grad = ctx.createLinearGradient(0, y, 0, H);
      if (dark) {
        grad.addColorStop(0,   `rgba(255,255,255,${0.55 * val + 0.08})`);
        grad.addColorStop(0.5, `rgba(255,255,255,${0.30 * val + 0.04})`);
        grad.addColorStop(1,   `rgba(255,255,255,0.02)`);
      } else {
        grad.addColorStop(0,   `rgba(0,0,0,${0.45 * val + 0.07})`);
        grad.addColorStop(0.5, `rgba(0,0,0,${0.22 * val + 0.03})`);
        grad.addColorStop(1,   `rgba(0,0,0,0.01)`);
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, h, [2, 2, 0, 0]);
      ctx.fill();
    }

    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);

  return {
    setPlaying(on) {
      playing = on;
      if (hiddenAudio) {
        if (on) hiddenAudio.play().catch(() => {});
        else    hiddenAudio.pause();
      }
      if (audioCtx && on && audioCtx.state === 'suspended') audioCtx.resume();
    },
    loadTrack,
  };
}

/** Mobile: first tap expands a social FAB; second tap follows the link. */
function initSocialFabs() {
  const fabs = document.querySelectorAll('.social-fab');
  if (!fabs.length) return;

  fabs.forEach((fab) => {
    fab.addEventListener('click', (e) => {
      if (window.innerWidth > 767) return;
      if (!fab.classList.contains('is-open')) {
        e.preventDefault();
        fabs.forEach((other) => other.classList.remove('is-open'));
        fab.classList.add('is-open');
      }
    });
  });

  document.addEventListener('click', (e) => {
    fabs.forEach((fab) => {
      if (!fab.contains(e.target)) fab.classList.remove('is-open');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      fabs.forEach((fab) => fab.classList.remove('is-open'));
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initStickyHeader();
  initBookingModal();
  initLinks();
  initSocialFabs();
  initCarousels();
  initPlayer();
  initSearch();
  initResponsiveScale();
});
