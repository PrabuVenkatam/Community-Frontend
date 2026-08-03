// import React, { useState, useEffect } from "react";
// import { Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import setFileName from "../utils/setFileName";


// const toCleanString = (value) => String(value || "").trim();

// const getInitialFieldValue = (field) => {
//   if (field.type === "checkbox" || field.type === "multiselect") return [];
//   if (field.type === "toggle") {
//     return Array.isArray(field.options) && field.options.length === 2
//       ? field.options[1]
//       : "No";
//   }
//   return "";
// };

// const hasMeaningfulValue = (value) => {
//   if (Array.isArray(value)) return value.length > 0;
//   return toCleanString(value).length > 0;
// };

// const safeParseArray = (val) => {
//   if (!val) return [];
//   if (Array.isArray(val)) return val;
//   if (typeof val === "string") {
//     try {
//       const parsed = JSON.parse(val);
//       if (typeof parsed === "string") return JSON.parse(parsed);
//       return parsed;
//     } catch { return []; }
//   }
//   return [];
// };

// const createInitialStaticData = (config, overrides = {}) => {
//   const data = {};
//   config.filter((s) => s.type === "static").forEach((section) => {
//     section.fields.forEach((field) => {
//       data[field.name] = getInitialFieldValue(field);
//     });
//   });
//   return { ...data, ...overrides };
// };

// const createEmptyDynamicRow = (section) => {
//   const values = {};
//   section.fields.forEach((field) => {
//     values[field.name] = getInitialFieldValue(field);
//   });
//   return { id: `${Date.now()}-${Math.random()}`, values };
// };

// const createInitialDynamicData = (config) => {
//   const data = {};
//   config.filter((s) => s.type === "dynamic").forEach((section) => {
//     const rowCount = section.initialRows || 1;
//     data[section.key] = Array.from({ length: rowCount }, () =>
//       createEmptyDynamicRow(section)
//     );
//   });
//   return data;
// };

// const extractDynamicList = (rows = [], fieldName) =>
//   rows.map((row) => toCleanString(row?.values?.[fieldName])).filter(Boolean);

// // ─── Label ──────────────────────────────────────────────────
// const Label = ({ text, required = true }) => (
//   <label className="block font-source font-semibold text-sm md:text-base leading-none tracking-normal text-primary mb-2">
//     {text} {required && <span className="text-red-500">*</span>}
//   </label>
// );

// // ─── FormInput ──────────────────────────────────────────────
// const FormInput = ({ field, value, onChange, inputName }) => {
//   if (field.type === "checkbox") {
//     const selectedValues = Array.isArray(value) ? value : [];
//     return (
//       <div className="flex flex-wrap gap-x-6 gap-y-2 items-center min-h-10">
//         {field.options.map((opt) => (
//           <label key={opt} className="group flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
//             <div className="relative flex items-center justify-center">
//               <input
//                 type="checkbox"
//                 name={`${inputName}-${opt}`}
//                 checked={selectedValues.includes(opt)}
//                 onChange={(e) =>
//                   onChange(
//                     e.target.checked
//                       ? [...selectedValues, opt]
//                       : selectedValues.filter((i) => i !== opt)
//                   )
//                 }
//                 className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[6px] checked:171717 checked:border-blue-600 transition-all"
//               />
//               <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
//                 <polyline points="20 6 9 17 4 12" />
//               </svg>
//             </div>
//             <span>{opt}</span>
//           </label>
//         ))}
//       </div>
//     );
//   }

//   if (field.type === "multiselect") {
//     const selectedValues = Array.isArray(value) ? value : [];
//     const [open, setOpen] = React.useState(false);
//     const ref = React.useRef(null);

//     React.useEffect(() => {
//       const handleClickOutside = (e) => {
//         if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//       };
//       document.addEventListener("mousedown", handleClickOutside);
//       return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const toggleValue = (opt) =>
//       onChange(
//         selectedValues.includes(opt)
//           ? selectedValues.filter((i) => i !== opt)
//           : [...selectedValues, opt]
//       );

//     return (
//       <div className="relative w-full" ref={ref}>
//         <div
//           onClick={() => setOpen(!open)}
//           className="w-full min-h-10 p-2 border border-gray-200 rounded bg-[#fcfcfc] flex flex-wrap gap-2 cursor-pointer"
//         >
//           {selectedValues.length === 0 ? (
//             <span className="text-gray-400 text-sm">Select options</span>
//           ) : (
//             selectedValues.map((val) => (
//               <span key={val} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
//                 {val}
//                 <span
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onChange(selectedValues.filter((i) => i !== val));
//                   }}
//                   className="cursor-pointer hover:text-red-500 font-bold leading-none"
//                 >
//                   ×
//                 </span>
//               </span>
//             ))
//           )}
//         </div>
//         {open && (
//           <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto">
//             {field.options.map((opt) => (
//               <label key={opt} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm">
//                 <input type="checkbox" checked={selectedValues.includes(opt)} onChange={() => toggleValue(opt)} />
//                 <span>{opt}</span>
//               </label>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }

//   if (field.type === "toggle") {
//     const options = Array.isArray(field.options) && field.options.length === 2 ? field.options : ["Yes", "No"];
//     const isFirstOptionActive = value === options[0];
//     return (
//       <button
//         type="button"
//         role="switch"
//         aria-checked={isFirstOptionActive}
//         onClick={() => onChange(isFirstOptionActive ? options[1] : options[0])}
//         className={`relative inline-flex h-10 min-w-[110px] items-center rounded-full px-1 transition-colors ${isFirstOptionActive ? "171717" : "bg-gray-300"}`}
//       >
//         <span className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow-sm transition-transform ${isFirstOptionActive ? "translate-x-0" : "translate-x-[70px]"}`} />
//         <span className="relative z-10 flex w-full justify-between px-3 text-xs font-semibold text-white">
//           <span>{options[0]}</span>
//           <span>{options[1]}</span>
//         </span>
//       </button>
//     );
//   }

//   if (field.type === "radio") {
//     return (
//       <div className="flex flex-wrap gap-x-6 gap-y-2 items-center min-h-10">
//         {field.options.map((opt) => (
//           <label key={opt} className="group flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
//             <div className="relative flex items-center justify-center">
//               <input
//                 type="radio"
//                 name={inputName}
//                 value={opt}
//                 checked={value === opt}
//                 onChange={(e) => onChange(e.target.value)}
//                 className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[6px] checked:171717 checked:border-blue-600 transition-all"
//               />
//               <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
//                 <polyline points="20 6 9 17 4 12" />
//               </svg>
//             </div>
//             <span>{opt}</span>
//           </label>
//         ))}
//       </div>
//     );
//   }

