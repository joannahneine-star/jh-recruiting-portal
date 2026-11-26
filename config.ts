// All data comes from these 4 public Google Sheets (published as CSV).
// To change a data source, paste the new "Publish to web → CSV" link here.
const BASE =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTRYYcYZMhAquljcoqXTHvM-iQ37uIGQcSVIIEcQcrOPnOM_vGgYkmKYND-RZKMREowTC7YtbfsVDuk/pub";

export const ROLES_CSV = `${BASE}?gid=179565093&single=true&output=csv`;
export const SHORTLISTS_CSV = `${BASE}?gid=1307124526&single=true&output=csv`;
export const CANDIDATES_CSV = `${BASE}?gid=895758321&single=true&output=csv`;
export const TESTS_CSV = `${BASE}?gid=1112916770&single=true&output=csv`;

// How often (in seconds) the portal re-reads the sheets.
export const REVALIDATE_SECONDS = 60;
