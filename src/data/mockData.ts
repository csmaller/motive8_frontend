import type { Coach, Event, VelocityClass, ContactFormData, RegistrationFormData, Product, NewsArticle } from '../types';

// Mock Coaches Data
export const mockCoaches: Coach[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Head Coach & Swimming Specialist',
    bio: 'Sarah is a former Olympic swimmer with over 15 years of coaching experience. She specializes in stroke technique and has helped numerous athletes achieve their personal bests in swimming.',
    specialties: ['Swimming Technique', 'Open Water Swimming', 'Race Strategy'],
    certifications: ['USA Swimming Certified', 'USAT Level II Certified', 'CPR/AED Certified'],
    yearsExperience: 15,
    email: 'sarah@triathlonteam.com'
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    title: 'Cycling Coach & Bike Fit Specialist',
    bio: 'Mike brings 12 years of professional cycling experience to our team. He focuses on power training, bike fitting, and helping athletes maximize their cycling efficiency.',
    specialties: ['Power Training', 'Bike Fitting', 'Cycling Mechanics', 'Time Trial Coaching'],
    certifications: ['USA Cycling Level 2', 'Retül Bike Fit Certified', 'TrainingPeaks Certified'],
    yearsExperience: 12,
    email: 'mike@triathlonteam.com'
  },
  {
    id: '3',
    name: 'Emily Chen',
    title: 'Running Coach & Nutrition Specialist',
    bio: 'Emily is a certified running coach and sports nutritionist who has completed over 20 Ironman races. She helps athletes develop sustainable running form and optimal nutrition strategies.',
    specialties: ['Running Form Analysis', 'Sports Nutrition', 'Injury Prevention', 'Marathon Training'],
    certifications: ['RRCA Certified', 'Precision Nutrition Certified', 'NASM-CPT'],
    yearsExperience: 10,
    email: 'emily@triathlonteam.com'
  },
  {
    id: '4',
    name: 'David Thompson',
    title: 'Triathlon Coach & Mental Performance',
    bio: 'David is a former professional triathlete who now focuses on helping athletes develop mental toughness and race-day strategies. He brings a holistic approach to triathlon training.',
    specialties: ['Mental Performance', 'Race Strategy', 'Transition Training', 'Goal Setting'],
    certifications: ['USAT Level III Certified', 'Mental Performance Certified', 'First Aid Certified'],
    yearsExperience: 18,
    email: 'david@triathlonteam.com'
  }
];

// Mock Events Data
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Spring Sprint Triathlon',
    date: new Date('2024-04-15'),
    time: '7:00 AM',
    location: 'Lake Park Recreation Area',
    description: 'A beginner-friendly sprint triathlon featuring a 750m swim, 20km bike, and 5km run. Perfect for first-time triathletes or those looking to improve their times.',
    type: 'race',
    registrationRequired: true,
    maxParticipants: 200,
    currentParticipants: 145,
    registrationDeadline: new Date('2024-04-01'),
    cost: 85
  },
  {
    id: '2',
    title: 'Weekly Brick Training',
    date: new Date('2024-03-20'),
    time: '6:00 PM',
    location: 'Team Training Center',
    description: 'Join us for our weekly brick training session combining cycling and running. All fitness levels welcome.',
    type: 'training',
    registrationRequired: false,
    maxParticipants: 30,
    currentParticipants: 18
  },
  {
    id: '3',
    title: 'Olympic Distance Challenge',
    date: new Date('2024-06-08'),
    time: '6:30 AM',
    location: 'Riverside Park',
    description: 'Test your endurance with our Olympic distance triathlon: 1.5km swim, 40km bike, and 10km run.',
    type: 'race',
    registrationRequired: true,
    maxParticipants: 150,
    currentParticipants: 89,
    registrationDeadline: new Date('2024-05-25'),
    cost: 120
  },
  {
    id: '4',
    title: 'Team BBQ & Awards Ceremony',
    date: new Date('2024-07-20'),
    time: '5:00 PM',
    location: 'Central Park Pavilion',
    description: 'Celebrate the season with our annual team barbecue and awards ceremony. Bring your family and friends!',
    type: 'social',
    registrationRequired: true,
    maxParticipants: 100,
    currentParticipants: 67,
    cost: 25
  },
  {
    id: '5',
    title: 'Open Water Swimming Clinic',
    date: new Date('2024-05-12'),
    time: '8:00 AM',
    location: 'Crystal Lake',
    description: 'Learn open water swimming techniques and safety with our certified coaches. Wetsuit recommended.',
    type: 'training',
    registrationRequired: true,
    maxParticipants: 20,
    currentParticipants: 14,
    cost: 40
  }
];

