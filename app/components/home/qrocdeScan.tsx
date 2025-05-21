import { useEffect, useRef } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

interface BarcodeScannerModalProps {
  show: boolean;
  handleClose: () => void;
  title?: string;
  onScan: (code: string) => void;
}

export default function BarcodeScannerModal({
  show,
  handleClose,
  title = "Scan Barcode",
  onScan,
}: BarcodeScannerModalProps) {
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    if (show) {
      const initScanner = async () => {
        try {
          const { Html5QrcodeScanner, Html5QrcodeSupportedFormats } =
            await import("html5-qrcode");

          const qrboxSize =
            Math.min(window.innerWidth, window.innerHeight) * 0.6;

          scannerRef.current = new Html5QrcodeScanner(
            "reader",
            {
              fps: 10,
              qrbox: { width: qrboxSize, height: qrboxSize },
              disableFlip: false,
              formatsToSupport: [
                Html5QrcodeSupportedFormats.QR_CODE,
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.CODE_39,
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.UPC_A,
                Html5QrcodeSupportedFormats.UPC_E,
                Html5QrcodeSupportedFormats.EAN_8,
              ],
            },
            false
          );

          scannerRef.current.render(
            (decodedText: string) => {
              console.log("Scanned code:", decodedText);
              onScan(decodedText);
              handleClose();
            },
            (errorMessage: string) => {
              console.error("QR code scanning error:", errorMessage);
            }
          );
        } catch (error) {
          console.error("Failed to load Html5QrcodeScanner:", error);
        }
      };

      initScanner();
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear().catch((error: any) => {
            console.error("Failed to clear scanner", error);
          });
        } catch (error) {
          console.error("Error during scanner cleanup:", error);
        }
      }
    };
  }, [show, onScan, handleClose]);

  return (
    <Dialog open={show} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Scan a barcode or QR code to automatically fill the product code
            field.
          </p>
        </div>
        <div id="reader" className="w-full"></div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
