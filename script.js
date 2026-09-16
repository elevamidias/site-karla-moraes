// =========================================================
// script.js — organizado em um único ponto de inicialização.
// (Antes havia 4 blocos DOMContentLoaded separados e uma função
// de efeito parallax que nunca era chamada; ambos foram
// consolidados/removidos para facilitar manutenção futura.)
// =========================================================

// Função para rolagem suave para seções
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const elementPosition = element.offsetTop - headerHeight - 20;

    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
}

// Função para destacar o link ativo na navegação
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a');

  let current = '';
  const scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// Função para animação de entrada dos cards
function animateCardsOnScroll() {
  const cards = document.querySelectorAll('.specialty-card, .testimonial-card, .contact-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
}

// Função para contador animado
function animateCounters() {
  const counters = document.querySelectorAll('.experience-number');

  counters.forEach(counter => {
    const target = parseInt(counter.textContent);
    let current = 0;
    const increment = target / 50;

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        counter.textContent = Math.ceil(current) + '+';
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + '+';
      }
    };

    // Iniciar animação quando o elemento estiver visível
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(counter);
  });
}

// Função para melhorar a acessibilidade
function improveAccessibility() {
  // Adicionar foco visível para navegação por teclado
  const focusableElements = document.querySelectorAll('a, button, input, textarea, select');

  focusableElements.forEach(element => {
    element.addEventListener('focus', () => {
      element.style.outline = '2px solid var(--accent-purple)';
      element.style.outlineOffset = '2px';
    });

    element.addEventListener('blur', () => {
      element.style.outline = 'none';
    });
  });

  // Adicionar navegação por teclado para links de âncora
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'A') {
      e.target.click();
    }
  });
}

// Função para otimizar o carregamento de imagens
function optimizeImageLoading() {
  const images = document.querySelectorAll('img');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        img.style.opacity = '1';
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    imageObserver.observe(img);
  });
}

// Função para adicionar efeitos de hover nos botões
function addButtonEffects() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
    });
  });
}

// Função para adicionar loading state nos botões de WhatsApp
function addWhatsAppButtonLoading() {
  const whatsappButtons = document.querySelectorAll('button[onclick*="wa.me"]');

  whatsappButtons.forEach(button => {
    button.addEventListener('click', () => {
      const originalText = button.innerHTML;
      button.innerHTML = '<span>📱</span> Abrindo WhatsApp...';
      button.disabled = true;

      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
      }, 2000);
    });
  });
}

// Função para validação básica de formulários (se houver)
function addFormValidation() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#e74c3c';
          input.style.boxShadow = '0 0 5px rgba(231, 76, 60, 0.3)';
        } else {
          input.style.borderColor = '';
          input.style.boxShadow = '';
        }
      });

      if (!isValid) {
        e.preventDefault();
        alert('Por favor, preencha todos os campos obrigatórios.');
      }
    });
  });
}

// Função para melhorar a performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/* CARROSSEL 1 — faixa de depoimentos (.slides / .prev / .next) */
function initTestimonialCarousel() {
  const slides = document.querySelector('.slides');
  const images = document.querySelectorAll('.slides img');
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');
  if (!slides || !prevButton || !nextButton || images.length === 0) return;

  let currentIndex = 0;

  function updateCarousel() {
    const slideWidth = images[0].clientWidth + 20; // largura da imagem + gap
    slides.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }

  function nextSlide() {
    if (currentIndex < images.length - Math.floor(800 / (images[0].clientWidth + 20))) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = images.length - Math.floor(800 / (images[0].clientWidth + 20));
      if (currentIndex < 0) currentIndex = 0;
    }
    updateCarousel();
  }

  nextButton.addEventListener('click', nextSlide);
  prevButton.addEventListener('click', prevSlide);

  // AutoPlay
  setInterval(nextSlide, 3000);

  // Corrigir tamanho ao redimensionar
  window.addEventListener('resize', updateCarousel);
}

/* CARROSSEL 2 — galeria de fotos (.gallery-item / .prev-btn / .next-btn / .dot) */
function initPhotoGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const dots = document.querySelectorAll('.dot');
  const galleryWrapper = document.querySelector('.gallery-wrapper');
  if (!galleryWrapper || !prevBtn || !nextBtn || galleryItems.length === 0) return;

  let currentIndex = 0;
  let autoSlideInterval;
  let isTransitioning = false;

  // Função para mostrar slide específico
  function showSlide(index) {
    if (isTransitioning) return;

    isTransitioning = true;

    // Remove classes ativas
    galleryItems.forEach((item, i) => {
      item.classList.remove('active', 'prev');
      dots[i].classList.remove('active');
    });

    // Adiciona classes ativas
    galleryItems[index].classList.add('active');
    dots[index].classList.add('active');

    currentIndex = index;

    // Reset da transição
    setTimeout(() => {
      isTransitioning = false;
    }, 800);
  }

  // Função para próximo slide
  function nextSlide() {
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    showSlide(nextIndex);
  }

  // Função para slide anterior
  function prevSlide() {
    const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    showSlide(prevIndex);
  }

  // Função para iniciar slideshow automático
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 4000); // Muda a cada 4 segundos
  }

  // Função para parar slideshow automático
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Event listeners para botões
  prevBtn.addEventListener('click', () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });

  // Event listeners para dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (index !== currentIndex) {
        stopAutoSlide();
        showSlide(index);
        startAutoSlide();
      }
    });
  });

  // Pausar slideshow quando mouse está sobre a galeria
  galleryWrapper.addEventListener('mouseenter', stopAutoSlide);
  galleryWrapper.addEventListener('mouseleave', startAutoSlide);

  // Suporte para navegação por teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    } else if (e.key === 'ArrowRight') {
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    }
  });

  // Suporte para touch/swipe em dispositivos móveis
  let startX = 0;
  let endX = 0;

  galleryWrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  galleryWrapper.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > swipeThreshold) {
      stopAutoSlide();
      if (diff > 0) {
        // Swipe left - próximo slide
        nextSlide();
      } else {
        // Swipe right - slide anterior
        prevSlide();
      }
      startAutoSlide();
    }
  }

  // Inicializar galeria
  showSlide(currentIndex);
  startAutoSlide();

  // Adicionar indicador de carregamento para imagens
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    img.addEventListener('load', () => {
      item.classList.add('loaded');
    });

    // Fallback para imagens que não carregam
    img.addEventListener('error', () => {
      img.src = `https://via.placeholder.com/800x500/1e3c72/ffffff?text=Foto+${index + 1}`;
    });
  });
}

