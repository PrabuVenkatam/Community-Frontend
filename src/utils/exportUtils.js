import API from "./api";
import { toast } from "react-toastify";

/**
 * Downloads a CSV file directly from an API endpoint by streaming blob data.
 * @param {string} endpointUrl - Relative API endpoint URL (e.g. `/users/export/event-registrations/123`)
 * @param {string} fallbackFileName - Default file name if header is missing
 */
export const downloadCSVFromAPI = async (endpointUrl, fallbackFileName = "Report.csv") => {
  try {
    const response = await API.get(endpointUrl, {
      responseType: "blob",
    });

    // Try to extract filename from content-disposition header
    let fileName = fallbackFileName;
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        fileName = match[1];
      }
    }

    // Create Blob URL and trigger browser download
    const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    toast.success("CSV export downloaded successfully!");
  } catch (error) {
    console.error("Export Error:", error);
    toast.error("Failed to export CSV report.");
  }
};
