// 语言检测和切换功能
class LanguageManager {
  constructor() {
    this.currentLang = this.detectLanguage();
    this.init();
  }

  detectLanguage() {
    // 检查本地存储
    const savedLang = localStorage.getItem("preferred-language");
    if (savedLang) {
      return savedLang;
    }

    // 默认显示英文版
    return "en";
  }

  init() {
    this.setLanguage(this.currentLang);
    this.bindEvents();
    this.showLanguageHint();
  }

  setLanguage(lang) {
    this.currentLang = lang;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

    // 更新所有带有data属性的元素
    const elements = document.querySelectorAll("[data-en][data-zh]");
    elements.forEach((element) => {
      const text = element.getAttribute(`data-${lang}`);
      if (text) {
        // 处理换行符
        const processedText = text.replace(/&#10;/g, "\n");
        element.textContent = processedText;
      }
    });

    // 更新placeholder属性
    const inputs = document.querySelectorAll(
      "[data-placeholder-en][data-placeholder-zh]",
    );
    inputs.forEach((input) => {
      const placeholder = input.getAttribute(`data-placeholder-${lang}`);
      if (placeholder) {
        input.placeholder = placeholder;
      }
    });

    // 更新语言切换按钮状态
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-lang") === lang) {
        btn.classList.add("active");
      }
    });

    // 保存到本地存储
    localStorage.setItem("preferred-language", lang);
  }

  bindEvents() {
    // 语言切换按钮事件
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const lang = e.target.getAttribute("data-lang");
        this.setLanguage(lang);
        this.hideLanguageHint();
      });
    });
  }

  showLanguageHint() {
    // 如果用户没有手动切换过语言，显示提示
    if (!localStorage.getItem("preferred-language")) {
      setTimeout(() => {
        const hint = document.createElement("div");
        hint.className = "language-hint";
        hint.innerHTML = "🌐 Click to switch to 中文";
        hint.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: rgba(0, 212, 255, 0.1);
                    border: 1px solid rgba(0, 212, 255, 0.3);
                    color: #00d4ff;
                    padding: 10px 15px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    z-index: 10000;
                    animation: fadeInOut 3s ease-in-out;
                    cursor: pointer;
                `;

        // 添加动画样式
        const style = document.createElement("style");
        style.textContent = `
                    @keyframes fadeInOut {
                        0%, 100% { opacity: 0; transform: translateY(-10px); }
                        20%, 80% { opacity: 1; transform: translateY(0); }
                    }
                `;
        document.head.appendChild(style);

        document.body.appendChild(hint);

        // 点击提示也可以切换语言
        hint.addEventListener("click", () => {
          this.setLanguage("zh");
          this.hideLanguageHint();
        });

        // 3秒后自动隐藏
        setTimeout(() => {
          if (document.body.contains(hint)) {
            hint.style.animation = "fadeInOut 1s ease-in-out reverse";
            setTimeout(() => {
              if (document.body.contains(hint)) {
                document.body.removeChild(hint);
              }
            }, 1000);
          }
        }, 3000);
      }, 2000);
    }
  }

  hideLanguageHint() {
    const hint = document.querySelector(".language-hint");
    if (hint) {
      hint.style.animation = "fadeInOut 0.5s ease-in-out reverse";
      setTimeout(() => {
        if (document.body.contains(hint)) {
          document.body.removeChild(hint);
        }
      }, 500);
    }
  }
}

// 初始化语言管理器
const languageManager = new LanguageManager();

// 导航栏滚动效果
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(10, 10, 10, 0.98)";
    navbar.style.boxShadow = "0 2px 20px rgba(0, 212, 255, 0.1)";
  } else {
    navbar.style.background = "rgba(10, 10, 10, 0.95)";
    navbar.style.boxShadow = "none";
  }
});

// 移动端菜单切换
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// 点击导航链接时关闭移动端菜单
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// 滚动时显示元素动画
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// 观察需要动画的元素
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".timeline-item, .skill-category, .project-card, .language-card, .about-text, .about-image",
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});

// 技能标签悬停效果
document.querySelectorAll(".skill-tag").forEach((tag) => {
  tag.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.1) rotate(2deg)";
  });

  tag.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1) rotate(0deg)";
  });
});

// 项目卡片3D倾斜效果
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
  });
});

// 联系表单处理
const contactForm = document.querySelector(".contact-form form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // 获取表单数据
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const subject = this.querySelectorAll('input[type="text"]')[1].value;
    const message = this.querySelector("textarea").value;

    // 简单的表单验证
    if (!name || !email || !subject || !message) {
      const errorMsg =
        languageManager.currentLang === "zh"
          ? "请填写所有必填字段"
          : "Please fill in all required fields";
      showNotification(errorMsg, "error");
      return;
    }

    if (!isValidEmail(email)) {
      const errorMsg =
        languageManager.currentLang === "zh"
          ? "请输入有效的邮箱地址"
          : "Please enter a valid email address";
      showNotification(errorMsg, "error");
      return;
    }

    // 模拟发送邮件
    const successMsg =
      languageManager.currentLang === "zh"
        ? "消息发送成功！我会尽快回复您。"
        : "Message sent successfully! I will reply to you as soon as possible.";
    showNotification(successMsg, "success");
    this.reset();
  });
}

// 邮箱验证函数
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 通知函数
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // 样式
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === "success" ? "#00d4ff" : "#ff4444"};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

  document.body.appendChild(notification);

  // 显示动画
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // 自动隐藏
  setTimeout(() => {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// 打字机效果
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// 数字计数动画
function animateNumbers() {
  const statNumbers = document.querySelectorAll(".stat-number");

  statNumbers.forEach((stat) => {
    const targetValue = parseFloat(
      stat.dataset.target || stat.textContent.replace(/[^0-9.]/g, ""),
    );
    if (Number.isNaN(targetValue)) {
      return;
    }

    const suffix =
      stat.dataset.suffix || (stat.textContent.trim().endsWith("+") ? "+" : "");
    const decimals = parseInt(stat.dataset.decimals || "0", 10);
    const duration = 2000;
    const start = performance.now();

    const updateValue = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const value = targetValue * progress;
      const formatted =
        decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
      stat.textContent = `${formatted}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        const finalValue =
          decimals > 0
            ? targetValue.toFixed(decimals)
            : Math.round(targetValue);
        stat.textContent = `${finalValue}${suffix}`;
      }
    };

    requestAnimationFrame(updateValue);
  });
}