//   if (field.type === "select") {
//     return (
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full p-2.5 border border-gray-200 rounded bg-[#fcfcfc] text-sm h-10 outline-none"
//       >
//         <option value="">Select Option</option>
//         {field.options.map((option) => (
//           <option key={option} value={option}>{option}</option>
//         ))}
//       </select>
//     );
//   }

//   if (field.type === "file") {
//     const isExisting = typeof value === "string" && value !== "";
//     const isNew = value instanceof File;
//     const isImage = field.name === "coverImage" || field.name === "collegeLogo" || field.name === "companyLogo";

//     return (
//       <div className="space-y-2">

//         <div className="flex relative border border-gray-200 rounded overflow-hidden h-10 w-full font-source transition focus-within:border-blue-400">
//           <label className="bg-[#171717] text-xs md:text-sm text-white px-3 md:px-5 py-2.5 font-medium cursor-pointer whitespace-nowrap hover:171717 transition">
//             Choose File
//             <input
//               type="file"
//               className="hidden"
//               onChange={(e) => onChange(e.target.files?.[0] || null)}
//               accept={isImage ? "image/*" : undefined}
//             />
//           </label>
//           <span className="flex-1 min-w-0 bg-[#fcfcfc] px-3 md:px-4 py-2.5 text-gray-400 text-xs truncate">
//             {isNew ? value.name : isExisting ? value.split("/").pop() : "No File Chosen"}
//           </span>

//         {(isExisting || isNew) && (
//   <div className="w-8 absolute right-0 top-1  h-8 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shadow-sm">
//     <img
//       src={isNew ? URL.createObjectURL(value) : setFileName(value)}
//       alt="Preview"
//       className="w-full h-full object-cover"
//     />
//   </div>
// )}
//         </div>
//       </div>
//     );
//   }

//   if (field.type === "textarea") {
//     return (
//       <textarea
//         rows={4}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full p-3 border border-gray-200 rounded bg-[#fcfcfc] focus:ring-1 focus:ring-blue-400 outline-none text-sm resize-none"
//       />
//     );
//   }

//   return (
//     <input
//       type={field.type}
//       value={value}
//       readOnly={field.readOnly}
//       onChange={(e) => {
//         if (field.readOnly) return;
//         let nextValue = e.target.value;
//         if (field.type === "tel") nextValue = nextValue.replace(/\D/g, "").slice(0, 10);
//         onChange(nextValue);
//       }}
//       inputMode={field.type === "tel" ? "numeric" : undefined}
//       maxLength={field.type === "tel" ? 10 : undefined}
//       className="w-full p-2 border border-gray-200 rounded bg-[#fcfcfc] focus:ring-1 focus:ring-blue-400 outline-none text-sm h-10"
//     />
//   );
// };

// // ─── FormLayout ─────────────────────────────────────────────
// const FormLayout = ({
//   config,           // form config array
//   editData,         // existing data for edit mode (optional)
//   onSubmit,         // async fn(formData, payload, staticData) => void
//   staticOverrides,  // extra initial static values e.g. { companyName: "Acme" }
//   submitLabel,      // override "Save" button text
//   dateFields,       // array of field names to format as YYYY-MM-DD e.g. ["eventDate"]
// }) => {
//   const navigate = useNavigate();

// const [staticData, setStaticData] = useState(() => {
//   if (editData) {
//     const data = {};
//     config.filter((s) => s.type === "static").forEach((section) => {
//       section.fields.forEach((field) => {
//         if (field.type === "file") {
//           data[field.name] = editData[field.name] ?? "";
//         } else if (field.type === "multiselect") {
//           data[field.name] = safeParseArray(editData[field.name]);
//         } else if (field.type === "date") {
//           // ✅ Auto-format any date field — no need for dateFields prop
//           const val = editData[field.name];
//           if (val) {
//             try { data[field.name] = new Date(val).toISOString().split("T")[0]; }
//             catch { data[field.name] = ""; }
//           } else {
//             data[field.name] = "";
//           }
//         } else {
//           const val = editData[field.name];
//           data[field.name] = val !== undefined && val !== null
//             ? val
//             : getInitialFieldValue(field);
//         }
//       });
//     });
//     if (editData._id || editData.id) data.id = editData._id || editData.id;
//     return data;
//   }
//   return createInitialStaticData(config, staticOverrides);
// });

//   const [dynamicData, setDynamicData] = useState(() => {
//     if (editData) {
//       const data = {};
//       config.filter((s) => s.type === "dynamic").forEach((section) => {
//         const list = editData[section.payloadKey || section.key];
//         if (Array.isArray(list) && list.length > 0) {
//           data[section.key] = list.map((item) => ({
//             id: item._id || `${Date.now()}-${Math.random()}`,
//             // single-field sections store primitives, multi-field store objects
//             values: typeof item === "object" && !Array.isArray(item)
//               ? { ...item }
//               : { [section.fields[0].name]: item },
//           }));
//         } else {
//           data[section.key] = Array.from(
//             { length: section.initialRows || 1 },
//             () => createEmptyDynamicRow(section)
//           );
//         }
//       });
//       return data;
//     }
//     return createInitialDynamicData(config);
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // keep staticOverrides in sync (e.g. organizerName loads async)
//   useEffect(() => {
//     if (!editData && staticOverrides) {
//       setStaticData((prev) => ({ ...prev, ...staticOverrides }));
//     }
//   }, [JSON.stringify(staticOverrides)]);

//   const sectionMap = config.reduce((acc, section) => {
//     if (section.type === "dynamic" && section.key) acc[section.key] = section;
//     return acc;
//   }, {});

//   const addRow = (sectionKey) => {
//     const section = sectionMap[sectionKey];
//     if (!section) return;
//     setDynamicData((prev) => ({
//       ...prev,
//       [sectionKey]: [...(prev[sectionKey] || []), createEmptyDynamicRow(section)],
//     }));
//   };

//   const removeRow = (sectionKey, rowId) => {
//     setDynamicData((prev) => ({
//       ...prev,
//       [sectionKey]: (prev[sectionKey] || []).filter((row) => row.id !== rowId),
//     }));
//   };

//   const updateStaticField = (fieldName, value) =>
//     setStaticData((prev) => ({ ...prev, [fieldName]: value }));

//   const updateDynamicField = (sectionKey, rowId, fieldName, value) =>
//     setDynamicData((prev) => ({
//       ...prev,
//       [sectionKey]: (prev[sectionKey] || []).map((row) =>
//         row.id === rowId ? { ...row, values: { ...row.values, [fieldName]: value } } : row
//       ),
//     }));

//   const buildPayload = () => {
//     const payload = {};
//     if (staticData.id) payload.id = staticData.id;

//     config.forEach((section) => {
//       if (section.type === "static") {
//         section.fields.forEach((field) => {
//           const payloadKey = field.payloadKey || field.name;
//           const rawValue = staticData[field.name];
//           if (field.type === "file") {
//             payload[payloadKey] = rawValue;
//           } else if (field.type === "multiselect" || Array.isArray(rawValue)) {
//             payload[payloadKey] = Array.isArray(rawValue) ? rawValue : [];
//           } else {
//             payload[payloadKey] = toCleanString(rawValue);
//           }
//         });
//       }

//       if (section.type === "dynamic") {
//         const rows = dynamicData[section.key] || [];
//         if (section.fields.length === 1) {
//           const field = section.fields[0];
//           const payloadKey = section.payloadKey || field.payloadKey || field.name;
//           payload[payloadKey] = extractDynamicList(rows, field.name);
//           return;
//         }
//         const payloadKey = section.payloadKey || section.key;
//         payload[payloadKey] = rows
//           .map((row) => {
//             const rowPayload = {};
//             section.fields.forEach((field) => {
//               const rowKey = field.payloadKey || field.name;
//               const rawValue = row?.values?.[field.name];
//               if (field.type === "file") rowPayload[rowKey] = rawValue;
//               else if (field.type === "multiselect" || Array.isArray(rawValue))
//                 rowPayload[rowKey] = Array.isArray(rawValue) ? rawValue : [];
//               else rowPayload[rowKey] = toCleanString(rawValue);
//             });
//             return rowPayload;
//           })
//           .filter((rowPayload) => Object.values(rowPayload).some(hasMeaningfulValue));
//       }
//     });

//     return payload;
//   };

//   const buildFormData = (payload) => {
//     const formData = new FormData();
//     Object.entries(payload).forEach(([key, value]) => {
//       if (value == null) return;
//       if (value instanceof File) { formData.append(key, value); return; }
//       if (Array.isArray(value)) { formData.append(key, JSON.stringify(value)); return; }
//       formData.append(key, String(value));
//     });
//     return formData;
//   };

//   const validateForm = () => {
//     const isEdit = !!staticData.id;
//     for (const section of config) {
//       // showWhen support
//       if (section.showWhen && staticData[section.showWhen.field] !== section.showWhen.value) continue;

//       if (section.type === "static") {
// for (const field of section.fields) {
//  if (field.showWhen) {
//   const { field: watchField, value } = field.showWhen;
//   const currentValue = staticData[watchField];
//   const isHidden = Array.isArray(value)
//     ? !value.includes(currentValue)
//     : currentValue !== value;
//   if (isHidden) continue;
// }  
//   if (field.required === false) continue;
//           const value = staticData[field.name];
//           if (field.type === "file" && isEdit && typeof value === "string" && value.trim() !== "") continue;
//           if (!hasMeaningfulValue(value)) {
//             toast.error(`${field.label} is required`);
//             return false;
//           }
//         }
//       }

//       if (section.type === "dynamic") {
//         const rows = dynamicData[section.key] || [];
//         for (let i = 0; i < rows.length; i++) {
//           const row = rows[i];
//           for (const field of section.fields) {
//             if (field.required === false) continue;
//             const value = row.values[field.name];
//             if (!hasMeaningfulValue(value)) {
//               toast.error(`${section.title} (Row ${i + 1}): ${field.label} is required`);
//               return false;
//             }
//             if (hasMeaningfulValue(value)) {
//               if (field.type === "tel" && value.length !== 10) {
//                 toast.error(`${section.title} (Row ${i + 1}): ${field.label} must be exactly 10 digits`);
//                 return false;
//               }
//               if (field.name === "mailId" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//                 toast.error(`${section.title} (Row ${i + 1}): Please enter a valid Email Id`);
//                 return false;
//               }
//             }
//           }
//         }
//       }
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     try {
//       setIsSubmitting(true);
//       const payload = buildPayload();
//       const formData = buildFormData(payload);
//       await onSubmit(formData, payload, staticData);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Failed to save");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="mx-auto bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="max-w-[1400px] mx-auto space-y-5 bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-200"
//       >
//         {config
//           .filter((section) =>
//             !section.showWhen || staticData[section.showWhen.field] === section.showWhen.value
//           )
//           .map((section, sectionIndex) => (
//             <div key={sectionIndex} className="space-y-6 border-b pb-6 last:border-b-0">
//               <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
//                 <h2 className="font-source font-semibold text-lg md:text-xl leading-none tracking-normal text-[#000000]">
//                   {section.title}
//                 </h2>
//                 {section.type === "dynamic" && !["grid-6", "row-action"].includes(section.dynamicStyle) && (
//                   <button type="button" onClick={() => addRow(section.key)} className="bg-[#171717] text-white px-5 py-1.5 rounded-md text-sm font-bold flex items-center gap-2">
//                     Add
//                   </button>
//                 )}
//               </div>

//               {/* STATIC */}
// {section.type === "static" && (
//   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
//     {section.fields
//       .filter((field) => {
//   if (!field.showWhen) return true;
//   const { field: watchField, value } = field.showWhen;
//   const currentValue = staticData[watchField];
//   // support both single value and array of values
//   return Array.isArray(value)
//     ? value.includes(currentValue)
//     : currentValue === value;
// })
//       .map((field, fieldIndex) => (
//                     <div key={fieldIndex} className={`${field.span === 2 ? "md:col-span-2" : ""} min-w-0`}>
//                       <Label text={field.label} required={field.required !== false} />
//                       <FormInput
//                         field={field}
//                         value={staticData[field.name]}
//                         onChange={(value) => updateStaticField(field.name, value)}
//                         inputName={field.name}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* DYNAMIC: grid-6 */}
//               {section.type === "dynamic" && section.dynamicStyle === "grid-6" && (
//                 <div className="space-y-4">
//                   {Array.from(
//                     { length: Math.ceil((dynamicData[section.key] || []).length / 3) },
//                     (_, chunkIndex) => (dynamicData[section.key] || []).slice(chunkIndex * 3, chunkIndex * 3 + 3)
//                   ).map((chunk, chunkIndex) => (
//                     <div key={`${section.key}-chunk-${chunkIndex}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] gap-4 items-end">
//                       {chunk.map((rowData, indexInChunk) => {
//                         const itemIndex = chunkIndex * 3 + indexInChunk + 1;
//                         const baseField = section.fields[0];
//                         return (
//                           <div key={rowData.id}>
//                             <Label text={`${section.title} (${itemIndex})`} required={itemIndex <= 3} />
//                             <FormInput
//                               field={baseField}
//                               value={rowData.values[baseField.name]}
//                               onChange={(value) => updateDynamicField(section.key, rowData.id, baseField.name, value)}
//                               inputName={`${section.key}_${rowData.id}_${baseField.name}`}
//                             />
//                           </div>
//                         );
//                       })}
//                       <div className="flex items-end justify-start lg:justify-center">
//                         {chunkIndex === 0 ? (
//                           <button type="button" onClick={() => addRow(section.key)} className="h-10 bg-[#171717] text-white px-5 rounded-md text-sm font-bold w-full md:w-auto">Add</button>
//                         ) : (
//                           <button type="button" onClick={() => { const rows = dynamicData[section.key] || []; const lastRow = rows[rows.length - 1]; if (lastRow) removeRow(section.key, lastRow.id); }} className="h-10 w-10 inline-flex items-center justify-center text-red-500 hover:scale-110 transition">
//                             <Trash2 />
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* DYNAMIC: row-action */}
//               {section.type === "dynamic" && section.dynamicStyle === "row-action" && (
//                 <div className="space-y-4">
//                   {(dynamicData[section.key] || []).map((rowData, rowIndex) => (
//                     <div key={rowData.id} className={`grid grid-cols-1 ${section.fields.length >= 4 ? "md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]" : "md:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]"} gap-4 items-end`}>
//                       {section.fields.map((field, fieldIndex) => (
//                         <div key={fieldIndex}>
//                           <Label text={field.label} required={field.required !== false} />
//                           <FormInput
//                             field={field}
//                             value={rowData.values[field.name]}
//                             onChange={(value) => updateDynamicField(section.key, rowData.id, field.name, value)}
//                             inputName={`${section.key}_${rowData.id}_${field.name}`}
//                           />
//                         </div>
//                       ))}
//                       <div className="flex items-end justify-start lg:justify-center">
//                         {rowIndex === 0 ? (
//                           <button type="button" onClick={() => addRow(section.key)} className="h-10 bg-[#171717] text-white px-5 rounded-md text-sm font-bold w-full md:w-auto">Add</button>
//                         ) : (
//                           <button type="button" onClick={() => removeRow(section.key, rowData.id)} className="h-10 w-10 inline-flex items-center justify-center text-red-500 hover:scale-110 transition">
//                             <Trash2 />
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* DYNAMIC: default (col-span) */}
//               {section.type === "dynamic" && !section.dynamicStyle && (
//                 <div className="space-y-4">
//                   {(dynamicData[section.key] || []).map((rowData, rowIndex) => (
//                     <div key={rowData.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
//                       {section.fields.map((field, fieldIndex) => (
//                         <div key={fieldIndex} className={field.colSpan}>
//                           <Label text={field.label} required={field.required !== false} />
//                           <FormInput
//                             field={field}
//                             value={rowData.values[field.name]}
//                             onChange={(value) => updateDynamicField(section.key, rowData.id, field.name, value)}
//                             inputName={`${section.key}_${rowData.id}_${field.name}`}
//                           />
//                         </div>
//                       ))}
//                       <div className="md:col-span-1 flex justify-center pb-2">
//                         {rowIndex > 0 && (
//                           <Trash2 className="text-red-500 cursor-pointer hover:scale-110 transition" onClick={() => removeRow(section.key, rowData.id)} />
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}

