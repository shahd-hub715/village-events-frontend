type BrandTitleProps = {
  title: string;
};

export default function BrandTitle({ title }: BrandTitleProps) {
  const words = title.trim().split(/\s+/);
  const [firstWord, ...rest] = words;

  return (
    <span className="brand-title">
      <span>{firstWord}</span>

      {rest.length > 0 && (
        <>
          {" "}
          <span className="brand-accent">
            {rest.join(" ")}
          </span>
        </>
      )}
    </span>
  );
}