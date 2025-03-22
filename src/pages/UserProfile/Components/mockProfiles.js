import coverphoto from "../../../assets/images/coverphoto.png";

const mockProfiles = [
  {
    id: 1,
    firstName: "Fatma",
    lastName: "Gamal",
    profilePicture:
      "https://th.bing.com/th/id/OIP.AxXeQv751lyx0ltppBIg6QHaHa?rs=1&pid=ImgDetMain",
    backgroundImage: coverphoto,
    bio: "Student at Cairo University",
    country: "Egypt",
    city: "Cairo",
    industry: "Computer Engineering",
    workExperience: ["Intern at Al Ahly Sabbour", "bla bla"],
    education: ["Cairo University, Class of 2024", "Alex, 2024"],
    skills: ["React", "JavaScript", "Tailwind CSS"],
    achievements: "Dean's List Award",
    connections: 50,
    about:
      "I am a highly motivated and detail-oriented Software Engineer with a passion for frontend development...",
    email: "fatma@example.com",
    profileUrl: "https://linkedin.com/in/fatma-gamal",
    mail: "fatma@example.com",
    isOwner: true, // Indicates this is the logged-in user's profile
  },

  {
    id: 2,
    firstName: "Mohamed",
    lastName: "Sobh",
    profilePicture:
      "https://th.bing.com/th/id/OIP.srNFFzORAaERcWvhwgPzVAHaHa?rs=1&pid=ImgDetMain",
    backgroundImage: coverphoto,
    bio: "Computer Engineering Student at Cairo University",
    country: "Egypt",
    city: "Qesm El Maadi, Cairo",
    industry: "Software Engineering",
    workExperience: ["Intern at Al Ahly Sabbour", "bla bla"],
    education: ["Cairo University, Class of 2024", "Alex, 2024"],
    skills: ["React", "JavaScript", "Tailwind CSS"],
    achievements: "Google Coding Competition Finalist",
    connections: 80,
    about: "",
    email: "mohamed@example.com",
    profileUrl: "https://linkedin.com/in/mohamed-sobh",
    mail: "mohamed@example.com",
    isOwner: false,
  },

  {
    id: 3,
    firstName: "Salma",
    lastName: "Ahmed",
    profilePicture:
      "https://th.bing.com/th/id/OIP.AxXeQv751lyx0ltppBIg6QHaHa?rs=1&pid=ImgDetMain",
    backgroundImage: coverphoto,
    bio: "Marketing Specialist | Content Creator",
    country: "Egypt",
    city: "Giza",
    industry: "Marketing & Media",
    workExperience: ["Intern at Al Ahly Sabbour", "bla bla"],
    education: ["Cairo University, Class of 2024", "Alex, 2024"],
    skills: ["React", "JavaScript", "Tailwind CSS"],
    achievements: "Top 10 Content Creators Award",
    connections: 80,
    about:
      "I thrive in collaborative environments, where I can contribute my problem-solving skills and creativity...",
    email: "salma@example.com",
    profileUrl: "https://linkedin.com/in/salma-ahmed",
    mail: "salma@example.com",
    isOwner: false,
  },
];

export default mockProfiles;
