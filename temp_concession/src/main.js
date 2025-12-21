import './style.css'

// Mock Data for Cars
const cars = [
  {
    id: 1,
    make: 'Peugeot',
    model: '3008 GT Line',
    year: 2021,
    km: '45,000 km',
    price: '24,900 €',
    type: 'SUV',
    image: '/car-peugeot-3008.png'
  },
  {
    id: 2,
    make: 'Volkswagen',
    model: 'Golf 8',
    year: 2022,
    km: '28,000 km',
    price: '21,500 €',
    type: 'Berline',
    image: '/car-vw-golf-8.png'
  },
  {
    id: 3,
    make: 'Renault',
    model: 'Clio IV',
    year: 2020,
    km: '55,000 km',
    price: '14,200 €',
    type: 'Citadine',
    image: '/car-renault-clio-4.png'
  },
  {
    id: 4,
    make: 'Mercedes',
    model: 'Classe A',
    year: 2021,
    km: '32,000 km',
    price: '29,500 €',
    type: 'Berline',
    image: '/car-mercedes-a.png'
  },
  {
    id: 5,
    make: 'Audi',
    model: 'Q5 S-Line',
    year: 2019,
    km: '68,000 km',
    price: '36,900 €',
    type: 'SUV',
    image: '/car-audi-q5.png'
  },
  {
    id: 6,
    make: 'BMW',
    model: 'M3 Competition',
    year: 2022,
    km: '15,000 km',
    price: '89,900 €',
    type: 'Berline',
    image: '/bmw-m3-competition.png'
  },
  {
    id: 7,
    make: 'Porsche',
    model: '911 Carrera S',
    year: 2021,
    km: '12,000 km',
    price: '145,000 €',
    type: 'Coupé',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000'
  },
  {
    id: 8,
    make: 'Tesla',
    model: 'Model 3 Performance',
    year: 2023,
    km: '5,000 km',
    price: '54,900 €',
    type: 'Berline',
    image: '/tesla-model-3.png'
  },
  {
    id: 9,
    make: 'Jeep',
    model: 'Wrangler Rubicon',
    year: 2020,
    km: '35,000 km',
    price: '42,500 €',
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2000'
  },
  {
    id: 10,
    make: 'Ford',
    model: 'Mustang GT',
    year: 2019,
    km: '48,000 km',
    price: '46,900 €',
    type: 'Coupé',
    image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=2000'
  },
  {
    id: 12,
    make: 'Mercedes',
    model: 'Classe E Coupe',
    year: 2022,
    km: '18,000 km',
    price: '59,900 €',
    type: 'Coupé',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2000'
  },
  {
    id: 14,
    make: 'Toyota',
    model: 'RAV4 Hybrid',
    year: 2022,
    km: '15,000 km',
    price: '38,900 €',
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2000'
  }
];

// DOM Elements
const carsGrid = document.getElementById('cars-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentTranslate = 0;
let currentSlide = 0;
const cardsToShow = 3;

// Render Cars Function
function renderCars(filterType = 'all') {
  carsGrid.innerHTML = '';
  currentSlide = 0;
  currentTranslate = 0;
  carsGrid.style.transform = `translateX(0)`;

  const filteredCars = filterType === 'all'
    ? cars
    : cars.filter(car => car.type === filterType);

  filteredCars.forEach(car => {
    const carCard = document.createElement('article');
    carCard.className = 'car-card';
    carCard.innerHTML = `
      <img src="${car.image}" alt="${car.make} ${car.model}" class="car-image">
      <div class="car-info">
        <h3 class="car-title">${car.make} ${car.model}</h3>
        <div class="car-specs">
          <span>${car.year}</span> • <span>${car.km}</span> • <span>${car.type}</span>
        </div>
        <div class="car-price">${car.price}</div>
      </div>
    `;
    carsGrid.appendChild(carCard);
  });

  updateSliderButtons(filteredCars.length);
}

function updateSliderButtons(totalCars) {
  if (prevBtn && nextBtn) {
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide >= totalCars - cardsToShow;
  }
}

function moveSlider(direction, totalCars) {
  if (direction === 'next' && currentSlide < totalCars - cardsToShow) {
    currentSlide++;
  } else if (direction === 'prev' && currentSlide > 0) {
    currentSlide--;
  }

  const cardWidth = carsGrid.querySelector('.car-card').offsetWidth;
  const gap = 32; // 2rem = 32px
  currentTranslate = -(currentSlide * (cardWidth + gap));
  carsGrid.style.transform = `translateX(${currentTranslate}px)`;

  updateSliderButtons(totalCars);
}

// Filter Logic
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all
    filterBtns.forEach(b => b.classList.remove('active'));
    // Add active to clicked
    btn.classList.add('active');

    // Filter
    const filter = btn.dataset.filter;
    renderCars(filter);
  });
});

// Slider Events
if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const totalCars = activeFilter === 'all' ? cars.length : cars.filter(c => c.type === activeFilter).length;
    moveSlider('prev', totalCars);
  });

  nextBtn.addEventListener('click', () => {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const totalCars = activeFilter === 'all' ? cars.length : cars.filter(c => c.type === activeFilter).length;
    moveSlider('next', totalCars);
  });
}

// Initial Render
renderCars();

// Mobile Menu Toggle (Simple)
const toggleBtn = document.querySelector('.mobile-toggle');
const nav = document.querySelector('.nav');

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const isVisible = nav.style.display === 'flex';
    nav.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) {
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '100%';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.backgroundColor = 'var(--primary)';
      nav.style.padding = '1rem';
      nav.style.textAlign = 'center';
    } else {
      nav.removeAttribute('style'); // reset
    }
  });
}
