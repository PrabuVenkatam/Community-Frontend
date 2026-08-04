import React, { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formVariants } from "../utils/profileFormConfigs";
import {
  createCollege,
  createCompany,
  createCompetition,
  createConference,
  createEvent,
  createFreelance,
  createInternship,
  createSeminar,
} from "../services/admin/adminServices";




const normalizeKey = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "_");

const getStaticFieldKey = (sectionIndex, fieldIndex, label) =>
  `s_${sectionIndex}_${fieldIndex}_${normalizeKey(label)}`;

const getDynamicFieldKey = (fieldIndex, label) =>
  `d_${fieldIndex}_${normalizeKey(label)}`;

const getInitialFieldValue = (field) => {
  if (field.type === "checkbox") return [];
  if (field.type === "toggle") {
    if (Array.isArray(field.options) && field.options.length === 2) {
      return field.options[1];
    }
    return "No";
  }
  if (field.type === "radio" || field.type === "select") {
    if (Array.isArray(field.options) && field.options.length > 0) {
      return field.options[0];
    }
  }
  return "";
};

const createEmptyDynamicRow = (section) => {
  const row = { id: `${Date.now()}-${Math.random()}` };
  section.fields.forEach((field, fieldIndex) => {
    row[getDynamicFieldKey(fieldIndex, field.label)] = getInitialFieldValue(field);
  });
  return row;
};

const createInitialDynamicData = (config) =>
  config.reduce((acc, section) => {
    if (section.type !== "dynamic") return acc;
    const rowCount = section.initialRows || 1;
    acc[section.key] = Array.from({ length: rowCount }, () => createEmptyDynamicRow(section));
    return acc;
  }, {});

const createInitialStaticData = (config) =>
  config.reduce((acc, section, sectionIndex) => {
    if (section.type !== "static") return acc;
    section.fields.forEach((field, fieldIndex) => {
      const key = getStaticFieldKey(sectionIndex, fieldIndex, field.label);
      acc[key] = getInitialFieldValue(field);
    });
    return acc;
  }, {});

const isMeaningfulValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return value !== null && value !== undefined && value !== "";
};

const toSerializableValue = (value) => {
  if (value instanceof File) return value.name;
  return value;
};

const submitHandlers = {
  company: createCompany,
  conference: createConference,
  competition: createCompetition,
  college: createCollege,
  event: createEvent,
  seminar: createSeminar,
  internship: createInternship,
  freelance: createFreelance,
};

const Label = ({ text, required = true }) => (
  <label className="block font-source font-semibold text-sm md:text-base leading-none tracking-normal text-primary mb-2">
    {text} {required && <span className="text-red-500">*</span>}
  </label>
);

