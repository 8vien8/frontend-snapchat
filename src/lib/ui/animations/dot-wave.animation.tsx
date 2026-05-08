export const DotWaveAnimation = () => {
  return (
    <span className="ml-1 flex">
      {new Array(3).fill(0).map((_, i) => (
        <span
          key={i}
          className="animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          .
        </span>
      ))}
    </span>
  );
};
