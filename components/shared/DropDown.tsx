import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DropDownProps {
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  value: string;
}

const DropDown = ({ options, onChange, value }: DropDownProps) => {
  return (
<div className = "w-full" >
      <Select onValueChange={onChange} defaultValue={value}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent >
          {options.length > 0 &&
            options.map((option) => (
              <SelectItem value={option.value}>{option.label}</SelectItem>
            ))}
        </SelectContent>
      </Select>
</div>
  );
};

export default DropDown;
