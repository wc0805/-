// ==UserScript==
// @name         Copy Unblocker (Naver + Mobile)
// @namespace    https://github.com/wc0805/user-scripts
// @version      1.6
// @description  네이버 블로그, 뉴스, 모바일 등에서 복사 제한 해제 + 모바일 터치 최적화
// @author       Anonymous
// @match        *://*.naver.com/*
// @match        *://*.blog.naver.com/*
// @match        *://*.m.blog.naver.com/*
// @match        *://*.news.naver.com/*
// @match        *://blog.naver.com/*
// @match        *://m.blog.naver.com/*
// @match        *://m.news.naver.com/*
// @run-at       document-end
// @icon         https://www.naver.com/favicon.ico
// @license      MIT
// @updateURL    https://raw.githubusercontent.com/wc0805/user-scripts/main/copy-unblocker.user.js
// @downloadURL  https://raw.githubusercontent.com/wc0805/user-scripts/main/copy-unblocker.user.js
// ==/UserScript==

(function () {
  'use strict';

  let styleElement = null;
  let observer = null;

  const enableCopy = () => {
    if (document.readyState !== 'complete') {
      window.addEventListener('load', enableCopy);
      return;
    }

    setTimeout(() => {
      document.addEventListener('contextmenu', (e) => e.stopPropagation(), true);
      document.addEventListener('copy', (e) => e.stopImmediatePropagation(), true);
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
          e.stopPropagation();
        }
      }, true);

      const css = `
          * {
              -webkit-user-select: auto !important;
              -moz-user-select: auto !important;
              -ms-user-select: auto !important;
              user-select: auto !important;
              -webkit-touch-callout: default !important;
              touch-action: auto !important;
          }

          html, body {
              -webkit-touch-callout: default !important;
              touch-action: auto !important;
          }

          [style*="user-select: none"],
          [style*="user-select:none"] {
              user-select: auto !important;
          }
      `;

      styleElement = document.createElement('style');
      styleElement.textContent = css;
      document.head.appendChild(styleElement);

      initOverlayRemoval();
      enableSelectionEvents();

      console.log('✅ 복사 제한 해제 완료 (네이버 + 모바일 대응)');
    }, 800);
  };

  const initOverlayRemoval = () => {
    const removeOverlays = () => {
      document.querySelectorAll('div, section, aside, header, footer, nav').forEach(element => {
        const style = window.getComputedStyle(element);
        const isBlocking =
          ['fixed', 'absolute', 'sticky'].includes(style.position) &&
          element.offsetHeight >= window.innerHeight * 0.3 &&
          parseInt(style.zIndex) >= 10;
        if (isBlocking) {
          element.remove();
        }
      });
    };

    observer = new MutationObserver(() => {
      removeOverlays();
      enableSelectionEvents();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    removeOverlays();
  };

  const enableSelectionEvents = () => {
    document.onselectstart = null;
    document.ondragstart = null;
    document.onmousedown = null;
    if (window.getSelection && typeof window.getSelection().removeAllRanges === 'function') {
      try {
        window.getSelection().removeAllRanges();
      } catch (e) {}
    }
  };

  enableCopy();
})();
