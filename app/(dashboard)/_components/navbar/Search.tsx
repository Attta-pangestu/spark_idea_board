import qs from "query-string";
import { useDebounce } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useEffect, useState, ChangeEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const SearchInput = () => {
  const [input, setInput] = useState("");
  const router = useRouter();
  const debouncedValue = useDebounce(input, 300);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: { search: debouncedValue },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  }, [debouncedValue, router]);

  return (
    <div className="w-full relative">
      <Search className="absolute top-1/2 transform -translate-y-1/2 left-4 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search Ideas..."
        value={input}
        onChange={handleChange}
        className="w-full max-w-[516px] pl-10 "
      />
    </div>
  );
};
