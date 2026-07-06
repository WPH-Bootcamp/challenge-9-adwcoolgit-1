import Image from "next/image";
import { Star } from "lucide-react";

import { passthroughLoader } from "@/features/home/constants";
import type { ReviewSummary } from "@/types/domain";

interface RestaurantReviewCardProps {
  review: ReviewSummary;
}

const reviewDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatReviewDate(value: string | null) {
  if (!value) {
    return "Recent review";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recent review";
  }

  return reviewDateFormatter.format(date).replace(" at ", ", ");
}

function ReviewAvatar({ name, avatar }: { name: string; avatar: string | null }) {
  if (avatar) {
    return (
      <div className="relative size-[58px] overflow-hidden rounded-full">
        <Image
          loader={passthroughLoader}
          unoptimized
          src={avatar}
          alt={name}
          fill
          sizes="58px"
          className="object-cover"
        />
      </div>
    );
  }

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((value) => value[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex size-[58px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#fdb022_0%,#c12116_100%)] text-base font-bold text-white">
      {initials || "JD"}
    </div>
  );
}

export function RestaurantReviewCard({ review }: RestaurantReviewCardProps) {
  const filledStars = Math.max(0, Math.min(5, Math.round(review.star)));

  return (
    <article className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0_0_10px_rgba(203,202,202,0.25)]">
      <div className="flex items-start gap-3">
        <ReviewAvatar name={review.authorName} avatar={review.authorAvatar} />
        <div className="min-w-0 text-(--color-neutral-950)">
          <p className="truncate text-md font-extrabold leading-[30px] tracking-[var(--tracking-tight)]">
            {review.authorName}
          </p>
          <p className="text-sm font-normal leading-7 tracking-[var(--tracking-tight)] text-(--color-neutral-600)">
            {formatReviewDate(review.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={`${review.reviewId}-${index}`}
              className={index < filledStars ? "size-6 fill-[#FDB022] text-[#FDB022]" : "size-6 text-(--color-neutral-300)"}
              strokeWidth={1.5}
            />
          ))}
        </div>
        <p className="text-sm font-normal leading-7 tracking-[var(--tracking-tight)] text-(--color-neutral-950)">
          {review.comment || "This diner left a positive impression without additional notes."}
        </p>
      </div>
    </article>
  );
}