//         <div className="flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
//           <button type="button" onClick={() => navigate(-1)} className="w-full md:w-auto px-6 md:px-10 py-2 border border-gray-300 rounded text-gray-500 font-bold hover:bg-gray-50">
//             Cancel
//           </button>
//           <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-6 md:px-10 py-2 bg-[#171717] text-white rounded font-bold shadow-md hover:171717 disabled:opacity-70">
//             {isSubmitting ? "Saving..." : submitLabel || (editData ? "Update" : "Save")}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default FormLayout;


// // import React, { useState, useEffect } from "react";
// // import { Trash2 } from "lucide-react";
// // import { useNavigate } from "react-router-dom";
// // import { toast } from "react-toastify";
// // import setFileName from "../utils/setFileName";

// // // ─── Custom Icons ────────────────────────────────────────────
// // // 🔁 Replace these SVGs with your own later

// // const ChevronIcon = () => (
// //   // TODO: Replace with your custom SVG
// //   <svg
// //     xmlns="http://www.w3.org/2000/svg"
// //     className="w-4 h-4 text-gray-400 pointer-events-none"
// //     viewBox="0 0 20 20"
// //     fill="currentColor"
// //   >
// //     <path
// //       fillRule="evenodd"
// //       d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
// //       clipRule="evenodd"
// //     />
// //   </svg>
// // );

// // const CalendarIcon = () => (
// //   // TODO: Replace with your custom SVG
// //   <svg
// //     xmlns="http://www.w3.org/2000/svg"
// //     className="w-4 h-4 text-gray-400 pointer-events-none"
// //     viewBox="0 0 24 24"
// //     fill="none"
// //     stroke="currentColor"
// //     strokeWidth="2"
// //     strokeLinecap="round"
// //     strokeLinejoin="round"
// //   >
// //     <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
// //     <line x1="16" y1="2" x2="16" y2="6" />
// //     <line x1="8" y1="2" x2="8" y2="6" />
// //     <line x1="3" y1="10" x2="21" y2="10" />
// //   </svg>
// // );

// // // ─── Helpers ─────────────────────────────────────────────────
// // const toCleanString = (value) => String(value || "").trim();

// // const getInitialFieldValue = (field) => {
// //   if (field.type === "checkbox" || field.type === "multiselect") return [];
// //   if (field.type === "toggle") {
// //     return Array.isArray(field.options) && field.options.length === 2
// //       ? field.options[1]
// //       : "No";
// //   }
// //   return "";
// // };

// // const hasMeaningfulValue = (value) => {
// //   if (Array.isArray(value)) return value.length > 0;
// //   return toCleanString(value).length > 0;
// // };

// // const safeParseArray = (val) => {
// //   if (!val) return [];
// //   if (Array.isArray(val)) return val;
// //   if (typeof val === "string") {
// //     try {
// //       const parsed = JSON.parse(val);
// //       if (typeof parsed === "string") return JSON.parse(parsed);
// //       return parsed;
// //     } catch {
// //       return [];
// //     }
// //   }
// //   return [];
// // };

// // const createInitialStaticData = (config, overrides = {}) => {
// //   const data = {};
// //   config.filter((s) => s.type === "static").forEach((section) => {
// //     section.fields.forEach((field) => {
// //       data[field.name] = getInitialFieldValue(field);
// //     });
// //   });
// //   return { ...data, ...overrides };
// // };

// // const createEmptyDynamicRow = (section) => {
// //   const values = {};
// //   section.fields.forEach((field) => {
// //     values[field.name] = getInitialFieldValue(field);
// //   });
// //   return { id: `${Date.now()}-${Math.random()}`, values };
// // };

// // const createInitialDynamicData = (config) => {
// //   const data = {};
// //   config.filter((s) => s.type === "dynamic").forEach((section) => {
// //     const rowCount = section.initialRows || 1;
// //     data[section.key] = Array.from({ length: rowCount }, () =>
// //       createEmptyDynamicRow(section)
// //     );
// //   });
// //   return data;
// // };

// // const extractDynamicList = (rows = [], fieldName) =>
// //   rows.map((row) => toCleanString(row?.values?.[fieldName])).filter(Boolean);

// // // ─── isFieldVisible helper ────────────────────────────────────
// // const isFieldVisible = (field, staticData) => {
// //   if (!field.showWhen) return true;
// //   const { field: watchField, value } = field.showWhen;
// //   const currentValue = staticData[watchField];
// //   return Array.isArray(value)
// //     ? value.includes(currentValue)
// //     : currentValue === value;
// // };

// // // ─── Label ──────────────────────────────────────────────────
// // const Label = ({ text, required = true }) => (
// //   <label className="block font-source font-semibold text-sm md:text-base leading-none tracking-normal text-primary mb-2">
// //     {text} {required && <span className="text-red-500">*</span>}
// //   </label>
// // );

// // // ─── FormInput ──────────────────────────────────────────────
// // const FormInput = ({ field, value, onChange, inputName }) => {
// //   if (field.type === "checkbox") {
// //     const selectedValues = Array.isArray(value) ? value : [];
// //     return (
// //       <div className="flex flex-wrap gap-x-6 gap-y-2 items-center min-h-10">
// //         {field.options.map((opt) => (
// //           <label
// //             key={opt}
// //             className="group flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
// //           >
// //             <div className="relative flex items-center justify-center">
// //               <input
// //                 type="checkbox"
// //                 name={`${inputName}-${opt}`}
// //                 checked={selectedValues.includes(opt)}
// //                 onChange={(e) =>
// //                   onChange(
// //                     e.target.checked
// //                       ? [...selectedValues, opt]
// //                       : selectedValues.filter((i) => i !== opt)
// //                   )
// //                 }
// //                 className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[6px] checked:171717 checked:border-blue-600 transition-all"
// //               />
// //               <svg
// //                 className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 viewBox="0 0 24 24"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 strokeWidth="4"
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //               >
// //                 <polyline points="20 6 9 17 4 12" />
// //               </svg>
// //             </div>
// //             <span>{opt}</span>
// //           </label>
// //         ))}
// //       </div>
// //     );
// //   }

// //   // ─── Multiselect with custom icon ───────────────────────────
// //   if (field.type === "multiselect") {
// //     const selectedValues = Array.isArray(value) ? value : [];
// //     const [open, setOpen] = React.useState(false);
// //     const ref = React.useRef(null);

