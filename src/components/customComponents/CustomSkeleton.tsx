import { Skeleton } from "@/components/ui/skeleton";

interface customSkeletonProps {
  numOfTimes?: number;
  isChatSkeleton: boolean;
}

const CustomSkeleton = ({
  numOfTimes = 1,
  isChatSkeleton,
}: customSkeletonProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8">
      {isChatSkeleton ? (
        <div className="w-full max-w-md md:max-w-lg mx-auto space-y-5 p-4">
          {/* Chat messages */}
          <div className="space-y-6">
            {/* AI message skeleton */}
            <div className="flex items-start space-x-4">
              <Skeleton className="h-10 md:h-12 w-10 md:w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] md:w-[400px] " />
                <Skeleton className="h-4 w-[200px] md:w-[300px] " />
              </div>
            </div>

            {/* User message skeleton */}
            <div className="flex items-start space-x-4 justify-end">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px] md:w-[350px] " />
                <Skeleton className="h-4 w-[150px] md:w-[300px] " />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>

            {/* Another AI message skeleton */}
            <div className="flex items-start space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] md:w-[400px]" />
                <Skeleton className="h-4 w-[200px] md:w-[300px]" />
              </div>
            </div>
            {/* User message skeleton */}
            <div className="flex items-start space-x-4 justify-end">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px] md:w-[300px]" />
                <Skeleton className="h-4 w-[150px] md:w-[250px]" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>

          {/* Input field skeleton */}
          <div className="flex items-center space-x-2 ">
            <Skeleton className="h-10 flex-grow rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          {Array.from({ length: numOfTimes }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-12 md:h-15  w-12 md:w-15  rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 md:h-6  w-[250px] md:w-[350px]  lg:w-[550px]" />
                <Skeleton className="h-4 md:h-6  w-[200px] md:w-[300px] lg:w-[500px]" />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default CustomSkeleton;
