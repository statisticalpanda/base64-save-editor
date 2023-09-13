import { useRef, useEffect, useState } from "react";

interface Props {
  data: any;
  onChange: (data: any) => void;
  indentLevel?: number;
  filterRegex?: RegExp;
  setFilter?: (value: string) => void;
}

const JsonView: React.FC<Props> = ({
  data,
  onChange,
  indentLevel = 0,
  filterRegex,
  setFilter,
}) => {
  const keyRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleKeyClick = (key: string) => {
    if (setFilter) {
      setFilter(""); // Clear filter

      // Using setTimeout to ensure DOM updates happen before scrolling
      setTimeout(() => {
        keyRefs.current[key]?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  };

  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleCollapse = (key: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const shouldDisplay = (key: string, value: any): boolean => {
    if (!filterRegex) return true;
    if (filterRegex.test(key)) return true;

    // If it's an object or array, recurse into its values
    if (typeof value === "object" && value !== null) {
      return Object.entries(value).some(([childKey, childValue]) =>
        shouldDisplay(childKey, childValue)
      );
    }

    return false;
  };
  const renderField = (key: string, value: any) => {
    if (typeof value === "object" && value !== null) {
      return (
        <div>
          <span onClick={() => toggleCollapse(key)}>
            {collapsedSections[key] ? "[+]" : "[-]"} {key}
          </span>
          {!collapsedSections[key] && (
            <JsonView
              data={value}
              onChange={(updatedNestedData) => {
                const updatedData = { ...data };
                updatedData[key] = updatedNestedData;
                onChange(updatedData);
              }}
              indentLevel={indentLevel + 1}
              filterRegex={filterRegex}
            />
          )}
        </div>
      );
    }
    if (typeof value === "boolean") {
      return (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => {
            const updatedData = { ...data };
            updatedData[key] = e.target.checked;
            onChange(updatedData);
          }}
        />
      );
    } else if (typeof value === "object" && value !== null) {
      return (
        <JsonView
          data={value}
          onChange={(updatedNestedData) => {
            const updatedData = { ...data };
            updatedData[key] = updatedNestedData;
            onChange(updatedData);
          }}
          indentLevel={indentLevel + 1}
        />
      );
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const updatedData = { ...data };
          updatedData[key] = e.target.value;
          onChange(updatedData);
        }}
      />
    );
  };

  return (
    <div style={{ marginLeft: `${indentLevel * 20}px` }}>
      {Object.keys(data).map(
        (key) =>
          shouldDisplay(key, data[key]) && (
            <div key={key} ref={(ref) => (keyRefs.current[key] = ref)}>
              <span onClick={() => handleKeyClick(key)}>
                {typeof data[key] === "object" && data[key] !== null
                  ? collapsedSections[key]
                    ? "[+]"
                    : "[-]"
                  : ""}{" "}
                {key}
              </span>
              {renderField(key, data[key])}
            </div>
          )
      )}
    </div>
  );
};

export default JsonView;