function initLanguageProgress() {
  const progressGroups = document.querySelectorAll(".language-progress");
  if (!progressGroups.length) {
    return;
  }

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const progressGroup = entry.target;
        const rawProgress = parseFloat(progressGroup.dataset.progress || "0");
        const normalized = clamp(rawProgress, 0, 1);
        progressGroup.style.setProperty("--progress", normalized);
        progressGroup.classList.add("filled");
        obs.unobserve(progressGroup);
      });
    },
    { threshold: 0.4 },
  );

  progressGroups.forEach((group) => {
    group.classList.remove("filled");
    group.style.setProperty("--progress", 0);
    observer.observe(group);
  });
}

// 当统计部分进入视口时启动数字动画
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateNumbers();
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

const statsSection = document.querySelector(".stats");
if (statsSection) {
  statsObserver.observe(statsSection);
}

// 粒子背景效果
function createParticles() {
  const hero = document.querySelector(".hero");
  if (!hero) {
    return;
  }
  const particleCount = 50;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: #00d4ff;
            border-radius: 50%;
            opacity: 0.6;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;

    fragment.appendChild(particle);
  }

  hero.appendChild(fragment);
}

// 页面加载完成后创建粒子效果
document.addEventListener("DOMContentLoaded", () => {
  createParticles();
});

// 添加粒子动画CSS
const style = document.createElement("style");
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        25% { transform: translateY(-20px) translateX(10px); }
        50% { transform: translateY(-10px) translateX(-10px); }
        75% { transform: translateY(-30px) translateX(5px); }
    }
`;
document.head.appendChild(style);

// 滚动进度条
function createScrollProgress() {
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(45deg, #00d4ff, #0099cc);
        z-index: 10001;
        transition: width 0.1s ease;
    `;

  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + "%";
  });
}

// 页面加载完成后创建滚动进度条
document.addEventListener("DOMContentLoaded", () => {
  createScrollProgress();
  createMouseCursor();
  addTypingEffect();
  addParallaxEffect();
  addStaggeredAnimations();
  initLanguageProgress();
});

