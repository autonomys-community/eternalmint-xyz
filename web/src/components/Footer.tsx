import { FaDiscord, FaGithub, FaHeart } from "react-icons/fa";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full text-white">
      <div className="flex justify-center items-center pt-4 pb-0">
        <a
          href="https://github.com/autonomys-community/eternalmint-xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mr-8"
        >
          <FaGithub size={24} />
          <span>GitHub Repo</span>
        </a>
        <p className="flex items-center gap-2">
          Made with <FaHeart className="text-red-500" /> by Marc-Aurèle & the Autonomys Community
        </p>
        <a
          href="https://autonomys.xyz/discord"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-8"
        >
          <FaDiscord className="text-white hover:text-gray-400" size={24} />
        </a>
      </div>
    </footer>
  );
};
