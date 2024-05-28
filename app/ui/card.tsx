import clsx from "clsx";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-slate-900 rounded-lg shadow-md overflow-hidden, p-4",
        className
      )}
    >
      <div>{children}</div>
    </div>
  );
}
