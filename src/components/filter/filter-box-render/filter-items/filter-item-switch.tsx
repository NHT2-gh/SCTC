import { Switch } from "@/components/ui/switch";
import { FilterItemProp, type SwitchFilter } from "../type";

export default function SwitchFilter({
  value,
  onChange,
}: FilterItemProp<SwitchFilter, boolean>) {
  return (
    <Switch defaultValue={value} handleOnChange={onChange} type={"switch"} />
  );
}
