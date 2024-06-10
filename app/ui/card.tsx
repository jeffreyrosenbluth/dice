import clsx from "clsx";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx("bg-inherit overflow-hidden, p-4 sm:min-w-48", className)}
    >
      <div>{children}</div>
    </div>
  );
}
