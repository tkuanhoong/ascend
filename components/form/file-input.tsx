import { Input } from "@/components/ui/input";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";

interface FileInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  href?: string;
  disabled?: boolean;
  accept?: string;
}

export function FileInput<T extends FieldValues>({
  control,
  label,
  name,
  disabled,
  accept,
}: FileInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <FormControl>
            <Input
              id={name}
              name={name}
              type="file"
              accept={accept}
              disabled={disabled}
              onChange={(e) => {
                field.onChange(e.target.files?.[0] || null);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