const FormInput = ({ field, value, onChange, inputName }) => {
  if (field.type === "checkbox") {
    const selectedValues = Array.isArray(value) ? value : [];
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-2 items-center min-h-10">
        {field.options.map((opt) => (
          <label key={opt} className="group flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                name={`${inputName}-${opt}`}
                checked={selectedValues.includes(opt)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selectedValues, opt]);
                  } else {
                    onChange(selectedValues.filter((item) => item !== opt));
                  }
                }}
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[6px] checked:bg-[#171717] checked:border-blue-600 transition-all"
              />
              <svg
                className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span>{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "toggle") {
    const options = Array.isArray(field.options) && field.options.length === 2 ? field.options : ["Yes", "No"];
    const isFirstOptionActive = value === options[0];

    return (
      <button
        type="button"
        role="switch"
        aria-checked={isFirstOptionActive}
        onClick={() => onChange(isFirstOptionActive ? options[1] : options[0])}
        className={`relative inline-flex h-10 min-w-[110px] items-center rounded-full px-1 transition-colors ${isFirstOptionActive ? "bg-[#171717]" : "bg-gray-300"
          }`}
      >
        <span
          className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow-sm transition-transform ${isFirstOptionActive ? "translate-x-0" : "translate-x-[70px]"
            }`}
        />
        <span className="relative z-10 flex w-full justify-between px-3 text-xs font-semibold text-white">
          <span>{options[0]}</span>
          <span>{options[1]}</span>
        </span>
      </button>
    );
  }

  if (field.type === "radio") {
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-2 items-center min-h-10">
        {field.options.map((opt) => (
          <label key={opt} className="group flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                name={inputName}
                value={opt}
                checked={value === opt}
                onChange={(e) => onChange(e.target.value)}
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[6px] checked:bg-[#171717] checked:border-blue-600 transition-all"
              />
              <svg
                className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span>{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 border border-gray-200 rounded bg-[#fcfcfc] text-sm h-10 outline-none"
      >
        <option value="">Select Option</option>
        {field.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "file") {
    return (
      <div className="flex border border-gray-200 rounded overflow-hidden h-10 w-full font-source transition focus-within:border-blue-400">
        <label className="bg-[#171717] text-xs md:text-sm text-white px-3 md:px-5 py-2.5 font-medium cursor-pointer whitespace-nowrap hover:bg-[#171717] transition">
          Choose File
          <input
            type="file"
            className="hidden"
            onChange={(e) => onChange(e.target.files?.[0] || null)}
          />
        </label>
        <span className="flex-1 min-w-0 bg-[#fcfcfc] px-3 md:px-4 py-2.5 text-gray-400 text-xs truncate">
          {value?.name || "No File Chosen"}
        </span>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded bg-[#fcfcfc] focus:ring-1 focus:ring-blue-400 outline-none text-sm resize-none"
      />
    );
  }

  return (
    <input
      type={field.type}
      value={value}
      onChange={(e) => {
        let nextValue = e.target.value;
        if (field.type === "tel") {
          nextValue = nextValue.replace(/\D/g, "").slice(0, 10);
        }
        onChange(nextValue);
      }}
      inputMode={field.type === "tel" ? "numeric" : undefined}
      maxLength={field.type === "tel" ? 10 : undefined}
      className="w-full p-2 border border-gray-200 rounded bg-[#fcfcfc] focus:ring-1 focus:ring-blue-400 outline-none text-sm h-10"
    />
  );
};



const ProfileForm = ({ formVariant: formVariantProp }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const formTypeFromRoute = location.state?.formType;
  const formTypeFromProp =
    typeof formVariantProp === "string" ? formVariantProp : undefined;
  const formType = formTypeFromRoute || formTypeFromProp || "event";
  const selectedVariant = formVariants[formType] || formVariants.event;

  const formConfig = useMemo(() => selectedVariant?.formConfig || [], [selectedVariant, formType]);

  const sectionMap = useMemo(
    () =>
      formConfig.reduce((acc, section) => {
        if (section.type === "dynamic" && section.key) {
          acc[section.key] = section;
        }
        return acc;
      }, {}),
    [formConfig]
  );

  const [staticData, setStaticData] = useState(() => createInitialStaticData(formConfig));
  const [dynamicData, setDynamicData] = useState(() => createInitialDynamicData(formConfig));
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setStaticData(createInitialStaticData(formConfig));
    setDynamicData(createInitialDynamicData(formConfig));
    setDescription("");
  }, [formType]);

  const addRow = (sectionKey) => {
    const section = sectionMap[sectionKey];
    if (!section) return;
    setDynamicData((prev) => ({
      ...prev,
      [sectionKey]: [...(prev[sectionKey] || []), createEmptyDynamicRow(section)],
    }));
  };

  const removeRow = (sectionKey, id) => {
    setDynamicData((prev) => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).filter((item) => item.id !== id),
    }));
  };

  const updateStaticField = (fieldKey, value) => {
    setStaticData((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const updateDynamicField = (sectionKey, rowId, fieldKey, value) => {
    setDynamicData((prev) => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).map((row) =>
        row.id === rowId ? { ...row, [fieldKey]: value } : row
      ),
    }));
  };

  const buildPayload = () => {
    const payload = {
      formType,
      title: selectedVariant?.title || formType,
      static: {},
      dynamic: {},
      description: description?.trim() || "",
    };

    formConfig.forEach((section, sectionIndex) => {
      if (section.type === "static") {
        const sectionKey = normalizeKey(section.title) || `section_${sectionIndex}`;
        const sectionData = {};

        section.fields.forEach((field, fieldIndex) => {
          const stateKey = getStaticFieldKey(sectionIndex, fieldIndex, field.label);
          const rawValue = staticData[stateKey];
          if (!isMeaningfulValue(rawValue)) return;

          const labelKey = normalizeKey(field.label) || `field_${fieldIndex}`;
          sectionData[labelKey] = toSerializableValue(rawValue);
        });

        if (Object.keys(sectionData).length > 0) {
          payload.static[sectionKey] = sectionData;
        }
      }

      if (section.type === "dynamic") {
        const rows = dynamicData[section.key] || [];
        const cleanedRows = rows
          .map((row) => {
            const rowData = {};
            section.fields.forEach((field, fieldIndex) => {
              const rowFieldKey = getDynamicFieldKey(fieldIndex, field.label);
              const rawValue = row[rowFieldKey];
              if (!isMeaningfulValue(rawValue)) return;
              rowData[normalizeKey(field.label) || `field_${fieldIndex}`] =
                toSerializableValue(rawValue);
            });
            return rowData;
          })
          .filter((row) => Object.keys(row).length > 0);

        if (cleanedRows.length > 0) {
          payload.dynamic[section.key] = cleanedRows;
        }
      }
    });

    return payload;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    const submitFn = submitHandlers[formType];
    if (!submitFn) {
      toast.error(`No submit handler configured for form type: ${formType}`);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = buildPayload();
      await submitFn(payload);
      toast.success(`${selectedVariant?.title || formType} saved successfully`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto bg-gray-50 ">
      <form onSubmit={handleSubmit} className="max-w-[1400px] mx-auto space-y-5 bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-200">
        {formConfig.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-6 border-b pb-6">
            <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
              <h2 className="font-source font-semibold text-lg md:text-xl leading-none tracking-normal text-[#000000]">
                {section.title}
              </h2>
              {section.type === "dynamic" && !["grid-6", "row-action"].includes(section.dynamicStyle) && (
                <button
                  type="button"
                  onClick={() => addRow(section.key)}
                  className="bg-[#171717] text-white px-5 py-1.5 rounded-md text-sm font-bold flex items-center gap-2"
                >
                  Add
                </button>
              )}
            </div>

            {section.type === "static" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                {section.fields.map((field, fieldIndex) => {
                  const stateKey = getStaticFieldKey(sectionIndex, fieldIndex, field.label);
                  return (
                    <div key={fieldIndex} className={`${field.span === 2 ? "md:col-span-2" : ""} min-w-0`}>
                      <Label text={field.label} required={field.required !== false} />
                      <FormInput
                        field={field}
                        value={staticData[stateKey]}
                        onChange={(value) => updateStaticField(stateKey, value)}
                        inputName={stateKey}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {section.type === "dynamic" && (
              <div className="space-y-4">
                {section.dynamicStyle === "row-action" ? (
                  (dynamicData[section.key] || []).map((rowData, rowIndex) => (
                    <div
                      key={rowData.id}
                      className={`grid grid-cols-1 ${section.fields.length >= 4
                        ? "md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]"
                        : "md:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]"
                        } gap-4 items-end`}
                    >
                      {section.fields.map((field, fieldIndex) => {
                        const rowFieldKey = getDynamicFieldKey(fieldIndex, field.label);
                        return (
                          <div key={fieldIndex}>
                            <Label text={field.label} required={field.required !== false} />
                            <FormInput
                              field={field}
                              value={rowData[rowFieldKey]}
                              onChange={(value) =>
                                updateDynamicField(section.key, rowData.id, rowFieldKey, value)
                              }
                              inputName={`${section.key}_${rowData.id}_${rowFieldKey}`}
                            />
                          </div>
                        );
                      })}
                      <div className="flex items-end justify-start lg:justify-center">
                        {rowIndex === 0 ? (
                          <button
                            type="button"
                            onClick={() => addRow(section.key)}
                            className="h-10 bg-[#171717] text-white px-5 rounded-md text-sm font-bold w-full md:w-auto"
                          >
                            Add
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeRow(section.key, rowData.id)}
                            className="h-10 w-10 inline-flex items-center justify-center text-red-500 hover:scale-110 transition"
                          >
                            <Trash2 />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : section.dynamicStyle === "grid-6" ? (
                  <>
                    {Array.from(
                      { length: Math.ceil((dynamicData[section.key] || []).length / 3) },
                      (_, chunkIndex) =>
                        (dynamicData[section.key] || []).slice(chunkIndex * 3, chunkIndex * 3 + 3)
                    ).map((chunk, chunkIndex) => (
                      <div
                        key={`${section.key}-chunk-${chunkIndex}`}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] gap-4 items-end"
                      >
                        {chunk.map((rowData, indexInChunk) => {
                          const itemIndex = chunkIndex * 3 + indexInChunk + 1;
                          const baseField = section.fields[0];
                          const rowFieldKey = getDynamicFieldKey(0, baseField.label);
                          const numberedField = {
                            ...baseField,
                            label: `${section.title} (${itemIndex})`,
                            required: itemIndex <= 3,
                          };

                          return (
                            <div key={rowData.id}>
                              <Label
                                text={numberedField.label}
                                required={numberedField.required !== false}
                              />
                              <FormInput
                                field={baseField}
                                value={rowData[rowFieldKey]}
                                onChange={(value) =>
                                  updateDynamicField(section.key, rowData.id, rowFieldKey, value)
                                }
                                inputName={`${section.key}_${rowData.id}_${rowFieldKey}`}
                              />
                            </div>
                          );
                        })}

                        <div className="flex items-end justify-start lg:justify-center">
                          {chunkIndex === 0 ? (
                            <button
                              type="button"
                              onClick={() => addRow(section.key)}
                              className="h-10 bg-[#171717] text-white px-5 rounded-md text-sm font-bold w-full md:w-auto"
                            >
                              Add
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const rows = dynamicData[section.key] || [];
                                const lastRow = rows[rows.length - 1];
                                if (lastRow) removeRow(section.key, lastRow.id);
                              }}
                              className="h-10 w-10 inline-flex items-center justify-center text-red-500 hover:scale-110 transition"
                            >
                              <Trash2 />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  (dynamicData[section.key] || []).map((rowData, rowIndex) => (
                    <div key={rowData.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      {section.fields.map((field, fieldIndex) => {
                        const rowFieldKey = getDynamicFieldKey(fieldIndex, field.label);
                        return (
                          <div key={fieldIndex} className={field.colSpan}>
                            <Label text={field.label} required={field.required !== false} />
                            <FormInput
                              field={field}
                              value={rowData[rowFieldKey]}
                              onChange={(value) =>
                                updateDynamicField(section.key, rowData.id, rowFieldKey, value)
                              }
                              inputName={`${section.key}_${rowData.id}_${rowFieldKey}`}
                            />
                          </div>
                        );
                      })}
                      <div className="md:col-span-1 flex justify-center pb-2">
                        {rowIndex > 0 && (
                          <Trash2
                            className="text-red-500 cursor-pointer hover:scale-110 transition"
                            onClick={() => removeRow(section.key, rowData.id)}
                          />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}

        {selectedVariant.descriptionLabel && (
          <div className="space-y-4">
            <h2 className="font-source font-semibold text-[20px] leading-none tracking-normal text-[#000000]">
              {selectedVariant.descriptionLabel}
            </h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 p-3 border border-gray-200 rounded bg-[#fcfcfc] outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Enter details..."
            />
          </div>
        )}

        <div className="flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full md:w-auto px-6 md:px-10 py-2 border border-gray-300 rounded text-gray-500 font-bold hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-6 md:px-10 py-2 bg-[#171717] text-white rounded font-bold shadow-md hover:bg-[#171717] disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
