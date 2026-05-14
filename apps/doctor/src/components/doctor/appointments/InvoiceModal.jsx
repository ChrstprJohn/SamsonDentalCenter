import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Label } from "../../ui";
import useServices from "../../../hooks/useServices";

import { api } from "../../../utils/api";
import { useToast } from "../../../context/ToastContext";
import { Plus, Trash2, ReceiptText, Stethoscope } from "lucide-react";

const MOCK_SERVICES = [
  { id: "mock-service-1", name: "Tooth Extraction", price: 1500 },
  { id: "mock-service-2", name: "General Consultation", price: 500 },
  { id: "mock-service-3", name: "Dental Cleaning", price: 1000 },
  { id: "mock-service-4", name: "Root Canal", price: 8000 },
  { id: "mock-service-5", name: "Braces Adjustment", price: 2000 },
];

const InvoiceModal = ({ isOpen, onClose, appointment, onSuccess }) => {
  const { services, loading: servicesLoading } = useServices();
  const displayServices =
    services && services.length > 0 ? services : MOCK_SERVICES;

  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [items, setItems] = useState([
    {
      service_id: appointment.service_id || "",
      quantity: 1,
    },
  ]);

  const [notes, setNotes] = useState("");

  const handleAddItem = () => {
    setItems([...items, { service_id: "", quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleServiceChange = (index, serviceId) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      service_id: serviceId,
    };
    setItems(newItems);
  };

  const handleQuantityChange = (index, qty) => {
    const newItems = [...items];
    newItems[index].quantity = parseInt(qty) || 1;
    setItems(newItems);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        appointment_id: appointment.id,
        patient_id: appointment.patient?.id,
        dentist_id: appointment.dentist_id,
        items: items,
        notes: notes,
      };

      // Simulation Mode: Logic for development/testing
      console.log("Simulating Invoice Submission:", payload);

      // Artificial delay for realism
      await new Promise((resolve) => setTimeout(resolve, 800));

      showToast("Clinical Invoice Generated (Simulated)", "success");
      onSuccess();
    } catch (err) {
      showToast(err.message || "Failed to generate invoice", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const patientName =
    appointment.last_name || appointment.first_name
      ? `${appointment.last_name || ""}, ${appointment.first_name || ""}`
          .replace(/\s+/g, " ")
          .trim()
      : appointment.booked_for_name || "Patient";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Clinical Invoice & Completion"
      size="xl"
    >
      <div className="space-y-6">
        {/* Patient Summary Header */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800">
          <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-lg">
            {patientName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-900 dark:text-white font-outfit">
              {patientName}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {appointment.service} •{" "}
              {new Date(appointment.date).toLocaleDateString()} at{" "}
              {appointment.start_time}
            </p>
          </div>
        </div>

        {/* Services Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ReceiptText size={18} className="text-brand-500" />
              <h5 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Clinical Services
              </h5>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="text-[10px] h-8 uppercase tracking-wider"
            >
              <Plus size={14} className="mr-1" /> Add Service
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex flex-wrap sm:flex-nowrap items-end gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 group transition-colors hover:border-brand-200 dark:hover:border-brand-500/30"
              >
                <div className="flex-grow min-w-[200px]">
                  <Label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">
                    Service Detail
                  </Label>
                  <select
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                    value={item.service_id}
                    onChange={(e) => handleServiceChange(index, e.target.value)}
                  >
                    <option value="" disabled>
                      Select Service
                    </option>
                    {displayServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-20 shrink-0">
                  <Label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">
                    Qty
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value)
                    }
                  />
                </div>
                <div className="w-10 flex items-center justify-center pb-2">
                  <button
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length === 1}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-30"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Notes Section */}

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Stethoscope size={18} className="text-brand-500" />
            <h5 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Clinical Notes
            </h5>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter clinical observations, treatment details, or follow-up instructions..."
            className="w-full h-32 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none resize-none"
          />
        </div>

        {/* Action Buttons */}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            className="uppercase tracking-wide text-xs"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={submitting}
            className="uppercase tracking-wide text-xs"
          >
            Generate Invoice & Complete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceModal;
