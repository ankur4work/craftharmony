export default function SectionHeader({ eyebrow, title, description, centered = false }) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && (
        <p className="eyebrow">
          <span className="inline-block h-px w-8 bg-terracotta" />
          {eyebrow}
        </p>
      )}
      <h2 className="section-title mt-3">{title}</h2>
      {description && <p className="section-copy">{description}</p>}
    </div>
  );
}
