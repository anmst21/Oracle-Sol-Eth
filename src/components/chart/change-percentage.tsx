import classNames from "classnames";
import SkeletonLoaderWrapper from "../skeleton";

const ChangePercentage = ({
  value,
  isSkeleton,
  fill,
}: {
  value: string;
  isSkeleton?: boolean;
  fill?: number;
}) => {
  const numValue = Number(value);
  return (
    <td className="pool-item__change">
      <div>
        {!isSkeleton && (
          <span>
            <span
              className={classNames("change-percentage", {
                "change-percentage--negative": numValue < 0,
                "change-percentage--zero": numValue === 0,
                "change-percentage--positive": numValue > 0,
              })}
            >
              {numValue}
            </span>
            %
          </span>
        )}
        {isSkeleton && (
          <SkeletonLoaderWrapper
            radius={2}
            height={21}
            width={fill}
            isLoading={true}
          />
        )}
      </div>
    </td>
  );
};

export default ChangePercentage;
