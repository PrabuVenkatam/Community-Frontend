import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, QrCode, CalendarDays, MapPin, Building } from 'lucide-react';
import { toast } from 'react-toastify';

const EventQRCodeModal = ({ isOpen, onClose, eventData, eventType = "Event" }) => {
  const qrRef = useRef(null);

  if (!isOpen || !eventData) return null;

  const eventTitle = eventData.eventName || eventData.title || "Event";
  const organizer = eventData.organizer || "";
  const eventDate = eventData.eventDate ? new Date(eventData.eventDate).toLocaleDateString() : 'N/A';
  const location = eventData.venue || eventData.mode || 'Venue';

  // Construct QR Payload JSON
  const qrPayload = JSON.stringify({
    eventId: eventData._id || eventData.id,
    eventType: eventType,
    title: eventTitle,
  });

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrPayload)}`;

  const handleDownload = () => {
    try {
      const svgElement = document.getElementById("event-qr-code-svg");

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.crossOrigin = "Anonymous";

      const qrSize = 300;
      const padding = 40;
      const headerHeight = 120;
      const footerHeight = 60;

      canvas.width = qrSize + padding * 2;
      canvas.height = qrSize + headerHeight + footerHeight + padding * 2;

      const renderCanvasAndDownload = () => {
        // Background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header Gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, "#006098");
        gradient.addColorStop(1, "#00C1FD");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, headerHeight);

        // Header Text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(`${eventType.toUpperCase()} CHECK-IN`, padding, 45);

        ctx.font = "bold 16px sans-serif";
        ctx.fillText(eventTitle.length > 30 ? eventTitle.substring(0, 30) + "..." : eventTitle, padding, 75);

        if (organizer) {
          ctx.font = "14px sans-serif";
          ctx.fillText(`Organizer: ${organizer}`, padding, 98);
        }

        // Draw QR SVG
        ctx.drawImage(img, padding, headerHeight + padding / 2, qrSize, qrSize);

        // Footer info
        ctx.fillStyle = "#f9fafb";
        ctx.fillRect(0, headerHeight + qrSize + padding, canvas.width, footerHeight);

        ctx.fillStyle = "#4b5563";
        ctx.font = "12px sans-serif";
        ctx.fillText(`Date: ${eventDate}  |  Location: ${location}`, padding, headerHeight + qrSize + padding + 35);

        // Trigger PNG Download
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${eventTitle.replace(/[^a-zA-Z0-9]/g, "_")}_QR.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        toast.success("QR Code downloaded successfully!");
      };

      const xml = new XMLSerializer().serializeToString(svgElement);
      const svg64 = btoa(unescape(encodeURIComponent(xml)));
      const b64Start = "data:image/svg+xml;base64,";
      img.src = b64Start + svg64;

      img.onload = () => {
        renderCanvasAndDownload();
      };
    } catch (err) {
      console.error("QR Code Download Error:", err);
      toast.error("Failed to download QR code.");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#006098] to-[#00C1FD] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {eventType} Attendance QR
            </span>
          </div>
          <h2 className="text-xl font-bold line-clamp-1">{eventTitle}</h2>
          <p className="text-white/80 text-sm flex items-center gap-1.5 mt-1">
            <Building size={14} /> {organizer}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col items-center">
          <div className="bg-gradient-to-b from-gray-50 to-white p-6 rounded-2xl border border-gray-200 shadow-inner flex flex-col items-center mb-6">
            <div ref={qrRef} className="bg-white p-3 rounded-xl shadow-md border border-gray-100">
              <QRCodeSVG
                id="event-qr-code-svg"
                value={qrPayload}
                size={220}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-xs text-gray-500 font-medium mt-3 flex items-center gap-1">
              <QrCode size={14} className="text-[#006098]" /> Printable Check-in QR Code
            </p>
          </div>

          <div className="w-full grid grid-cols-2 gap-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl mb-6">
            <div className="flex items-center gap-1.5">
              <CalendarDays size={14} className="text-[#006098]" />
              <span className="truncate">{eventDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-[#006098]" />
              <span className="truncate">{location}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 py-3 bg-gradient-to-r from-[#006098] to-[#00C1FD] text-white rounded-xl font-semibold hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition"
            >
              <Download size={16} /> Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EventQRCodeModal;
