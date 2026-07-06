import type { ImageLoaderProps } from "next/image";

export const heroImageUrl =
  "https://www.figma.com/api/mcp/asset/3562d3dd-a81e-45eb-ab2b-89ae1fa751e4";

export const logoMaskUrl =
  "https://www.figma.com/api/mcp/asset/04b02add-146c-42c3-b9c0-950a4f526fb5";

export const logoImageUrl =
  "https://www.figma.com/api/mcp/asset/9b7d590b-be51-40e3-93e1-649f513d0df6";

function getIconifyIconUrl(name: string, color = "%23717680") {
  return `https://api.iconify.design/${name}.svg?color=${color}&width=16&height=16`;
}

export const chevronDownUrl = getIconifyIconUrl("lucide/chevron-down");
export const eyeIconUrl = getIconifyIconUrl("lucide/eye");
export const eyeOffIconUrl = getIconifyIconUrl("lucide/eye-off");
export const checkIconUrl = getIconifyIconUrl("lucide/check", "%23FDFDFD");

export const passthroughLoader = ({ src }: ImageLoaderProps) => src;

export const authCopy = {
  login: {
    title: "Welcome Back",
    subtitle: "Good to see you again! Let's eat",
  },
  register: {
    title: "Create Account",
    subtitle: "Create your account and start discovering great meals",
  },
} as const;
