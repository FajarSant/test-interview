import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function HeaderSection() {
  return (
    <section className="bg-blue-600 text-white py-12 px-4 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <h4 className="text-sm uppercase">Blog genzet</h4>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          The Journal : Design Resources, <br className="hidden md:inline" />
          Interviews, and Industry News
        </h1>
        <p className="mt-4 text-lg">Your daily dose of design insights!</p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <Select>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="design">Design</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Search articles" className="w-full md:w-96" />
        </div>
      </div>
    </section>
  );
}
