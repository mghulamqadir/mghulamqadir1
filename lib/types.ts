export type ProjectStatus = "draft" | "published" | "archived";

export interface Technology { id?: string; name: string; category: string; icon?: string | null; }
export interface ProjectImage { id: string; public_id: string; secure_url: string; resource_type: string; format?: string | null; width?: number | null; height?: number | null; bytes?: number | null; alt_text: string; caption?: string | null; sort_order: number; }
export interface Project {
  id: string; title: string; slug: string; short_description: string; company: string;
  role: string; category: string; status: ProjectStatus; featured: boolean; sort_order: number;
  overview?: string | null; problem?: string | null; solution?: string | null; my_role?: string | null;
  architecture?: string | null; challenges?: string[] | null; outcome?: string | null;
  live_url?: string | null; github_url?: string | null; cover_image_url?: string | null;
  seo_title?: string | null; seo_description?: string | null; technologies?: Technology[]; images?: ProjectImage[];
}
export interface Experience { id: string; company: string; role: string; location?: string | null; start_date: string; end_date?: string | null; current_role: boolean; description?: string | null; highlights?: string[]; technologies?: string[]; sort_order: number; }
export interface Testimonial { id: string; name: string; job_title?: string | null; company?: string | null; testimonial: string; source_url?: string | null; featured: boolean; status: "draft" | "published"; sort_order: number; }
export interface Certification { id: string; name: string; issuer?: string | null; issue_date?: string | null; date_label?: string | null; credential_id?: string | null; credential_url?: string | null; image_url?: string | null; sort_order: number; }
export interface SiteSettings { key: string; value: Record<string, unknown>; }

export interface RequestLog {
  id: string;
  ip: string;
  method: string;
  path: string;
  query?: string | null;
  user_agent?: string | null;
  referer?: string | null;
  country?: string | null;
  city?: string | null;
  region?: string | null;
  created_at: string;
}

export interface RequestLogStats {
  totalToday: number;
  uniqueIpsToday: number;
  totalAllTime: number;
  topPaths: { path: string; count: number }[];
}
