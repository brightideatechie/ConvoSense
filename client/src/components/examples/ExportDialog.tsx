import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExportDialog } from "../ExportDialog";

export default function ExportDialogExample() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Export Dialog</Button>
      <ExportDialog
        open={open}
        onOpenChange={setOpen}
        onExport={(options) => {
          console.log("Export with options:", options);
        }}
      />
    </div>
  );
}
