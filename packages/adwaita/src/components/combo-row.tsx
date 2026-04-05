import { useIcon } from "@gtk-js/gtk4";
import { forwardRef, type HTMLAttributes, useCallback, useMemo, useState } from "react";

export interface AdwComboRowProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  items: string[];
  selected?: number;
  enableSearch?: boolean;
  useSubtitle?: boolean;
  onSelected?: (index: number) => void;
}

/**
 * AdwComboRow — An ActionRow with a dropdown selection.
 *
 * CSS node: row.combo
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.ComboRow.html
 */
export const AdwComboRow = forwardRef<HTMLDivElement, AdwComboRowProps>(function AdwComboRow(
  {
    title,
    subtitle,
    items,
    selected: controlledSelected,
    enableSearch = false,
    useSubtitle = false,
    onSelected,
    className,
    ...rest
  },
  ref,
) {
  const isControlled = controlledSelected !== undefined;
  const [internalSelected, setInternalSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = isControlled ? controlledSelected : internalSelected;

  const ArrowIcon = useIcon("PanDown");
  const CheckIcon = useIcon("ObjectSelect");

  const filtered = useMemo(() => {
    if (!search) return items.map((item, i) => ({ item, i }));
    return items
      .map((item, i) => ({ item, i }))
      .filter(({ item }) => item.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  const selectItem = useCallback(
    (i: number) => {
      if (!isControlled) setInternalSelected(i);
      onSelected?.(i);
      setOpen(false);
      setSearch("");
    },
    [isControlled, onSelected],
  );

  const displaySubtitle = useSubtitle ? items[selected] : subtitle;

  const classes = ["gtk-row", "combo", "activatable"];
  if (open) classes.push("has-open-popup");
  if (className) classes.push(className);

  return (
    <div ref={ref} className={classes.join(" ")} {...rest}>
      <div
        className="gtk-box gtk-box-layout horizontal header"
        style={{ gap: 6, alignItems: "center", cursor: "pointer" }}
        onClick={() => {
          setOpen(!open);
          setSearch("");
        }}
      >
        <div className="gtk-box gtk-box-layout vertical title" style={{ flex: 1, gap: 3 }}>
          <span className="gtk-label title">{title}</span>
          {displaySubtitle && <span className="gtk-label subtitle">{displaySubtitle}</span>}
        </div>
        {!useSubtitle && <span className="gtk-label">{items[selected] ?? ""}</span>}
        {ArrowIcon && (
          <span className="gtk-image dropdown-arrow">
            <ArrowIcon size={16} />
          </span>
        )}
      </div>
      {open && (
        <div className="gtk-popover background menu">
          <div className="gtk-contents">
            {enableSearch && (
              <div className="combo-searchbar" style={{ padding: 6 }}>
                <input
                  type="search"
                  className="gtk-entry search"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
            )}
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              {filtered.map(({ item, i }) => (
                <div
                  key={i}
                  className={`gtk-row activatable ${i === selected ? "selected" : ""}`}
                  role="option"
                  aria-selected={i === selected}
                  onClick={() => selectItem(i)}
                >
                  <span className="gtk-label">{item}</span>
                  {i === selected && CheckIcon && (
                    <span className="gtk-image">
                      <CheckIcon size={16} />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
