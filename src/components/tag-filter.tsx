"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TAGS = ["all", "nature", "city"];

type Props = {
  selected: string;
  onChange: (tag: string) => void;
};

export default function TagFilter({ selected, onChange }: Props) {
  return (
    <Tabs defaultValue="all" value={selected} onValueChange={onChange}>
      <TabsList>
        {TAGS.map((tag) => (
          <TabsTrigger key={tag} value={tag} className="capitalize">
            {tag}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