// 平滑的页面加载动画
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition =
    "opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 200);
});

// 键盘导航支持
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // 关闭移动端菜单
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  }
});

// 触摸设备优化
if ("ontouchstart" in window) {
  document.body.classList.add("touch-device");

  // 为触摸设备添加特殊样式
  const touchStyle = document.createElement("style");
  touchStyle.textContent = `
        .touch-device .project-card:hover {
            transform: none;
        }
        .touch-device .skill-tag:hover {
            transform: none;
        }
    `;
  document.head.appendChild(touchStyle);
}

// 创建鼠标跟随效果
function createMouseCursor() {
  const cursor = document.createElement("div");
  cursor.className = "cursor";
  document.body.appendChild(cursor);

  const cursorFollower = document.createElement("div");
  cursorFollower.className = "cursor-follower";
  document.body.appendChild(cursorFollower);

  let mouseX = 0,
    mouseY = 0;
  let followerX = 0,
    followerY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    cursorFollower.style.left = followerX + "px";
    cursorFollower.style.top = followerY + "px";

    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // 悬停效果
  const hoverElements = document.querySelectorAll(
    "a, button, .floating-card, .project-card, .skill-tag, .language-card",
  );
  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "scale(1.5)";
      cursorFollower.style.transform = "scale(1.5)";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "scale(1)";
      cursorFollower.style.transform = "scale(1)";
    });
  });
}

// 打字机效果
function addTypingEffect() {
  const heroTitle = document.querySelector(".hero-title .name");
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = "";
    heroTitle.style.opacity = "1";

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 80);
      }
    };

    setTimeout(typeWriter, 1200);
  }
}

// 视差滚动效果
function addParallaxEffect() {
  const parallaxElements = document.querySelectorAll(
    ".floating-card, .hero-image",
  );
  if (!parallaxElements.length) {
    return;
  }

  let ticking = false;

  const updateParallax = () => {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach((el, index) => {
      const speed = 0.08 + index * 0.04;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    },
    { passive: true },
  );
}

// 交错动画效果
function addStaggeredAnimations() {
  const animatedElements = document.querySelectorAll(
    ".timeline-item, .skill-category, .project-card, .language-card",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0) scale(1)";
          }, index * 150);
        }
      });
    },
    { threshold: 0.15 },
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px) scale(0.95)";
    el.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    el.style.willChange = "transform, opacity";
    observer.observe(el);
  });
}

// 创建星空粒子系统
function createStarField() {
  const hero = document.querySelector(".hero");
  const starCount = 50;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const size = Math.random() * 2 + 0.5;
    const duration = 3 + Math.random() * 4;
    const delay = Math.random() * 2;
    const brightness = Math.random() * 0.8 + 0.2;

    star.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, ${brightness});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: starGlow ${duration}s ease-in-out infinite;
            animation-delay: ${delay}s;
            will-change: opacity;
            box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, ${brightness * 0.5});
        `;

    hero.appendChild(star);
  }
}

// 星空闪烁动画
const starFieldStyle = document.createElement("style");
starFieldStyle.textContent = `
    @keyframes starGlow {
        0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
        }
        50% { 
            opacity: 1;
            transform: scale(1.2);
        }
    }
    
    .star:hover {
        opacity: 1 !important;
        transform: scale(1.5) !important;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.8) !important;
        transition: all 0.3s ease !important;
    }
`;
document.head.appendChild(starFieldStyle);

// 移除波浪背景效果，专注于星空主题

// 全局动画优化
function optimizeAnimations() {
  // 减少重绘和重排
  const style = document.createElement("style");
  style.textContent = `
        .hero, .floating-card, .project-card, .skill-category, .timeline-item {
            contain: layout style paint;
        }
        
        .particle {
            contain: layout style paint;
        }
        
        /* 硬件加速 */
        .hero-content, .hero-image, .floating-card {
            transform: translateZ(0);
            backface-visibility: hidden;
        }
        
        /* 平滑滚动优化 */
        html {
            scroll-behavior: smooth;
        }
        
        /* 减少动画卡顿 */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
  document.head.appendChild(style);
}

// 初始化所有动画效果
document.addEventListener("DOMContentLoaded", () => {
  optimizeAnimations();
  createStarField();
});