// Mock Velocity Classes Data
export const mockVelocityClasses: VelocityClass[] = [
  {
    id: '1',
    name: 'Beginner Cycling Fundamentals',
    description: 'Learn the basics of cycling technique, safety, and equipment. Perfect for those new to cycling or triathlon.',
    schedule: 'Tuesdays & Thursdays, 6:00 PM - 7:30 PM',
    duration: '6 weeks',
    maxParticipants: 12,
    currentEnrollment: 8,
    instructor: 'Mike Rodriguez',
    level: 'beginner',
    cost: 180,
    location: 'Indoor Training Center',
    equipment: ['Road bike or hybrid', 'Helmet', 'Water bottle'],
    prerequisites: ['Basic bike handling skills']
  },
  {
    id: '2',
    name: 'Intermediate Power Training',
    description: 'Develop your cycling power and endurance with structured interval training and power meter analysis.',
    schedule: 'Mondays & Wednesdays, 7:00 PM - 8:30 PM',
    duration: '8 weeks',
    maxParticipants: 10,
    currentEnrollment: 7,
    instructor: 'Mike Rodriguez',
    level: 'intermediate',
    cost: 240,
    location: 'Indoor Training Center',
    equipment: ['Road bike', 'Power meter (preferred)', 'Helmet', 'Heart rate monitor'],
    prerequisites: ['6+ months cycling experience', 'Comfortable with group rides']
  },
  {
    id: '3',
    name: 'Advanced Race Preparation',
    description: 'Elite-level training focusing on race tactics, time trial positioning, and peak performance strategies.',
    schedule: 'Saturdays, 6:00 AM - 8:00 AM',
    duration: '10 weeks',
    maxParticipants: 8,
    currentEnrollment: 6,
    instructor: 'David Thompson',
    level: 'advanced',
    cost: 320,
    location: 'Outdoor Training Routes',
    equipment: ['Time trial bike (preferred)', 'Aero helmet', 'Power meter', 'GPS computer'],
    prerequisites: ['Competitive cycling experience', 'Sub-40 minute 40km time trial']
  },
  {
    id: '4',
    name: 'Youth Cycling Development',
    description: 'Fun and safe cycling program for young athletes aged 12-17. Focus on skill development and bike safety.',
    schedule: 'Saturdays, 10:00 AM - 11:30 AM',
    duration: '12 weeks',
    maxParticipants: 15,
    currentEnrollment: 11,
    instructor: 'Emily Chen',
    level: 'beginner',
    cost: 150,
    location: 'Safe Training Circuit',
    equipment: ['Properly fitted bike', 'Helmet (required)', 'Water bottle'],
    prerequisites: ['Ages 12-17', 'Parental consent form']
  }
];

// Mock Form Data Generators
export const generateMockContactForm = (): ContactFormData => ({
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '(555) 123-4567',
  message: 'I am interested in joining your triathlon team and would like more information about training programs.'
});

export const generateMockRegistrationForm = (): RegistrationFormData => ({
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  phone: '(555) 987-6543',
  emergencyContact: 'Robert Smith',
  emergencyPhone: '(555) 456-7890',
  experience: 'intermediate',
  classPreference: 'Intermediate Power Training',
  medicalConditions: 'None',
  agreeToTerms: true
});

// Utility functions for generating random mock data
export const getRandomCoach = (): Coach => {
  const randomIndex = Math.floor(Math.random() * mockCoaches.length);
  return mockCoaches[randomIndex];
};

export const getRandomEvent = (): Event => {
  const randomIndex = Math.floor(Math.random() * mockEvents.length);
  return mockEvents[randomIndex];
};

export const getRandomVelocityClass = (): VelocityClass => {
  const randomIndex = Math.floor(Math.random() * mockVelocityClasses.length);
  return mockVelocityClasses[randomIndex];
};

export const getEventsByType = (type: Event['type']): Event[] => {
  return mockEvents.filter(event => event.type === type);
};

