import projectPlaceholder from '../assets/project-placeholder.jpg';
import projectEndurance from '../assets/projects/endurance.webp';

export const links = {
  email: 'lucasbonnard91@gmail.com',
  linkedin: 'https://www.linkedin.com/in/lucas-bonnard-705953131/',
  behance: 'https://www.behance.net/lucasbonnard',
  cv: 'cv.pdf',
};

export type Theme = 'light' | 'accent' | 'dark';

export const roles = ['UI/UX Designer', 'UI Artist', 'Product Designer', 'Graphic Designer'];

export const nav = [
  { label: 'Home', target: 'home', group: ['home'] },
  { label: 'Skills', target: 'skills', group: ['skills', 'more'] },
  { label: 'Career', target: 'career', group: ['career'] },
  { label: 'Works', target: 'work', group: ['work'] },
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
  { title: 'UI Artist at Kylotonn', desc: 'From 2021 to present, video game industry, Paris (France)' },
  { title: 'UI/UX Designer at Sportunity', desc: '2020 (6 months), Internship, Massy (France)' },
  { title: 'UI/UX Designer at Moonrise', desc: 'From 2018 to 2019, Work-study Program, Paris (France)' },
  { title: 'Master’s Degree in Interaction and Experience', desc: 'From 2019 to 2021, Toulon (France)' },
  { title: 'Art Director at Smash Essonne', desc: 'From 2014 to 2023, Smash Essonne (Association)' },
];

const placeholderText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque condimentum ligula et justo accumsan';

const placeholders = Array.from({ length: 5 }, (_, i) => ({
  title: `Project ${i + 2}`,
  image: projectPlaceholder,
  alt: `Project ${i + 2} preview`,
  text: placeholderText,
  href: '#',
}));

export const projects = [
  {
    title: 'Endurance racing game',
    image: projectEndurance,
    alt: 'In-game racing interface of an endurance prototype on track, shown on a monitor in a race team garage',
    text: 'A racing simulation game built around endurance racing and the 24 Hours of Le Mans. Coming soon to PS5, Xbox and PC.',
    href: '#',
  },
  ...placeholders,
];
