import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const ContactForm = ({ isOpen, onClose, property }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    enableSMS: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
} else if (!/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setLoading(true);

    try {
      // Simulate contact submission (replace with actual service when database available)
      const contactData = {
        ...formData,
        propertyId: property?.Id,
        propertyTitle: property?.title,
        timestamp: new Date().toISOString()
      };

      // Mock service delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Send SMS if enabled
      if (formData.enableSMS && formData.phone) {
        try {
          const { ApperClient } = window.ApperSDK;
          const apperClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
          });

          const smsResult = await apperClient.functions.invoke(import.meta.env.VITE_SEND_SMS, {
            body: JSON.stringify({
              to: formData.phone,
              message: `Thank you for your interest in ${property?.title}. An agent will contact you within 24 hours. - Homescape Team`
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!smsResult.success) {
            console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SEND_SMS}. The response body is: ${JSON.stringify(smsResult)}.`);
          }
        } catch (smsError) {
          console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_SEND_SMS}. The error is: ${smsError.message}`);
        }
      }

      // Store contact submission (mock implementation)
      const existingContacts = JSON.parse(localStorage.getItem('propertyContacts') || '[]');
      existingContacts.push(contactData);
      localStorage.setItem('propertyContacts', JSON.stringify(existingContacts));

      toast.success(
        formData.enableSMS 
          ? "Contact request sent! You'll receive an SMS confirmation and the agent will respond within 24 hours."
          : "Contact request sent! The agent will respond within 24 hours."
      );
      
      // Reset form and close
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        enableSMS: false
      });
      onClose();

    } catch (error) {
      console.error('Contact submission error:', error);
      toast.error("Failed to send contact request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-semibold text-primary">
                  Contact Agent
                </h2>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-gray-100"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              {/* Property Info */}
              {property && (
                <div className="bg-background p-4 rounded-xl mb-6">
                  <h3 className="font-medium text-primary mb-1">{property.title}</h3>
                  <p className="text-sm text-gray-600">{property.location}</p>
                  <p className="text-lg font-semibold text-accent mt-2">
                    ${property.price?.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-primary">
                    Message
                  </label>
                  <textarea
                    className={cn(
                      "w-full px-4 py-3 bg-background border border-gray-300 rounded-xl text-primary placeholder-gray-500 transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
                      "hover:border-gray-400 resize-none",
                      errors.message && "border-error focus:ring-error focus:border-error"
                    )}
                    rows="4"
                    placeholder="Tell us about your interest in this property..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                  />
                  {errors.message && (
                    <p className="text-sm text-error">{errors.message}</p>
                  )}
                </div>

                {/* SMS Option */}
                <div className="flex items-center space-x-3 p-4 bg-background rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleInputChange('enableSMS', !formData.enableSMS)}
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                      formData.enableSMS
                        ? "bg-accent border-accent text-white"
                        : "border-gray-300 hover:border-accent"
                    )}
                  >
                    {formData.enableSMS && <ApperIcon name="Check" size={14} />}
                  </button>
                  <div>
                    <p className="text-sm font-medium text-primary">Send SMS confirmation</p>
                    <p className="text-xs text-gray-600">Receive instant confirmation via text message</p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-4 text-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <ApperIcon name="Loader2" size={20} className="mr-3 animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Send" size={20} className="mr-3" />
                      Send Contact Request
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactForm;