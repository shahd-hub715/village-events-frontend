/**
 * Single place where the village identity lives.
 * Supporting another village later = change these values (or load them from an API).
 */
export interface VillageConfig {
  /** Bare name, e.g. "مصمص" */
  name: string;
  /** Optional override for the page/site title */
  title?: string;
  /** Compact title for tight spots like the sticky header */
  shortTitle?: string;
}

export const villageConfig: VillageConfig = {
  name: "مصمص"
};

export function villageTitle(config: VillageConfig = villageConfig): string {
  return config.title ?? `مناسبات قرية ${config.name}`;
}

/** Used in the header, where the full title would be truncated on small screens. */
export function villageShortTitle(config: VillageConfig = villageConfig): string {
  return config.shortTitle ?? "مناسبات قريتنا";
}