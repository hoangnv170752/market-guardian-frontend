import { Link } from 'waku';

export const Header = () => {
  return (
    <header className="flex items-center gap-4 p-6 lg:fixed lg:left-0 lg:top-0">
      <Link to="/" className="flex items-center gap-3">
        <img 
          src="/images/kangaroo.jpg" 
          alt="Market Guardian" 
          className="h-10 w-auto object-contain"
        />
      </Link>
    </header>
  );
};