export const getClassesByLevel = (level: VelocityClass['level']): VelocityClass[] => {
  return mockVelocityClasses.filter(cls => cls.level === level);
};

export const getUpcomingEvents = (limit?: number): Event[] => {
  const now = new Date();
  const upcoming = mockEvents
    .filter(event => event.date > now)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return limit ? upcoming.slice(0, limit) : upcoming;
};

export const getAvailableClasses = (): VelocityClass[] => {
  return mockVelocityClasses.filter(cls => cls.currentEnrollment < cls.maxParticipants);
};

// Mock Store Products Data
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'M8 Team Racing Tri Suit',
    description: 'Professional-grade triathlon suit designed for optimal performance. Features moisture-wicking fabric, aerodynamic fit, and quick-dry technology.',
    price: 149.99,
    originalPrice: 179.99,
    category: 'apparel',
    images: ['/api/placeholder/400/400'],
    inStock: true,
    stockQuantity: 25,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy/Orange', 'Black/Blue'],
    rating: 4.8,
    reviewCount: 42,
    features: ['Moisture-wicking fabric', 'Aerodynamic design', 'Quick-dry technology', 'Compression fit'],
    brand: 'M8 Team'
  },
  {
    id: '2',
    name: 'Pro Carbon Fiber Bike Helmet',
    description: 'Lightweight carbon fiber helmet with advanced ventilation system. CPSC and CE certified for maximum safety.',
    price: 299.99,
    category: 'gear',
    images: ['/api/placeholder/400/400'],
    inStock: true,
    stockQuantity: 15,
    sizes: ['S', 'M', 'L'],
    colors: ['Matte Black', 'White/Blue', 'Red/Black'],
    rating: 4.9,
    reviewCount: 28,
    features: ['Carbon fiber construction', '18 air vents', 'Adjustable fit system', 'Lightweight (220g)'],
    brand: 'AeroTech'
  },
  {
    id: '3',
    name: 'M8 Team Water Bottle',
    description: 'BPA-free sports bottle with team logo. Perfect for training and race day hydration.',
    price: 19.99,
    category: 'accessories',
    images: ['/api/placeholder/400/400'],
    inStock: true,
    stockQuantity: 100,
    colors: ['Blue', 'Black', 'Clear'],
    rating: 4.5,
    reviewCount: 67,
    features: ['BPA-free', '750ml capacity', 'Easy-squeeze design', 'Dishwasher safe'],
    brand: 'M8 Team'
  },
  {
    id: '4',
    name: 'Endurance Energy Gel Pack',
    description: 'High-performance energy gels for sustained endurance. Pack of 12 assorted flavors.',
    price: 24.99,
    category: 'nutrition',
    images: ['/api/placeholder/400/400'],
    inStock: true,
    stockQuantity: 50,
    rating: 4.3,
    reviewCount: 89,
    features: ['12 gel pack', 'Assorted flavors', 'Fast-absorbing carbs', 'Caffeine options available'],
    brand: 'EnduroFuel'
  },
  {
    id: '5',
    name: 'Wetsuit Pro 3mm',
    description: 'Premium neoprene wetsuit for open water swimming. Flexible design for optimal stroke mechanics.',
    price: 399.99,
    originalPrice: 449.99,
    category: 'gear',
    images: ['/api/placeholder/400/400'],
    inStock: true,
    stockQuantity: 8,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.7,
    reviewCount: 34,
    features: ['3mm neoprene', 'Flexible shoulder panels', 'Quick-release zipper', 'Buoyancy optimization'],
    brand: 'AquaFlex'
  },
  {
    id: '6',
    name: 'M8 Team Training T-Shirt',
    description: 'Comfortable cotton-blend training shirt with team logo. Perfect for casual wear and light training.',
    price: 29.99,
    category: 'apparel',
    images: ['/api/placeholder/400/400'],
    inStock: true,
    stockQuantity: 75,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Gray', 'Black', 'White'],
    rating: 4.4,
    reviewCount: 156,
    features: ['Cotton-poly blend', 'Breathable fabric', 'Team logo', 'Regular fit'],
    brand: 'M8 Team'
  },
  {
    id: '7',
    name: 'GPS Sports Watch',
    description: 'Multi-sport GPS watch with heart rate monitoring, swim tracking, and 20-hour battery life.',
    price: 449.99,
    category: 'gear',
    images: ['/api/placeholder/400/400'],
    inStock: true,
    stockQuantity: 12,
    colors: ['Black', 'Blue', 'White'],
    rating: 4.6,
    reviewCount: 73,
    features: ['GPS tracking', 'Heart rate monitor', 'Swim-proof', '20hr battery', 'Multi-sport modes'],
    brand: 'SportTech'
  },
  {
    id: '8',
    name: 'Transition Bag Pro',
    description: 'Organized transition bag with multiple compartments for race day gear. Waterproof and durable.',
    price: 89.99,
    category: 'accessories',
    images: ['/api/placeholder/400/400'],
    inStock: true,
    stockQuantity: 30,
    colors: ['Black', 'Navy', 'Red'],
    rating: 4.5,
    reviewCount: 45,
    features: ['Multiple compartments', 'Waterproof', 'Shoulder straps', 'Ventilated shoe compartment'],
    brand: 'RacePro'
  }
];

