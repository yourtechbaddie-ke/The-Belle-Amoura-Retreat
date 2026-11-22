// ==========================================================================
// THE BELLE AMOURA RETREAT — CLIENT UX & INTERACTIVE ENGINE
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation drawer is authoritatively orchestrated by nav.js
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (typeof window.__closeRetreatDrawer === 'function') {
        window.__closeRetreatDrawer();
      }
      closeEscapeModal();
    }
  });

  // 2. Escape Dossier Modal Data
  const escapeDossiers = {
    bali: {
      title: 'Bali Cliffside Ocean Sanctuaries',
      kicker: 'BALI · ULUWATU & NUSA DUA',
      category: 'Coastal & Islands',
      image: 'https://images.pexels.com/photos/35043038/pexels-photo-35043038.jpeg?auto=compress&cs=tinysrgb&w=1600',
      description: 'Private cantilevered pool pavilions suspended above the Indian Ocean. Floating breakfasts, private temple water purifications, and slow living.',
      idealSeason: 'April – October (Dry season with offshore breezes)',
      travelRhythm: 'Deeply restorative, ocean-centric, unhurried',
      conciergeHighlights: 'Private villa butler, floating breakfast setup, private speed boat charter to Nusa Penida coves',
      itinerary: [
        { day: 'Phase 01', text: 'Private fast-track VIP arrival at Denpasar followed by luxury chauffeured transfer to Uluwatu cliff villa.' },
        { day: 'Phase 02', text: 'Floating breakfast in your private infinity pool followed by a private temple water blessing with a master priest.' },
        { day: 'Phase 03', text: 'Sunset private catamaran cruise along the Bukit peninsula with an onboard private chef.' }
      ]
    },
    safari: {
      title: 'Serengeti & Masai Mara Luxury in the Wild',
      kicker: 'SERENGETI · MARA CONSERVANCY · OKAVANGO',
      category: 'Wilderness & Safari',
      image: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=1600',
      description: 'Follow the migration in complete silence. Solar-powered luxury canvas pavilions, private bush planes directly to remote airstrips, and open 4x4 safaris.',
      idealSeason: 'July – October (Great River Crossings) / January – March (Calving)',
      travelRhythm: 'Dawn expeditions, golden-hour reflection, fireside stargazing',
      conciergeHighlights: 'Private field naturalist, bush aircraft landings, candlelit savanna bush dinners',
      itinerary: [
        { day: 'Phase 01', text: 'Private charter flight landing on secluded bush runway with direct safari vehicle escort to the lodge.' },
        { day: 'Phase 02', text: 'Sunrise hot-air balloon flight above the Mara river followed by a secluded champagne bush breakfast.' },
        { day: 'Phase 03', text: 'Private wildlife tracking through an exclusive conservancy closed to mass tourism.' }
      ]
    },
    amalfi: {
      title: 'Amalfi Coast & Capri Private Residences',
      kicker: 'AMALFI · POSITANO · CAPRI',
      category: 'Coastal & Islands',
      image: 'https://images.pexels.com/photos/34790496/pexels-photo-34790496.jpeg?auto=compress&cs=tinysrgb&w=1600',
      description: 'Historic lemon-grove villas clinging to limestone precipices. Private Riva motorboat excursions, secluded swimming grottos, and terrace dining.',
      idealSeason: 'May – June / September – October',
      travelRhythm: 'Sensory, sun-drenched, maritime freedom',
      conciergeHighlights: 'Private Riva motorboat day charter, secluded cove dining access, private sommelier cellar tour',
      itinerary: [
        { day: 'Phase 01', text: 'Private helicopter transfer from Naples directly to private coastal villa helipad.' },
        { day: 'Phase 02', text: 'All-day cruise to Capri and Li Galli islands with swimming in sea caves and cliffside lunch.' },
        { day: 'Phase 03', text: 'Private terrace dinner prepared by an Amalfi culinary maestro using organic garden produce.' }
      ]
    },
    kyoto: {
      title: 'Kyoto & Imperial Cultural Sanctuaries',
      kicker: 'KYOTO · NAOSHIMA · ARASHIYAMA',
      category: 'City & Culture',
      image: 'https://images.pexels.com/photos/29289153/pexels-photo-29289153.jpeg?auto=compress&cs=tinysrgb&w=1600',
      description: 'Beyond crowded shrines into centuries-old private machiya townhouses, head-abbot temple meditations, and secluded artisan ateliers.',
      idealSeason: 'October – December (Momiji foliage) / March – May (Spring)',
      travelRhythm: 'Contemplative, sensory, culturally profound',
      conciergeHighlights: 'Private Zen abbot meditation, multi-generation tea master ceremony, VIP museum curatorial tours',
      itinerary: [
        { day: 'Phase 01', text: 'Arrival into historic heritage ryokan with private cedar onsen and tranquil moss courtyard.' },
        { day: 'Phase 02', text: 'Early morning private gate opening at Daitoku-ji temple with head monk guidance.' },
        { day: 'Phase 03', text: 'Evening private kaiseki dining accompanied by a classical koto performance.' }
      ]
    },
    maldives: {
      title: 'Maldives Overwater Lagoon Pavilions',
      kicker: 'BAA ATOLL · LACCADIVE SEA',
      category: 'Coastal & Islands',
      image: 'https://images.pexels.com/photos/29863339/pexels-photo-29863339.jpeg?auto=compress&cs=tinysrgb&w=1600',
      description: 'Secluded overwater villas perched above crystal turquoise lagoons. Manta ray private snorkeling excursions and castaway sandbank picnics.',
      idealSeason: 'November – April (Glass-calm seas)',
      travelRhythm: 'Barefoot luxury, marine immersion, serene stillness',
      conciergeHighlights: 'Private marine biologist guide, secluded sandbank private dinner, seaplane charter',
      itinerary: [
        { day: 'Phase 01', text: 'VIP seaplane scenic flight directly to private island jetty with dedicated villa host.' },
        { day: 'Phase 02', text: 'Private yacht excursion to Hanifaru Bay for private snorkeling with manta rays and whale sharks.' },
        { day: 'Phase 03', text: 'Lantern-lit private sandbank dinner isolated in the middle of the Indian Ocean.' }
      ]
    },
    alps: {
      title: 'Swiss Alps & Restorative Mountain Lodges',
      kicker: 'ZERMATT · ENGADIN · DOLOMITES',
      category: 'Wellness & Spa',
      image: 'https://images.pexels.com/photos/30615183/pexels-photo-30615183.jpeg?auto=compress&cs=tinysrgb&w=1600',
      description: 'Alpine air, thermal mineral springs, and larch-wood architectural chalets with panoramic glacier vistas.',
      idealSeason: 'December – April (Winter ski & thermal) / June – September (Summer alpine wildflowers)',
      travelRhythm: 'Invigorating, grounding, thermal restorative',
      conciergeHighlights: 'Private alpine mountain guide, heli-hiking, bespoke botanical hydrotherapy',
      itinerary: [
        { day: 'Phase 01', text: 'Scenic luxury panoramic train or helicopter arrival into alpine private chalet.' },
        { day: 'Phase 02', text: 'Guided high-altitude alpine hike followed by custom outdoor cedar hot tub immersion.' },
        { day: 'Phase 03', text: 'Restorative thermal hydrotherapy and botanical dinner sourced from high-meadow farms.' }
      ]
    },
    aviation: {
      title: 'Bespoke Private Aviation & Remote Charters',
      kicker: 'POINT-TO-POINT · ZERO AIRPORT DELAYS',
      category: 'Private Aviation & Charters',
      image: 'https://images.pexels.com/photos/358220/pexels-photo-358220.jpeg?auto=compress&cs=tinysrgb&w=1600',
      description: 'Fly directly into private airstrips, remote island runways, and wilderness camps without commercial hub layovers.',
      idealSeason: 'On-demand 365 days',
      travelRhythm: 'Absolute autonomy, frictionless transitions, seamless boarding',
      conciergeHighlights: 'Tarmac ramp access, bespoke onboard culinary curation, direct luggage transit',
      itinerary: [
        { day: 'Phase 01', text: 'Seamless departure from private executive terminal with expedited five-minute screening.' },
        { day: 'Phase 02', text: 'Direct point-to-point transcontinental flight tailored with personalized vintage cellar selection.' },
        { day: 'Phase 03', text: 'Direct landing at private island or remote safari airstrip with greeting liaison.' }
      ]
    },
    desert: {
      title: 'Golden Horizon Desert Pavilions',
      kicker: 'WADI RUM · NAMIB · SAHARA',
      category: 'Wilderness & Safari',
      image: 'https://images.pexels.com/photos/1001435/pexels-photo-1001435.jpeg?auto=compress&cs=tinysrgb&w=1600',
      description: 'Silent dunes and deep-space night skies. Architectural glass pavilions designed to immerse you in dramatic desert topography.',
      idealSeason: 'October – April',
      travelRhythm: 'Stillness, cosmic clarity, ancient horizons',
      conciergeHighlights: 'Private astrophysicist telescope session, bespoke 4x4 desert navigation, private bedouin tea rituals',
      itinerary: [
        { day: 'Phase 01', text: 'Airstrip landing into secluded canyon valley reserve with private guide greeting.' },
        { day: 'Phase 02', text: 'Sunset camel trek across golden dunes followed by torchlit dinner under the stars.' },
        { day: 'Phase 03', text: 'Night-sky deep space telescope session with professional astronomer.' }
      ]
    }
  };

  // 3. Modal Elements & Handlers
  const modal = document.getElementById('escape-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalInquire = document.getElementById('modal-inquire-btn');
  let currentEscape = null;

  function openEscapeModal(key) {
    const data = escapeDossiers[key];
    if (!data || !modal) return;
    currentEscape = data;

    const heroImg = document.getElementById('modal-hero-img');
    if (heroImg) heroImg.style.backgroundImage = `url('${data.image}')`;

    const eyebrowEl = document.getElementById('modal-eyebrow');
    if (eyebrowEl) eyebrowEl.textContent = data.kicker;

    const titleEl = document.getElementById('modal-title');
    if (titleEl) titleEl.textContent = data.title;

    const descEl = document.getElementById('modal-desc');
    if (descEl) descEl.textContent = data.description;

    const seasonEl = document.getElementById('modal-season');
    if (seasonEl) seasonEl.textContent = data.idealSeason;

    const rhythmEl = document.getElementById('modal-rhythm');
    if (rhythmEl) rhythmEl.textContent = data.travelRhythm;

    const touchesEl = document.getElementById('modal-touches');
    if (touchesEl) touchesEl.textContent = data.conciergeHighlights;

    const listEl = document.getElementById('modal-itinerary-list');
    if (listEl) {
      listEl.innerHTML = data.itinerary.map(item => `
        <li>
          <span>${item.day} —</span>
          <div>${item.text}</div>
        </li>
      `).join('');
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeEscapeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeEscapeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeEscapeModal();
    });
  }

  // Trigger modal from any element with [data-escape]
  document.querySelectorAll('[data-escape]').forEach(el => {
    el.addEventListener('click', () => {
      const key = el.dataset.escape;
      openEscapeModal(key);
    });
  });

  // Modal Inquiry action
  if (modalInquire) {
    modalInquire.addEventListener('click', () => {
      closeEscapeModal();
      if (currentEscape) {
        const destField = document.querySelector('input[name="destination"]');
        const interestField = document.querySelector('select[name="interest"]');
        if (destField) destField.value = currentEscape.title;
        if (interestField) {
          const opts = Array.from(interestField.options);
          const match = opts.find(o => o.text.toLowerCase().includes(currentEscape.category.toLowerCase().split('&')[0].trim()));
          if (match) interestField.value = match.value;
        }
      }
      const inquireSec = document.getElementById('inquire');
      if (inquireSec) {
        inquireSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 4. Discovery Card Filter Tabs
  const filterPills = document.querySelectorAll('.filter-pill');
  const discoveryCards = document.querySelectorAll('.discovery-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;
      discoveryCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. Inquiry Form Client-Side Validation & Submission (/api/inquiries)
  const inquiryForm = document.getElementById('inquiry-form');
  const formStatus = document.getElementById('form-status');

  if (inquiryForm) {
    const nameInput = document.getElementById('name') || inquiryForm.querySelector('input[name="name"]');
    const emailInput = document.getElementById('email') || inquiryForm.querySelector('input[name="email"]');
    const consentInput = document.getElementById('inquiry-consent') || inquiryForm.querySelector('input[name="consent"]');
    const submitBtn = inquiryForm.querySelector('button[type="submit"]');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const validationHint = document.getElementById('inquiry-validation-hint');
    const validationText = document.getElementById('inquiry-validation-text');

    // Standard RFC-compliant email regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function validateName() {
      if (!nameInput) return true;
      const val = nameInput.value.trim();
      return val.length >= 2;
    }

    function validateEmail() {
      if (!emailInput) return true;
      const val = emailInput.value.trim();
      return val.length > 0 && emailRegex.test(val);
    }

    function validateConsent() {
      if (!consentInput) return true;
      return consentInput.checked;
    }

    function checkFormValidity() {
      const isNameOk = validateName();
      const isEmailOk = validateEmail();
      const isConsentOk = validateConsent();

      // Check any other mandatory [required] fields within the form
      const allRequired = Array.from(inquiryForm.querySelectorAll('[required]')).filter(
        el => el !== nameInput && el !== emailInput && el !== consentInput
      );
      const allOtherOk = allRequired.every(el => {
        if (el.type === 'checkbox' || el.type === 'radio') return el.checked;
        return el.value.trim().length > 0;
      });

      return isNameOk && isEmailOk && isConsentOk && allOtherOk;
    }

    function updateFieldStatus(input, errorEl, isValid, errorMsg) {
      if (!input) return;
      const touched = input.dataset.touched === 'true';

      if (!isValid && touched) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        if (errorEl) {
          errorEl.textContent = errorMsg;
          errorEl.classList.add('show');
        }
      } else if (isValid) {
        input.classList.remove('is-invalid');
        if (input.value.trim().length > 0) {
          input.classList.add('is-valid');
        } else {
          input.classList.remove('is-valid');
        }
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.classList.remove('show');
        }
      } else {
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.classList.remove('show');
        }
      }
    }

    function updateValidationUI() {
      const isNameOk = validateName();
      const isEmailOk = validateEmail();
      const isConsentOk = validateConsent();
      const isOverallValid = checkFormValidity();

      if (submitBtn) {
        submitBtn.disabled = !isOverallValid;
        if (isOverallValid) {
          submitBtn.removeAttribute('aria-disabled');
          submitBtn.classList.remove('is-disabled');
        } else {
          submitBtn.setAttribute('aria-disabled', 'true');
          submitBtn.classList.add('is-disabled');
        }
      }

      if (validationHint && validationText) {
        if (isOverallValid) {
          validationHint.classList.add('valid');
          validationText.textContent = 'All mandatory fields completed. Ready to begin the conversation.';
        } else {
          validationHint.classList.remove('valid');
          const nameVal = (nameInput?.value || '').trim();
          const emailVal = (emailInput?.value || '').trim();

          if (nameVal.length === 0 && emailVal.length === 0) {
            validationText.textContent = 'Please enter your name and a valid email address to enable submission.';
          } else if (!isNameOk) {
            validationText.textContent = 'Please provide your name (minimum 2 characters).';
          } else if (!isEmailOk) {
            if (emailVal.length === 0) {
              validationText.textContent = 'Please enter your email address to enable submission.';
            } else {
              validationText.textContent = 'Please enter a valid email format (e.g. name@domain.com).';
            }
          } else if (!isConsentOk) {
            validationText.textContent = 'Please accept the enquiry communication consent checkbox.';
          } else {
            validationText.textContent = 'Please complete all required fields to enable submission.';
          }
        }
      }
    }

    // Attach real-time input and blur validation listeners
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        if (nameInput.dataset.touched === 'true') {
          updateFieldStatus(nameInput, nameError, validateName(), 'Please enter your name (minimum 2 characters)');
        }
        updateValidationUI();
      });
      nameInput.addEventListener('blur', () => {
        nameInput.dataset.touched = 'true';
        updateFieldStatus(nameInput, nameError, validateName(), 'Please enter your name (minimum 2 characters)');
        updateValidationUI();
      });
    }

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (emailInput.dataset.touched === 'true') {
          const emailVal = emailInput.value.trim();
          const msg = emailVal.length === 0 ? 'Email address is required' : 'Please enter a valid email address (e.g. name@domain.com)';
          updateFieldStatus(emailInput, emailError, validateEmail(), msg);
        }
        updateValidationUI();
      });
      emailInput.addEventListener('blur', () => {
        emailInput.dataset.touched = 'true';
        const emailVal = emailInput.value.trim();
        const msg = emailVal.length === 0 ? 'Email address is required' : 'Please enter a valid email address (e.g. name@domain.com)';
        updateFieldStatus(emailInput, emailError, validateEmail(), msg);
        updateValidationUI();
      });
    }

    if (consentInput) {
      consentInput.addEventListener('change', () => {
        updateValidationUI();
      });
    }

    // Watch any form inputs
    inquiryForm.addEventListener('input', updateValidationUI);
    inquiryForm.addEventListener('change', updateValidationUI);

    // Initial check on page load to lock button until fields are completed
    updateValidationUI();

    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Trigger touched state on mandatory fields to reveal feedback if submitted
      if (nameInput) {
        nameInput.dataset.touched = 'true';
        updateFieldStatus(nameInput, nameError, validateName(), 'Please enter your name (minimum 2 characters)');
      }
      if (emailInput) {
        emailInput.dataset.touched = 'true';
        const emailVal = emailInput.value.trim();
        const msg = emailVal.length === 0 ? 'Email address is required' : 'Please enter a valid email address (e.g. name@domain.com)';
        updateFieldStatus(emailInput, emailError, validateEmail(), msg);
      }

      if (!checkFormValidity()) {
        updateValidationUI();
        if (!validateName() && nameInput) {
          nameInput.focus();
        } else if (!validateEmail() && emailInput) {
          emailInput.focus();
        }
        return;
      }

      const originalHTML = submitBtn ? submitBtn.innerHTML : '<span>Begin the conversation</span><span>↗</span>';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Curating enquiry…</span><span>…</span>';
      }

      if (formStatus) {
        formStatus.className = 'form-status-box';
        formStatus.textContent = '';
      }

      const formData = new FormData(inquiryForm);
      const payload = Object.fromEntries(formData.entries());
      payload.consent = consentInput ? consentInput.checked : false;

      // Format international phone with country code
      if (payload.phone) {
        const code = payload.country_dial || '+254';
        payload.phone = `${code} ${payload.phone}`.trim();
      }

      try {
        const response = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || 'Unable to submit enquiry right now. Please try again.');
        }

        inquiryForm.reset();
        if (nameInput) {
          nameInput.dataset.touched = 'false';
          nameInput.classList.remove('is-valid', 'is-invalid');
        }
        if (emailInput) {
          emailInput.dataset.touched = 'false';
          emailInput.classList.remove('is-valid', 'is-invalid');
        }
        if (nameError) {
          nameError.textContent = '';
          nameError.classList.remove('show');
        }
        if (emailError) {
          emailError.textContent = '';
          emailError.classList.remove('show');
        }

        if (formStatus) {
          const waUrl = data.whatsappUrl || 'https://wa.me/254706168307';
          formStatus.className = 'form-status-box show';
          formStatus.style.borderLeftColor = '#25D366';
          formStatus.style.background = '#F0FAF4';
          formStatus.style.color = '#0B4F4A';
          formStatus.innerHTML = `
            <div style="font-size:15px; font-weight:700; margin-bottom:6px; color:#063B3D;">
              Form submitted successfully. The B.A.R will get back to you as soon as we can
            </div>
            <p style="margin:0 0 10px 0; font-size:13px; color:#334155;">
              Reference: <code>${data.inquiryId || 'BA-NEW'}</code>. Your enquiry has been recorded in our CRM and routed to our mobile desk.
            </p>
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:8px; padding:10px 16px; background:#25D366; color:#063B3D; text-decoration:none; font-weight:700; border-radius:6px; font-size:13px; box-shadow:0 3px 10px rgba(37,211,102,0.3);">
              <span>📲 Transmit directly to WhatsApp Concierge (+254 706 168 307) ↗</span>
            </a>
          `;
        }
      } catch (err) {
        if (formStatus) {
          formStatus.className = 'form-status-box show';
          formStatus.style.borderLeftColor = '#C66D64';
          formStatus.style.background = '#F9EDE8';
          formStatus.textContent = err.message || 'Something went wrong. Please reach out to thebelleamouraretreat@gmail.com.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.innerHTML = originalHTML;
        }
        updateValidationUI();
      }
    });
  }

  // 6. Global Currency & Region Switcher
  const currencyDropdown = document.getElementById('global-currency-dropdown');
  const currencyRates = {
    USD: { symbol: '$', rate: 1, prefix: true },
    KES: { symbol: 'KSh ', rate: 130, prefix: true },
    EUR: { symbol: '€', rate: 0.92, prefix: true },
    GBP: { symbol: '£', rate: 0.79, prefix: true },
    AED: { symbol: 'AED ', rate: 3.67, prefix: true },
    CHF: { symbol: 'CHF ', rate: 0.88, prefix: true },
    CAD: { symbol: 'CA$', rate: 1.36, prefix: true },
    AUD: { symbol: 'A$', rate: 1.52, prefix: true },
    SGD: { symbol: 'S$', rate: 1.34, prefix: true }
  };

  let activeCurrency = localStorage.getItem('belle_amoura_currency') || 'USD';
  if (currencyDropdown) {
    currencyDropdown.value = activeCurrency;
    currencyDropdown.addEventListener('change', (e) => {
      activeCurrency = e.target.value;
      localStorage.setItem('belle_amoura_currency', activeCurrency);
      updateCurrencyAcrossUI();
    });
  }

  function formatPrice(usdVal) {
    const config = currencyRates[activeCurrency] || currencyRates.USD;
    const converted = Math.round(usdVal * config.rate);
    const formatted = converted.toLocaleString();
    return `${config.symbol}${formatted}`;
  }

  function updateCurrencyAcrossUI() {
    document.querySelectorAll('[data-usd]').forEach(el => {
      const usdVal = parseFloat(el.getAttribute('data-usd'));
      if (!isNaN(usdVal)) {
        el.textContent = formatPrice(usdVal);
      }
    });
    // Trigger calculator recalculation if active
    if (typeof calculateInstallmentPlan === 'function') {
      calculateInstallmentPlan();
    }
  }

  // 7. Curated Packages Data & Installment Engine
  const curatedPackages = [
    {
      id: 'orlando-disney',
      title: 'Orlando Magic: Disney World, Universal & SeaWorld',
      destination: 'Orlando, Florida, USA',
      category: 'kids',
      duration: '7 Days / 6 Nights',
      usdPrice: 2950,
      usdOriginal: 3280,
      depositUsd: 850,
      installmentsCount: 3,
      isInstallment: true,
      priceBasis: 'person sharing',
      badgeText: '10% OFF · KIDS & FAMILY HIT',
      image: '/assets/images/orlando-disney-magic-kingdom.jpg',
      description: 'The ultimate fairytale escape for families. Deluxe Disney-area resort suite, 4-day Disney Park Hopper passes, Universal Studios & Harry Potter 2-day pass, SeaWorld encounters, and VIP shuttles.',
      inclusions: [
        'Deluxe family suite near Disney Springs & monorail',
        '4-day Walt Disney World & Magic Kingdom Park Hopper passes',
        '2-day Universal Studios Wizarding World of Harry Potter passes',
        'SeaWorld single-day marine animal park passes',
        'Daily resort park shuttles & VIP character breakfast'
      ]
    },
    {
      id: 'disney-paris',
      title: 'Disneyland Paris & Fairytale French Châteaux',
      destination: 'Paris & Marne-la-Vallée, France',
      category: 'kids',
      duration: '5 Days / 4 Nights',
      usdPrice: 1980,
      usdOriginal: 2200,
      depositUsd: 580,
      installmentsCount: 3,
      isInstallment: true,
      priceBasis: 'person sharing',
      badgeText: '10% OFF · FAMILY MAGIC',
      image: '/assets/images/disneyland-paris-sleeping-beauty-castle.jpg',
      description: 'Whimsical European holiday in Paris! 4-star superior Disney resort, 2-day multi-park Disneyland & Walt Disney Studios passes, private Seine champagne river cruise, and Eiffel Tower summit tickets.',
      inclusions: [
        '4-star Disney-themed superior hotel accommodation',
        '2-day multi-park Disneyland & Walt Disney Studios hopper passes',
        'Private Seine River sightseeing cruise for the family',
        'Eiffel Tower summit family access tickets',
        'Return Paris airport shuttles & fast-track park access'
      ]
    },
    {
      id: 'lapland-santa',
      title: 'Lapland Arctic Wonderland & Santa Claus Village',
      destination: 'Rovaniemi, Finland',
      category: 'kids',
      duration: '5 Days / 4 Nights',
      usdPrice: 3600,
      usdOriginal: 4000,
      depositUsd: 1050,
      installmentsCount: 3,
      isInstallment: true,
      priceBasis: 'person sharing',
      badgeText: '10% OFF · ARCTIC WONDER',
      image: '/assets/images/lapland_aurora_clean_1793133565406.jpg',
      description: 'Heated glass igloo suite under the Northern Lights, private official Santa Claus sanctuary meet-and-greet, 10km husky dog sledding, reindeer sleigh safari & Sami campfire lunch, and full thermal winter gear.',
      inclusions: [
        'Heated luxury glass igloo stay under the Northern Lights',
        'Private official meet-and-greet with Santa Claus at his sanctuary',
        '10km husky dog sledding through snow pine forests',
        'Reindeer sleigh ride safari & Sami campfire storytelling',
        'Full Arctic thermal winter suits, boots & airport transfers'
      ]
    },
    {
      id: 'maldives-lagoon',
      title: 'Maldives Overwater Lagoon & Coral Snorkeling',
      destination: 'Baa Atoll, Maldives',
      category: 'coastal',
      duration: '5 Days / 4 Nights',
      usdPrice: 3250,
      usdOriginal: 3610,
      depositUsd: 950,
      installmentsCount: 3,
      isInstallment: true,
      priceBasis: 'person sharing',
      badgeText: '10% OFF · OVERWATER VILLA',
      image: '/assets/images/maldives_luxury_villa_1793133495823.jpg',
      description: 'Sunlit overwater villa suspended over crystal turquoise lagoon. Scenic return seaplane transfers from Malé, all-inclusive gourmet dining & beverage plan, private manta ray snorkeling, and sunset dolphin cruise.',
      inclusions: [
        'Private overwater ocean villa with sun deck & direct lagoon stairs',
        'All-inclusive gourmet breakfast, lunch, 3-course dinner & premium beverages',
        'Guided manta ray and sea turtle reef snorkeling excursion',
        'Return scenic seaplane transfers from Malé International Airport',
        'Sunset dolphin catamaran cruise & Maldives green taxes included'
      ]
    },
    {
      id: 'spain-mediterranean',
      title: 'Spain Sunshine: Barcelona & Costa Brava Beaches',
      destination: 'Barcelona & Costa Brava, Spain',
      category: 'coastal',
      duration: '6 Days / 5 Nights',
      usdPrice: 2250,
      usdOriginal: 2500,
      depositUsd: 650,
      installmentsCount: 3,
      isInstallment: true,
      priceBasis: 'person sharing',
      badgeText: '10% OFF · CULTURAL LUXURY',
      image: '/assets/images/spain_costa_brava_1793133550146.jpg',
      description: '5-star boutique hotel in Barcelona Gothic Quarter, skip-the-line VIP Sagrada Família & Park Güell passes, private chauffeured day excursion to Tossa de Mar medieval cove beaches, and curated tapas & wine tasting.',
      inclusions: [
        '5-star boutique hotel in Barcelona Gothic Quarter',
        'Sagrada Família & Park Güell VIP skip-the-line passes',
        'Private chauffeured day excursion to Costa Brava & Tossa de Mar',
        'Curated authentic tapas, paella & sommelier wine tasting',
        'Private airport chauffeur transfers & hop-on city pass'
      ]
    },
    {
      id: 'dubai-parks',
      title: 'Dubai Extravaganza: Desert Safari, Marina & Legoland',
      destination: 'Dubai, United Arab Emirates',
      category: 'kids',
      duration: '5 Days / 4 Nights',
      usdPrice: 1650,
      usdOriginal: 1835,
      depositUsd: 500,
      installmentsCount: 3,
      isInstallment: true,
      priceBasis: 'person sharing',
      badgeText: '10% OFF · 5-STAR DUBAI',
      image: '/assets/images/dubai_luxury_desert_1793133565351.jpg',
      description: '5-star downtown hotel, private VIP 4x4 desert safari with luxury majlis BBQ dinner & falconry, 2-day Dubai Parks & Resorts passes (Legoland & Motiongate), private marina yacht dinner cruise, and airport transfers.',
      inclusions: [
        '5-star luxury hotel in Downtown / Dubai Marina',
        'Private 4x4 dune bashing desert safari with VIP majlis BBQ & show',
        'Dubai Parks & Resorts multi-park ticket (Legoland & Motiongate)',
        'Private Dubai Marina luxury glass yacht dinner cruise',
        'Miracle Garden & Dubai Frame VIP entry with chauffeur'
      ]
    },
    {
      id: 'diani-coral',
      title: 'Diani Beach & Wasini Coral Island Getaway',
      destination: 'Diani Beach, South Coast Kenya',
      category: 'coastal',
      duration: '4 Days / 3 Nights',
      usdPrice: 890,
      usdOriginal: 990,
      depositUsd: 250,
      installmentsCount: 3,
      isInstallment: true,
      priceBasis: 'person sharing',
      badgeText: '10% OFF · COASTAL RETREAT',
      image: '/assets/images/diani_beach_luxury_1793133580695.jpg',
      description: '5-star beachfront boutique resort in Diani with half-board dining. Private traditional Swahili dhow sailing to Wasini Island, dolphin watching, Kisite Mpunguti Marine Park snorkeling, and fresh seafood lunch.',
      inclusions: [
        '5-star beachfront boutique resort (Swahili Beach / The Sands at Nomad)',
        'Daily lavish breakfast buffet and 4-course gourmet dinner',
        'Private Wasini Island dhow cruise with wild dolphin watching',
        'Kisite Mpunguti Marine National Park conservation entry & snorkeling',
        'Return private transfers from SGR Mombasa / Ukunda Airstrip'
      ]
    },
    {
      id: 'mara-safari',
      title: 'Maasai Mara Big Five Safari & Campfire Nights',
      destination: 'Maasai Mara, Kenya',
      category: 'safari',
      duration: '3 Days / 2 Nights',
      usdPrice: 1350,
      usdOriginal: 1500,
      depositUsd: 400,
      installmentsCount: 3,
      isInstallment: true,
      priceBasis: 'person sharing',
      badgeText: '10% OFF · 4x4 LAND CRUISER',
      image: '/assets/images/maasai_mara_luxury_camp_1793133580423.jpg',
      description: 'Luxury canvas tented camp inside Maasai Mara. Dedicated 4x4 extended safari Land Cruiser with pop-up roof and master naturalist guide, all chef-prepared meals, and 2 full days of official National Reserve conservation entry fees included.',
      inclusions: [
        'Luxury en-suite safari tented camp (Sarova Mara / Mara Serena / Ashnil)',
        'Dedicated 4x4 pop-up roof safari Land Cruiser Jeep with master guide',
        'All official Maasai Mara National Reserve park entry fees ($100-$200/day/adult included)',
        'Full-board gourmet meals prepared by professional safari chefs',
        'Maasai cultural community village visit & sunset bush campfire'
      ]
    },
    {
      id: 'naivasha-spa',
      title: 'Naivasha & Hell\'s Gate Geothermal Spa Weekend',
      destination: 'Lake Naivasha, Kenya',
      category: 'weekend',
      duration: '2 Days / 1 Night',
      usdPrice: 390,
      usdOriginal: 435,
      depositUsd: 115,
      installmentsCount: 2,
      isInstallment: true,
      priceBasis: 'person sharing',
      badgeText: '10% OFF · WEEKEND GETAWAY',
      image: '/assets/images/naivasha_geothermal_spa_1793133595543.jpg',
      description: '5-star lakeside resort stay. Boat safari to Crescent Island with walking game tour, Hell’s Gate gorge guided hike & bicycle rental, and soothing swim in Olkaria natural warm geothermal mineral spa.',
      inclusions: [
        '5-star lakeside resort (Enashipai Resort & Spa / Lake Naivasha Sopa)',
        'Hell\'s Gate National Park bicycle rental and gorge naturalist hike',
        'Olkaria natural geothermal warm mineral pool admission & swim',
        'Boat safari on Lake Naivasha with Crescent Island walking sanctuary',
        'All meals included from Saturday lunch to Sunday lunch'
      ]
    },
    {
      id: 'zanzibar-sunset',
      title: 'Zanzibar Stone Town & Nungwi Sunset Catamaran',
      destination: 'Zanzibar, Tanzania',
      category: 'coastal',
      duration: '5 Days / 4 Nights',
      usdPrice: 1480,
      usdOriginal: 1645,
      depositUsd: 450,
      installmentsCount: 3,
      isInstallment: true,
      priceBasis: 'person sharing',
      badgeText: '10% OFF · ISLAND GETAWAY',
      image: '/assets/images/zanzibar_sunset_catamaran_1793133596419.jpg',
      description: '5-star beachfront resort in Nungwi / Kendwa. Historical Stone Town architectural walking tour, organic spice farm tasting excursion, and private sunset catamaran cruise with chilled champagne & seafood canapés.',
      inclusions: [
        '5-star beachfront luxury resort in Nungwi / Kendwa',
        'Private historical Stone Town architectural walking tour & Old Fort',
        'Organic spice farm aroma and tasting guided excursion',
        'Private sunset catamaran sailing cruise with champagne & canapés',
        'Return private airport transfers in air-conditioned executive van'
      ]
    },
    {
      id: 'samburu-helicopter',
      title: 'Samburu & Suguta Valley Private Helicopter Expedition',
      destination: 'Northern Kenya & Great Rift Valley',
      category: 'upfront',
      duration: '4 Days / 3 Nights',
      usdPrice: 16500,
      usdOriginal: 16500,
      depositUsd: 16500,
      installmentsCount: 1,
      isInstallment: false,
      priceBasis: 'charter package (up to 4 guests)',
      badgeText: '100% UPFRONT SETTLEMENT',
      image: '/assets/images/samburu_heli_expedition_1793133610873.jpg',
      description: 'Dedicated Eurocopter B3/H125 turbine helicopter and private bush pilot for 4 days. Luxury cliffside lodge suite in Samburu, Lake Turkana flamingo flight paths, sand dune champagne landings, and tarmac VIP ramp clearance.',
      inclusions: [
        'Dedicated Eurocopter turbine helicopter & senior bush pilot for 4 days',
        'Exclusive cliffside luxury lodge private suite in Samburu',
        'Private Samburu indigenous master naturalist guide & ranger escort',
        'Lake Turkana flamingo aerial surveys & remote sand dune landings',
        'Direct Wilson tarmac airside VIP private aviation clearance'
      ]
    },
    {
      id: 'lamu-villa-buyout',
      title: 'Lamu Historic Island Private Mansion Buyout & Superyacht',
      destination: 'Lamu Archipelago, Kenya',
      category: 'upfront',
      duration: '5 Days / 4 Nights',
      usdPrice: 14800,
      usdOriginal: 14800,
      depositUsd: 14800,
      installmentsCount: 1,
      isInstallment: false,
      priceBasis: 'mansion buyout (up to 8 guests)',
      badgeText: '100% UPFRONT SETTLEMENT (FOR UP TO 8 GUESTS)',
      image: '/assets/images/lamu_swahili_estate_1793133610031.jpg',
      description: 'Exclusive buyout of an authentic 18th-century private oceanfront Swahili coral stone estate for your party. Full-time private chef, butler, and private 50-foot motor yacht with captain for offshore sandbank excursions.',
      inclusions: [
        'Exclusive buyout of 18th-century private oceanfront Swahili mansion for 8 guests',
        'Full private staff: executive chef, personal butler, housekeeping & security',
        '50-foot private motor yacht with captain & fuel for offshore excursions',
        'Private deep-sea fishing & Manda Toto sandbank gourmet beach picnic',
        'Direct private airstrip boat transfer greeting & Lamu Old Town tour'
      ]
    }
  ];

  // Render Packages Grid
  const packagesContainer = document.getElementById('packages-grid');
  function renderPackages(filter = 'all') {
    if (!packagesContainer) return;
    
    const filtered = curatedPackages.filter(pkg => {
      if (filter === 'all') return true;
      if (filter === 'installment') return pkg.isInstallment;
      if (filter === 'upfront') return !pkg.isInstallment;
      return pkg.category === filter;
    });

    packagesContainer.innerHTML = filtered.map(pkg => {
      const priceNow = formatPrice(pkg.usdPrice);
      const priceWas = formatPrice(pkg.usdOriginal);
      const depositStr = formatPrice(pkg.depositUsd);
      const monthlyStr = pkg.isInstallment && pkg.installmentsCount > 1
        ? formatPrice(Math.round((pkg.usdPrice - pkg.depositUsd) / pkg.installmentsCount))
        : '';

      const paymentPolicyHTML = pkg.isInstallment
        ? `<div class="pkg-payment-policy installment">
             💳 <strong>Lipa Pole Pole:</strong> Fixed Deposit ${depositStr} · Balance in ${pkg.installmentsCount} monthly payments of ~${monthlyStr}
           </div>`
        : `<div class="pkg-payment-policy upfront">
             🛡️ <strong>100% Upfront Settlement:</strong> Supplier &amp; aviation slots guaranteed immediately upon lock-in.
           </div>`;

      const badgeType = pkg.category === 'kids'
        ? 'pkg-badge-kids'
        : (!pkg.isInstallment ? 'pkg-badge-upfront' : 'pkg-badge-discount');

      const waText = encodeURIComponent(
        `Hello The Belle Amoura Retreat! I'm ready to book the "${pkg.title}" (${pkg.destination}) for ${priceNow}. ` +
        (pkg.isInstallment ? `I would like to start with the fixed deposit of ${depositStr} and pay in installments.` : `I understand this high-end trip is settled upfront.`)
      );

      return `
        <article class="package-card" data-pkg-id="${pkg.id}">
          <div class="pkg-img-wrap">
            <img src="${pkg.image}" alt="${pkg.title}" loading="lazy">
            <div class="pkg-badges-row">
              <span class="${badgeType}">${pkg.badgeText}</span>
              <span class="pkg-badge-duration">${pkg.duration}</span>
            </div>
          </div>
          <div class="pkg-body">
            <div>
              <div class="pkg-destination">📍 ${pkg.destination}</div>
              <h3 class="pkg-title">${pkg.title}</h3>
              <p class="pkg-desc">${pkg.description}</p>
              <ul class="pkg-inclusions-list">
                ${pkg.inclusions.map(inc => `<li><span>✓</span> ${inc}</li>`).join('')}
              </ul>
            </div>
            <div>
              <div class="pkg-pricing-box">
                <div class="pkg-price-row">
                  <span class="pkg-price-current" data-usd="${pkg.usdPrice}">${priceNow}</span>
                  <span class="pkg-price-basis">/${pkg.priceBasis || 'person sharing'}</span>
                  ${pkg.usdOriginal > pkg.usdPrice ? `<span class="pkg-price-original" data-usd="${pkg.usdOriginal}">${priceWas}</span>` : ''}
                  ${pkg.usdOriginal > pkg.usdPrice ? `<span class="pkg-price-savings">SAVE ${Math.round((1 - pkg.usdPrice/pkg.usdOriginal)*100)}%</span>` : ''}
                </div>
                ${paymentPolicyHTML}
              </div>
              <div class="pkg-actions">
                <a href="https://wa.me/254706168307?text=${waText}" target="_blank" rel="noopener noreferrer" class="pkg-btn-wa">
                  <span>📲 Book via WhatsApp</span>
                </a>
                <button type="button" class="pkg-btn-calc" onclick="selectPackageForCalculator('${pkg.id}')">
                  <span>🧮 Plan</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Initial render
  renderPackages('all');

  // Package Filter Buttons
  const pkgTabs = document.querySelectorAll('.pkg-tab-btn');
  pkgTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pkgTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderPackages(tab.dataset.tab);
    });
  });

  // 8. Interactive Installment Calculator Logic
  const calcSelect = document.getElementById('calc-pkg-select');
  const calcModeInputs = document.querySelectorAll('input[name="calc-mode"]');

  window.selectPackageForCalculator = function(pkgId) {
    if (calcSelect) {
      calcSelect.value = pkgId;
    }
    const calcSection = document.getElementById('installment-calculator');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    calculateInstallmentPlan();
  };

  function calculateInstallmentPlan() {
    if (!calcSelect) return;
    const selectedId = calcSelect.value;
    const pkg = curatedPackages.find(p => p.id === selectedId) || curatedPackages[0];
    
    const isUpfrontMode = document.querySelector('input[name="calc-mode"]:checked')?.value === 'upfront';

    const calcTotalEl = document.getElementById('calc-total-price');
    const calcDepositEl = document.getElementById('calc-deposit-today');
    const calcInstallmentsEl = document.getElementById('calc-installment-breakdown');
    const calcBalanceDueEl = document.getElementById('calc-balance-due');
    const calcBtn = document.getElementById('calc-whatsapp-btn');

    if (!pkg) return;

    if (!pkg.isInstallment || isUpfrontMode) {
      // 100% Upfront Mode
      const totalFormatted = formatPrice(pkg.usdPrice);
      if (calcTotalEl) calcTotalEl.textContent = totalFormatted;
      if (calcDepositEl) calcDepositEl.textContent = `${totalFormatted} (100% Full Upfront Settlement)`;
      if (calcInstallmentsEl) calcInstallmentsEl.textContent = 'None — Single upfront payment locks supplier rates immediately.';
      if (calcBalanceDueEl) calcBalanceDueEl.textContent = 'Settled upon reservation confirmation';
      
      if (calcBtn) {
        const text = encodeURIComponent(`Hello The Belle Amoura Retreat! I would like to book "${pkg.title}" with 100% Upfront Settlement for ${totalFormatted}. Please confirm supplier availability.`);
        calcBtn.href = `https://wa.me/254706168307?text=${text}`;
        calcBtn.innerHTML = `<span>📲 Lock In Booking Upfront via WhatsApp (${totalFormatted}) ↗</span>`;
      }
    } else {
      // Installments / Lipa Pole Pole Mode
      const totalFormatted = formatPrice(pkg.usdPrice);
      const depositFormatted = formatPrice(pkg.depositUsd);
      const remainingBalance = pkg.usdPrice - pkg.depositUsd;
      const count = pkg.installmentsCount || 3;
      const monthlyFormatted = formatPrice(Math.round(remainingBalance / count));

      if (calcTotalEl) calcTotalEl.textContent = totalFormatted;
      if (calcDepositEl) calcDepositEl.textContent = `${depositFormatted} (Fixed Deposit to Secure Your Spot)`;
      if (calcInstallmentsEl) calcInstallmentsEl.textContent = `${count} monthly payments of ~${monthlyFormatted} before travel`;
      if (calcBalanceDueEl) calcBalanceDueEl.textContent = 'Final installment completed 7 days prior to departure';

      if (calcBtn) {
        const text = encodeURIComponent(
          `Hello The Belle Amoura Retreat! I'd like to book "${pkg.title}" on the Lipa Pole Pole Installment Plan. ` +
          `I am ready to pay the fixed deposit of ${depositFormatted} today, followed by ${count} monthly installments of ${monthlyFormatted}.`
        );
        calcBtn.href = `https://wa.me/254706168307?text=${text}`;
        calcBtn.innerHTML = `<span>📲 Lock In with Fixed Deposit (${depositFormatted}) via WhatsApp ↗</span>`;
      }
    }
  }

  if (calcSelect) {
    calcSelect.addEventListener('change', calculateInstallmentPlan);
  }
  calcModeInputs.forEach(input => {
    input.addEventListener('change', () => {
      document.querySelectorAll('.calc-radio-card').forEach(c => c.classList.remove('active'));
      input.closest('.calc-radio-card')?.classList.add('active');
      calculateInstallmentPlan();
    });
  });

  // Populate Calculator Dropdown
  if (calcSelect) {
    calcSelect.innerHTML = curatedPackages.map(pkg => `
      <option value="${pkg.id}">
        ${pkg.title} — ${formatPrice(pkg.usdPrice)} ${pkg.isInstallment ? `(Deposit: ${formatPrice(pkg.depositUsd)})` : '(100% Upfront)'}
      </option>
    `).join('');
    calculateInstallmentPlan();
  }

  // Hero Quick Pick items click handler
  document.querySelectorAll('.quick-pick-item').forEach(item => {
    item.addEventListener('click', () => {
      const pkgKey = item.dataset.pkg;
      let targetId = 'diani-coral';
      if (pkgKey === 'mara') targetId = 'mara-safari';
      if (pkgKey === 'naivasha') targetId = 'naivasha-spa';
      selectPackageForCalculator(targetId);
    });
  });
});

