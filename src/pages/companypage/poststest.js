import logoImage from "../../assets/images/elsewedyicon.jpeg";
import mediaImage from "../../assets/images/testpost.jpeg";

const posts = [
  {
    companyName: "ELSEWEDY ELECTRIC",
    logo: logoImage, // Use imported image
    timeAgo: "1w",
    text: "Elsewedy Cables, Safety That Lasts.",
    media: mediaImage, // Use imported image
    mediaType: "image",
    likes: 687,
    comments: 11,
    shares: 132,
    edited: true,
  },
  {
    companyName: "Tech Innovators",
    logo: logoImage,
    timeAgo: "3d",
    text: "Our latest innovation is here! Stay tuned for the big reveal. 🚀",
    media: logoImage,
    mediaType: "image",
    likes: 450,
    comments: 20,
    shares: 75,
    edited: true,
  },
  {
    companyName: "AI Research Hub",
    logo: logoImage,
    timeAgo: "5d",
    text: "Read our latest article on the future of AI.",
    media: logoImage,
    mediaType: "image",
    likes: 310,
    comments: 15,
    shares: 80,
    edited: true,
  },
  {
    companyName: "Cloud Solutions",
    logo: logoImage,
    timeAgo: "2h",
    text: "Download our latest whitepaper on cloud security.",
    media: logoImage,
    mediaType: "image",
    likes: 220,
    comments: 8,
    shares: 50,
    edited: false,
  },
];

export default posts;
