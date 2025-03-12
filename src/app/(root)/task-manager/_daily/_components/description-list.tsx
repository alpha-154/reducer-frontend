interface DescriptionListProps {
  descriptions: string[];
  maxItems?: number;
}

export function DescriptionList({
  descriptions,
  maxItems,
}: DescriptionListProps) {
  const displayItems = maxItems
    ? descriptions.slice(0, maxItems)
    : descriptions;

  return (
    <div className="relative space-y-1 max-h-[200px] overflow-y-auto border rounded-xl border-boneInnerBg p-2">
     
      {displayItems.map((desc, index) => (
        <div key={index} className="flex items-center gap-6">
          <div className="w-8 h-8 flex text-white items-center justify-center rounded-full bg-burntSienna text-sm font-medium shrink-0">
            {index + 1}
          </div>
          <span className="text-darkbrownText text-sm">{desc}</span>
        </div>
      ))}

      {maxItems && descriptions.length > maxItems && (
        <div className="text-sm text-gray-400 pl-[4.5rem]">
          +{descriptions.length - maxItems} more items...
        </div>
      )}
    </div>
  );
}
