import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, FileJson, Download } from "lucide-react";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (options: ExportOptions) => void;
}

export interface ExportOptions {
  format: "pdf" | "json";
  includeTranscript: boolean;
  includeSummary: boolean;
  includeStats: boolean;
  includeFactChecks: boolean;
}

export function ExportDialog({ open, onOpenChange, onExport }: ExportDialogProps) {
  const [options, setOptions] = useState<ExportOptions>({
    format: "pdf",
    includeTranscript: true,
    includeSummary: true,
    includeStats: true,
    includeFactChecks: true,
  });

  const handleExport = () => {
    onExport(options);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" data-testid="dialog-export">
        <DialogHeader>
          <DialogTitle>Export Conversation</DialogTitle>
          <DialogDescription>
            Choose what to include in your export
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="font-medium">Export Format</Label>
            <RadioGroup
              value={options.format}
              onValueChange={(value) =>
                setOptions({ ...options, format: value as "pdf" | "json" })
              }
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="pdf" id="format-pdf" data-testid="radio-format-pdf" />
                <Label htmlFor="format-pdf" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  PDF Report
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="json" id="format-json" data-testid="radio-format-json" />
                <Label htmlFor="format-json" className="flex items-center gap-2 cursor-pointer">
                  <FileJson className="h-4 w-4" />
                  JSON Data
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="font-medium">Include Content</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="include-transcript"
                  checked={options.includeTranscript}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeTranscript: !!checked })
                  }
                  data-testid="checkbox-transcript"
                />
                <Label htmlFor="include-transcript" className="cursor-pointer">
                  Full Transcript
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="include-summary"
                  checked={options.includeSummary}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeSummary: !!checked })
                  }
                  data-testid="checkbox-summary"
                />
                <Label htmlFor="include-summary" className="cursor-pointer">
                  Conversation Summary
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="include-stats"
                  checked={options.includeStats}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeStats: !!checked })
                  }
                  data-testid="checkbox-stats"
                />
                <Label htmlFor="include-stats" className="cursor-pointer">
                  Participant Statistics
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="include-factchecks"
                  checked={options.includeFactChecks}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeFactChecks: !!checked })
                  }
                  data-testid="checkbox-factchecks"
                />
                <Label htmlFor="include-factchecks" className="cursor-pointer">
                  Fact Check Results
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-export">
            Cancel
          </Button>
          <Button onClick={handleExport} className="gap-2" data-testid="button-confirm-export">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
