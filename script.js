/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   script.js — CKCGW 웹사이트 공통 스크립트
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. 모바일 햄버거 메뉴 ── */
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('.navbar-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
    // 메뉴 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
      }
    });
  }

  /* ── 2. 스크롤 reveal 애니메이션 ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ── 3. 현재 페이지 네비 active 처리 ── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-menu a').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* ── 4. 갤러리 라이트박스 ── */
  const lightbox        = document.getElementById('lightbox');
  const lightboxImg     = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose   = document.getElementById('lightboxClose');

  if (lightbox) {
    // 갤러리 아이템 클릭
    document.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item[data-src]');
      // 수정됨: 앨범 커버(album-cover)를 클릭했을 때는 라이트박스가 켜지지 않도록 방지
      if (item && !item.classList.contains('album-cover')) {
        const src     = item.dataset.src;
        const caption = item.dataset.caption || '';
        if (src && !src.startsWith('#')) {
          lightboxImg.src             = src;
          lightboxCaption.textContent = caption;
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      }
    });

    // 닫기
    function closeLightbox() {
      lightbox.classList.remove('open');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ── 5. 갤러리 앨범 열기 / 닫기 기능 (새로 추가됨) ── */
  window.openAlbum = function(albumId) {
    const targetAlbum = document.getElementById(albumId);
    if (!targetAlbum) return;
    const yearSection = targetAlbum.closest('.year-section');
    const year = yearSection.dataset.year;

    // 앨범 목록(커버들) 숨기기
    const albumList = document.getElementById('album-list-' + year);
    if (albumList) albumList.style.display = 'none';

    // 선택한 앨범 내부 사진들 보여주기
    targetAlbum.style.display = 'block';
  };

  window.closeAlbum = function(year) {
    // 앨범 목록(커버들) 다시 보여주기
    const albumList = document.getElementById('album-list-' + year);
    if (albumList) albumList.style.display = '';
    
    // 열려있는 모든 앨범 내부 화면 숨기기
    const yearSection = document.querySelector(`.year-section[data-year="${year}"]`);
    if (yearSection) {
      yearSection.querySelectorAll('.album-detail').forEach(detail => {
        detail.style.display = 'none';
      });
    }
  };

  /* ── 6. 갤러리 연도 탭 필터 (수정됨) ── */
  window.filterYear = function(year, btn) {
    // 탭 active
    document.querySelectorAll('.year-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    // 행사 제목까지 함께 제어하기 위해 year-section 단위로 표시/숨김
    document.querySelectorAll('.year-section').forEach(section => {
      const show = (year === 'all') || (section.dataset.year === year);
      section.style.display = show ? '' : 'none';

      // 💡수정됨: 연도 탭을 누르면 무조건 '앨범 커버 목록'이 보이고 '내부 사진'은 숨겨지도록 초기화
      if (show) {
        const y = section.dataset.year;
        const albumList = document.getElementById('album-list-' + y);
        if (albumList) albumList.style.display = '';

        section.querySelectorAll('.album-detail').forEach(detail => {
          detail.style.display = 'none';
        });
      }
    });
  };

  /* ── 7. 교회 목록 검색 & 지역 필터 ── */
  const churchSearchInput = document.getElementById('churchSearch');
  if (churchSearchInput) {
    churchSearchInput.addEventListener('input', filterChurches);
  }

  window.filterChurchRegion = function(region, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    btn.dataset.region = region;
    filterChurches();
  };

  function filterChurches() {
    const query  = (churchSearchInput?.value || '').toLowerCase();
    const active = document.querySelector('.filter-btn.active');
    const region = active?.dataset?.region || 'all';

    document.querySelectorAll('.church-card').forEach(card => {
      const matchQuery  = card.innerText.toLowerCase().includes(query);
      const matchRegion = (region === 'all') || (card.dataset.region === region);
      card.style.display = (matchQuery && matchRegion) ? '' : 'none';
    });
  }

  /* ── 8. 공지사항 탭 필터 ── */
  window.filterNews = function(category, btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.news-full-card').forEach(card => {
      const show = (category === 'all') || (card.dataset.category === category);
      card.style.display = show ? '' : 'none';
    });
  };

  /* ── 9. 문의 폼 제출 (더미 — 실제로는 서버 필요) ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-submit');
      btn.textContent = '전송 중...';
      btn.disabled = true;
      // 실제 서버 연동 전 시뮬레이션
      setTimeout(() => {
        btn.textContent = '✓ 문의가 접수되었습니다';
        btn.style.background = '#2e7d32';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = '문의 보내기 →';
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1200);
    });
  }

  /* ── 10. 이미지 로드 에러 처리 (placeholder 표시) ── */
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('error', () => {
      const parent = img.closest('.gallery-item');
      if (parent) {
        img.style.display = 'none';
        const ph = parent.querySelector('.photo-placeholder');
        if (ph) ph.style.display = 'flex';
      }
    });
  });

});