import React from "react";
import { theme } from "../common-dependencies/CartContext";

export type FacetOption = { value: string; count?: number };
export type Facets = {
  price: { min: number; max: number };
  category: FacetOption[];
  productType: FacetOption[];
  voltage: FacetOption[];
  cct: FacetOption[];
  ip: FacetOption[];
  beam: FacetOption[];
  mount: FacetOption[];
  bodyColor: FacetOption[];
  wattBuckets: string[];
};

export function FilterSidebar({
  facets,
  selected,
  onChange,
}: {
  facets: Facets;
  selected: any;
  onChange: (next: any) => void;
}) {
  const [minP, setMinP] = React.useState(facets.price.min);
  const [maxP, setMaxP] = React.useState(facets.price.max);

  const sec = (title: string, children: React.ReactNode) => (
    <div style={{ borderTop: "1px solid #e7ebf1", padding: "16px 0" }}>
      <div style={{ fontWeight: 600, marginBottom: 10, color: theme.blue, fontFamily: theme.futuristicFont }}>{title}</div>
      {children}
    </div>
  );

  const chip = (label: string, active: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      style={{
        margin: "4px 6px 6px 0",
        padding: "6px 10px",
        borderRadius: 10,
        border: active ? `1.5px solid ${theme.blue}` : "1px solid #dfe6ee",
        background: active ? "rgba(79,140,255,0.08)" : "#fff",
        color: active ? theme.blue : "#495672",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: theme.futuristicFont,
      }}
    >
      {label}
    </button>
  );

  const checkbox = (val: string, group: string) => {
    const set = new Set<string>(selected[group] || []);
    const active = set.has(val);
    return (
      <label style={{ display: "flex", alignItems: "center", marginBottom: 8, cursor: "pointer", fontFamily: theme.futuristicFont }}>
        <input
          type="checkbox"
          checked={active}
          onChange={() => {
            active ? set.delete(val) : set.add(val);
            onChange({ ...selected, [group]: Array.from(set) });
          }}
          style={{ marginRight: 10 }}
        />
        <span>{val}</span>
      </label>
    );
  };

  return (
    <aside
      style={{
        width: 280,
        background: "#fff",
        border: "1px solid #e3e8ee",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 8px 24px rgba(120,144,156,0.08)",
        fontFamily: theme.futuristicFont,
        marginRight: 24,
        minWidth: 220,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8, color: theme.blue, fontFamily: theme.futuristicFont }}>Filter by</div>

      {sec("Price", (
        <>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={minP} onChange={e=>setMinP(+e.target.value||facets.price.min)} type="number" style={{ flex: 1, padding: 8, borderRadius: 10, border: "1px solid #e0e6ee" }} />
            <input value={maxP} onChange={e=>setMaxP(+e.target.value||facets.price.max)} type="number" style={{ flex: 1, padding: 8, borderRadius: 10, border: "1px solid #e0e6ee" }} />
          </div>
          <button
            onClick={() => onChange({ ...selected, price: { min: minP, max: maxP } })}
            style={{
              marginTop: 10, background: theme.blue, color: "#fff", border: "none",
              padding: "10px 12px", borderRadius: 12, fontWeight: 700, cursor: "pointer", width: "100%",
              fontFamily: theme.futuristicFont,
            }}
          >
            Apply
          </button>
        </>
      ))}

      {sec("Voltage", (
        <>
          {["110–120 VAC","220–240 VAC","120–277 VAC","12 VDC","24 VDC"].map(v =>
            chip(v, (selected.voltage||[]).includes(v),
              () => {
                const set = new Set(selected.voltage||[]);
                set.has(v) ? set.delete(v) : set.add(v);
                onChange({ ...selected, voltage: Array.from(set) });
              }
            )
          )}
        </>
      ))}

      {sec("CCT", (
        <>
          {["3000K","4000K","5000K"].map(v =>
            chip(v, (selected.cct||[]).includes(v),
              () => {
                const set = new Set(selected.cct||[]);
                set.has(v) ? set.delete(v) : set.add(v);
                onChange({ ...selected, cct: Array.from(set) });
              }
            )
          )}
        </>
      ))}

      {sec("IP Rating", (
        <>
          {["IP65","IP67","IP40"].map(v => checkbox(v, "ip"))}
        </>
      ))}

      {sec("Beam Angle", (["14°","38°","45°","60°","105°","120°"].map(v => checkbox(v, "beam"))))}

      {sec("Mounting", (["Wall mount","Recessed","Surface Mount","Suspended","Spike Mount"].map(v => checkbox(v, "mount"))))}

      {sec("Body Colour", (
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {["Black","White","Matt Grey","Dark Grey","Anodized Aluminium","Stainless Steel"].map(label => {
            const active = (selected.bodyColor||[]).includes(label);
            const hex: Record<string,string> = {
              Black:"#111", White:"#f5f5f7", "Matt Grey":"#9aa3b2", "Dark Grey":"#6b7280",
              "Anodized Aluminium":"#b9bec7", "Stainless Steel":"#c0c4c9"
            };
            return (
              <button
                key={label}
                onClick={()=>{
                  const set=new Set(selected.bodyColor||[]);
                  active?set.delete(label):set.add(label);
                  onChange({ ...selected, bodyColor:Array.from(set) });
                }}
                title={label}
                style={{
                  width:28, height:28, borderRadius:14,
                  border: active? `2px solid ${theme.blue}` : "1px solid #d7dde6",
                  background: hex[label]||"#eaeef6", cursor:"pointer"
                }}
              />
            );
          })}
        </div>
      ))}

      {sec("Wattage", (["≤5W","6–10W","11–20W","21–35W","36–50W","51W+"].map(v => checkbox(v, "wattage"))))}
      
      {sec("Category", (["Indoor Lights","Outdoor Lights"].map(v => checkbox(v, "category"))))}

      {sec("Stock", (
        <label style={{ display:"flex", alignItems:"center", gap:8 }}>
          <input type="checkbox"
            checked={!!selected.inStock}
            onChange={e=>onChange({ ...selected, inStock: e.target.checked })}
          />
          In Stock only
        </label>
      ))}
    </aside>
  );
}