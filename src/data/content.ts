import projectPlaceholder from '../assets/project-placeholder.jpg';

export const links = {
  email: 'lucasbonnard91@gmail.com',
  linkedin: 'https://www.linkedin.com/in/lucas-bonnard-705953131/',
  behance: 'https://www.behance.net/lucasbonnard',
  cv: 'cv.pdf',
};

export type Theme = 'light' | 'accent' | 'dark';

export const nav = [
  { label: 'Home', target: 'home', group: ['home'] },
  { label: 'Skill', target: 'skills', group: ['skills', 'more'] },
  { label: 'Career', target: 'career', group: ['career'] },
  { label: 'Work', target: 'work', group: ['work'] },
  { label: 'Contact', target: 'contact', group: ['contact'] },
];

export const skills = [
  {
    title: 'Conception',
    body: 'From personas to wireframes, the early thinking stages are key to designing a truly user-centered interface.',
  },
  {
    title: 'Interface',
    body: 'A strong interface is built on a consistent design system and mockups that give developers exactly what they need.',
  },
  {
    title: 'Integration',
    body: 'A well-designed interface adapts to technical constraints, whether it’s an app, a website or a video game.',
  },
];

export const moreSkills = [
  {
    title: 'Illustration',
    body: 'From icons to illustrations, I create custom assets for my own projects and add an artistic touch.',
    mobile: true,
  },
  {
    title: 'Motion',
    body: 'From transitions to loading screens, animation is a key element of interface design and gives it a new dimension.',
    mobile: true,
  },
  {
    title: 'Print',
    body: 'With 10 years of experience in the nonprofit sector, I can adapt to a wide range of media beyond digital.',
    mobile: false,
  },
  {
    title: 'Visual identity',
    body: 'As a graphic designer, my expertise allows me to extend my creative work beyond the interface.',
    mobile: true,
  },
];

export const career = [
  { title: 'Master’s Degree in Interaction and Experience', desc: '2021, Toulon (France)' },
  { title: 'Art Director at Smash Essonne', desc: 'From 2014 to 2023, Smash Essonne (Association)' },
  { title: 'UI/UX Designer at Moonrise', desc: '2019, Internship, Massy (France)' },
  { title: 'UI/UX Designer at Sportunity', desc: '2019, Internship, Massy (France)' },
  { title: 'UI Artist at Kylotonn', desc: 'From 2021 to 2026, video game industry, Paris (France)' },
];

const placeholderText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque condimentum ligula et justo accumsan';

export const projects = Array.from({ length: 6 }, (_, i) => ({
  title: `Project ${i + 1}`,
  image: projectPlaceholder,
  alt: `Project ${i + 1} preview`,
  text: placeholderText,
  href: '#',
}));