// //     React.useEffect(() => {
// //       const handleClickOutside = (e) => {
// //         if (ref.current && !ref.current.contains(e.target)) setOpen(false);
// //       };
// //       document.addEventListener("mousedown", handleClickOutside);
// //       return () => document.removeEventListener("mousedown", handleClickOutside);
// //     }, []);

// //     const toggleValue = (opt) =>
// //       onChange(
// //         selectedValues.includes(opt)
// //           ? selectedValues.filter((i) => i !== opt)
// //           : [...selectedValues, opt]
// //       );

// //     return (
// //       <div className="relative w-full" ref={ref}>
// //         <div
// //           onClick={() => setOpen(!open)}
// //           className="w-full min-h-10 p-2 pr-8 border border-gray-200 rounded bg-[#fcfcfc] flex flex-wrap gap-2 cursor-pointer relative"
// //         >
// //           {selectedValues.length === 0 ? (
// //             <span className="text-gray-400 text-sm">Select options</span>
// //           ) : (
// //             selectedValues.map((val) => (
// //               <span
// //                 key={val}
// //                 className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
// //               >
// //                 {val}
// //                 <span
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     onChange(selectedValues.filter((i) => i !== val));
// //                   }}
// //                   className="cursor-pointer hover:text-red-500 font-bold leading-none"
// //                 >
// //                   ×
// //                 </span>
// //               </span>
// //             ))
// //           )}
// //           {/* Custom icon — top-right corner */}
// //           <span className="absolute right-2 top-1/2 -translate-y-1/2">
// //             <ChevronIcon />
// //           </span>
// //         </div>
// //         {open && (
// //           <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto">
// //             {field.options.map((opt) => (
// //               <label
// //                 key={opt}
// //                 className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
// //               >
// //                 <input
// //                   type="checkbox"
// //                   checked={selectedValues.includes(opt)}
// //                   onChange={() => toggleValue(opt)}
// //                 />
// //                 <span>{opt}</span>
// //               </label>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     );
// //   }

// //   if (field.type === "toggle") {
// //     const options =
// //       Array.isArray(field.options) && field.options.length === 2
// //         ? field.options
// //         : ["Yes", "No"];
// //     const isFirstOptionActive = value === options[0];
// //     return (
// //       <button
// //         type="button"
// //         role="switch"
// //         aria-checked={isFirstOptionActive}
// //         onClick={() => onChange(isFirstOptionActive ? options[1] : options[0])}
// //         className={`relative inline-flex h-10 min-w-[110px] items-center rounded-full px-1 transition-colors ${
// //           isFirstOptionActive ? "171717" : "bg-gray-300"
// //         }`}
// //       >
// //         <span
// //           className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow-sm transition-transform ${
// //             isFirstOptionActive ? "translate-x-0" : "translate-x-[70px]"
// //           }`}
// //         />
// //         <span className="relative z-10 flex w-full justify-between px-3 text-xs font-semibold text-white">
// //           <span>{options[0]}</span>
// //           <span>{options[1]}</span>
// //         </span>
// //       </button>
// //     );
// //   }

// //   if (field.type === "radio") {
// //     return (
// //       <div className="flex flex-wrap gap-x-6 gap-y-2 items-center min-h-10">
// //         {field.options.map((opt) => (
// //           <label
// //             key={opt}
// //             className="group flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
// //           >
// //             <div className="relative flex items-center justify-center">
// //               <input
// //                 type="radio"
// //                 name={inputName}
// //                 value={opt}
// //                 checked={value === opt}
// //                 onChange={(e) => onChange(e.target.value)}
// //                 className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[6px] checked:171717 checked:border-blue-600 transition-all"
// //               />
// //               <svg
// //                 className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 viewBox="0 0 24 24"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 strokeWidth="4"
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //               >
// //                 <polyline points="20 6 9 17 4 12" />
// //               </svg>
// //             </div>
// //             <span>{opt}</span>
// //           </label>
// //         ))}
// //       </div>
// //     );
// //   }

// //   // ─── Select with custom icon ─────────────────────────────────
// //   if (field.type === "select") {
// //     return (
// //       <div className="relative w-full">
// //         <select
// //           value={value}
// //           onChange={(e) => onChange(e.target.value)}
// //           className="w-full appearance-none p-2.5 pr-9 border border-gray-200 rounded bg-[#fcfcfc] text-sm h-10 outline-none cursor-pointer"
// //         >
// //           <option value="">Select Option</option>
// //           {field.options.map((option) => (
// //             <option key={option} value={option}>
// //               {option}
// //             </option>
// //           ))}
// //         </select>
// //         {/* Custom icon — swap ChevronIcon SVG with yours */}
// //         <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
// //           <ChevronIcon />
// //         </span>
// //       </div>
// //     );
// //   }

// //   if (field.type === "file") {
// //     const isExisting = typeof value === "string" && value !== "";
// //     const isNew = value instanceof File;
// //     const isImage =
// //       field.name === "coverImage" ||
// //       field.name === "collegeLogo" ||
// //       field.name === "companyLogo";