// Store utility functions
export const getProductsByCategory = (category: Product['category']): Product[] => {
  return mockProducts.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter(product => product.rating >= 4.5).slice(0, 4);
};

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};
// Mock News Articles Data
export const mockNewsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'M8 Team Dominates Regional Triathlon Championship',
    slug: 'm8-team-dominates-regional-championship',
    excerpt: 'Our athletes secured 8 podium finishes at the Regional Triathlon Championship, showcasing months of dedicated training and preparation.',
    content: `What an incredible weekend at the Regional Triathlon Championship! Our M8 team athletes delivered outstanding performances across all age groups, bringing home 8 podium finishes and setting multiple personal records.

**Race Highlights:**
- Sarah Johnson claimed 1st place in the Women's 30-34 division with a blazing 2:15:32 finish
- Mike Chen secured 2nd place in Men's 40-44, improving his previous best by over 5 minutes
- The relay team of Rodriguez, Thompson, and Williams dominated the mixed relay category

**Training Pays Off:**
These results are a testament to the structured training programs our coaches have developed. The focus on technique refinement, power development, and race strategy clearly showed on race day.

**Looking Ahead:**
With these strong performances, several of our athletes have qualified for the National Championships. We're already planning the next phase of training to prepare for this exciting opportunity.

Congratulations to all our athletes who competed! Your dedication and hard work continue to inspire the entire M8 community.`,
    author: 'Coach Anna Nemeckay',
    publishedAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
    status: 'published' as const,
    category: 'race-results' as const,
    featuredImage: '/assets/img/news/championship-podium.jpg',
    tags: ['race results', 'championship', 'podium', 'personal records'],
    featured: true,
    readTime: 3
  },
  {
    id: '2',
    title: 'New Training Facility Opens This Spring',
    slug: 'new-training-facility-opens-spring',
    excerpt: 'We are excited to announce the opening of our new state-of-the-art training facility, featuring an indoor pool, bike studio, and recovery center.',
    content: `We are thrilled to announce that our new training facility will be opening this spring! This 15,000 square foot facility represents a major milestone for the M8 team and will provide our athletes with world-class training amenities.

**Facility Features:**
- 25-meter indoor pool with underwater cameras for stroke analysis
- Climate-controlled cycling studio with 20 smart trainers
- Dedicated running treadmill area with gait analysis technology
- Recovery center with ice baths, sauna, and massage therapy rooms
- Nutrition consultation rooms and athlete lounge

**Grand Opening Event:**
Join us on March 15th for our grand opening celebration! We'll have facility tours, mini training sessions, and special membership offers for new athletes.

**Membership Benefits:**
Current members will have priority access to the new facility, and we're introducing flexible training packages to accommodate different schedules and goals.

This facility will allow us to provide even better support for our athletes' training and recovery needs. We can't wait to see you there!`,
    author: 'M8 Team Management',
    publishedAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-10'),
    status: 'published' as const,
    category: 'team-news' as const,
    featuredImage: '/assets/img/news/new-facility.jpg',
    tags: ['facility', 'training', 'grand opening', 'membership'],
    featured: true,
    readTime: 2
  },
  {
    id: '3',
    title: 'Winter Training Tips: Staying Motivated in Cold Weather',
    slug: 'winter-training-tips-cold-weather',
    excerpt: 'Coach Emily Chen shares her top strategies for maintaining training consistency and motivation during the challenging winter months.',
    content: `Winter training can be challenging, but it's also an opportunity to build mental toughness and maintain fitness for the upcoming season. Here are my top tips for staying motivated during the colder months.

**1. Set Indoor Training Goals**
Focus on technique work and building base fitness. Use this time to work on swimming stroke efficiency or cycling power development on the trainer.

**2. Embrace the Weather**
Don't let cold weather stop you entirely. Proper layering and gear can make outdoor training enjoyable even in winter conditions.

**3. Join Group Training Sessions**
Training with others provides accountability and makes winter workouts more enjoyable. Our indoor cycling classes are perfect for this!

**4. Focus on Strength Training**
Winter is an ideal time to build strength and address any muscular imbalances. Our new facility will have a dedicated strength training area.

**5. Plan Your Season**
Use the quieter winter months to plan your race calendar and set goals for the upcoming season.

Remember, consistency is key. Even shorter, indoor sessions will help maintain your fitness and keep you ready for spring training ramp-up.`,
    author: 'Coach Emily Chen',
    publishedAt: new Date('2026-01-05'),
    updatedAt: new Date('2026-01-05'),
    status: 'published' as const,
    category: 'training-tips' as const,
    tags: ['winter training', 'motivation', 'indoor training', 'tips'],
    featured: false,
    readTime: 4
  },
  {
    id: '4',
    title: 'Upcoming Velocity Classes Schedule',
    slug: 'upcoming-velocity-classes-schedule',
    excerpt: 'Check out our updated Velocity cycling class schedule for February, featuring new time slots and specialized training sessions.',
    content: `We are excited to share our updated Velocity cycling class schedule for February! Based on member feedback, we have added new time slots and specialized sessions to better serve our community.

**New Schedule Highlights:**
- Early morning sessions now start at 5:30 AM for busy professionals
- Weekend warrior sessions on Saturday mornings
- Specialized hill climbing workshops on Thursday evenings
- Recovery rides on Sunday afternoons

**Class Types:**
- **Power Development**: Focus on building FTP and sustained power
- **Interval Training**: High-intensity sessions for race preparation  
- **Endurance Rides**: Longer sessions for base building
- **Technique Focus**: Form and efficiency workshops

**Registration:**
Classes fill up quickly, so be sure to register early through our website. Members get priority booking 48 hours before non-members.

All classes are led by our certified cycling coaches and include post-workout analysis and personalized feedback.`,
    author: 'Coach Mike Rodriguez',
    publishedAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    status: 'published' as const,
    category: 'events' as const,
    tags: ['velocity classes', 'cycling', 'schedule', 'registration'],
    featured: false,
    readTime: 2
  },
  {
    id: '5',
    title: 'Nutrition Workshop: Fueling for Long Distance Events',
    slug: 'nutrition-workshop-fueling-long-distance',
    excerpt: 'Join our upcoming nutrition workshop where we will cover race-day fueling strategies, hydration protocols, and supplement timing.',
    content: `Proper nutrition can make or break your race performance. Join us for an in-depth workshop on fueling strategies for long-distance triathlon events.

**Workshop Topics:**
- Pre-race nutrition and carb loading strategies
- During-race fueling: what, when, and how much
- Hydration protocols for different weather conditions
- Post-race recovery nutrition
- Common nutrition mistakes and how to avoid them

**What You'll Learn:**
- How to calculate your individual calorie and fluid needs
- Practical tips for practicing nutrition during training
- Product recommendations and alternatives
- Troubleshooting digestive issues during races

**Workshop Details:**
- Date: February 20th, 2024
- Time: 6:00 PM - 8:00 PM
- Location: M8 Training Facility Conference Room
- Cost: Free for members, $25 for non-members
- Includes: Workshop materials and sample products

**Registration Required:**
Space is limited to 30 participants. Register through our website or contact the front desk.

This workshop is perfect for athletes preparing for their first long-distance event or experienced racers looking to optimize their nutrition strategy.`,
    author: 'Coach Emily Chen',
    publishedAt: new Date('2023-12-28'),
    updatedAt: new Date('2023-12-28'),
    status: 'published' as const,
    category: 'events' as const,
    tags: ['nutrition', 'workshop', 'fueling', 'long distance'],
    featured: false,
    readTime: 3
  }
];