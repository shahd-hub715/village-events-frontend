import { strings } from "../config/strings";
import { villageTitle } from "../config/village";
import "../styles/changeRequest.css";

interface HeroSectionProps {
  onAddEvent: () => void;
  onRequestChange: () => void;
}

export default function HeroSection({
  onAddEvent,
  onRequestChange
}: HeroSectionProps) {
  return (
    <section className="hero">
      <span className="hero-eyebrow">{strings.hero.eyebrow}</span>

      <h1 className="hero-title">{villageTitle()}</h1>

      <p className="hero-text">{strings.hero.text}</p>

      <div className="hero-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onAddEvent}
        >
          {strings.hero.primaryCta}
        </button>

        <a className="btn btn-secondary" href="#events">
          {strings.hero.secondaryCta}
        </a>
      </div>

      <button
        type="button"
        className="hero-link"
        onClick={onRequestChange}
      >
        {strings.changeRequest.cta}
      </button>
    </section>
  );
}