// //     return (
// //       <div className="space-y-2">
// //         <div className="flex relative border border-gray-200 rounded overflow-hidden h-10 w-full font-source transition focus-within:border-blue-400">
// //           <label className="bg-[#171717] text-xs md:text-sm text-white px-3 md:px-5 py-2.5 font-medium cursor-pointer whitespace-nowrap hover:171717 transition">
// //             Choose File
// //             <input
// //               type="file"
// //               className="hidden"
// //               onChange={(e) => onChange(e.target.files?.[0] || null)}
// //               accept={isImage ? "image/*" : undefined}
// //             />
// //           </label>
// //           <span className="flex-1 min-w-0 bg-[#fcfcfc] px-3 md:px-4 py-2.5 text-gray-400 text-xs truncate">
// //             {isNew
// //               ? value.name
// //               : isExisting
// //               ? value.split("/").pop()
// //               : "No File Chosen"}
// //           </span>
// //           {(isExisting || isNew) && (
// //             <div className="w-8 absolute right-0 top-1 h-8 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shadow-sm">
// //               <img
// //                 src={isNew ? URL.createObjectURL(value) : setFileName(value)}
// //                 alt="Preview"
// //                 className="w-full h-full object-cover"
// //               />
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (field.type === "textarea") {
// //     return (
// //       <textarea
// //         rows={4}
// //         value={value}
// //         onChange={(e) => onChange(e.target.value)}
// //         className="w-full p-3 border border-gray-200 rounded bg-[#fcfcfc] focus:ring-1 focus:ring-blue-400 outline-none text-sm resize-none"
// //       />
// //     );
// //   }

// //   // ─── Date with calendar icon ─────────────────────────────────
// //   if (field.type === "date") {
// //     return (
// //       <div className="relative w-full">
// //         <input
// //           type="date"
// //           value={value}
// //           onChange={(e) => onChange(e.target.value)}
// //           className="w-full p-2 pr-9 border border-gray-200 rounded bg-[#fcfcfc] focus:ring-1 focus:ring-blue-400 outline-none text-sm h-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute"
// //         />
// //         {/* Custom icon — swap CalendarIcon SVG with yours */}
// //         <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
// //           <CalendarIcon />
// //         </span>
// //       </div>
// //     );
// //   }

// //   return (
// //     <input
// //       type={field.type}
// //       value={value}
// //       readOnly={field.readOnly}
// //       onChange={(e) => {
// //         if (field.readOnly) return;
// //         let nextValue = e.target.value;
// //         if (field.type === "tel")
// //           nextValue = nextValue.replace(/\D/g, "").slice(0, 10);
// //         onChange(nextValue);
// //       }}
// //       inputMode={field.type === "tel" ? "numeric" : undefined}
// //       maxLength={field.type === "tel" ? 10 : undefined}
// //       className="w-full p-2 border border-gray-200 rounded bg-[#fcfcfc] focus:ring-1 focus:ring-blue-400 outline-none text-sm h-10"
// //     />
// //   );
// // };

// // // ─── FormLayout ─────────────────────────────────────────────
// // const FormLayout = ({
// //   config,
// //   editData,
// //   onSubmit,
// //   staticOverrides,
// //   submitLabel,
// //   dateFields,
// // }) => {
// //   const navigate = useNavigate();

// //   const [staticData, setStaticData] = useState(() => {
// //     if (editData) {
// //       const data = {};
// //       config.filter((s) => s.type === "static").forEach((section) => {
// //         section.fields.forEach((field) => {
// //           if (field.type === "file") {
// //             data[field.name] = editData[field.name] ?? "";
// //           } else if (field.type === "multiselect") {
// //             data[field.name] = safeParseArray(editData[field.name]);
// //           } else if (field.type === "date") {
// //             const val = editData[field.name];
// //             if (val) {
// //               try {
// //                 data[field.name] = new Date(val).toISOString().split("T")[0];
// //               } catch {
// //                 data[field.name] = "";
// //               }
// //             } else {
// //               data[field.name] = "";
// //             }
// //           } else {
// //             const val = editData[field.name];
// //             data[field.name] =
// //               val !== undefined && val !== null
// //                 ? val
// //                 : getInitialFieldValue(field);
// //           }
// //         });
// //       });
// //       if (editData._id || editData.id) data.id = editData._id || editData.id;
// //       return data;
// //     }
// //     return createInitialStaticData(config, staticOverrides);
// //   });

// //   const [dynamicData, setDynamicData] = useState(() => {
// //     if (editData) {
// //       const data = {};
// //       config.filter((s) => s.type === "dynamic").forEach((section) => {
// //         const list = editData[section.payloadKey || section.key];
// //         if (Array.isArray(list) && list.length > 0) {
// //           data[section.key] = list.map((item) => ({
// //             id: item._id || `${Date.now()}-${Math.random()}`,
// //             values:
// //               typeof item === "object" && !Array.isArray(item)
// //                 ? { ...item }
// //                 : { [section.fields[0].name]: item },
// //           }));
// //         } else {
// //           data[section.key] = Array.from(
// //             { length: section.initialRows || 1 },
// //             () => createEmptyDynamicRow(section)
// //           );
// //         }
// //       });
// //       return data;
// //     }
// //     return createInitialDynamicData(config);
// //   });

// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   useEffect(() => {
// //     if (!editData && staticOverrides) {
// //       setStaticData((prev) => ({ ...prev, ...staticOverrides }));
// //     }
// //   }, [JSON.stringify(staticOverrides)]);

// //   const sectionMap = config.reduce((acc, section) => {
// //     if (section.type === "dynamic" && section.key) acc[section.key] = section;
// //     return acc;
// //   }, {});

// //   const addRow = (sectionKey) => {
// //     const section = sectionMap[sectionKey];
// //     if (!section) return;
// //     setDynamicData((prev) => ({
// //       ...prev,
// //       [sectionKey]: [
// //         ...(prev[sectionKey] || []),
// //         createEmptyDynamicRow(section),
// //       ],
// //     }));
// //   };

// //   const removeRow = (sectionKey, rowId) => {
// //     setDynamicData((prev) => ({
// //       ...prev,
// //       [sectionKey]: (prev[sectionKey] || []).filter((row) => row.id !== rowId),
// //     }));
// //   };

// //   const updateStaticField = (fieldName, value) =>
// //     setStaticData((prev) => ({ ...prev, [fieldName]: value }));

// //   const updateDynamicField = (sectionKey, rowId, fieldName, value) =>
// //     setDynamicData((prev) => ({
// //       ...prev,
// //       [sectionKey]: (prev[sectionKey] || []).map((row) =>
// //         row.id === rowId
// //           ? { ...row, values: { ...row.values, [fieldName]: value } }
// //           : row
// //       ),
// //     }));

// //   const buildPayload = () => {
// //     const payload = {};
// //     if (staticData.id) payload.id = staticData.id;

// //     config.forEach((section) => {
// //       if (section.type === "static") {
// //         section.fields.forEach((field) => {
// //           const payloadKey = field.payloadKey || field.name;
// //           const rawValue = staticData[field.name];
// //           if (field.type === "file") {
// //             payload[payloadKey] = rawValue;
// //           } else if (field.type === "multiselect" || Array.isArray(rawValue)) {
// //             payload[payloadKey] = Array.isArray(rawValue) ? rawValue : [];
// //           } else {
// //             payload[payloadKey] = toCleanString(rawValue);
// //           }
// //         });
// //       }

// //       if (section.type === "dynamic") {
// //         const rows = dynamicData[section.key] || [];
// //         if (section.fields.length === 1) {
// //           const field = section.fields[0];
// //           const payloadKey =
// //             section.payloadKey || field.payloadKey || field.name;
// //           payload[payloadKey] = extractDynamicList(rows, field.name);
// //           return;
// //         }
// //         const payloadKey = section.payloadKey || section.key;
// //         payload[payloadKey] = rows
// //           .map((row) => {
// //             const rowPayload = {};
// //             section.fields.forEach((field) => {
// //               const rowKey = field.payloadKey || field.name;
// //               const rawValue = row?.values?.[field.name];
// //               if (field.type === "file") rowPayload[rowKey] = rawValue;
// //               else if (
// //                 field.type === "multiselect" ||
// //                 Array.isArray(rawValue)
// //               )
// //                 rowPayload[rowKey] = Array.isArray(rawValue) ? rawValue : [];
// //               else rowPayload[rowKey] = toCleanString(rawValue);
// //             });
// //             return rowPayload;
// //           })
// //           .filter((rowPayload) =>
// //             Object.values(rowPayload).some(hasMeaningfulValue)
// //           );
// //       }
// //     });

// //     return payload;
// //   };

// //   const buildFormData = (payload) => {
// //     const formData = new FormData();
// //     Object.entries(payload).forEach(([key, value]) => {
// //       if (value == null) return;
// //       if (value instanceof File) {
// //         formData.append(key, value);
// //         return;
// //       }
// //       if (Array.isArray(value)) {
// //         formData.append(key, JSON.stringify(value));
// //         return;
// //       }
// //       formData.append(key, String(value));
// //     });
// //     return formData;
// //   };

// //   const validateForm = () => {
// //     const isEdit = !!staticData.id;

// //     for (const section of config) {
// //       // ── Section-level showWhen (single value only for sections) ──
// //       if (section.showWhen) {
// //         const { field: watchField, value: watchValue } = section.showWhen;
// //         const currentValue = staticData[watchField];
// //         const sectionHidden = Array.isArray(watchValue)
// //           ? !watchValue.includes(currentValue)
// //           : currentValue !== watchValue;
// //         if (sectionHidden) continue;
// //       }

// //       // ── Static fields ────────────────────────────────────────────
// //       if (section.type === "static") {
// //         for (const field of section.fields) {
// //           // Field-level showWhen
// //           if (!isFieldVisible(field, staticData)) continue;
// //           if (field.required === false) continue;

// //           const value = staticData[field.name];
// //           if (
// //             field.type === "file" &&
// //             isEdit &&
// //             typeof value === "string" &&
// //             value.trim() !== ""
// //           )
// //             continue;
// //           if (!hasMeaningfulValue(value)) {
// //             toast.error(`${field.label} is required`);
// //             return false;
// //           }
// //         }
// //       }

// //       // ── Dynamic fields ───────────────────────────────────────────
// //       if (section.type === "dynamic") {
// //         const rows = dynamicData[section.key] || [];
// //         const requiredUpTo = section.initialRows || 1; // e.g. 6 rows → first 3 required via initialRows

// //         for (let i = 0; i < rows.length; i++) {
// //           const row = rows[i];
// //           const isRequiredRow = i < 3; // ✅ Only first 3 rows are required

// //           for (const field of section.fields) {
// //             if (field.required === false) continue;

// //             const value = row.values[field.name];
// //             const filled = hasMeaningfulValue(value);

// //             // Skip entirely empty rows beyond row index 2 (rows 4–N)
// //             if (!isRequiredRow && !filled) continue;

// //             // If a later row has some content, validate it fully
// //             if (!filled) {
// //               if (isRequiredRow) {
// //                 toast.error(
// //                   `${section.title} (Row ${i + 1}): ${field.label} is required`
// //                 );
// //                 return false;
// //               }
// //               continue;
// //             }

// //             // Extra format validations
// //             if (field.type === "tel" && value.length !== 10) {
// //               toast.error(
// //                 `${section.title} (Row ${i + 1}): ${field.label} must be exactly 10 digits`
// //               );
// //               return false;
// //             }
// //             if (
// //               field.name === "mailId" &&
// //               !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
// //             ) {
// //               toast.error(
// //                 `${section.title} (Row ${i + 1}): Please enter a valid Email Id`
// //               );
// //               return false;
// //             }
// //           }
// //         }
// //       }
// //     }
// //     return true;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!validateForm()) return;
// //     try {
// //       setIsSubmitting(true);
// //       const payload = buildPayload();
// //       const formData = buildFormData(payload);
// //       await onSubmit(formData, payload, staticData);
// //     } catch (error) {
// //       toast.error(error?.response?.data?.message || "Failed to save");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="mx-auto bg-gray-50">
// //       <form
// //         onSubmit={handleSubmit}
// //         className="max-w-[1400px] mx-auto space-y-5 bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-200"
// //       >
// //         {config
// //           .filter((section) => {
// //             if (!section.showWhen) return true;
// //             const { field: watchField, value: watchValue } = section.showWhen;
// //             const currentValue = staticData[watchField];
// //             return Array.isArray(watchValue)
// //               ? watchValue.includes(currentValue)
// //               : currentValue === watchValue;
// //           })
// //           .map((section, sectionIndex) => (
// //             <div
// //               key={sectionIndex}
// //               className="space-y-6 border-b pb-6 last:border-b-0"
// //             >
// //               <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
// //                 <h2 className="font-source font-semibold text-lg md:text-xl leading-none tracking-normal text-[#000000]">
// //                   {section.title}
// //                 </h2>
// //                 {section.type === "dynamic" &&
// //                   !["grid-6", "row-action"].includes(
// //                     section.dynamicStyle
// //                   ) && (
// //                     <button
// //                       type="button"
// //                       onClick={() => addRow(section.key)}
// //                       className="bg-[#171717] text-white px-5 py-1.5 rounded-md text-sm font-bold flex items-center gap-2"
// //                     >
// //                       Add
// //                     </button>
// //                   )}
// //               </div>

// //               {/* ── STATIC ── */}
// //               {section.type === "static" && (
// //                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
// //                   {section.fields
// //                     .filter((field) => isFieldVisible(field, staticData))
// //                     .map((field, fieldIndex) => (
// //                       <div
// //                         key={fieldIndex}
// //                         className={`${
// //                           field.span === 2 ? "md:col-span-2" : ""
// //                         } min-w-0`}
// //                       >
// //                         <Label
// //                           text={field.label}
// //                           required={field.required !== false}
// //                         />
// //                         <FormInput
// //                           field={field}
// //                           value={staticData[field.name]}
// //                           onChange={(value) =>
// //                             updateStaticField(field.name, value)
// //                           }
// //                           inputName={field.name}
// //                         />
// //                       </div>
// //                     ))}
// //                 </div>
// //               )}

// //               {/* ── DYNAMIC: grid-6 ──
// //                   3 inputs per row + action column same width (w-24).
// //                   Row 0 → Add button. Row 1+ → Delete button. Both w-24.
// //               */}
// //               {section.type === "dynamic" &&
// //                 section.dynamicStyle === "grid-6" && (
// //                   <div className="space-y-4">
// //                     {Array.from(
// //                       {
// //                         length: Math.ceil(
// //                           (dynamicData[section.key] || []).length / 3
// //                         ),
// //                       },
// //                       (_, chunkIndex) =>
// //                         (dynamicData[section.key] || []).slice(
// //                           chunkIndex * 3,
// //                           chunkIndex * 3 + 3
// //                         )
// //                     ).map((chunk, chunkIndex) => (
// //                       <div
// //                         key={`${section.key}-chunk-${chunkIndex}`}
// //                         className="grid grid-cols-1 md:grid-cols-[repeat(3,1fr)_auto] gap-4 items-end"
// //                       >
// //                         {/* 3 inputs — stretch to fill full width */}
// //                         {chunk.map((rowData, indexInChunk) => {
// //                           const itemIndex = chunkIndex * 3 + indexInChunk + 1;
// //                           const isRequired = itemIndex <= 3;
// //                           const baseField = section.fields[0];
// //                           return (
// //                             <div key={rowData.id}>
// //                               <Label
// //                                 text={`${section.title} (${itemIndex})`}
// //                                 required={isRequired}
// //                               />
// //                               <FormInput
// //                                 field={baseField}
// //                                 value={rowData.values[baseField.name]}
// //                                 onChange={(value) =>
// //                                   updateDynamicField(
// //                                     section.key,
// //                                     rowData.id,
// //                                     baseField.name,
// //                                     value
// //                                   )
// //                                 }
// //                                 inputName={`${section.key}_${rowData.id}_${baseField.name}`}
// //                               />
// //                             </div>
// //                           );
// //                         })}

// //                         {/* Action column — w-24 for both Add and Delete */}
// //                         <div className="flex items-end justify-start lg:justify-center">
// //                           {chunkIndex === 0 ? (
// //                             <button
// //                               type="button"
// //                               onClick={() => addRow(section.key)}
// //                               className="h-10 w-24 bg-[#171717] text-white rounded-md text-sm font-bold"
// //                             >
// //                               Add
// //                             </button>
// //                           ) : (
// //                             <button
// //                               type="button"
// //                               onClick={() =>
// //                                 chunk.forEach((rowData) =>
// //                                   removeRow(section.key, rowData.id)
// //                                 )
// //                               }
// //                               className="h-10 w-24 flex items-center justify-center text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition"
// //                             >
// //                               <Trash2 className="w-5 h-5" />
// //                             </button>
// //                           )}
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}