/* Formulário de contato — monta a mensagem e abre no WhatsApp.
   Substitui o envio por EmailJS, que dependia de um script ausente. */
const WHATSAPP_NUMERO = '5591982644888';

function initWhatsAppForm() {
  const form = document.querySelector('#form-whatsapp');
  if (!form) return;

  const status = form.querySelector('#wa-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const contato = form.contato.value.trim();
    const assunto = form.assunto.value;
    const mensagem = form.mensagem.value.trim();

    if (!nome || !contato || !assunto || !mensagem) {
      status.textContent = 'Preencha todos os campos para continuar.';
      status.classList.add('erro');
      return;
    }

    status.classList.remove('erro');
    status.textContent = 'Abrindo o WhatsApp com a sua mensagem...';

    const texto =
      'Olá, Dra. Karla! Vim pelo site.\n\n' +
      'Nome: ' + nome + '\n' +
      'Contato: ' + contato + '\n' +
      'Assunto: ' + assunto + '\n\n' +
      mensagem;

    window.open('https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(texto), '_blank');

    form.reset();
    setTimeout(() => { status.textContent = ''; }, 6000);
  });
}

// Animação de digitação do nome principal do hero.
// O texto completo fica em um "fantasma" invisível que reserva o espaço final,
// e a versão visível é desenhada por cima. Assim nada reflui durante a digitação.
function animateHeroTitle() {
  const title = document.querySelector('.hero-title-name[data-typewriter]');
  if (!title) return;

  const text = title.textContent.trim();
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  title.textContent = '';
  title.classList.add('typing-title');
  // O espaço final é reservado via CSS (content: attr(data-full)), não por um
  // segundo span com o texto — assim o H1 nunca fica com o nome duplicado no HTML.
  title.setAttribute('data-full', text);

  const visivel = document.createElement('span');
  visivel.className = 'tw-text';
  title.append(visivel);

  if (reduzido) {
    visivel.textContent = text;
    title.classList.add('done');
    return;
  }

  const DURACAO = 1500;
  let inicio = null;

  const passo = (agora) => {
    if (inicio === null) inicio = agora;
    const progresso = Math.min((agora - inicio) / DURACAO, 1);
    const chars = Math.round(progresso * text.length);

    if (visivel.textContent.length !== chars) {
      visivel.textContent = text.slice(0, chars);
    }

    if (progresso < 1) {
      requestAnimationFrame(passo);
    } else {
      setTimeout(() => title.classList.add('done'), 1200);
    }
  };

  setTimeout(() => requestAnimationFrame(passo), 300);
}

// Menu de navegação no celular
function initMobileNav() {
  const toggle = document.querySelector('#nav-toggle');
  const menu = document.querySelector('#nav-menu');
  if (!toggle || !menu) return;

  const fechar = () => {
    menu.classList.remove('aberto');
    toggle.classList.remove('ativo');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu de navegação');
  };

  toggle.addEventListener('click', () => {
    const aberto = menu.classList.toggle('aberto');
    toggle.classList.toggle('ativo', aberto);
    toggle.setAttribute('aria-expanded', String(aberto));
    toggle.setAttribute('aria-label', aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
  });

  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', fechar));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fechar();
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) fechar();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) fechar();
  });
}

// O botão flutuante do WhatsApp some quando a seção de contato está na tela,
// para não cobrir o botão de envio do formulário no celular.
function initFloatingButtonVisibility() {
  const botao = document.querySelector('.whatsapp-button');
  const contato = document.querySelector('#contato');
  if (!botao || !contato || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(([entry]) => {
    botao.classList.toggle('oculto', entry.isIntersecting);
  }, { threshold: 0.12 });

  observer.observe(contato);
}

// =========================================================
// Inicialização — ponto único, executado quando o DOM carrega.
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNavLink();
  animateCardsOnScroll();
  animateCounters();
  improveAccessibility();
  optimizeImageLoading();
  addButtonEffects();
  addWhatsAppButtonLoading();
  addFormValidation();

  // Smooth scroll para links de âncora
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });

  initTestimonialCarousel();
  initPhotoGallery();
  initWhatsAppForm();
  animateHeroTitle();
  initMobileNav();
  initFloatingButtonVisibility();
});

// Recalcular link ativo ao redimensionar a janela
window.addEventListener('resize', updateActiveNavLink);

// Recalcular link ativo durante a rolagem (com debounce, uma única vez)
window.addEventListener('scroll', debounce(updateActiveNavLink, 10));
