import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface TextInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  href?: string;
  disabled?: boolean;
}
export const CommonInput = <T extends FieldValues>({
  control,
  label,
  name,
  placeholder,
  type,
  required,
  href,
  disabled,
  defaultValue,
}: TextInputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {
            // If href is provided, render a link to the related page
            href ? (
              <div className="flex justify-between items-center">
                <FormLabel htmlFor={name}>{label}</FormLabel>
                <a
                  href={href}
                  className="ml-auto text-sm underline-offset-4 hover:underline text-right"
                >
                  Forgot your password?
                </a>
              </div>
            ) : (
              <FormLabel htmlFor={name}>{label}</FormLabel>
            )
          }

          <FormControl>
            <Input
              {...field}
              id={name}
              placeholder={placeholder}
              type={type}
              required={required}
              disabled={disabled}
              defaultValue={defaultValue}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
