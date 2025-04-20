import * as React from "react";
import { useState } from "react";
import { Trailer } from "../types/trailer.types";
import { Button } from "~src/shared/ui/Button";
import { Input } from "~src/shared/ui/Input";
import { Textarea } from "~src/shared/ui/Textarea";
import { Switch } from "~src/shared/ui/Switch";

type TrailerFormProps = {
  defaultValues?: Partial<Trailer>;
  onSubmit: (values: Partial<Trailer>) => void;
};

export const TrailerForm = ({
  defaultValues = {},
  onSubmit,
}: TrailerFormProps) => {
  const [formData, setFormData] = useState<Partial<Trailer>>({
    name: "",
    description: "",
    capacity: "",
    deliveryFee: 0,
    rentalPrices: { fullDay: 0, halfDay: 0 },
    insuranceRequired: false,
    ...defaultValues,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (field.startsWith("rentalPrices")) {
        const key = field.split(".")[1];
        return {
          ...prev,
          rentalPrices: {
            fullDay: prev.rentalPrices?.fullDay ?? 0,
            halfDay: prev.rentalPrices?.halfDay ?? 0,
            [key]: Number(value) || 0, // Ensure default value is 0
          },
        };
      }

      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        required
      />

      <div className="flex gap-4">
        <span>Description</span>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <Input
        label="Capacity"
        value={formData.capacity}
        onChange={(e) => handleChange("capacity", e.target.value)}
        placeholder="e.g. 5 cubic yards"
      />

      <Input
        label="Delivery Fee"
        type="number"
        step="0.01"
        value={formData.deliveryFee}
        onChange={(e) => handleChange("deliveryFee", e.target.value)}
      />

      <Input
        label="Full Day Price"
        type="number"
        step="0.01"
        value={formData.rentalPrices?.fullDay ?? ""}
        onChange={(e) => handleChange("rentalPrices.fullDay", e.target.value)}
      />

      <Input
        label="Half Day Price"
        type="number"
        step="0.01"
        value={formData.rentalPrices?.halfDay ?? ""}
        onChange={(e) => handleChange("rentalPrices.halfDay", e.target.value)}
      />

      <div className="flex items-center justify-start gap-4">
        <span>Requires Insurance</span>
        <Switch
          checked={formData.insuranceRequired || false}
          onChange={(value) => handleChange("insuranceRequired", value)}
        />
      </div>

      <Button type="submit">Save Trailer</Button>
    </form>
  );
};
