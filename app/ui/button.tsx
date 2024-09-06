import { Button, ButtonProps } from "@nextui-org/react";
import clsx from "clsx";

interface CustomButtonProps extends ButtonProps {
  disabled?: boolean;
}

const DiceButton: React.FC<CustomButtonProps> = ({
  children,
  disabled,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={disabled}
      className={clsx("bg-blue-500 px-4 py-2 transition duration-200", {
        "opacity-100": !disabled,
        "opacity-50": disabled,
      })}
    >
      {children}
    </Button>
  );
};

export default DiceButton;
