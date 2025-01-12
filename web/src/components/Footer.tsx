import { FaGithub, FaHeart, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full text-white">
      <div className="flex justify-center items-center pt-4 pb-0">
        <a
          href="https://github.com/marc-aurele-besner/eternalmint-xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mr-8"
        >
          <FaGithub size={24} />
          <span>GitHub Repo</span>
        </a>
        <p className="flex items-center gap-2">
          Made with <FaHeart className="text-red-500" /> by Marc-Aurèle
        </p>
        <a
          href="https://github.com/marc-aurele-besner"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-8"
        >
          <FaGithub className="text-white hover:text-gray-400" size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/marc-aurele-besner/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4"
        >
          <FaLinkedin className="text-white hover:text-gray-400" size={24} />
        </a>
        <a
          href="https://x.com/marcaureleb"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4"
        >
          <FaTwitter className="text-white hover:text-gray-400" size={24} />
        </a>
      </div>
    </footer>
  );
};
