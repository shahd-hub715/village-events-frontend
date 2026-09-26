import { villageShortTitle } from "../config/village";
import { strings } from "../config/strings";
import BrandTitle from "./BrandTitle.tsx";

interface HeaderProps {
  onAddEvent: () => void;
}

export default function Header({ onAddEvent }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <BrandTitle title={villageShortTitle()} />
        </div>

        <button
          type="button"
          className="btn btn-primary btn-pill"
          onClick={onAddEvent}
        >
          {strings.hero.primaryCta}
        </button>
      </div>
    </header>
  );
}