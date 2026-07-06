import type { ImageLoaderProps } from "next/image";

export const homeHeroImageUrl =
  "https://www.figma.com/api/mcp/asset/d567ce96-f5f1-49d9-ab5a-86a0e4439b96";

export const homeHeaderLogoFillUrl =
  "https://www.figma.com/api/mcp/asset/05c11a20-a561-4f01-84ff-e084738daa03";

export const homeFooterLogoFillUrl =
  "https://www.figma.com/api/mcp/asset/3c510453-9248-416f-9b59-c667daca4883";

export const homeLogoMaskUrl =
  "https://www.figma.com/api/mcp/asset/d1bc82b1-5c5b-4cee-b87d-e5fcf8a0686f";

export const homeSearchIconUrl =
  "https://www.figma.com/api/mcp/asset/909fdcd2-5325-45f1-a766-273624a3fc3d";

export const homeCategoryIconUrls = {
  allRestaurant:
    "https://www.figma.com/api/mcp/asset/d5fe0385-dcf4-44b9-b2d3-0f9c04d58b57",
  nearby:
    "https://www.figma.com/api/mcp/asset/77690b77-a9e0-476e-8a68-bd6d05ffc225",
  bestSeller:
    "https://www.figma.com/api/mcp/asset/a60e1a2f-d18e-48a6-af51-69b240fd187b",
  lunch:
    "https://www.figma.com/api/mcp/asset/27683bf8-5d23-41b3-94fd-a3c7f0940198",
} as const;

export const passthroughLoader = ({ src }: ImageLoaderProps) => src;
