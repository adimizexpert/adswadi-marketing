import type { CmsPlan } from "./api";
import { defaultInstagramPlans, defaultYoutubePlans } from "./cmsDefaults";

function isYoutube(p: CmsPlan) {
  return p.platform === "youtube" || p.platform === undefined;
}

function isInstagram(p: CmsPlan) {
  return p.platform === "instagram";
}

/** Split API plans for YouTube vs Instagram sections; fall back to defaults if a side is missing. */
export function splitPlansByPlatform(plans: CmsPlan[]): {
  youtube: CmsPlan[];
  instagram: CmsPlan[];
} {
  const yt = plans.filter(isYoutube);
  const ig = plans.filter(isInstagram);
  return {
    youtube: yt.length ? yt : defaultYoutubePlans,
    instagram: ig.length ? ig : defaultInstagramPlans,
  };
}