// //               {/* ── DYNAMIC: row-action ── */}
// //               {section.type === "dynamic" &&
// //                 section.dynamicStyle === "row-action" && (
// //                   <div className="space-y-4">
// //                     {(dynamicData[section.key] || []).map(
// //                       (rowData, rowIndex) => (
// //                         <div
// //                           key={rowData.id}
// //                           className={`grid grid-cols-1 ${
// //                             section.fields.length >= 4
// //                               ? "md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]"
// //                               : "md:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]"
// //                           } gap-4 items-end`}
// //                         >
// //                           {section.fields.map((field, fieldIndex) => (
// //                             <div key={fieldIndex}>
// //                               <Label
// //                                 text={field.label}
// //                                 required={field.required !== false}
// //                               />
// //                               <FormInput
// //                                 field={field}
// //                                 value={rowData.values[field.name]}
// //                                 onChange={(value) =>
// //                                   updateDynamicField(
// //                                     section.key,
// //                                     rowData.id,
// //                                     field.name,
// //                                     value
// //                                   )
// //                                 }
// //                                 inputName={`${section.key}_${rowData.id}_${field.name}`}
// //                               />
// //                             </div>
// //                           ))}
// //                           <div className="flex items-end justify-start lg:justify-center">
// //                             {rowIndex === 0 ? (
// //                               <button
// //                                 type="button"
// //                                 onClick={() => addRow(section.key)}
// //                                 className="h-10 bg-[#171717] text-white px-5 rounded-md text-sm font-bold w-full md:w-auto"
// //                               >
// //                                 Add
// //                               </button>
// //                             ) : (
// //                               <button
// //                                 type="button"
// //                                 onClick={() =>
// //                                   removeRow(section.key, rowData.id)
// //                                 }
// //                                 className="h-10 w-10 inline-flex items-center justify-center text-red-500 hover:scale-110 transition"
// //                               >
// //                                 <Trash2 />
// //                               </button>
// //                             )}
// //                           </div>
// //                         </div>
// //                       )
// //                     )}
// //                   </div>
// //                 )}

// //               {/* ── DYNAMIC: default (col-span) ── */}
// //               {section.type === "dynamic" && !section.dynamicStyle && (
// //                 <div className="space-y-4">
// //                   {(dynamicData[section.key] || []).map(
// //                     (rowData, rowIndex) => (
// //                       <div
// //                         key={rowData.id}
// //                         className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
// //                       >
// //                         {section.fields.map((field, fieldIndex) => (
// //                           <div key={fieldIndex} className={field.colSpan}>
// //                             <Label
// //                               text={field.label}
// //                               required={field.required !== false}
// //                             />
// //                             <FormInput
// //                               field={field}
// //                               value={rowData.values[field.name]}
// //                               onChange={(value) =>
// //                                 updateDynamicField(
// //                                   section.key,
// //                                   rowData.id,
// //                                   field.name,
// //                                   value
// //                                 )
// //                               }
// //                               inputName={`${section.key}_${rowData.id}_${field.name}`}
// //                             />
// //                           </div>
// //                         ))}
// //                         <div className="md:col-span-1 flex justify-center pb-2">
// //                           {rowIndex > 0 && (
// //                             <Trash2
// //                               className="text-red-500  cursor-pointer hover:scale-110 transition"
// //                               onClick={() => removeRow(section.key, rowData.id)}
// //                             />
// //                           )}
// //                         </div>
// //                       </div>
// //                     )
// //                   )}
// //                 </div>
// //               )}
// //             </div>
// //           ))}

// //         <div className="flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
// //           <button
// //             type="button"
// //             onClick={() => navigate(-1)}
// //             className="w-full md:w-auto px-6 md:px-10 py-2 border border-gray-300 rounded text-gray-500 font-bold hover:bg-gray-50"
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             type="submit"
// //             disabled={isSubmitting}
// //             className="w-full md:w-auto px-6 md:px-10 py-2 bg-[#171717] text-white rounded font-bold shadow-md hover:171717 disabled:opacity-70"
// //           >
// //             {isSubmitting
// //               ? "Saving..."
// //               : submitLabel || (editData ? "Update" : "Save")}
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };

// // export default FormLayout;

import React, { useState, useEffect } from "react";
import { Trash2, ChevronDown, Calendar, ChevronDown as MultiIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import setFileName from "../utils/setFileName";
import Icon from "../components/icons";
import { useRef } from "react";


const toCleanString = (value) => String(value || "").trim();

const getInitialFieldValue = (field) => {
  if (field.defaultValue !== undefined) return field.defaultValue;
  if (field.type === "checkbox" || field.type === "multiselect") return [];
  if (field.type === "toggle") {
    return Array.isArray(field.options) && field.options.length === 2
      ? field.options[1]
      : "No";
  }
  if (field.type === "radio") {
    return Array.isArray(field.options) && field.options.length > 0
      ? field.options[0]
      : "";
  }
  return "";
};

const hasMeaningfulValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return toCleanString(value).length > 0;
};

const safeParseArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === "string") return JSON.parse(parsed);
      return parsed;
    } catch { return []; }
  }
  return [];
};

const createInitialStaticData = (config, overrides = {}) => {
  const data = {};
  config.filter((s) => s.type === "static").forEach((section) => {
    section.fields.forEach((field) => {
      data[field.name] = getInitialFieldValue(field);
    });
  });
  return { ...data, ...overrides };
};

const createEmptyDynamicRow = (section) => {
  const values = {};
  section.fields.forEach((field) => {
    values[field.name] = getInitialFieldValue(field);
  });
  return { id: `${Date.now()}-${Math.random()}`, values };
};

const createInitialDynamicData = (config) => {
  const data = {};
  config.filter((s) => s.type === "dynamic").forEach((section) => {
    const rowCount = section.initialRows || 1;
    data[section.key] = Array.from({ length: rowCount }, () =>
      createEmptyDynamicRow(section)
    );
  });
  return data;
};

const extractDynamicList = (rows = [], fieldName) =>
  rows.map((row) => toCleanString(row?.values?.[fieldName])).filter(Boolean);

// ─── Label ──────────────────────────────────────────────────
const Label = ({ text, required = true }) => (
  <label className="block font-source font-semibold text-sm md:text-base leading-none tracking-normal text-primary mb-2">
    {text} {required && <span className="text-red-500">*</span>}
  </label>
);

// ─── Action Button (fixed width) ────────────────────────────
const ACTION_BTN_CLASS = "h-10 w-20 inline-flex items-center justify-center rounded-md text-sm font-bold transition shrink-0";

