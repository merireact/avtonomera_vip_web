// src/utils/plateMatch.js

export function matchPlatePositional(plate, partsObj) {
  if (!partsObj) return true;

  // The plates are always in format Like: "А123БВ77"
  // Let's parse the actual plate
  // Allowed letters: АВЕКМНОРСТУХ and A-Z
  const m = plate.toUpperCase().match(/^([A-ZА-ЯЁ])?(\d)(\d)(\d)([A-ZА-ЯЁ])?([A-ZА-ЯЁ])?(\d{2,3})$/i);
  if (!m) {
    // Fallback simply to include if it's not standard
    const q = Object.values(partsObj).join("").trim().toLowerCase();
    if (!q) return true;
    return plate.toLowerCase().includes(q);
  }

  const [, pl1, pd1, pd2, pd3, pl2, pl3, pr] = m;
  const p = partsObj;

  // Check positions if they are provided in search query
  if (p.l1 && p.l1.toUpperCase() !== pl1?.toUpperCase()) return false;
  if (p.d1 && p.d1 !== pd1) return false;
  if (p.d2 && p.d2 !== pd2) return false;
  if (p.d3 && p.d3 !== pd3) return false;
  if (p.l2 && p.l2.toUpperCase() !== pl2?.toUpperCase()) return false;
  if (p.l3 && p.l3.toUpperCase() !== pl3?.toUpperCase()) return false;
  
  // For region, usually it's startsWith so that "7" matches "77" and "790"
  if (p.r && !pr?.startsWith(p.r)) return false;

  return true;
}