// ─── FormInput ──────────────────────────────────────────────
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
                onChange={(e) =>
                  onChange(
                    e.target.checked
                      ? [...selectedValues, opt]
                      : selectedValues.filter((i) => i !== opt)
                  )
                }
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[6px] checked:bg-[#171717] checked:border-[#171717] transition-all"
              />
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span>{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  // ── multiselect with custom chevron icon ──────────────────
  if (field.type === "multiselect") {
    const selectedValues = Array.isArray(value) ? value : [];
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);
    const inputRef = useRef(null);
    React.useEffect(() => {
      const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleValue = (opt) =>
      onChange(
        selectedValues.includes(opt)
          ? selectedValues.filter((i) => i !== opt)
          : [...selectedValues, opt]
      );

    return (
      <div className="relative w-full" ref={ref}>
        <div
          onClick={() => setOpen(!open)}
          className="w-full min-h-10 px-2 pr-9 py-1.5 border border-gray-200 rounded bg-[#fcfcfc] flex flex-wrap gap-2 cursor-pointer relative"
        >
          {selectedValues.length === 0 ? (
            <span className="text-gray-400 text-sm self-center">Select options</span>
          ) : (
            selectedValues.map((val) => (
              <span key={val} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                {val}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(selectedValues.filter((i) => i !== val));
                  }}
                  className="cursor-pointer hover:text-red-500 font-bold leading-none"
                >
                  ×
                </span>
              </span>
            ))
          )}
          {/* Custom chevron icon */}
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon src="/icons/arrow_drop_down.png" size={20} strokeWidth={2} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </span>
        </div>
        {open && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto">
            {field.options.map((opt) => (
              <label key={opt} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                <input type="checkbox" checked={selectedValues.includes(opt)} onChange={() => toggleValue(opt)} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}
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
        className={`relative inline-flex h-10 min-w-[110px] items-center rounded-full px-1 transition-colors ${isFirstOptionActive ? "bg-[#171717]" : "bg-gray-300"}`}
      >
        <span className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow-sm transition-transform ${isFirstOptionActive ? "translate-x-0" : "translate-x-[70px]"}`} />
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
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-[6px] checked:bg-[#171717] checked:border-[#171717] transition-all"
              />
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span>{opt}</span>
          </label>
        ))}
      </div>
    );
  }

  // ── select with custom chevron icon ──────────────────────
  if (field.type === "select") {
    return (
      <div className="relative w-full">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none p-2.5 pr-9 border border-gray-200 rounded bg-[#fcfcfc] text-sm h-10 outline-none cursor-pointer"
        >
          {/* <option value="">Select Option</option> */}
          {field.options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {/* Custom chevron icon */}
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon src="/icons/arrow_drop_down.png" size={20} strokeWidth={2} />
        </span>
      </div>
    );
  }

  if (field.type === "file") {
    const isExisting = typeof value === "string" && value !== "";
    const isNew = value instanceof File;
    const isImage = field.name === "coverImage" || field.name === "collegeLogo" || field.name === "companyLogo";

    return (
      <div className="space-y-2">
        <div className="flex relative border border-gray-200 rounded overflow-hidden h-10 w-full font-source transition focus-within:border-blue-400">
          <label className="bg-[#171717] text-xs md:text-sm text-white px-3 md:px-5 py-2.5 font-medium cursor-pointer whitespace-nowrap hover:171717 transition">
            Choose File
            <input
              type="file"
              className="hidden"
              onChange={(e) => onChange(e.target.files?.[0] || null)}
              accept={isImage ? "image/*" : undefined}
            />
          </label>
          <span className="flex-1 min-w-0 bg-[#fcfcfc] px-3 md:px-4 py-2.5 text-gray-400 text-xs truncate">
            {isNew ? value.name : isExisting ? value.split("/").pop() : "No File Chosen"}
          </span>
          {(isExisting || isNew) && (
            <div className="w-8 absolute right-0 top-1 h-8 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shadow-sm">
              <img
                src={isNew ? URL.createObjectURL(value) : setFileName(value)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
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

  // ── date with custom calendar icon ────────────────────────
  if (field.type === "date") {
    const inputRef = useRef(null);
    return (
      <div onClick={() => inputRef.current?.showPicker?.()} className="relative w-full">
        <input
          ref={inputRef}
          type="date"
          value={value}
          max={field.max}
          readOnly={field.readOnly}
          onChange={(e) => {
            if (field.readOnly) return;
            onChange(e.target.value);
          }}
          className="w-full p-2 pr-9 border border-gray-200 rounded bg-[#fcfcfc] focus:ring-1 focus:ring-blue-400 outline-none text-sm h-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
        />
        {/* Custom calendar icon */}
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon src="/icons/calendar-days.png" size={16} strokeWidth={2} />
        </span>
      </div>
    );
  }

  return (
    <input
      type={field.type}
      value={value}
      readOnly={field.readOnly}
      onChange={(e) => {
        if (field.readOnly) return;
        let nextValue = e.target.value;
        if (field.type === "tel") nextValue = nextValue.replace(/\D/g, "").slice(0, 10);
        if (field.sanitize === "noSpecialChars") nextValue = nextValue.replace(/[^a-zA-Z0-9\s.\-]/g, "");
        if (field.sanitize === "noExtraNum") nextValue = nextValue.replace(/\D/g, "").slice(0, 6);
        if (field.sanitize === "noAlphabets") nextValue = nextValue.replace(/\D/g, "").slice(0, 18)
        if (field.sanitize === "ifsc") nextValue = nextValue.replace(/[^A-Z0-9]/gi, "").slice(0, 11).toUpperCase();
        onChange(nextValue);
      }}
      inputMode={field.type === "tel" ? "numeric" : undefined}
      maxLength={field.type === "tel" ? 10 : undefined}
      className="w-full p-2 border border-gray-200 rounded bg-[#fcfcfc] focus:ring-1 focus:ring-blue-400 outline-none text-sm h-10"
    />
  );
};

// ─── FormLayout ─────────────────────────────────────────────
const FormLayout = ({
  config,
  editData,
  onSubmit,
  staticOverrides,
  submitLabel,
  dateFields,
}) => {
  const navigate = useNavigate();

  const [staticData, setStaticData] = useState(() => {
    if (editData) {
      const data = {};
      config.filter((s) => s.type === "static").forEach((section) => {
        section.fields.forEach((field) => {
          if (field.type === "file") {
            data[field.name] = editData[field.name] ?? "";
          } else if (field.type === "multiselect") {
            data[field.name] = safeParseArray(editData[field.name]);
          } else if (field.type === "date") {
            const val = editData[field.name];
            if (val) {
              try { data[field.name] = new Date(val).toISOString().split("T")[0]; }
              catch { data[field.name] = ""; }
            } else {
              data[field.name] = "";
            }
          } else {
            const val = editData[field.name];
            data[field.name] = val !== undefined && val !== null
              ? val
              : getInitialFieldValue(field);
          }
        });
      });
      if (editData._id || editData.id) data.id = editData._id || editData.id;
      return data;
    }
    return createInitialStaticData(config, staticOverrides);
  });

  const [dynamicData, setDynamicData] = useState(() => {
    if (editData) {
      const data = {};
      config.filter((s) => s.type === "dynamic").forEach((section) => {
        const list = editData[section.payloadKey || section.key];
        if (Array.isArray(list) && list.length > 0) {
          data[section.key] = list.map((item) => ({
            id: item._id || `${Date.now()}-${Math.random()}`,
            values: typeof item === "object" && !Array.isArray(item)
              ? { ...item }
              : { [section.fields[0].name]: item },
          }));
        } else {
          data[section.key] = Array.from(
            { length: section.initialRows || 1 },
            () => createEmptyDynamicRow(section)
          );
        }
      });
      return data;
    }
    return createInitialDynamicData(config);
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!editData && staticOverrides) {
      setStaticData((prev) => ({ ...prev, ...staticOverrides }));
    }
  }, [JSON.stringify(staticOverrides)]);

  const sectionMap = config.reduce((acc, section) => {
    if (section.type === "dynamic" && section.key) acc[section.key] = section;
    return acc;
  }, {});

  const addRow = (sectionKey) => {
    const section = sectionMap[sectionKey];
    if (!section) return;
    setDynamicData((prev) => ({
      ...prev,
      [sectionKey]: [...(prev[sectionKey] || []), createEmptyDynamicRow(section)],
    }));
  };

  const removeRow = (sectionKey, rowId) => {
    setDynamicData((prev) => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).filter((row) => row.id !== rowId),
    }));
  };

  const updateStaticField = (fieldName, value) =>
    setStaticData((prev) => ({ ...prev, [fieldName]: value }));

  const updateDynamicField = (sectionKey, rowId, fieldName, value) =>
    setDynamicData((prev) => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).map((row) =>
        row.id === rowId ? { ...row, values: { ...row.values, [fieldName]: value } } : row
      ),
    }));

  const buildPayload = () => {
    const payload = {};
    if (staticData.id) payload.id = staticData.id;

    config.forEach((section) => {
      if (section.type === "static") {
        section.fields.forEach((field) => {
          const payloadKey = field.payloadKey || field.name;
          const rawValue = staticData[field.name];
          if (field.type === "file") {
            payload[payloadKey] = rawValue;
          } else if (field.type === "multiselect" || Array.isArray(rawValue)) {
            payload[payloadKey] = Array.isArray(rawValue) ? rawValue : [];
          } else {
            payload[payloadKey] = toCleanString(rawValue);
          }
        });
      }

      if (section.type === "dynamic") {
        const rows = dynamicData[section.key] || [];
        if (section.fields.length === 1) {
          const field = section.fields[0];
          const payloadKey = section.payloadKey || field.payloadKey || field.name;
          payload[payloadKey] = extractDynamicList(rows, field.name);
          return;
        }
        const payloadKey = section.payloadKey || section.key;
        payload[payloadKey] = rows
          .map((row) => {
            const rowPayload = {};
            section.fields.forEach((field) => {
              const rowKey = field.payloadKey || field.name;
              const rawValue = row?.values?.[field.name];
              if (field.type === "file") rowPayload[rowKey] = rawValue;
              else if (field.type === "multiselect" || Array.isArray(rawValue))
                rowPayload[rowKey] = Array.isArray(rawValue) ? rawValue : [];
              else rowPayload[rowKey] = toCleanString(rawValue);
            });
            return rowPayload;
          })
          .filter((rowPayload) => Object.values(rowPayload).some(hasMeaningfulValue));
      }
    });

    return payload;
  };

  const buildFormData = (payload) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value == null) return;
      if (value instanceof File) { formData.append(key, value); return; }
      if (Array.isArray(value)) { formData.append(key, JSON.stringify(value)); return; }
      formData.append(key, String(value));
    });
    return formData;
  };

  const validateForm = () => {
    const isEdit = !!staticData.id;
    for (const section of config) {
      if (section.showWhen && staticData[section.showWhen.field] !== section.showWhen.value) continue;

      if (section.type === "static") {
        for (const field of section.fields) {
          if (field.showWhen) {
            const { field: watchField, value } = field.showWhen;
            const currentValue = staticData[watchField];
            const isHidden = Array.isArray(value)
              ? !value.includes(currentValue)
              : currentValue !== value;
            if (isHidden) continue;
          }
          if (field.required === false) continue;
          const value = staticData[field.name];
          if (field.type === "file" && isEdit && typeof value === "string" && value.trim() !== "") continue;
          if (!hasMeaningfulValue(value)) {
            toast.error(`${field.label} is required`);
            return false;
          }
          if (field.sanitize === "validMail" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            toast.error(`${field.label} must be a valid email`);
            return false;
          }
          if (field.sanitize === "noExtraNum" && hasMeaningfulValue(value) && (value.length < 5 || value.length > 6)) {
            toast.error(`${field.label} must be between 5 and 6 digits`);
            return false;
          }
          if (field.sanitize === "ifsc" && hasMeaningfulValue(value) && value.length !== 11) {
            toast.error(`${field.label} must be exactly 11 characters`);
            return false;
          }
        }
      }

      if (section.type === "dynamic") {
        const rows = dynamicData[section.key] || [];
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          for (const field of section.fields) {
            if (field.required === false) continue;
            const value = row.values[field.name];
            if (!hasMeaningfulValue(value)) {
              toast.error(`${section.title} (Row ${i + 1}): ${field.label} is required`);
              return false;
            }
            if (hasMeaningfulValue(value)) {
              if (field.type === "tel" && value.length !== 10) {
                toast.error(`${section.title} (Row ${i + 1}): ${field.label} must be exactly 10 digits`);
                return false;
              }
              if (field.name === "mailId" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                toast.error(`${section.title} (Row ${i + 1}): Please enter a valid Email Id`);
                return false;
              }
              if (field.sanitize === "noExtraNum" && (value.length < 5 || value.length > 6)) {
                toast.error(`${section.title} (Row ${i + 1}): ${field.label} must be between 5 and 6 digits`);
                return false;
              }
              if (field.sanitize === "ifsc" && value.length !== 11) {
                toast.error(`${section.title} (Row ${i + 1}): ${field.label} must be exactly 11 characters`);
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setIsSubmitting(true);
      const payload = buildPayload();
      const formData = buildFormData(payload);
      await onSubmit(formData, payload, staticData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="max-w-[1400px] mx-auto space-y-5 bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-sm border border-gray-200"
      >
        {config
          .filter((section) =>
            !section.showWhen || staticData[section.showWhen.field] === section.showWhen.value
          )
          .map((section, sectionIndex) => {
            const rows = dynamicData[section.key] || [];
            const lastRowId = rows.length > 0 ? rows[rows.length - 1].id : null;

            return (
              <div key={sectionIndex} className="space-y-6 border-b pb-6 last:border-b-0">
                <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
                  <h2 className="font-source font-semibold text-lg md:text-xl leading-none tracking-normal text-[#000000]">
                    {section.title}
                  </h2>
                  {section.type === "dynamic" && !["grid-6", "row-action"].includes(section.dynamicStyle) && (
                    <button type="button" onClick={() => addRow(section.key)} className="bg-[#171717] text-white px-5 py-1.5 rounded-md text-sm font-bold flex items-center gap-2">
                      Add
                    </button>
                  )}
                </div>

                {/* STATIC */}
                {section.type === "static" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                    {section.fields
                      .filter((field) => {
                        if (!field.showWhen) return true;
                        const { field: watchField, value } = field.showWhen;
                        const currentValue = staticData[watchField];
                        return Array.isArray(value)
                          ? value.includes(currentValue)
                          : currentValue === value;
                      })
                      .map((field, fieldIndex) => (
                        <div key={fieldIndex} className={`${field.span === 2 ? "md:col-span-2" : ""} min-w-0`}>
                          <Label text={field.label} required={field.required !== false} />
                          <FormInput
                            field={field}
                            value={staticData[field.name]}
                            onChange={(value) => updateStaticField(field.name, value)}
                            inputName={field.name}
                          />
                        </div>
                      ))}
                  </div>
                )}

                {/* DYNAMIC: grid-6 */}
                {section.type === "dynamic" && section.dynamicStyle === "grid-6" && (
                  <div className="space-y-4">
                    {Array.from(
                      { length: Math.ceil((dynamicData[section.key] || []).length / 3) },
                      (_, chunkIndex) => (dynamicData[section.key] || []).slice(chunkIndex * 3, chunkIndex * 3 + 3)
                    ).map((chunk, chunkIndex) => {
                      const chunkLastId = chunk[chunk.length - 1]?.id;
                      const isLastChunk = chunkIndex === Math.ceil((dynamicData[section.key] || []).length / 3) - 1;
                      return (
                        <div key={`${section.key}-chunk-${chunkIndex}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] gap-4 items-end">
                          {chunk.map((rowData, indexInChunk) => {
                            const itemIndex = chunkIndex * 3 + indexInChunk + 1;
                            const baseField = section.fields[0];
                            return (
                              <div key={rowData.id}>
                                <Label text={`${section.title} (${itemIndex})`} required={baseField.required !== false} />
                                <FormInput
                                  field={baseField}
                                  value={rowData.values[baseField.name]}
                                  onChange={(value) => updateDynamicField(section.key, rowData.id, baseField.name, value)}
                                  inputName={`${section.key}_${rowData.id}_${baseField.name}`}
                                />
                              </div>
                            );
                          })}
                          {/* Action column: Add on first chunk, Delete only on last chunk, spacer otherwise */}
                          <div className="flex items-end justify-start lg:justify-center">
                            {chunkIndex === 0 ? (
                              <button
                                type="button"
                                onClick={() => addRow(section.key)}
                                className={`${ACTION_BTN_CLASS} bg-[#171717] text-white`}
                              >
                                Add
                              </button>
                            ) : isLastChunk ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const allRows = dynamicData[section.key] || [];
                                  const lastRow = allRows[allRows.length - 1];
                                  if (lastRow) removeRow(section.key, lastRow.id);
                                }}
                                className={`${ACTION_BTN_CLASS} text-red-500 hover:scale-110`}
                              >
                                <Trash2 size={18} />
                              </button>
                            ) : (
                              /* spacer to keep grid alignment */
                              <div className={ACTION_BTN_CLASS} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* DYNAMIC: row-action */}
                {section.type === "dynamic" && section.dynamicStyle === "row-action" && (
                  <div className="space-y-4">
                    {(dynamicData[section.key] || []).map((rowData, rowIndex) => {
                      const isLastRow = rowData.id === lastRowId;
                      return (
                        <div key={rowData.id} className={`grid grid-cols-1 ${section.fields.length >= 4 ? "md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]" : "md:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]"} gap-4 items-end`}>
                          {section.fields.map((field, fieldIndex) => (
                            <div key={fieldIndex}>
                              <Label text={field.label} required={field.required !== false} />
                              <FormInput
                                field={field}
                                value={rowData.values[field.name]}
                                onChange={(value) => updateDynamicField(section.key, rowData.id, field.name, value)}
                                inputName={`${section.key}_${rowData.id}_${field.name}`}
                              />
                            </div>
                          ))}
                          <div className="flex items-end justify-start lg:justify-center">
                            {rowIndex === 0 ? (
                              <button
                                type="button"
                                onClick={() => addRow(section.key)}
                                className={`${ACTION_BTN_CLASS} bg-[#171717] text-white`}
                              >
                                Add
                              </button>
                            ) : isLastRow ? (
                              <button
                                type="button"
                                onClick={() => removeRow(section.key, rowData.id)}
                                className={`${ACTION_BTN_CLASS} text-red-500 hover:scale-110`}
                              >
                                <Trash2 size={18} />
                              </button>
                            ) : (
                              /* spacer — same width, no icon */
                              <div className={ACTION_BTN_CLASS} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* DYNAMIC: default (col-span) */}
                {section.type === "dynamic" && !section.dynamicStyle && (
                  <div className="space-y-4">
                    {(dynamicData[section.key] || []).map((rowData, rowIndex) => {
                      const isLastRow = rowData.id === lastRowId;
                      return (
                        <div key={rowData.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                          {section.fields.map((field, fieldIndex) => (
                            <div key={fieldIndex} className={field.colSpan}>
                              <Label text={field.label} required={field.required !== false} />
                              <FormInput
                                field={field}
                                value={rowData.values[field.name]}
                                onChange={(value) => updateDynamicField(section.key, rowData.id, field.name, value)}
                                inputName={`${section.key}_${rowData.id}_${field.name}`}
                              />
                            </div>
                          ))}
                          {/* spacer col always present; icon only on last row */}
                          <div className="md:col-span-1 flex justify-center pb-2 h-10 items-center">
                            {isLastRow && rowIndex > 0 && (
                              <Trash2
                                size={18}
                                className="text-red-500 cursor-pointer hover:scale-110 transition"
                                onClick={() => removeRow(section.key, rowData.id)}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

        <div className="flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4 pt-4 md:pt-6">
          <button type="button" onClick={() => navigate(-1)} className="w-full md:w-auto px-6 md:px-10 py-2 border border-gray-300 rounded text-gray-500 font-bold hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-6 md:px-10 py-2 bg-[#171717] text-white rounded font-bold shadow-md hover:171717 disabled:opacity-70">
            {isSubmitting ? "Saving..." : submitLabel || (editData ? "Update" : "Save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormLayout;